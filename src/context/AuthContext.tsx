import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, StudentOnboardingData } from '../types';
import { authService } from '../services/api';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isLoading: boolean;
  login: (email: string, password?: string, role?: UserRole) => Promise<User>;
  register: (name: string, email: string, password?: string) => Promise<User>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  completeOnboarding: (data: StudentOnboardingData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    authService.getCurrentUser()
      .then((u) => {
        setUser(u);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password?: string, role: UserRole = 'student') => {
    const loggedIn = await authService.login(email, password, role);
    setUser(loggedIn);
    return loggedIn;
  };

  const register = async (name: string, email: string, password?: string) => {
    const registered = await authService.register(name, email, password);
    setUser(registered);
    return registered;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const switchRole = async (newRole: UserRole) => {
    if (!user) return;
    const updated = await authService.switchRole(newRole);
    setUser(updated);
  };

  const updateProfile = async (updates: Partial<User>) => {
    const updated = await authService.updateProfile(updates);
    setUser(updated);
  };

  const completeOnboarding = async (data: StudentOnboardingData) => {
    const updated = await authService.completeOnboarding(data);
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'student',
        isLoading,
        login,
        register,
        logout,
        switchRole,
        updateProfile,
        completeOnboarding
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
