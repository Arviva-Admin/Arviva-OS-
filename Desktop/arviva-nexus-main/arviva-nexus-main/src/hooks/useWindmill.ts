// Windmill API Hook - React hook for executing Windmill scripts
// Provides loading state, error handling, and result caching

import { useState, useCallback } from 'react';
import { windmillClient, type WindmillResponse } from '@/core/windmillClient';

interface UseWindmillState {
  loading: boolean;
  error: string | null;
  data: unknown | null;
  jobId: string | null;
}

/**
 * Hook for executing Windmill scripts from React components.
 * 
 * Usage:
 *   const { execute, loading, data, error } = useWindmill();
 *   const handleClick = () => execute('f/scouts/run_scan', { source: 'reddit' });
 */
export const useWindmill = () => {
  const [state, setState] = useState<UseWindmillState>({
    loading: false,
    error: null,
    data: null,
    jobId: null,
  });

  const execute = useCallback(async (scriptPath: string, params: Record<string, unknown> = {}, userId?: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    const result: WindmillResponse = await windmillClient.execute(scriptPath, params, userId);
    
    if (result.ok) {
      setState({ loading: false, error: null, data: result.data, jobId: result.job_id || null });
    } else {
      setState({ loading: false, error: result.error || 'Unknown error', data: null, jobId: null });
    }
    
    return result;
  }, []);

  const reset = useCallback(() => {
    setState({ loading: false, error: null, data: null, jobId: null });
  }, []);

  return { ...state, execute, reset };
};
