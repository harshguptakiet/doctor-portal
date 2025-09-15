import { useState, useEffect } from 'react';
import { onAuthStateChange } from '../services/authService';
import type { Doctor, Patient } from '../types/auth';

interface AuthState {
  user: Doctor | Patient | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = (): AuthState => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (authState) => {
      setState({
        user: authState.user as Doctor | Patient | null,
        loading: authState.loading,
        error: authState.error || null
      });
    });

    return () => unsubscribe();
  }, []);

  return state;
};
