import { SUPPORTED_COUNTRIES } from '../core/constants';

export type SupportedCountry = typeof SUPPORTED_COUNTRIES[number];

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  country: SupportedCountry;
  studyLevel?: 'undergraduate' | 'postgraduate';
  verified: boolean;
  createdAt: Date;
  hasProfile?: boolean;
  provider?: 'google' | 'apple' | 'microsoft';
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email?: string;
  password?: string;
  provider?: 'google' | 'apple' | 'microsoft';
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  country: SupportedCountry;
  provider?: 'google' | 'apple' | 'microsoft';
}

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<{ user: AuthUser; hasProfile: boolean }>;
  register: (data: RegisterData) => Promise<AuthUser>;
  logout: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
  reset: () => void;
}
