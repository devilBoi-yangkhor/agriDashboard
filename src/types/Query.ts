import { Master } from "./master/master";
import { User } from "@/services/UserService";

export interface Query {
  id: number;
  type: string;
  email: string;
  phone_number: string;
  date: string;
  query: string;
  remarks: string;
  status?: { id: number; name: string };
  category?: { id: number; name: string };
  sub_category?: { id: number; name: string }[];
  start_date: string;
  end_date?: string;
  gender?: { id: number; name: string };
  dzongkhag?: { id: number; name: string };
  assigned_by?: User;
  assigned_to?: { id: number; first_name?: string, last_name?: string };
  parent?: { id: number; name: string };
  created_at?: any
  priority?: string;
}


export interface HistoryItem {
  object_pk: string;
  action: number;
  changes: string;
  actor: string | null;
  timestamp: string;
}