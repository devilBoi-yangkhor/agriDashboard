export type Master = {
    id: number;
    type: string;
    code?: string;
    name?: string;
    description?: string;
    is_active: boolean;
    parent?:{
        id: number;
        type: string;
        code?: string;
        name?: string;
        description: string;
        is_active: boolean;
    }
}