// ==========================================
// Hook useAdminAuth
// ==========================================

import { useContext } from 'react';
import { AdminAuthContext, type AdminAuthContextType } from '@/contexts/AdminAuthContext';

export function useAdminAuth(): AdminAuthContextType {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth deve ser usado dentro de um AdminAuthProvider');
  }
  return context;
}

export default useAdminAuth;