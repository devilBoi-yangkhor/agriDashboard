export type ApiResponse = {
    timestamp: number;
    statusCode: number;
    status: string;
    message: string;
    data: Organisation;
  }
  
export type Organisation = {
    map(arg0: (org: Organisation) => { value: number; text: string; }): import("react").SetStateAction<import("../../interface/Options").Options[]>;
    id: number;
    code: string;
    description: string;
    created_date: string; // or Date if you'll parse it
    created_by: string;
    last_updated_date: string; // or Date if you'll parse it
    last_updated_by: string;
    active: string;
    address: string;
    contact: number;
    email: string;
  }