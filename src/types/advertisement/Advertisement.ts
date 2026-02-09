export interface Advertisement {
  data: any;
  id: number;                      
  title: string;
  description: string;
  contact_phone: string;
  photo?: string | null;

  status: string;
  status_display?: string;         

  created_by?: number | null;
  created_by_email?: string | null;

  seller_id?: number | null;
  seller_name?: string | null;

  created_at?: string;
  updated_at?: string;
}


export interface AdvertisementFormValues {
  title: string;
  description: string;
  contact_phone: string;
  photo: File | null;
}

export interface ApiResponse<T> {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: T[];
  data?: T | T[];        
  message?: string;
  status?: string;
  statusCode?: number;
  timestamp?: number;
}

