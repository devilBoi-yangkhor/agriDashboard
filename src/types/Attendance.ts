export interface Attendance {
  id?: number;
  user?: {
    id?: number;
    username?: string;
    email?: string;
    mobile_number?: string;
    role_ids?: string;
    first_name?: string;
    last_name?: string;
  };
  username?: string;
  start_date?: string;
  end_date?: string;
  duration?: number;
  created_by?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Options {
  value: string;
  text: string;
  data?: {
    email: string;
    mobile_number: string;
    roles: string;
  };
}
