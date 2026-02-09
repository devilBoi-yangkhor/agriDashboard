export interface ShippingAddress {
  full_name: string;
  phone: string;
  address: string;
  dzongkhag: string;
  gewog: string;
  chiwog: string;
}

export interface Order {
  id?: string;
  order_number?: string;

  // Buyer
  user?: number | null;
  user_name?: string | null;
  shipping_address?: ShippingAddress;

  // Product
  product?: number | null;
  product_name?: string | null;

  // Order details
  quantity?: number;
  price?: number;
  total_amount?: number;

  payment_status?: string | null;
  order_status?: string | null;

  // File URL returned by backend
  payment_proof?: string | null; 

  created_at?: string;
  updated_at?: string;

  status?: string;
}
