import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase-auth';

export interface PilotPortfolio {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  location: string;
  city: string;
  country: string;
  linkedin_url: string;
  total_hours: number;
  pic_hours: number;
  ifr_hours: number;
  night_hours: number;
  simulators: string[];
  licenses: { type?: string; name?: string; issuer?: string; year?: string }[];
  type_ratings: string[];
  medical_class: string;
  medical_expiry: string;
  core_competencies: string[];
  skills: string[];
  experience: {
    role?: string;
    job_title?: string;
    company?: string;
    location?: string;
    start_date?: string;
    end_date?: string;
    achievements?: string[];
  }[];
  education: {
    degree?: string;
    qualification?: string;
    institution?: string;
    year?: string;
  }[];
  summary: string;
  bio: string;
  mentorship_hours: number;
  mentorship_observations: number;
  mentorship_cases: number;
  achievements: {
    title?: string;
    name?: string;
    type?: string;
    category?: string;
    issuer?: string;
    year?: string;
    date?: string;
  }[];
  awards_count: number;
  certifications_count: number;
  last_synced_at: string;
  synced_from_recognition: boolean;
  created_at: string;
  updated_at: string;
}

export interface UsePilotPortfolioReturn {
  portfolio: PilotPortfolio | null;
  loading: boolean;
  error: string | null;
  refreshPortfolio: () => Promise<void>;
  updatePortfolio: (data: Partial<PilotPortfolio>) => Promise<void>;
  syncFromRecognition: (recognitionData: any) => Promise<void>;
}

export const usePilotPortfolio = (userId?: string): UsePilotPortfolioReturn => {
  const [portfolio, setPortfolio] = useState<PilotPortfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolio = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('pilot_portfolio_data')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (data) {
        setPortfolio(data);
      } else {
        // Create default portfolio if none exists
        await createDefaultPortfolio();
      }
    } catch (err: any) {
      console.error('Error fetching pilot portfolio:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const createDefaultPortfolio = async () => {
    if (!userId) return;

    try {
      const defaultPortfolio = {
        user_id: userId,
        first_name: '',
        last_name: '',
        total_hours: 0,
        pic_hours: 0,
        ifr_hours: 0,
        night_hours: 0,
        simulators: [],
        licenses: [],
        type_ratings: [],
        core_competencies: [],
        skills: [],
        experience: [],
        education: [],
        achievements: [],
        mentorship_hours: 0,
        mentorship_observations: 0,
        mentorship_cases: 0,
        awards_count: 0,
        certifications_count: 0
      };

      const { data, error: insertError } = await supabase
        .from('pilot_portfolio_data')
        .insert(defaultPortfolio)
        .select()
        .single();

      if (insertError) throw insertError;
      setPortfolio(data);
    } catch (err: any) {
      console.error('Error creating default portfolio:', err);
      setError(err.message);
    }
  };

  const updatePortfolio = async (data: Partial<PilotPortfolio>) => {
    if (!userId) return;

    try {
      setError(null);

      const { error: updateError } = await supabase
        .from('pilot_portfolio_data')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      await fetchPortfolio();
    } catch (err: any) {
      console.error('Error updating portfolio:', err);
      setError(err.message);
    }
  };

  const syncFromRecognition = async (recognitionData: any) => {
    if (!userId || !recognitionData) return;

    try {
      setError(null);

      // Extract relevant data from Recognition & Achievements
      const syncData = {
        total_hours: recognitionData.totalHours || 0,
        pic_hours: recognitionData.picHours || 0,
        ifr_hours: recognitionData.ifrHours || 0,
        night_hours: recognitionData.nightHours || 0,
        achievements: recognitionData.achievements || [],
        awards_count: recognitionData.awardsCount || 0,
        certifications_count: recognitionData.certificationsCount || 0,
        licenses: recognitionData.licenses || [],
        core_competencies: recognitionData.coreCompetencies || [],
        skills: recognitionData.skills || [],
        experience: recognitionData.experience || [],
        education: recognitionData.education || [],
        summary: recognitionData.summary || recognitionData.bio || '',
        last_synced_at: new Date().toISOString(),
        synced_from_recognition: true
      };

      const { error: updateError } = await supabase
        .from('pilot_portfolio_data')
        .update(syncData)
        .eq('user_id', userId);

      if (updateError) throw updateError;

      await fetchPortfolio();
    } catch (err: any) {
      console.error('Error syncing from recognition:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  return {
    portfolio,
    loading,
    error,
    refreshPortfolio: fetchPortfolio,
    updatePortfolio,
    syncFromRecognition
  };
};
