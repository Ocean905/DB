import { Component, OnInit } from '@angular/core';
import { Category, Transaction, HSRStation } from '../../models/data-item';
import { finalize } from 'rxjs/operators';
import { DataService } from '../../services/data.service';

interface LoadingState {
  items: boolean;
  save: boolean;
  delete: boolean;
}

@Component({
  selector: 'app-data-management',
  templateUrl: './data-management.component.html',
  styleUrls: ['./data-management.component.css']
})
export class DataManagementComponent implements OnInit {
  selectedTable: string = 'invoice_transactions';
  transactions: Transaction[] = [];
  deletingItemId: string = '';
  showDeleteConfirm: boolean = false;    
  categories: Category[] = [];
  hsrStations: HSRStation[] = [];
  showModal: boolean = false;
  categorySearch: string = '';
  filteredCategories: Category[] = [];
  loading = false;
  error = '';
  showErrorMessage = false;
  errorMessage = '';

  editingTransaction: Transaction | null = null;
  editingCategory: Category | null = null;
  editingHSR: HSRStation | null = null;

  loadingState: LoadingState = {
    items: false,
    save: false,
    delete: false
  };

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadCategories();
    this.loadItems();
  }

  getTableTitle(): string {
    switch(this.selectedTable) {
      case 'invoice_transactions': return '品項管理';
      case 'invoice_transtions_categories': return '類別管理';
      case 'HSR': return '高鐵站別管理';
      default: return '';
    }
  }

  getModalTitle(): string {
    const action = this.editingTransaction?._id || this.editingCategory?._id || this.editingHSR?._id ? '編輯' : '新增';
    switch(this.selectedTable) {
      case 'invoice_transactions': return `${action}品項`;
      case 'invoice_transtions_categories': return `${action}類別`;
      case 'HSR': return `${action}高鐵站別`;
      default: return action;
    }
  }

  loadCategories() {
    this.dataService.getCategories().subscribe({
      next: (data) => {
        console.log('Categories loaded:', data);
        this.categories = data;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.showError('無法載入類別');
      }
    });
  }

  loadItems() {
    this.loading = true;
    this.error = '';

    switch(this.selectedTable) {
      case 'invoice_transactions':
        this.dataService.getTransactions().subscribe({
          next: (data) => {
            console.log('Transactions loaded:', data);
            this.transactions = data;
            this.loading = false;
          },
          error: (error) => {
            console.error('Error loading transactions:', error);
            this.showError('無法載入品項');
            this.loading = false;
          }
        });
        break;

      case 'invoice_transtions_categories':
        this.dataService.getCategories().subscribe({
          next: (data) => {
            console.log('Categories loaded:', data);
            this.categories = data;
            this.loading = false;
          },
          error: (error) => {
            console.error('Error loading categories:', error);
            this.showError('無法載入類別');
            this.loading = false;
          }
        });
        break;

      case 'HSR':
        this.dataService.getHSRStations().subscribe({
          next: (data) => {
            console.log('HSR stations loaded:', data);
            this.hsrStations = data;
            this.loading = false;
          },
          error: (error) => {
            console.error('Error loading HSR stations:', error);
            this.showError('無法載入高鐵站別');
            this.loading = false;
          }
        });
        break;
    }
  }

  selectTable(table: string) {
    this.selectedTable = table;
    this.loadItems();
  }

  openAddModal() {
    switch(this.selectedTable) {
      case 'invoice_transactions':
        this.editingTransaction = { 
          name: '', 
          unit: '', 
          coefficient: 0, 
          category: '', 
          source: '', 
          source_name: '' 
        };
        break;
      case 'invoice_transtions_categories':
        this.editingCategory = { name: '', parent: '' };
        break;
      case 'HSR':
        this.editingHSR = { origin: '', destination: '', carbonFootprint: 0 };
        break;
    }
    this.showModal = true;
  }

  openEditModal(item: any) {
    console.log('Opening edit modal with item:', item);
    switch(this.selectedTable) {
      case 'invoice_transactions':
        this.editingTransaction = { ...item };
        break;
      case 'invoice_transtions_categories':
        this.editingCategory = { ...item };
        break;
      case 'HSR':
        this.editingHSR = { ...item };
        break;
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingTransaction = null;
    this.editingCategory = null;
    this.editingHSR = null;
    this.error = '';
  }

  saveItem() {
    this.loadingState.save = true;
    switch(this.selectedTable) {
      case 'invoice_transactions':
        if (this.editingTransaction) {
          const errors = this.validateTransaction(this.editingTransaction);
          if (errors.length > 0) {
            this.showError(errors.join('\n'));
            return;
          }

          const categoryExists = this.categories.some(
            category => category.name === this.editingTransaction?.category
          );
          
          if (!categoryExists) {
            this.showError('無效的類別，請選擇現有的類別');
            return;
          }

          if (!this.editingTransaction.source) {
            this.showError('請填寫資料來源');
            return;
          }

          if (this.editingTransaction._id) {
            this.dataService.updateTransaction(this.editingTransaction._id, this.editingTransaction).subscribe({
              next: () => {
                this.loadItems();
                this.closeModal();
                this.showError('更新成功');
              },
              error: (error) => {
                console.error('Error updating transaction:', error);
                this.showError('更新失敗');
              }
            });
          } else {
            this.dataService.addTransaction(this.editingTransaction).subscribe({
              next: () => {
                this.loadItems();
                this.closeModal();
                this.showError('新增成功');
              },
              error: (error) => this.handleError('新增品項', error)
            });
          }
        }
        break;

      case 'invoice_transtions_categories':
        if (this.editingCategory) {
          if (this.editingCategory._id) {
            this.dataService.updateCategory(this.editingCategory._id, this.editingCategory).subscribe({
              next: () => {
                this.loadItems();
                this.closeModal();
                this.showError('更新類別成功');
              },
              error: (error) => {
                console.error('Error updating category:', error);
                this.showError('更新類別失敗');
              }
            });
          } else {
            this.dataService.addCategory(this.editingCategory).subscribe({
              next: () => {
                this.loadCategories();
                this.loadItems();
                this.closeModal();
                this.showError('新增類別成功');
              },
              error: (error) => {
                console.error('Error saving category:', error);
                this.showError('新增類別失敗');
              }
            });
          }
        }
        break;

      case 'HSR':
        if (this.editingHSR) {
          if (this.editingHSR._id) {
            this.dataService.updateHSRStation(this.editingHSR._id, this.editingHSR).subscribe({
              next: () => {
                this.loadItems();
                this.closeModal();
                this.showError('更新高鐵站別成功');
              },
              error: (error) => {
                console.error('Error updating HSR station:', error);
                this.showError('更新高鐵站別失敗');
              }
            });
          } else {
            this.dataService.addHSRStation(this.editingHSR).subscribe({
              next: () => {
                this.loadItems();
                this.closeModal();
                this.showError('新增高鐵站別成功');
              },
              error: (error) => {
                console.error('Error saving HSR station:', error);
                this.showError('新增高鐵站別失敗');
              }
            });
          }
        }
        break;
    }
    this.loadingState.save = false;
  }

  deleteItem(id: string | undefined) {
    console.log('準備刪除項目，ID:', id);
    if (!id) {
      this.showError('無效的ID');
      return;
    }
    this.deletingItemId = id;
    this.showDeleteConfirm = true;
  }

  confirmDelete() {
    console.log('確認刪除，ID:', this.deletingItemId, '表格:', this.selectedTable);
    if (!this.deletingItemId) {
      this.showError('無效的刪除ID');
      return;
    }

    this.loadingState.delete = true;
    
    switch(this.selectedTable) {
      case 'invoice_transactions':
        this.dataService.deleteTransaction(this.deletingItemId)
          .pipe(
            finalize(() => {
              this.loadingState.delete = false;
              this.showDeleteConfirm = false;
              this.deletingItemId = '';
            })
          )
          .subscribe({
            next: () => {
              this.loadItems();
              this.showError('刪除成功');
            },
            error: (error) => {
              console.error('刪除失敗:', error);
              let errorMessage = '刪除失敗';
              if (error.status === 404) {
                errorMessage = '找不到要刪除的項目';
              } else if (error.status === 400) {
                errorMessage = '無效的請求';
              }
              this.showError(errorMessage);
            }
          });
        break;

      case 'invoice_transtions_categories':
        this.dataService.deleteCategory(this.deletingItemId)
          .pipe(
            finalize(() => {
              this.loadingState.delete = false;
              this.showDeleteConfirm = false;
              this.deletingItemId = '';
            })
          )
          .subscribe({
            next: () => {
              this.loadItems();
              this.loadCategories();
              this.showError('刪除類別成功');
            },
            error: (error) => {
              console.error('刪除類別失敗:', error);
              this.showError('刪除類別失敗');
            }
          });
        break;

      case 'HSR':
        this.dataService.deleteHSRStation(this.deletingItemId)
          .pipe(
            finalize(() => {
              this.loadingState.delete = false;
              this.showDeleteConfirm = false;
              this.deletingItemId = '';
            })
          )
          .subscribe({
            next: () => {
              this.loadItems();
              this.showError('刪除高鐵站別成功');
            },
            error: (error) => {
              console.error('刪除高鐵站別失敗:', error);
              this.showError('刪除高鐵站別失敗');
            }
          });
        break;
    }
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.deletingItemId = '';
  }

  searchCategories() {
    if (!this.categorySearch) {
      this.filteredCategories = [];
      return;
    }
    this.filteredCategories = this.categories.filter(category =>
      category.name.toLowerCase().includes(this.categorySearch.toLowerCase())
    );
  }

  selectCategory(category: Category) {
    if (this.editingTransaction) {
      this.editingTransaction.category = category.name;
    }
    this.categorySearch = category.name;
    this.filteredCategories = [];
  }

  private showError(message: string) {
    this.errorMessage = message;
    this.showErrorMessage = true;
  }

  closeErrorModal() {
    this.showErrorMessage = false;
    this.errorMessage = '';
  }

  private handleError(operation: string, error: any) {
    console.error(`${operation} 失敗:`, error);
    let errorMessage = '';
    
    if (error.status === 404) {
      errorMessage = '找不到資源';
    } else if (error.status === 400) {
      errorMessage = '請求參數錯誤';
    } else if (error.status === 500) {
      errorMessage = '服務器錯誤';
    } else {
      errorMessage = '操作失敗，請稍後重試';
    }
    
    this.showError(errorMessage);
  }

  validateTransaction(transaction: Transaction): string[] {
    const errors: string[] = [];
    
    if (!transaction.name?.trim()) {
      errors.push('名稱不能為空');
    }
    
    if (!transaction.unit?.trim()) {
      errors.push('單位不能為空');
    }
    
    if (transaction.coefficient <= 0) {
      errors.push('係數必須大於0');
    }
    
    if (!this.categories.some(c => c.name === transaction.category)) {
      errors.push('請選擇有效的類別');
    }
    
    return errors;
  }
}
