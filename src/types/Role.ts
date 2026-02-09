// export type Role = {
//     id?: number; // Add this line
//     role_name: string;
//     privileges: object[]; // Assuming privilege IDs are strings
//     active: string; // Assuming this is a string like "Y" or "N"
// }

export interface Role {
  id?: number; // Add this line
  name: string;
  permission_ids?: any;
  is_active?: string;
  code?: string;
}
