import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase-auth';

export interface AirlinePassportConnection {
  id: string;
  user_id: string;
  airline_id: string;
  airline_name: string;
  airline_code: string;
  logo_url: string;
  status: 'connected' | 'pending' | 'available' | 'disconnected';
  last_synced_at: string | null;
  match_percentage: number;
  flight_hours_synced: boolean;
  competencies_synced: boolean;
  achievements_synced: boolean;
  created_at: string;
  updated_at: string;
}

export interface UseAirlinePassportReturn {
  connections: AirlinePassportConnection[];
  loading: boolean;
  error: string | null;
  refreshConnections: () => Promise<void>;
  connectAirline: (airlineId: string, airlineName: string, airlineCode: string, logoUrl: string) => Promise<void>;
  disconnectAirline: (connectionId: string) => Promise<void>;
  syncAirlineData: (connectionId: string) => Promise<void>;
}

export const useAirlinePassport = (userId?: string): UseAirlinePassportReturn => {
  const [connections, setConnections] = useState<AirlinePassportConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConnections = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('airline_passport_connections')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (fetchError) throw fetchError;

      setConnections(data || []);
    } catch (err: any) {
      console.error('Error fetching airline connections:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const connectAirline = async (
    airlineId: string, 
    airlineName: string, 
    airlineCode: string, 
    logoUrl: string
  ) => {
    if (!userId) return;

    try {
      setError(null);

      // Check if already exists
      const { data: existing } = await supabase
        .from('airline_passport_connections')
        .select('id')
        .eq('user_id', userId)
        .eq('airline_id', airlineId)
        .single();

      if (existing) {
        // Update to pending/connected
        const { error: updateError } = await supabase
          .from('airline_passport_connections')
          .update({
            status: 'pending',
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);

        if (updateError) throw updateError;
      } else {
        // Create new connection
        const { error: insertError } = await supabase
          .from('airline_passport_connections')
          .insert({
            user_id: userId,
            airline_id: airlineId,
            airline_name: airlineName,
            airline_code: airlineCode,
            logo_url: logoUrl,
            status: 'pending',
            match_percentage: 0,
            flight_hours_synced: false,
            competencies_synced: false,
            achievements_synced: false
          });

        if (insertError) throw insertError;
      }

      await fetchConnections();
    } catch (err: any) {
      console.error('Error connecting airline:', err);
      setError(err.message);
    }
  };

  const disconnectAirline = async (connectionId: string) => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('airline_passport_connections')
        .delete()
        .eq('id', connectionId);

      if (deleteError) throw deleteError;

      await fetchConnections();
    } catch (err: any) {
      console.error('Error disconnecting airline:', err);
      setError(err.message);
    }
  };

  const syncAirlineData = async (connectionId: string) => {
    if (!userId) return;

    try {
      setError(null);

      // Get user's pilot portfolio data
      const { data: portfolio } = await supabase
        .from('pilot_portfolio_data')
        .select('*')
        .eq('user_id', userId)
        .single();

      // Calculate match percentage based on portfolio data
      const matchPercentage = calculateMatchPercentage(portfolio);

      // Update connection with synced data
      const { error: updateError } = await supabase
        .from('airline_passport_connections')
        .update({
          status: 'connected',
          last_synced_at: new Date().toISOString(),
          match_percentage: matchPercentage,
          flight_hours_synced: !!portfolio?.total_hours,
          competencies_synced: !!(portfolio?.core_competencies?.length > 0),
          achievements_synced: !!(portfolio?.achievements?.length > 0)
        })
        .eq('id', connectionId);

      if (updateError) throw updateError;

      await fetchConnections();
    } catch (err: any) {
      console.error('Error syncing airline data:', err);
      setError(err.message);
    }
  };

  const calculateMatchPercentage = (portfolio: any): number => {
    if (!portfolio) return 0;
    
    let score = 0;
    let maxScore = 0;

    // Flight hours (max 30 points)
    maxScore += 30;
    if (portfolio.total_hours >= 1500) score += 30;
    else if (portfolio.total_hours >= 500) score += 20;
    else if (portfolio.total_hours > 0) score += 10;

    // PIC hours (max 25 points)
    maxScore += 25;
    if (portfolio.pic_hours >= 500) score += 25;
    else if (portfolio.pic_hours >= 200) score += 15;
    else if (portfolio.pic_hours > 0) score += 5;

    // Licenses (max 20 points)
    maxScore += 20;
    const licenses = portfolio.licenses || [];
    if (licenses.some((l: any) => l.type?.includes('ATPL') || l.name?.includes('ATPL'))) score += 20;
    else if (licenses.some((l: any) => l.type?.includes('CPL') || l.name?.includes('CPL'))) score += 15;
    else if (licenses.length > 0) score += 10;

    // Type ratings (max 15 points)
    maxScore += 15;
    const typeRatings = portfolio.type_ratings || [];
    if (typeRatings.length >= 2) score += 15;
    else if (typeRatings.length === 1) score += 10;

    // Competencies (max 10 points)
    maxScore += 10;
    if (portfolio.core_competencies?.length >= 5) score += 10;
    else if (portfolio.core_competencies?.length > 0) score += 5;

    return Math.round((score / maxScore) * 100) || 0;
  };

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  return {
    connections,
    loading,
    error,
    refreshConnections: fetchConnections,
    connectAirline,
    disconnectAirline,
    syncAirlineData
  };
};
