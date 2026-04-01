import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase-auth';

export interface RecognitionMatch {
  id: string;
  user_id: string;
  job_id: string;
  operator_name: string;
  job_title: string;
  job_url: string;
  job_category: string;
  aircraft_type: string;
  job_location: string;
  contract_type: string;
  company_logo_url: string;
  overall_match_percentage: number;
  hours_match: boolean;
  license_match: boolean;
  type_rating_match: boolean;
  location_match: boolean;
  visa_match: boolean;
  matching_factors: string[];
  missing_factors: string[];
  status: 'active' | 'saved' | 'applied' | 'dismissed';
  viewed_at: string | null;
  saved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UseRecognitionMatchesReturn {
  matches: RecognitionMatch[];
  topMatches: RecognitionMatch[];
  loading: boolean;
  error: string | null;
  refreshMatches: () => Promise<void>;
  calculateMatches: (jobListings: any[]) => Promise<void>;
  saveMatch: (matchId: string) => Promise<void>;
  dismissMatch: (matchId: string) => Promise<void>;
  markAsApplied: (matchId: string) => Promise<void>;
  viewMatch: (matchId: string) => Promise<void>;
}

export const useRecognitionMatches = (userId?: string): UseRecognitionMatchesReturn => {
  const [matches, setMatches] = useState<RecognitionMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('pilot_recognition_matches')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('overall_match_percentage', { ascending: false });

      if (fetchError) throw fetchError;

      setMatches(data || []);
    } catch (err: any) {
      console.error('Error fetching recognition matches:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const calculateMatches = async (jobListings: any[]) => {
    if (!userId || !jobListings?.length) return;

    try {
      setLoading(true);
      setError(null);

      // Get user's portfolio data
      const { data: portfolio } = await supabase
        .from('pilot_portfolio_data')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!portfolio) {
        console.warn('No portfolio data found for user');
        setLoading(false);
        return;
      }

      // Calculate matches for each job
      const calculatedMatches = jobListings.map(job => {
        return calculateJobMatch(job, portfolio);
      });

      // Upsert matches to database
      for (const match of calculatedMatches) {
        const { error: upsertError } = await supabase
          .from('pilot_recognition_matches')
          .upsert({
            user_id: userId,
            job_id: match.job_id,
            operator_name: match.operator_name,
            job_title: match.job_title,
            job_url: match.job_url,
            job_category: match.job_category,
            aircraft_type: match.aircraft_type,
            job_location: match.job_location,
            contract_type: match.contract_type,
            company_logo_url: match.company_logo_url,
            overall_match_percentage: match.overall_match_percentage,
            hours_match: match.hours_match,
            license_match: match.license_match,
            type_rating_match: match.type_rating_match,
            location_match: match.location_match,
            visa_match: match.visa_match,
            matching_factors: match.matching_factors,
            missing_factors: match.missing_factors,
            status: 'active',
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,job_id'
          });

        if (upsertError) {
          console.error('Error upserting match:', upsertError);
        }
      }

      await fetchMatches();
    } catch (err: any) {
      console.error('Error calculating matches:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateJobMatch = (job: any, portfolio: any) => {
    const matchingFactors: string[] = [];
    const missingFactors: string[] = [];
    
    let score = 0;
    let maxScore = 0;

    // Parse job requirements
    const jobFlightTime = parseInt(job.flightTime) || 0;
    const jobLicense = job.license || '';
    const jobTypeRating = job.typeRating || '';
    const jobLocation = job.location || '';
    const jobVisa = job.visaSponsorship || '';

    // Hours match (max 30 points)
    maxScore += 30;
    const userHours = portfolio.total_hours || 0;
    if (jobFlightTime === 0 || userHours >= jobFlightTime) {
      score += 30;
      matchingFactors.push(`Flight hours: ${userHours}h meets requirement`);
    } else if (userHours >= jobFlightTime * 0.7) {
      score += 20;
      matchingFactors.push(`Flight hours: ${userHours}h (close to ${jobFlightTime}h requirement)`);
      missingFactors.push(`Need ${jobFlightTime - userHours} more hours`);
    } else {
      missingFactors.push(`Flight hours: Need ${jobFlightTime - userHours} more hours`);
    }

    // License match (max 25 points)
    maxScore += 25;
    const userLicenses = portfolio.licenses || [];
    const licenseMatch = userLicenses.some((l: any) => 
      l.type?.toLowerCase().includes(jobLicense.toLowerCase()) ||
      l.name?.toLowerCase().includes(jobLicense.toLowerCase())
    );
    if (!jobLicense || licenseMatch) {
      score += 25;
      if (jobLicense) matchingFactors.push(`License: ${jobLicense} ✓`);
    } else if (userLicenses.length > 0) {
      score += 10;
      matchingFactors.push(`Has ${userLicenses[0]?.type || 'license'} (upgradeable to ${jobLicense})`);
      missingFactors.push(`License: ${jobLicense} required`);
    } else {
      missingFactors.push(`License: ${jobLicense} required`);
    }

    // Type rating match (max 20 points)
    maxScore += 20;
    const userTypeRatings = portfolio.type_ratings || [];
    if (!jobTypeRating || jobTypeRating.toLowerCase() === 'not required') {
      score += 20;
      matchingFactors.push('No type rating required');
    } else if (userTypeRatings.some((tr: string) => 
      jobTypeRating.toLowerCase().includes(tr.toLowerCase()) ||
      tr.toLowerCase().includes(jobTypeRating.toLowerCase())
    )) {
      score += 20;
      matchingFactors.push(`Type rating: ${jobTypeRating} ✓`);
    } else {
      missingFactors.push(`Type rating: ${jobTypeRating} required`);
    }

    // Location match (max 15 points)
    maxScore += 15;
    const userLocation = portfolio.country || portfolio.location || '';
    if (!jobLocation || userLocation.toLowerCase().includes(jobLocation.toLowerCase().split(',')[0])) {
      score += 15;
      matchingFactors.push(`Location preference match`);
    } else {
      // Check if visa sponsorship available
      if (jobVisa.toLowerCase().includes('yes')) {
        score += 10;
        matchingFactors.push(`Visa sponsorship available for ${jobLocation}`);
      } else {
        missingFactors.push(`Location: ${jobLocation} (consider visa requirements)`);
      }
    }

    // Experience/Competencies (max 10 points)
    maxScore += 10;
    if (portfolio.experience?.length > 0 || portfolio.mentorship_hours > 0) {
      score += 10;
      matchingFactors.push('Relevant experience documented');
    } else {
      missingFactors.push('Add more experience details to improve match');
    }

    const overallPercentage = Math.round((score / maxScore) * 100) || 0;

    return {
      job_id: job.id || `${job.company}-${job.title}`.replace(/\s+/g, '-').toLowerCase(),
      operator_name: job.company || 'Unknown',
      job_title: job.title || 'Pilot Position',
      job_url: job.url || job.applicationUrl || '',
      job_category: job.role || 'Pilot',
      aircraft_type: job.aircraft || 'Various',
      job_location: job.location || '',
      contract_type: 'Full Time',
      company_logo_url: job.companyLogo || '',
      overall_match_percentage: overallPercentage,
      hours_match: userHours >= jobFlightTime,
      license_match: licenseMatch,
      type_rating_match: userTypeRatings.length > 0,
      location_match: userLocation.toLowerCase().includes(jobLocation.toLowerCase().split(',')[0]),
      visa_match: jobVisa.toLowerCase().includes('yes'),
      matching_factors: matchingFactors,
      missing_factors: missingFactors
    };
  };

  const saveMatch = async (matchId: string) => {
    try {
      const { error: updateError } = await supabase
        .from('pilot_recognition_matches')
        .update({
          status: 'saved',
          saved_at: new Date().toISOString()
        })
        .eq('id', matchId);

      if (updateError) throw updateError;
      await fetchMatches();
    } catch (err: any) {
      console.error('Error saving match:', err);
      setError(err.message);
    }
  };

  const dismissMatch = async (matchId: string) => {
    try {
      const { error: updateError } = await supabase
        .from('pilot_recognition_matches')
        .update({ status: 'dismissed' })
        .eq('id', matchId);

      if (updateError) throw updateError;
      await fetchMatches();
    } catch (err: any) {
      console.error('Error dismissing match:', err);
      setError(err.message);
    }
  };

  const markAsApplied = async (matchId: string) => {
    try {
      const { error: updateError } = await supabase
        .from('pilot_recognition_matches')
        .update({ status: 'applied' })
        .eq('id', matchId);

      if (updateError) throw updateError;
      await fetchMatches();
    } catch (err: any) {
      console.error('Error marking as applied:', err);
      setError(err.message);
    }
  };

  const viewMatch = async (matchId: string) => {
    try {
      const { error: updateError } = await supabase
        .from('pilot_recognition_matches')
        .update({ viewed_at: new Date().toISOString() })
        .eq('id', matchId);

      if (updateError) throw updateError;
    } catch (err: any) {
      console.error('Error viewing match:', err);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  // Get top 5 matches with highest percentage
  const topMatches = matches.slice(0, 5);

  return {
    matches,
    topMatches,
    loading,
    error,
    refreshMatches: fetchMatches,
    calculateMatches,
    saveMatch,
    dismissMatch,
    markAsApplied,
    viewMatch
  };
};
