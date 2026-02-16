// Supabase Realtime Hook - Connects UI to live database updates
// Ready for integration when Lovable Cloud is enabled

import { useState, useEffect, useCallback } from 'react';

export interface RealtimeEvent<T = unknown> {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: T;
  old_record?: T;
  timestamp: string;
}

interface UseRealtimeOptions {
  table: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
  enabled?: boolean;
}

/**
 * Subscribe to Supabase Realtime changes on a table.
 * Returns the latest event and a list of all records.
 * 
 * Usage:
 *   const { data, lastEvent } = useSupabaseRealtime<MetaEvent>({ table: 'meta_events' });
 */
export const useSupabaseRealtime = <T = unknown>({ table, event = '*', filter, enabled = true }: UseRealtimeOptions) => {
  const [data, setData] = useState<T[]>([]);
  const [lastEvent, setLastEvent] = useState<RealtimeEvent<T> | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    // Placeholder: When Supabase is connected, this will subscribe to realtime
    console.log(`[REALTIME] Subscribing to ${table} (${event})${filter ? ` with filter: ${filter}` : ''}`);
    setConnected(true);

    // Simulate connection for UI development
    return () => {
      console.log(`[REALTIME] Unsubscribed from ${table}`);
      setConnected(false);
    };
  }, [table, event, filter, enabled]);

  const refresh = useCallback(() => {
    console.log(`[REALTIME] Manual refresh requested for ${table}`);
  }, [table]);

  return { data, lastEvent, connected, refresh };
};
