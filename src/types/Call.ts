export interface Call {
  id: number;
  date: string;
  total_time: string;
  category: string;
  sub_category: string;
  query: string;
  remarks: string;
  agent: string;
  assigned_by: string;
}

export interface Call {
  phone_number: string;
  query: string;
  status: string;
  agent: string;
  category_id: number;
  sub_categories: number[];
  gender: string;
  dzongkhag: string;
  start_time: string;
  end_time: string;
  remarks: string;
  is_active: boolean;
  created_at: string;
  history: History[];
  assigned_by: string;
}
