export type LabSite = {
    map(arg0: (item: LabSite) => { value: string; text: string; }): import("react").SetStateAction<import("../../interface/Options").Options[]>;
    id: number;
    code: string;
    description: string;
    active: 'Y' | 'N'; // assuming it could be either 'Y' or 'N'
    created_by: string;
    created_date: string | null;
    last_updated_by: string;
    last_updated_date: string | null;
  };

  export type ApiResponse = {
      timestamp: number;
      statusCode: number;
      status: string;
      message: string;
      data: LabSite;
    }