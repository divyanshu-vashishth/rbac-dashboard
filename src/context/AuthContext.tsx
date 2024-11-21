import { createContext, useContext } from 'react';
import type { User } from '@/utils/types';

interface AuthContextType {
  user: User | null;
}

export const AuthContext = createContext<AuthContextType>({ user: null });

export const useAuth = () => useContext(AuthContext);