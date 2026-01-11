export * from './api';
export * from './auth';

// Common Types
export interface SelectOption {
  label: string;
  value: string;
}

// ImgBB Types
export interface ImgBBImageData {
  filename: string;
  name: string;
  url: string;
}

export interface ImgBBUploadResponse {
  data: {
    id: string;
    title: string;
    url_viewer: string;
    url: string;
    display_url: string;
    width: string;
    height: string;
    size: string;
    time: string;
    expiration: string;
    image: ImgBBImageData;
    delete_url: string;
  };
  success: boolean;
  status: number;
}

export interface ImgBBUploadResult {
  url: string;
  deleteUrl: string;
  imageData: ImgBBImageData;
}

export interface TableColumn<T = any> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: SelectOption[];
  validation?: any;
}
