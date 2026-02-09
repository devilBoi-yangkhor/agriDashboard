import { Master } from "./master/master";

export type Noticeboard = {
  id?: any; // Made optional
  topic: string;
  description?: string;
  priority?: string;
  category_id?: any;
  sub_categories?: any[];
  is_active?: boolean;
  category?: Master
};
