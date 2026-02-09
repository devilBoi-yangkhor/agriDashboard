import { SampleTestType } from "../sample/sample";
import { Organisation } from "../organisation/Organisation";

export interface MasterItem {
  id: number | string;
  name: string;
  code?: string;
  type?: string;
  description?: string;
  is_active?: boolean;
}

// Updated to match your actual API response
export interface Category {
  id: number;
  type: string;
  code: string;
  name: string;
  description: string;
  is_active: boolean;
}

export interface Unit {
  id: number;
  type: string;
  code: string;
  name: string;
  description: string;
  is_active: boolean;
}

export interface Status {
  id: number;
  type: string;
  code: string;
  name: string;
  description: string | null;
  is_active: boolean;
}

export interface Seller {
  id: number;
  email: string;
  contact_person: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  category: string | Category; // Can be string ID or Category object
  price: string | number;
  stock: number;
  unit: string | Unit; // Can be string ID or Unit object
  status: string | Status; // Can be string ID or Status object
  
  dzongkhag?: string;
  gewog?: string;
  chiwog?: string;
  location?: string | Location;
  
  organic?: boolean;
  min_order_qty?: number;
  discount?: string;
  discounted_price?: number;
  
  seller?: number | Seller;
  seller_name?: string | null;
  
  photos?: string[]; // Array of string paths
  created_at?: string;
  updated_at?: string;
  has_coordinates?: boolean;
}

export interface ApiResponse<T> {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: T;
  data?: T;
}