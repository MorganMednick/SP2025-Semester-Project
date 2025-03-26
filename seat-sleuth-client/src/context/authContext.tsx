import { useContext, useEffect, useState, ReactNode } from 'react';
import { loginUser, checkLogin, registerUser, logoutUser } from '../api/functions/auth';
import { AuthPayload } from '@shared/api/payloads';
import { AuthContext } from '../types/clitentAuth';
import { showMantineNotification } from '../util/uiUtils';
import { ApiResponse, AuthResponse } from '@shared/api/responses';
import { responseIsOk } from '../util/apiUtils';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<number>(-1);

  useEffect(() => {
    const verifyLogin = async () => {
      try {
        const response: ApiResponse<AuthResponse> = await checkLogin();
        if (responseIsOk(response)) {
          setIsAuthenticated(true);
          showMantineNotification({ message: 'Session saved. You are logged in!', type: 'INFO' });
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      }
    };

    verifyLogin();
  }, []);

  const login = async (credentials: AuthPayload) => {
    try {
      const response: ApiResponse<AuthResponse> = await loginUser(credentials);
      if (responseIsOk(response)) {
        setIsAuthenticated(true);
        setUserId(response?.data?.userId || -1);
        showMantineNotification({ message: `Welcome Back ${credentials.email}`, type: 'SUCCESS' });
      } else {
        throw new Error(response.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      showMantineNotification({
        message: error.message || 'Login failed. Please try again.',
        type: 'ERROR',
      });
    }
  };

  const logout = async () => {
    try {
      const response: ApiResponse<AuthResponse> = await logoutUser();
      if (responseIsOk(response)) {
        setIsAuthenticated(false);
        setUserId(-1);
        showMantineNotification({ message: 'You have been logged out.', type: 'INFO' });
      } else {
        throw new Error(response.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      showMantineNotification({
        message: error.message || 'Logout failed. Please try again.',
        type: 'ERROR',
      });
    }
  };

  const register = async (credentials: AuthPayload) => {
    try {
      const response: ApiResponse<AuthResponse> = await registerUser(credentials);
      if (responseIsOk(response)) {
        setIsAuthenticated(true);
        setUserId(response?.data?.userId || -1);
        showMantineNotification({ message: `Welcome, ${credentials.email}!`, type: 'SUCCESS' });
      } else {
        setIsAuthenticated(false);
        throw new Error(response.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      showMantineNotification({
        message: error.message || 'Registration failed. Please try again.',
        type: 'ERROR',
      });
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, logout, register }}>
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
