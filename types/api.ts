// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// API Request Types
export interface CreateSocietyRequest {
  societyID: string;
  convenor: {
    year: string;
    name: string;
    rollno: string;
    password: string;
    imgurl: string;
  };
  coConvenors?: Array<{
    name: string;
    imgurl: string;
    year: string;
  }>;
  logo: string;
}

export interface UpdateSocietyRequest extends Partial<CreateSocietyRequest> {
  id: string;
}
