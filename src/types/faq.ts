import { Master } from "./master/master";

export type FAQ = {
  id?: any; // Made optional
  question: string;
  answer?: string;
  priority?: string;
  category_id?: any;
  sub_categories?: any[];
  is_active?: boolean;
  category?: Master;
};
