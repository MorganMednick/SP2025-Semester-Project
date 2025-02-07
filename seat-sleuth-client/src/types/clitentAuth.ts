import { AuthPayload } from '@shared/api/payloads';
import { createContext } from 'react';

export enum AuthState {
  LOGIN = 'login',
  REGISTER = 'register',
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (credentials: AuthPayload) => Promise<void>;
  logout: () => Promise<void>;
  register: (credentials: AuthPayload) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
