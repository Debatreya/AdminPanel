import type { YEAR_LEVELS, DEVELOPER_ROLES } from '@/constants/enums';

// Shared
export interface DeveloperPayload {
  id: string;
  name: string;
  imgURL: string;
  year: YEAR_LEVELS;
  role: DEVELOPER_ROLES;
  github: string;
  insta: string;
  linkedin: string;
}

// Request DTOs
export interface CreateDeveloperRequest {
  developer: DeveloperPayload;
}

export interface UpdateDeveloperRequest {
  developer: Partial<Omit<DeveloperPayload, 'id'>>;
}

// Response DTOs
export interface DeveloperResponse extends DeveloperPayload {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllDevelopersResponse {
  success: true;
  data: DeveloperResponse[];
}

export interface GetDeveloperResponse {
  success: true;
  data: DeveloperResponse;
}

export interface CreateDeveloperResponse {
  success: true;
  message: string;
  data: DeveloperResponse;
}

export interface UpdateDeveloperResponse {
  success: true;
  message: string;
  data: DeveloperResponse;
}

export interface DeleteDeveloperResponse {
  success: true;
  message: string;
}

export interface DeveloperErrorResponse {
  message: string;
  success?: false;
}
