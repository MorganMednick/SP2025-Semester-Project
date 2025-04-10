import { AuthPayload } from '@client/types/shared/payloads';
import { createContext } from 'react';

export enum AuthState {
  LOGIN = 'login',
  REGISTER = 'register',
}

interface AuthContextType {
  isAuthenticated: boolean;
  userId: number;
  login: (credentials: AuthPayload) => Promise<void>;
  logout: () => Promise<void>;
  register: (credentials: AuthPayload) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
