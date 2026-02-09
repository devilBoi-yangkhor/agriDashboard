export interface Email {
  email: string;
  query: string;
  status_id: number;
  agent: string;
  category_id?: number;
  sub_category: number[];
  start_date: string;
  end_date: string;
  remarks: string;
  is_active: boolean;
  date: string;
  type: string;
  assigned_by: string;
  assigned_to: string;
}
