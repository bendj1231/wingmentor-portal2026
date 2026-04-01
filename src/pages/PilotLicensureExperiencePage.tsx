import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase-auth';

interface PilotLicensureExperiencePageProps {
  onBack: () => void;
  userProfile?: {
    uid?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null;
}

interface JobExperience {
  id: string;
  company: string;
  position: string;
  fromDate: string;
  toDate: string;
  description: string;
}

interface AircraftRating {
  id: string;
  aircraftType: string;
  ratingDate: string;
  isCurrent: boolean;
}

const OCCUPATION_OPTIONS = [
  { value: 'employed', label: 'Employed' },
  { value: 'unemployed', label: 'Unemployed' },
  { value: 'open_to_changes', label: 'Open to Changes' },
  { value: 'looking_for_new_opportunities', label: 'Looking for New Opportunities' }
];

const LICENSE_TYPES = [
  'PPL',
  'CPL',
  'SPL',
  'CFI',
  'IR',
  'ME',
  'ATPL',
  'ATPL Frozen'
];

const MEDICAL_CLASSES = [
  'Class 1',
  'Class 2',
  'Class 3'
];

const COMMON_AIRCRAFT = [
  'Airbus A320', 'Airbus A330', 'Airbus A350', 'Airbus A380',
  'Boeing 737', 'Boeing 747', 'Boeing 757', 'Boeing 767', 'Boeing 777', 'Boeing 787',
  'Embraer E170/E175', 'Embraer E190/E195',
  'Bombardier CRJ200/700/900',
  'ATR 42/72',
  'Cessna 172', 'Cessna 208', 'Cessna Citation',
  'Piper PA-28', 'Piper PA-34',
  'Diamond DA40', 'Diamond DA42',
  'Beechcraft King Air',
  'Other'
];

const LANGUAGES = [
  'English', 'Arabic', 'French', 'Spanish', 'German', 'Italian', 'Portuguese',
  'Russian', 'Chinese (Mandarin)', 'Japanese', 'Hindi', 'Urdu', 'Turkish',
  'Other'
];

const NATIONALITIES = [
  'United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman',
  'United Kingdom', 'United States', 'Canada', 'Australia', 'New Zealand',
  'India', 'Pakistan', 'South Africa', 'Egypt', 'Jordan', 'Lebanon', 'Morocco',
  'Turkey', 'Other'
];

const ENGLISH_PROFICIENCY_LEVELS = [
  'Level 1 - Pre-Elementary',
  'Level 2 - Elementary',
  'Level 3 - Pre-Operational',
  'Level 4 - Operational',
  'Level 5 - Extended',
  'Level 6 - Expert'
];

// Aviation Pathways Options
const AVIATION_PATHWAYS_OPTIONS = [
  'Commercial Aviation (Airlines)',
  'Cargo Aviation',
  'Business Aviation / Private Jets',
  'Flight Instruction',
  'Agricultural Aviation',
  'Emergency Medical Services (Air Ambulance)',
  'Search and Rescue',
  'Firefighting Aviation',
  'Aerial Photography / Surveying',
  'Flight Testing',
  'Military Aviation',
  'Government / Civil Aviation Authority',
  'Aviation Management',
  'Aircraft Maintenance',
  'Aviation Safety & Investigation',
  'Unmanned Aerial Systems (Drones)',
  'Helicopter Operations',
  'Seaplane Operations',
  'Aerobatics / Airshow Flying',
  'Gliding / Soaring'
];

// Pilot Job Positions Options
const PILOT_JOB_POSITIONS_OPTIONS = [
  'Student Pilot',
  'Private Pilot',
  'Commercial Pilot',
  'First Officer (FO)',
  'Senior First Officer (SFO)',
  'Captain',
  'Check Airman / Examiner',
  'Type Rating Instructor',
  'Simulator Instructor',
  'Ground School Instructor',
  'Chief Pilot',
  'Director of Operations',
  'Flight Operations Manager',
  'Corporate Pilot',
  'Charter Pilot',
  'Cargo Pilot',
  'Helicopter Pilot',
  'Agricultural Pilot',
  'Flight Test Pilot',
  'Airshow / Display Pilot',
  'Military Pilot',
  'Flight Dispatcher',
  'Aviation Consultant'
];

export const PilotLicensureExperiencePage: React.FC<PilotLicensureExperiencePageProps> = ({ 
  onBack, 
  userProfile 
}) => {
  // Personal Info State
  const [firstName, setFirstName] = useState(userProfile?.firstName || '');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState(userProfile?.lastName || '');
  const [fullLegalName, setFullLegalName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [nationality, setNationality] = useState('');
  const [residingCountry, setResidingCountry] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [flightSchoolAddress, setFlightSchoolAddress] = useState('');
  const [languages, setLanguages] = useState('');
  
  // License Info State
  const [currentLicenses, setCurrentLicenses] = useState<string[]>([]);
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseExpiry, setLicenseExpiry] = useState('');
  
  // Medical Certificate State
  const [medicalExpiry, setMedicalExpiry] = useState('');
  const [medicalCountry, setMedicalCountry] = useState('');
  const [medicalClass, setMedicalClass] = useState('');
  
  // Radio License State
  const [radioLicenseExpiry, setRadioLicenseExpiry] = useState('');
  
  // Aircraft Ratings State
  const [aircraftRatings, setAircraftRatings] = useState<AircraftRating[]>([]);
  
  // Job Experience State
  const [jobExperiences, setJobExperiences] = useState<JobExperience[]>([]);
  
  // Current Occupation State
  const [currentOccupation, setCurrentOccupation] = useState('');
  const [currentEmployer, setCurrentEmployer] = useState('');
  const [currentPosition, setCurrentPosition] = useState('');
  
  // Additional Info State
  const [countriesVisited, setCountriesVisited] = useState('');
  const [favoriteAircraft, setFavoriteAircraft] = useState('');
  const [whyBecomePilot, setWhyBecomePilot] = useState('');
  const [otherSkills, setOtherSkills] = useState('');
  const [englishProficiency, setEnglishProficiency] = useState('');
  
  // Pilot Interests State
  const [aviationPathwaysInterests, setAviationPathwaysInterests] = useState<string[]>([]);
  const [pilotJobPositionsInterests, setPilotJobPositionsInterests] = useState<string[]>([]);
  
  // Form State
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Separate effect to handle minimum display time for loading screen
  useEffect(() => {
    // Always show loading for at least 1 second when component mounts
    const timer = setTimeout(() => {
      if (dataLoaded || !userProfile?.uid) {
        // Hide loader if data is loaded OR if no userProfile after timeout
        setIsLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [dataLoaded, userProfile?.uid]);

  // Load existing data from Supabase
  useEffect(() => {
    const loadExistingData = async () => {
      if (!userProfile?.uid) {
        console.log('No userProfile uid available, skipping data load');
        setDataLoaded(true); // Mark as loaded so loader hides
        return;
      }

      try {
        // First, fetch from profiles table (account creation data)
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, display_name, phone, country, date_of_birth, email, onboarding_responses')
          .eq('id', userProfile.uid)
          .single();

        // Set initial values from profiles (if available)
        let initialData: any = {};
        
        if (profileError) {
          console.log('No profile data found:', profileError);
        } else if (profileData) {
          console.log('Profile data loaded:', profileData);
          
          // Extract from onboarding_responses JSONB as fallback
          const onboarding = profileData.onboarding_responses || {};
          
          // Handle empty strings as well as null/undefined
          const hasValue = (val: any) => val && val.trim && val.trim() !== '';
          
          initialData = {
            fullLegalName: hasValue(profileData.full_name) ? profileData.full_name : (hasValue(onboarding.full_name) ? onboarding.full_name : ''),
            contactNumber: hasValue(profileData.phone) ? profileData.phone : (hasValue(onboarding.phone) ? onboarding.phone : ''),
            residingCountry: hasValue(profileData.country) ? profileData.country : (hasValue(onboarding.country) ? onboarding.country : ''),
            dateOfBirth: hasValue(profileData.date_of_birth) ? profileData.date_of_birth : (hasValue(onboarding.date_of_birth) ? onboarding.date_of_birth : '')
          };
          
          // Parse display_name into first/last name (check for empty string)
          if (hasValue(profileData.display_name)) {
            const nameParts = profileData.display_name.split(' ');
            initialData.firstName = nameParts[0] || '';
            initialData.lastName = nameParts.slice(1).join(' ') || '';
          } else if (hasValue(onboarding.first_name) || hasValue(onboarding.last_name)) {
            initialData.firstName = onboarding.first_name || '';
            initialData.lastName = onboarding.last_name || '';
          } else if (profileData.email) {
            // Fallback: parse email prefix as name
            const emailPrefix = profileData.email.split('@')[0];
            // Parse benjamintigerbowler -> Benjamin Tiger Bowler
            // or john.doe -> John Doe
            const cleanName = emailPrefix
              .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase
              .replace(/([0-9])/g, ' ') // Remove numbers
              .replace(/[._-]/g, ' ') // Replace separators with space
              .replace(/\s+/g, ' ') // Collapse multiple spaces
              .trim();
            
            if (cleanName) {
              const nameParts = cleanName.split(' ').filter((p: string) => p.length > 0);
              if (nameParts.length >= 2) {
                // Capitalize each part
                initialData.firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1).toLowerCase();
                initialData.lastName = nameParts.slice(1).map((p: string) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(' ');
              } else if (nameParts.length === 1) {
                initialData.firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1).toLowerCase();
                initialData.lastName = '';
              }
            }
          }
        }

        // Then, fetch from pilot_licensure_experience table
        const { data, error } = await supabase
          .from('pilot_licensure_experience')
          .select('*')
          .eq('user_id', userProfile.uid)
          .maybeSingle();

        if (error) {
          console.log('No existing licensure data found:', error);
          // Only use profile data as fallback if we haven't already set the values
          if (!fullLegalName) setFullLegalName(initialData.fullLegalName || '');
          if (!firstName) setFirstName(initialData.firstName || userProfile?.firstName || '');
          if (!lastName) setLastName(initialData.lastName || userProfile?.lastName || '');
          if (!contactNumber) setContactNumber(initialData.contactNumber || '');
          if (!residingCountry) setResidingCountry(initialData.residingCountry || '');
          if (!dateOfBirth) setDateOfBirth(initialData.dateOfBirth || '');
        } else if (data) {
          console.log('Licensure data loaded:', data);
          // Personal Info - use licensure data if available, fallback to profiles
          setFirstName(data.first_name || initialData.firstName || userProfile?.firstName || '');
          setMiddleName(data.middle_name || '');
          setLastName(data.last_name || initialData.lastName || userProfile?.lastName || '');
          setFullLegalName(data.full_legal_name || initialData.fullLegalName || '');
          setDateOfBirth(data.date_of_birth || initialData.dateOfBirth || '');
          setNationality(data.nationality || '');
          setResidingCountry(data.residing_country || initialData.residingCountry || '');
          setContactNumber(data.contact_number || initialData.contactNumber || '');
          setFlightSchoolAddress(data.flight_school_address || '');
          setLanguages(data.languages || '');
          setEnglishProficiency(data.english_proficiency || '');

          // License Info
          setCurrentLicenses(data.current_license || []);
          setLicenseNumber(data.license_number || '');
          setLicenseExpiry(data.license_expiry || '');

          // Medical Info
          setMedicalExpiry(data.medical_expiry || '');
          setMedicalCountry(data.medical_country || '');
          setMedicalClass(data.medical_class || '');
          setRadioLicenseExpiry(data.radio_license_expiry || '');

          // Aircraft Ratings
          setAircraftRatings(data.aircraft_ratings || []);

          // Job Experiences
          setJobExperiences(data.job_experiences || []);

          // Current Occupation
          setCurrentOccupation(data.current_occupation || '');
          setCurrentEmployer(data.current_employer || '');
          setCurrentPosition(data.current_position || '');

          // Pilot Interests
          setCountriesVisited(data.countries_visited?.toString() || '');
          setFavoriteAircraft(data.favorite_aircraft || '');
          setWhyBecomePilot(data.why_become_pilot || '');
          setOtherSkills(data.other_skills || '');
          setAviationPathwaysInterests(data.aviation_pathways_interests || []);
          setPilotJobPositionsInterests(data.pilot_job_positions_interests || []);
        }
        
        // Apply all profile data fallbacks if no licensure data was found
        if (!data) {
          setFullLegalName(initialData.fullLegalName || '');
          setFirstName(initialData.firstName || userProfile?.firstName || '');
          setLastName(initialData.lastName || userProfile?.lastName || '');
          setContactNumber(initialData.contactNumber || '');
          setResidingCountry(initialData.residingCountry || '');
          setDateOfBirth(initialData.dateOfBirth || '');
        }
        
        // Mark data as loaded - the separate effect will handle hiding the loader after min time
        setDataLoaded(true);
        
      } catch (error) {
        console.error('Error loading data:', error);
        setDataLoaded(true); // Still mark as loaded to hide loader
      }
    };

    loadExistingData();
  }, [userProfile?.uid]);

  // Add new job experience
  const addJobExperience = () => {
    const newJob: JobExperience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      fromDate: '',
      toDate: '',
      description: ''
    };
    setJobExperiences([...jobExperiences, newJob]);
  };

  // Update job experience
  const updateJobExperience = (id: string, field: keyof JobExperience, value: string) => {
    setJobExperiences(jobExperiences.map(job => 
      job.id === id ? { ...job, [field]: value } : job
    ));
  };

  // Remove job experience
  const removeJobExperience = (id: string) => {
    setJobExperiences(jobExperiences.filter(job => job.id !== id));
  };

  // Add aircraft rating
  const addAircraftRating = () => {
    const newRating: AircraftRating = {
      id: Date.now().toString(),
      aircraftType: '',
      ratingDate: '',
      isCurrent: true
    };
    setAircraftRatings([...aircraftRatings, newRating]);
  };

  // Update aircraft rating
  const updateAircraftRating = (id: string, field: keyof AircraftRating, value: string | boolean) => {
    setAircraftRatings(aircraftRatings.map(rating => 
      rating.id === id ? { ...rating, [field]: value } : rating
    ));
  };

  // Remove aircraft rating
  const removeAircraftRating = (id: string) => {
    setAircraftRatings(aircraftRatings.filter(rating => rating.id !== id));
  };

  // Toggle license selection
  const toggleLicense = (license: string) => {
    if (currentLicenses.includes(license)) {
      setCurrentLicenses(currentLicenses.filter(l => l !== license));
    } else {
      setCurrentLicenses([...currentLicenses, license]);
    }
  };

  // Toggle aviation pathway interest
  const toggleAviationPathway = (pathway: string) => {
    if (aviationPathwaysInterests.includes(pathway)) {
      setAviationPathwaysInterests(aviationPathwaysInterests.filter(p => p !== pathway));
    } else {
      setAviationPathwaysInterests([...aviationPathwaysInterests, pathway]);
    }
  };

  // Toggle pilot job position interest
  const togglePilotJobPosition = (position: string) => {
    if (pilotJobPositionsInterests.includes(position)) {
      setPilotJobPositionsInterests(pilotJobPositionsInterests.filter(p => p !== position));
    } else {
      setPilotJobPositionsInterests([...pilotJobPositionsInterests, position]);
    }
  };

  // Save all data to Supabase
  const handleSave = async () => {
    if (!userProfile?.uid) {
      setSaveMessage('Please log in to save your data');
      return;
    }

    setIsSaving(true);
    setSaveMessage('');

    try {
      const data = {
        user_id: userProfile.uid,
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        date_of_birth: dateOfBirth,
        nationality,
        languages,
        current_license: currentLicenses,
        license_number: licenseNumber,
        license_expiry: licenseExpiry,
        medical_expiry: medicalExpiry,
        medical_country: medicalCountry,
        medical_class: medicalClass,
        radio_license_expiry: radioLicenseExpiry,
        aircraft_ratings: aircraftRatings,
        job_experiences: jobExperiences,
        current_occupation: currentOccupation,
        current_employer: currentEmployer,
        current_position: currentPosition,
        full_legal_name: fullLegalName,
        flight_school_address: flightSchoolAddress,
        residing_country: residingCountry,
        contact_number: contactNumber,
        favorite_aircraft: favoriteAircraft,
        why_become_pilot: whyBecomePilot,
        aviation_pathways_interests: aviationPathwaysInterests,
        pilot_job_positions_interests: pilotJobPositionsInterests,
        english_proficiency: englishProficiency,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('pilot_licensure_experience')
        .upsert(data, { onConflict: 'user_id' });

      if (error) throw error;

      setSaveMessage('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      setSaveMessage('Error saving data. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="dashboard-container animate-fade-in" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f4f8 0%, #e8eef5 100%)' }}>
      {/* Loading Screen */}
      {isLoading ? (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          <p style={{ marginTop: '1.5rem', fontSize: '1.125rem', color: '#475569', fontWeight: 500 }}>
            Loading your profile...
          </p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>
            Please wait while we fetch your information
          </p>
        </div>
      ) : (
      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <button
            onClick={onBack}
            style={{
              position: 'absolute',
              top: '2rem',
              left: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '0.875rem',
              color: '#475569',
              fontWeight: 500
            }}
          >
            ← Back to Dashboard
          </button>
          
          <div style={{ marginBottom: '1rem' }}>
            <img src="/logo.png" alt="WingMentor Logo" style={{ height: '120px', width: 'auto' }} />
          </div>
          <p style={{ letterSpacing: '0.2em', color: '#2563eb', fontWeight: 600, fontSize: '0.75rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            Pilot Recognition Profile
          </p>
          <h1 style={{ fontSize: '2rem', marginTop: '0.5rem', marginBottom: '0', color: '#0f172a', fontWeight: 600 }}>
            Pilot Licensure & Experience Data Entry
          </h1>
          <p style={{ marginTop: '1rem', color: '#64748b', maxWidth: '600px', margin: '1rem auto' }}>
            This information will be visible to aviation industry manufacturers and airlines who will see your current state, qualifications, and experience.
          </p>
        </header>

        {/* Save Message */}
        {saveMessage && (
          <div style={{
            background: saveMessage.includes('success') ? '#dcfce7' : '#fee2e2',
            border: `1px solid ${saveMessage.includes('success') ? '#86efac' : '#fca5a5'}`,
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '2rem',
            textAlign: 'center',
            color: saveMessage.includes('success') ? '#166534' : '#991b1b'
          }}>
            {saveMessage}
          </div>
        )}

        {/* Personal Information Section */}
        <section style={{ 
          background: 'white', 
          borderRadius: '20px', 
          padding: '2rem', 
          marginBottom: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            Personal Information
          </h2>
          
          {/* Full Legal Name */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
              Full Legal Name *
            </label>
            <input
              type="text"
              value={fullLegalName}
              onChange={(e) => setFullLegalName(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}
              placeholder="Captain John Doe"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                First Name *
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem'
                }}
                placeholder="Enter first name"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                Middle Name
              </label>
              <input
                type="text"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem'
                }}
                placeholder="Enter middle name (optional)"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                Last Name *
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem'
                }}
                placeholder="Enter last name"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                Date of Birth *
              </label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                Residing Country *
              </label>
              <select
                value={residingCountry}
                onChange={(e) => setResidingCountry(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  background: 'white'
                }}
              >
                <option value="">Select residing country</option>
                {NATIONALITIES.map(nat => (
                  <option key={nat} value={nat}>{nat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                Nationality *
              </label>
              <select
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  background: 'white'
                }}
              >
                <option value="">Select nationality</option>
                {NATIONALITIES.map(nat => (
                  <option key={nat} value={nat}>{nat}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Flight School Address */}
          <div style={{ marginTop: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
              Flight School Address
            </label>
            <input
              type="text"
              value={flightSchoolAddress}
              onChange={(e) => setFlightSchoolAddress(e.target.value)}
              placeholder="Aviation Way, Sector 4, Global Flight Academy..."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}
            />
          </div>

          {/* Contact Number */}
          <div style={{ marginTop: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
              Contact Number *
            </label>
            <input
              type="tel"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="+1 (555) 000-0000"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}
            />
          </div>
          
          {/* Languages */}
          <div style={{ marginTop: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
              Languages You Speak *
            </label>
            <input
              type="text"
              value={languages}
              onChange={(e) => setLanguages(e.target.value)}
              placeholder="e.g. English, Arabic, French"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}
            />
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#6b7280' }}>
              Enter languages separated by commas
            </p>
          </div>

          {/* English Proficiency */}
          <div style={{ marginTop: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
              English Proficiency Level *
            </label>
            <select
              value={englishProficiency}
              onChange={(e) => setEnglishProficiency(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.875rem',
                background: 'white'
              }}
            >
              <option value="">Select proficiency level</option>
              {ENGLISH_PROFICIENCY_LEVELS.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#6b7280' }}>
              ICAO English Language Proficiency Rating
            </p>
          </div>
        </section>

        {/* License Information Section */}
        <section style={{ 
          background: 'white', 
          borderRadius: '20px', 
          padding: '2rem', 
          marginBottom: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            License Information
          </h2>
          
          {/* Pilot Licenses - Multi Select */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.75rem' }}>
              Current License(s) Held *
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {LICENSE_TYPES.map(license => (
                <button
                  key={license}
                  onClick={() => toggleLicense(license)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '9999px',
                    border: '1px solid',
                    borderColor: currentLicenses.includes(license) ? '#2563eb' : '#d1d5db',
                    background: currentLicenses.includes(license) ? '#2563eb' : 'white',
                    color: currentLicenses.includes(license) ? 'white' : '#374151',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                >
                  {license}
                </button>
              ))}
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                License Number
              </label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem'
                }}
                placeholder="Enter license number"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                License Expiration Date *
              </label>
              <input
                type="date"
                value={licenseExpiry}
                onChange={(e) => setLicenseExpiry(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem'
                }}
              />
            </div>
          </div>
        </section>

        {/* Medical Certificate Section */}
        <section style={{ 
          background: 'white', 
          borderRadius: '20px', 
          padding: '2rem', 
          marginBottom: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            Medical Certificate
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                Medical Certificate Expiration Date *
              </label>
              <input
                type="date"
                value={medicalExpiry}
                onChange={(e) => setMedicalExpiry(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                Country Medical License Issued *
              </label>
              <select
                value={medicalCountry}
                onChange={(e) => setMedicalCountry(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  background: 'white'
                }}
              >
                <option value="">Select country</option>
                {NATIONALITIES.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.75rem' }}>
                Medical Class *
              </label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {MEDICAL_CLASSES.map(medClass => (
                  <button
                    key={medClass}
                    onClick={() => setMedicalClass(medClass)}
                    style={{
                      padding: '0.75rem 1.5rem',
                      borderRadius: '8px',
                      border: '2px solid',
                      borderColor: medicalClass === medClass ? '#2563eb' : '#d1d5db',
                      background: medicalClass === medClass ? '#2563eb' : 'white',
                      color: medicalClass === medClass ? 'white' : '#374151',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      fontWeight: 600,
                      flex: 1
                    }}
                  >
                    {medClass}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Radio License Section */}
        <section style={{ 
          background: 'white', 
          borderRadius: '20px', 
          padding: '2rem', 
          marginBottom: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            Radio License
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                Radio License Expiration Date
              </label>
              <input
                type="date"
                value={radioLicenseExpiry}
                onChange={(e) => setRadioLicenseExpiry(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem'
                }}
              />
            </div>
          </div>
        </section>

        {/* Aircraft Type Ratings Section */}
        <section style={{ 
          background: 'white', 
          borderRadius: '20px', 
          padding: '2rem', 
          marginBottom: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Aircraft Type Ratings
            </h2>
            <button
              onClick={addAircraftRating}
              style={{
                padding: '0.5rem 1rem',
                background: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              + Add Rating
            </button>
          </div>
          
          {aircraftRatings.length === 0 && (
            <p style={{ color: '#6b7280', fontStyle: 'italic', textAlign: 'center', padding: '2rem' }}>
              No aircraft ratings added yet. Click "Add Rating" to add your type ratings.
            </p>
          )}
          
          {aircraftRatings.map((rating, index) => (
            <div key={rating.id} style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1rem', 
              marginBottom: '1rem',
              padding: '1rem',
              background: '#f9fafb',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.25rem' }}>
                  Aircraft Type
                </label>
                <select
                  value={rating.aircraftType}
                  onChange={(e) => updateAircraftRating(rating.id, 'aircraftType', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    background: 'white'
                  }}
                >
                  <option value="">Select aircraft</option>
                  {COMMON_AIRCRAFT.map(aircraft => (
                    <option key={aircraft} value={aircraft}>{aircraft}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.25rem' }}>
                  Rating Date
                </label>
                <input
                  type="date"
                  value={rating.ratingDate}
                  onChange={(e) => updateAircraftRating(rating.id, 'ratingDate', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={rating.isCurrent}
                    onChange={(e) => updateAircraftRating(rating.id, 'isCurrent', e.target.checked)}
                    style={{ width: '1rem', height: '1rem' }}
                  />
                  <span style={{ fontSize: '0.875rem', color: '#374151' }}>Current Rating</span>
                </label>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button
                  onClick={() => removeAircraftRating(rating.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Job Experience Section */}
        <section style={{ 
          background: 'white', 
          borderRadius: '20px', 
          padding: '2rem', 
          marginBottom: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Job Experience
            </h2>
            <button
              onClick={addJobExperience}
              style={{
                padding: '0.5rem 1rem',
                background: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              + Add Experience
            </button>
          </div>
          
          {jobExperiences.length === 0 && (
            <p style={{ color: '#6b7280', fontStyle: 'italic', textAlign: 'center', padding: '2rem' }}>
              No job experiences added yet. Click "Add Experience" to log your work history.
            </p>
          )}
          
          {jobExperiences.map((job, index) => (
            <div key={job.id} style={{ 
              marginBottom: '1.5rem',
              padding: '1.5rem',
              background: '#f9fafb',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.25rem' }}>
                    Company/Organization *
                  </label>
                  <input
                    type="text"
                    value={job.company}
                    onChange={(e) => updateJobExperience(job.id, 'company', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.875rem'
                    }}
                    placeholder="e.g., Emirates Airlines"
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.25rem' }}>
                    Position/Role *
                  </label>
                  <input
                    type="text"
                    value={job.position}
                    onChange={(e) => updateJobExperience(job.id, 'position', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.875rem'
                    }}
                    placeholder="e.g., First Officer"
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.25rem' }}>
                    From Date *
                  </label>
                  <input
                    type="date"
                    value={job.fromDate}
                    onChange={(e) => updateJobExperience(job.id, 'fromDate', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.25rem' }}>
                    To Date
                  </label>
                  <input
                    type="date"
                    value={job.toDate}
                    onChange={(e) => updateJobExperience(job.id, 'toDate', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.25rem' }}>
                  Job Description
                </label>
                <textarea
                  value={job.description}
                  onChange={(e) => updateJobExperience(job.id, 'description', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    minHeight: '80px',
                    resize: 'vertical'
                  }}
                  placeholder="Describe your responsibilities and achievements in this role..."
                />
              </div>
              
              <button
                onClick={() => removeJobExperience(job.id)}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Remove Experience
              </button>
            </div>
          ))}
        </section>

        {/* Current Occupation Section */}
        <section style={{ 
          background: 'white', 
          borderRadius: '20px', 
          padding: '2rem', 
          marginBottom: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            Current Occupation Status
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.75rem' }}>
              Your Current Employment Status *
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {OCCUPATION_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={() => setCurrentOccupation(option.value)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    border: '2px solid',
                    borderColor: currentOccupation === option.value ? '#2563eb' : '#d1d5db',
                    background: currentOccupation === option.value ? '#2563eb' : 'white',
                    color: currentOccupation === option.value ? 'white' : '#374151',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          
          {(currentOccupation === 'employed' || currentOccupation === 'open_to_changes') && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                  Current Employer
                </label>
                <input
                  type="text"
                  value={currentEmployer}
                  onChange={(e) => setCurrentEmployer(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.875rem'
                  }}
                  placeholder="Enter current employer name"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                  Current Position
                </label>
                <input
                  type="text"
                  value={currentPosition}
                  onChange={(e) => setCurrentPosition(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.875rem'
                  }}
                  placeholder="Enter current position"
                />
              </div>
            </div>
          )}
        </section>

        {/* Pilot Interests Section */}
        <section style={{ 
          background: 'white', 
          borderRadius: '20px', 
          padding: '2rem', 
          marginBottom: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            Pilot Interests
          </h2>
          
          {/* Aviation Pathways Interests - Multiple Choice */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.75rem' }}>
              Interests in Aviation Pathways (Select all that apply)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {AVIATION_PATHWAYS_OPTIONS.map(pathway => (
                <button
                  key={pathway}
                  onClick={() => toggleAviationPathway(pathway)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '9999px',
                    border: '1px solid',
                    borderColor: aviationPathwaysInterests.includes(pathway) ? '#2563eb' : '#d1d5db',
                    background: aviationPathwaysInterests.includes(pathway) ? '#2563eb' : 'white',
                    color: aviationPathwaysInterests.includes(pathway) ? 'white' : '#374151',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    fontWeight: 500,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {pathway}
                </button>
              ))}
            </div>
          </div>

          {/* Pilot Job Positions Interests - Multiple Choice */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.75rem' }}>
              Interests in Pilot Job Positions (Select all that apply)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {PILOT_JOB_POSITIONS_OPTIONS.map(position => (
                <button
                  key={position}
                  onClick={() => togglePilotJobPosition(position)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '9999px',
                    border: '1px solid',
                    borderColor: pilotJobPositionsInterests.includes(position) ? '#2563eb' : '#d1d5db',
                    background: pilotJobPositionsInterests.includes(position) ? '#2563eb' : 'white',
                    color: pilotJobPositionsInterests.includes(position) ? 'white' : '#374151',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    fontWeight: 500,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {position}
                </button>
              ))}
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                Countries Visited (General Average)
              </label>
              <input
                type="number"
                value={countriesVisited}
                onChange={(e) => setCountriesVisited(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem'
                }}
                placeholder="Number of countries visited"
                min="0"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                Favorite Aircraft Type
              </label>
              <select
                value={favoriteAircraft}
                onChange={(e) => setFavoriteAircraft(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  background: 'white'
                }}
              >
                <option value="">Select favorite aircraft</option>
                {COMMON_AIRCRAFT.map(aircraft => (
                  <option key={aircraft} value={aircraft}>{aircraft}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
              Why Did You Become a Pilot / Hold a Pilot License?
            </label>
            <textarea
              value={whyBecomePilot}
              onChange={(e) => setWhyBecomePilot(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.875rem',
                minHeight: '120px',
                resize: 'vertical'
              }}
              placeholder="Share your story and motivation for becoming a pilot..."
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
              Other Skills & Experiences (e.g., Cooking, IT, Languages, etc.)
            </label>
            <textarea
              value={otherSkills}
              onChange={(e) => setOtherSkills(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.875rem',
                minHeight: '100px',
                resize: 'vertical'
              }}
              placeholder="List any additional skills, hobbies, or experiences you have outside of aviation..."
            />
          </div>
        </section>

        {/* Industry Visibility Notice */}
        <section style={{ 
          background: 'white', 
          borderRadius: '20px', 
          padding: '2rem', 
          marginBottom: '2rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Industry Visibility Notice
          </h3>
          <p style={{ color: '#0f172a', lineHeight: 1.6, marginBottom: '1rem' }}>
            <strong>This information is visible to aviation industry manufacturers and airlines.</strong>
          </p>
          <p style={{ color: '#64748b', lineHeight: 1.6 }}>
            Leading aviation companies including Boeing, Airbus, Emirates, Etihad Airways, and other major airlines regularly review pilot profiles on our platform. 
            Your current state, qualifications, experience, and employment status will be visible to recruiters and hiring managers who are looking for qualified pilots. 
            Keep your information up-to-date to maximize your opportunities in the aviation industry.
          </p>
        </section>

        {/* Save Button */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem', marginBottom: '2rem' }}>
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              padding: '1rem 3rem',
              background: isSaving ? '#93c5fd' : '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.125rem',
              fontWeight: 700,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
              transition: 'all 0.2s ease'
            }}
          >
            {isSaving ? 'Saving...' : 'Save All Information'}
          </button>
        </div>
      </main>
      )}
    </div>
  );
};

export default PilotLicensureExperiencePage;
