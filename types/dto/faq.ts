// Request DTOs
export interface CreateFAQRequest {
  faq: string;
}

export interface UpdateFAQRequest {
  faq: string;
}

// Response DTOs
export interface FAQResponse {
  _id: string;
  id: string;
  faq: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllFAQsResponse {
  success: true;
  data: FAQResponse[];
}

export interface GetSingleFAQResponse {
  success: true;
  data: FAQResponse;
}

export interface CreateFAQResponse {
  success: true;
  message: string;
  data: FAQResponse;
}

export interface UpdateFAQResponse {
  success: true;
  message: string;
  data: FAQResponse;
}

export interface DeleteFAQResponse {
  success: true;
  message: string;
}

export interface ErrorResponse {
  message: string;
  success?: false;
}
