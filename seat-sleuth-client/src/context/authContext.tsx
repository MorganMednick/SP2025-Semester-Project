import { useContext, useEffect, useState, ReactNode } from 'react';
import { loginUser, checkLogin, registerUser, logoutUser } from '../api/functions/auth';
import { AuthPayload } from '@shared/api/payloads';
import axios from 'axios';
import { AuthContext } from '../types/clitentAuth';
import { showMantineNotification } from '../util/uiUtils';
import { ApiResponse, AuthResponse } from '@shared/api/responses';

axios.defaults.withCredentials = true;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const verifyLogin = async () => {
      const response: ApiResponse<AuthResponse> = await checkLogin();
      if (response?.statusCode && response.statusCode >= 200 && response.statusCode < 300) {
        setIsAuthenticated(true);
        showMantineNotification({ message: 'You are already logged in!', type: 'INFO' });
      } else {
        setIsAuthenticated(false);
      }
    };
    verifyLogin();
  }, []);

  const login = async (credentials: AuthPayload) => {
    const response: ApiResponse<AuthResponse> = await loginUser(credentials);
    if (response?.statusCode && response.statusCode >= 200 && response.statusCode < 300) {
      setIsAuthenticated(true);
      showMantineNotification({ message: `Welcome Back ${credentials.email}`, type: 'SUCCESS' });
    } else {
      showMantineNotification({ message: response.message, type: 'ERROR' });
    }
  };

  const logout = async () => {
    const response: ApiResponse<AuthResponse> = await logoutUser();
    if (response?.statusCode >= 200 && response.statusCode < 300) {
      showMantineNotification({ message: `You have been logged out.`, type: 'INFO' });
      setIsAuthenticated(false);
    } else {
      showMantineNotification({ message: response.message, type: 'ERROR' });
    }
  };

  const register = async (credentials: AuthPayload) => {
    const response: ApiResponse<AuthResponse> = await registerUser(credentials);
    if (response?.statusCode >= 200 && response.statusCode < 300) {
      showMantineNotification({ message: `Welcome, ${credentials.email}!`, type: 'SUCCESS' });
      setIsAuthenticated(true);
    } else {
      showMantineNotification({ message: response.message, type: 'ERROR' });
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
