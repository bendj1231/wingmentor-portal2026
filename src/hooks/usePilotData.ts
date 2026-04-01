import { useState, useEffect } from 'react';
import { doc, onSnapshot, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

// ─── Firestore Document Shape ────────────────────────────────────────────────

export interface PilotStats {
  totalHours: number;
  picHours: number;
  ifrHours: number;
  nightHours: number;
  simulators?: string[];
}

export interface PilotMentorship {
  hours: number;
  observations: number;
  cases: number;
}

export interface PilotPersonalInfo {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  city?: string;
  country?: string;
}

export interface PilotExperience {
  role?: string;
  jobTitle?: string;
  company?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  dates?: string;
  achievements?: string[];
  bullets?: string[];
}

export interface PilotEducation {
  degree?: string;
  qualification?: string;
  institution?: string;
  year?: string;
}

export interface PilotLicense {
  type?: string;
  name?: string;
  licenseName?: string;
  issuer?: string;
  institution?: string;
  year?: string;
  date?: string;
  issued?: string;
}

export interface PilotAchievement {
  title?: string;
  name?: string;
  type?: string;
  category?: string;
  issuer?: string;
  year?: string;
  date?: string;
}

export interface PilotProfile {
  personalInfo?: PilotPersonalInfo;
  stats?: PilotStats;
  mentorship?: PilotMentorship;
  licenses?: string[] | PilotLicense[];
  summary?: string;
  bio?: string;
  coreCompetencies?: string[];
  skills?: string[];
  experience?: PilotExperience[];
  education?: PilotEducation[];
  achievements?: PilotAchievement[];
  // Legacy flat fields (from 'users' collection)
  phone?: string;
  location?: string;
  city?: string;
  country?: string;
  linkedin?: string;
  linkedIn?: string;
  totalHours?: number;
}

// ─── Hook Return Type ────────────────────────────────────────────────────────

export interface UsePilotDataReturn {
  pilotData: PilotProfile | null;
  achievements: PilotAchievement[];
  loading: boolean;
  error: string | null;
}

// ─── Default Fallback Data ───────────────────────────────────────────────────

const DEFAULT_PILOT: PilotProfile = {
  personalInfo: {
    firstName: 'Benjamin',
    lastName: 'Bowler',
    email: 'contact@wingmentor.app',
    phone: '+44 7000 000000',
    location: 'London, United Kingdom',
    linkedin: 'linkedin.com/in/bbowler',
  },
  stats: {
    totalHours: 0,
    picHours: 0,
    ifrHours: 0,
    nightHours: 0,
    simulators: [],
  },
  mentorship: {
    hours: 22,
    observations: 10,
    cases: 4,
  },
  licenses: ['ATPL (Frozen)', 'UAE GCAA', 'Class 1 Medical'],
  summary:
    'Dedicated and safety-conscious aviation professional currently enrolled in the Wingman Network Foundational Program. Proven track record in Crew Resource Management and Evidence-Based Training methodologies. Committed to achieving the Airline Transport Pilot License and contributing to airline operational excellence through competency-based assessment frameworks.',
  coreCompetencies: [
    'Aviation Training & EBT',
    'Crew Resource Management (CRM)',
    'Standard Operating Procedures',
    'Flight Safety & Risk Assessment',
    'Evidence-Based Training',
    'Competency-Based Training and Assessment',
    'Situational Awareness',
    'Decision Making',
    'Teamwork & Communication',
  ],
  experience: [
    {
      role: 'Student Pilot – Foundational Program',
      company: 'Wingman Network',
      startDate: 'Jan 2024',
      endDate: 'Present',
      achievements: [
        'Spearheaded completion of structured Evidence-Based Training modules covering advanced CRM techniques.',
        'Managed pre-flight risk assessments under mentor supervision.',
        'Participated in Line-Oriented Flight Training scenarios on Airbus A320 simulators.',
        'Demonstrated competency in Standard Operating Procedures and threat-and-error management.',
      ],
    },
  ],
  education: [
    {
      degree: 'Foundational Mentorship Program',
      institution: 'WingMentor Academy',
      year: '2024',
    },
  ],
};

// ─── The Hook ────────────────────────────────────────────────────────────────

export const usePilotData = (uid?: string): UsePilotDataReturn => {
  const [pilotData, setPilotData] = useState<PilotProfile | null>(null);
  const [achievements, setAchievements] = useState<PilotAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Resolve the UID: prefer the prop, then fall back to auth.currentUser
  const resolvedUid = uid || (auth?.currentUser as any)?.uid;

  useEffect(() => {
    // No UID — use defaults
    if (!resolvedUid) {
      setPilotData(DEFAULT_PILOT);
      setLoading(false);
      return;
    }

    // No Firestore connection (dev mode) — use defaults with UID context
    if (!db) {
      console.warn('usePilotData: Firestore unavailable, using default pilot data.');
      setPilotData(DEFAULT_PILOT);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // ── Real-time listener on pilotProfiles/{uid} ──
    const profileRef = doc(db, 'pilotProfiles', resolvedUid);

    const unsubProfile = onSnapshot(
      profileRef,
      (snap) => {
        if (snap.exists()) {
          setPilotData(snap.data() as PilotProfile);
        } else {
          // Fallback: try the 'users' collection
          const userRef = doc(db, 'users', resolvedUid);
          onSnapshot(
            userRef,
            (userSnap) => {
              if (userSnap.exists()) {
                setPilotData(userSnap.data() as PilotProfile);
              } else {
                // Neither collection has data — use defaults
                setPilotData(DEFAULT_PILOT);
              }
              setLoading(false);
            },
            (err) => {
              console.error('usePilotData: users listener error', err);
              setError(err.message);
              setPilotData(DEFAULT_PILOT);
              setLoading(false);
            },
          );
          return; // loading will be set by inner listener
        }
        setLoading(false);
      },
      (err) => {
        console.error('usePilotData: pilotProfiles listener error', err);
        setError(err.message);
        setPilotData(DEFAULT_PILOT);
        setLoading(false);
      },
    );

    // ── One-time fetch for achievements ──
    const fetchAchievements = async () => {
      try {
        const achQuery = query(
          collection(db, 'achievements'),
          where('userId', '==', resolvedUid),
        );
        const achSnap = await getDocs(achQuery);
        const items: PilotAchievement[] = [];
        achSnap.forEach((d) => {
          items.push(d.data() as PilotAchievement);
        });
        setAchievements(items);
      } catch (err: any) {
        console.warn('usePilotData: achievements fetch failed', err);
      }
    };
    fetchAchievements();

    return () => unsubProfile();
  }, [resolvedUid]);

  return { pilotData, achievements, loading, error };
};
