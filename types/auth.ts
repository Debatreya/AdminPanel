// Authentication Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'convenor' | 'co-convenor';
  societyId?: string;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  role: 'convenor' | 'co-convenor';
  societyId?: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: Date;
}
