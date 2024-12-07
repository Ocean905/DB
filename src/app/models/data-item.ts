// src/app/models/data-item.ts

export interface Category {
    _id?: string;
    name: string;
    parent: string;
  }
  
export interface Transaction {
  _id?: string;
  name: string;
  unit: string;
  coefficient: number;
  category: string;
  source: string; 
  source_name?: string; 
}
  
  export interface HSRStation {
    _id?: string;
    origin: string;
    destination: string;
    carbonFootprint: number;
  }