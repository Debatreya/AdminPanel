export const APP_CONFIG = {
  name: 'Admin Panel',
  description: 'Society Management Admin Panel',
  version: '1.0.0',
  author: 'Your Organization',
} as const;

export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 10000,
  retryAttempts: 3,
} as const;

export const PAGINATION_CONFIG = {
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 20, 50, 100],
  maxPageSize: 100,
} as const;

export const FILE_CONFIG = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
  uploadPath: '/uploads',
} as const;
