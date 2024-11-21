import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

export const usePermissions = () => {
  const { user } = useContext(AuthContext);

  const hasPermission = (permission: string): boolean => {
    return user?.role?.permissions?.some(p => p.name === permission) ?? false;
  };

  return { hasPermission };
};