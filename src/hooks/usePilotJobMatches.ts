import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase-auth';

export interface JobMatchRequirement {
  label: string;
  required: string;
  userValue: string;
  status: 'met' | 'partial' | 'missing';
  gap?: string;
}

export interface MatchReason {
  type: 'strength' | 'match' | 'opportunity';
  text: string;
  detail?: string;
}

export interface JobMatchData {
  id: string;
  match_id: string;
  position: string;
  aircraft: string;
  airline: string;
  location: string;
  airline_logo?: string;
  salary?: string;
  posted_date: string;
  match_score: number;
  requirements: JobMatchRequirement[];
  match_reasons: MatchReason[];
  missing_requirements: string[];
  gap_hours: number;
  missing_licenses: string[];
  missing_type_ratings: string[];
  hours_match: number;
  license_match: number;
  type_rating_match: number;
  experience_match: number;
}

interface UsePilotJobMatchesOptions {
  userId?: string;
  limit?: number;
  enableRealtime?: boolean;
}

interface UsePilotJobMatchesReturn {
  matches: JobMatchData[];
  interestJobs: JobMatchData[];
  loading: boolean;
  error: string | null;
  hasProfileData: boolean;
  totalJobs: number;
  refetch: () => Promise<void>;
}

// Transform database match to UI format
const transformMatchData = (dbMatch: any): JobMatchData => {
  // Build requirements array from the match data
  const requirements: JobMatchRequirement[] = [];
  
  // Add hours requirement
  const hoursStatus = dbMatch.hours_match >= 40 ? 'met' : 
                     dbMatch.hours_match >= 30 ? 'partial' : 'missing';
  requirements.push({
    label: 'Total Hours',
    required: dbMatch.gap_hours > 0 ? `${dbMatch.gap_hours} more` : 'Met',
    userValue: hoursStatus === 'met' ? '✓' : hoursStatus === 'partial' ? '~' : '!',
    status: hoursStatus,
    gap: dbMatch.gap_hours > 0 ? `Need ${dbMatch.gap_hours} more hours` : undefined
  });
  
  // Add license requirement
  const licenseStatus = dbMatch.license_match >= 25 ? 'met' : 'missing';
  if (dbMatch.missing_licenses && dbMatch.missing_licenses.length > 0) {
    requirements.push({
      label: 'License',
      required: dbMatch.missing_licenses[0],
      userValue: '!',
      status: 'missing',
      gap: `Missing: ${dbMatch.missing_licenses[0]}`
    });
  } else {
    requirements.push({
      label: 'License',
      required: 'Qualified',
      userValue: '✓',
      status: 'met'
    });
  }
  
  // Add type rating requirement
  if (dbMatch.missing_type_ratings && dbMatch.missing_type_ratings.length > 0) {
    requirements.push({
      label: 'Type Rating',
      required: dbMatch.missing_type_ratings[0],
      userValue: '!',
      status: 'missing',
      gap: `Missing: ${dbMatch.missing_type_ratings[0]}`
    });
  } else {
    requirements.push({
      label: 'Type Rating',
      required: 'Current',
      userValue: '✓',
      status: 'met'
    });
  }
  
  // Add experience requirement
  const expStatus = dbMatch.experience_match >= 15 ? 'met' :
                   dbMatch.experience_match >= 8 ? 'partial' : 'missing';
  requirements.push({
    label: 'Experience',
    required: expStatus === 'met' ? 'Qualified' : 'Need more',
    userValue: expStatus === 'met' ? '✓' : expStatus === 'partial' ? '~' : '!',
    status: expStatus
  });
  
  return {
    id: dbMatch.job_id,
    match_id: dbMatch.match_id,
    position: dbMatch.job_position,
    aircraft: dbMatch.aircraft,
    airline: dbMatch.airline,
    location: dbMatch.location,
    airline_logo: dbMatch.airline_logo,
    salary: dbMatch.salary,
    posted_date: dbMatch.posted_date,
    match_score: dbMatch.match_score,
    requirements,
    match_reasons: dbMatch.match_reasons || [],
    missing_requirements: dbMatch.missing_requirements || [],
    gap_hours: dbMatch.gap_hours || 0,
    missing_licenses: dbMatch.missing_licenses || [],
    missing_type_ratings: dbMatch.missing_type_ratings || [],
    hours_match: dbMatch.hours_match || 0,
    license_match: dbMatch.license_match || 0,
    type_rating_match: dbMatch.type_rating_match || 0,
    experience_match: dbMatch.experience_match || 0
  };
};

// Transform job data for interest-based matches
const transformInterestJobData = (job: any): JobMatchData => {
  return {
    id: job.id,
    match_id: `interest-${job.id}`,
    position: job.job_position,
    aircraft: job.aircraft,
    airline: job.airline,
    location: job.location,
    airline_logo: job.airline_logo,
    salary: job.salary,
    posted_date: job.posted_date,
    match_score: 0,
    requirements: [],
    match_reasons: [{ type: 'opportunity', text: 'Matches your interests' }],
    missing_requirements: [],
    gap_hours: 0,
    missing_licenses: [],
    missing_type_ratings: [],
    hours_match: 0,
    license_match: 0,
    type_rating_match: 0,
    experience_match: 0
  };
};

export const usePilotJobMatches = ({
  userId,
  limit = 10,
  enableRealtime = true
}: UsePilotJobMatchesOptions): UsePilotJobMatchesReturn => {
  const [matches, setMatches] = useState<JobMatchData[]>([]);
  const [interestJobs, setInterestJobs] = useState<JobMatchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasProfileData, setHasProfileData] = useState(false);
  const [totalJobs, setTotalJobs] = useState(0);
  const channelRef = useRef<any>(null);

  const fetchMatches = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // First, check if user has a pilot profile
      const { data: profile, error: profileError } = await supabase
        .from('pilot_recognition_profiles')
        .select('id, total_hours, licenses, type_ratings')
        .eq('user_id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      const hasData = !!(profile?.total_hours || (profile?.licenses && profile.licenses.length > 0));
      setHasProfileData(hasData);

      // Get total active jobs count
      const { count: jobCount, error: countError } = await supabase
        .from('job_database')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      if (!countError) {
        setTotalJobs(jobCount || 0);
      }

      // Fetch credential-based matches if profile exists
      if (profile) {
        const { data: dbMatches, error: matchError } = await supabase
          .rpc('get_pilot_job_matches', {
            p_user_id: userId,
            p_limit: limit
          });

        if (matchError) throw matchError;

        if (dbMatches && dbMatches.length > 0) {
          const transformedMatches = dbMatches.map(transformMatchData);
          setMatches(transformedMatches);
        } else {
          setMatches([]);
        }
      } else {
        setMatches([]);
      }

      // Fetch interest-based jobs
      // First get user interests
      const { data: interests, error: interestsError } = await supabase
        .from('pilot_interests')
        .select('interest_tags')
        .eq('user_id', userId)
        .single();

      if (!interestsError && interests?.interest_tags && interests.interest_tags.length > 0) {
        // Query jobs matching those interests
        const { data: interestJobData, error: interestError } = await supabase
          .from('job_database')
          .select('*')
          .eq('status', 'active')
          .overlaps('tags', interests.interest_tags)
          .limit(limit);

        if (!interestError && interestJobData) {
          const transformedInterestJobs = interestJobData.map(transformInterestJobData);
          setInterestJobs(transformedInterestJobs);
        } else {
          setInterestJobs([]);
        }
      } else {
        setInterestJobs([]);
      }
    } catch (err: any) {
      console.error('Error fetching job matches:', err);
      setError(err.message || 'Failed to fetch job matches');
      setMatches([]);
      setInterestJobs([]);
    } finally {
      setLoading(false);
    }
  }, [userId, limit]);

  // Fetch matches on mount and when userId changes
  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  // Set up realtime subscription
  useEffect(() => {
    if (!userId || !enableRealtime) return;

    // Subscribe to job database changes
    const jobChannel = supabase
      .channel('job_database_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'job_database'
        },
        () => {
          // Re-fetch matches when jobs change
          fetchMatches();
        }
      )
      .subscribe();

    // Subscribe to pilot profile changes
    const profileChannel = supabase
      .channel('pilot_profile_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pilot_recognition_profiles',
          filter: `user_id=eq.${userId}`
        },
        () => {
          // Re-fetch matches when profile changes
          fetchMatches();
        }
      )
      .subscribe();

    // Subscribe to match changes
    const matchChannel = supabase
      .channel('pilot_job_matches_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pilot_job_matches'
        },
        () => {
          // Re-fetch matches when matches are updated
          fetchMatches();
        }
      )
      .subscribe();

    channelRef.current = { jobChannel, profileChannel, matchChannel };

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current.jobChannel);
        supabase.removeChannel(channelRef.current.profileChannel);
        supabase.removeChannel(channelRef.current.matchChannel);
      }
    };
  }, [userId, enableRealtime, fetchMatches]);

  return {
    matches,
    interestJobs,
    loading,
    error,
    hasProfileData,
    totalJobs,
    refetch: fetchMatches
  };
};

// Helper hook to get user profile
export const usePilotProfile = (userId?: string) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('pilot_recognition_profiles')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        setProfile(data || null);
      } catch (err: any) {
        console.error('Error fetching pilot profile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  return { profile, loading, error };
};
