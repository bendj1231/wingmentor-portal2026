import React, { useEffect, useState, useRef } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { supabase } from '../lib/supabase-auth';

// ─── Types ───────────────────────────────────────────────────────────────────

interface AtlasCVGeneratorProps {
  onBack: () => void;
  userProfile?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    uid?: string;
  } | null;
}

interface ExperienceEntry {
  id: number;
  jobTitle: string;
  company: string;
  location: string;
  dates: string;
  bullets: string[];
}

interface EducationEntry {
  id: number;
  degree: string;
  institution: string;
  year: string;
}

interface UserData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
  };
  summary: string;
  coreCompetencies: string[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
}

// ─── ATLAS Logic: Acronym Expansion ──────────────────────────────────────────

const ACRONYM_MAP: Record<string, string> = {
  'ATPL': 'Airline Transport Pilot License (ATPL)',
  'CPL': 'Commercial Pilot License (CPL)',
  'PPL': 'Private Pilot License (PPL)',
  'IR': 'Instrument Rating (IR)',
  'ME': 'Multi-Engine Rating (ME)',
  'MCC': 'Multi-Crew Cooperation (MCC)',
  'CRM': 'Crew Resource Management (CRM)',
  'EBT': 'Evidence-Based Training (EBT)',
  'CBTA': 'Competency-Based Training and Assessment (CBTA)',
  'PIC': 'Pilot-in-Command (PIC)',
  'SIC': 'Second-in-Command (SIC)',
  'FO': 'First Officer (FO)',
  'TRI': 'Type Rating Instructor (TRI)',
  'TRE': 'Type Rating Examiner (TRE)',
  'SFI': 'Synthetic Flight Instructor (SFI)',
  'LOFT': 'Line-Oriented Flight Training (LOFT)',
  'LOE': 'Line Operational Evaluation (LOE)',
  'OPC': 'Operator Proficiency Check (OPC)',
  'LPC': 'License Proficiency Check (LPC)',
  'PQA': 'Pilot Quality Assurance (PQA)',
  'GCAA': 'General Civil Aviation Authority (GCAA)',
  'EASA': 'European Union Aviation Safety Agency (EASA)',
  'FAA': 'Federal Aviation Administration (FAA)',
  'ICAO': 'International Civil Aviation Organization (ICAO)',
  'SOP': 'Standard Operating Procedures (SOP)',
  'QRH': 'Quick Reference Handbook (QRH)',
  'MEL': 'Minimum Equipment List (MEL)',
  'NOTAM': 'Notice to Airmen (NOTAM)',
  'ATC': 'Air Traffic Control (ATC)',
  'IFR': 'Instrument Flight Rules (IFR)',
  'VFR': 'Visual Flight Rules (VFR)',
  'FCTM': 'Flight Crew Training Manual (FCTM)',
  'FCOM': 'Flight Crew Operations Manual (FCOM)',
  'SMS': 'Safety Management System (SMS)',
  'CFI': 'Certified Flight Instructor (CFI)',
  'AWD': 'Automated Workflow Diagnostics (AWD)',
};

function expandAcronyms(text: string): string {
  let result = text;
  for (const [acronym, expanded] of Object.entries(ACRONYM_MAP)) {
    const regex = new RegExp(`\\b${acronym}\\b`, 'g');
    result = result.replace(regex, expanded);
  }
  return result;
}

// ─── ATLAS Logic: Action Verb Filter ─────────────────────────────────────────

const PASSIVE_PATTERNS: { pattern: RegExp; replacement: string }[] = [
  { pattern: /^I was responsible for /i, replacement: 'Managed ' },
  { pattern: /^Responsible for /i, replacement: 'Managed ' },
  { pattern: /^I helped /i, replacement: 'Supported ' },
  { pattern: /^Helped /i, replacement: 'Supported ' },
  { pattern: /^I assisted /i, replacement: 'Facilitated ' },
  { pattern: /^Assisted in /i, replacement: 'Facilitated ' },
  { pattern: /^Assisted with /i, replacement: 'Facilitated ' },
  { pattern: /^I worked on /i, replacement: 'Developed ' },
  { pattern: /^Worked on /i, replacement: 'Developed ' },
  { pattern: /^I was involved in /i, replacement: 'Spearheaded ' },
  { pattern: /^Involved in /i, replacement: 'Spearheaded ' },
  { pattern: /^I participated in /i, replacement: 'Contributed to ' },
  { pattern: /^Participated in /i, replacement: 'Contributed to ' },
  { pattern: /^I did /i, replacement: 'Executed ' },
  { pattern: /^Did /i, replacement: 'Executed ' },
  { pattern: /^I handled /i, replacement: 'Oversaw ' },
  { pattern: /^Handled /i, replacement: 'Oversaw ' },
  { pattern: /^I took care of /i, replacement: 'Administered ' },
  { pattern: /^Took care of /i, replacement: 'Administered ' },
  { pattern: /^I made /i, replacement: 'Produced ' },
  { pattern: /^Made /i, replacement: 'Produced ' },
];

function filterActionVerbs(bullet: string): string {
  let result = bullet.trim();
  for (const { pattern, replacement } of PASSIVE_PATTERNS) {
    if (pattern.test(result)) {
      result = result.replace(pattern, replacement);
      break;
    }
  }
  return result;
}

// ─── Default / Fallback Data ─────────────────────────────────────────────────

const DEFAULT_DATA: UserData = {
  personalInfo: {
    name: 'Benjamin Bowler',
    email: 'contact@wingmentor.app',
    phone: '+44 7000 000000',
    location: 'London, United Kingdom',
    linkedin: 'linkedin.com/in/bbowler',
  },
  summary:
    'Dedicated and safety-conscious aviation professional currently enrolled in the WingMentor Foundational Program. Proven track record in Crew Resource Management and Evidence-Based Training methodologies. Committed to achieving the Airline Transport Pilot License and contributing to airline operational excellence through competency-based assessment frameworks.',
  coreCompetencies: [
    'Aviation Training & EBT',
    'Crew Resource Management',
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
      id: 1,
      jobTitle: 'Student Pilot – Foundational Program',
      company: 'WingMentor',
      location: 'Remote',
      dates: 'Jan 2024 – Present',
      bullets: [
        'Spearheaded completion of structured Evidence-Based Training modules covering advanced CRM techniques.',
        'I was responsible for conducting pre-flight risk assessments under mentor supervision.',
        'Participated in Line-Oriented Flight Training scenarios on Airbus A320 simulators.',
        'Demonstrated competency in Standard Operating Procedures and threat-and-error management.',
      ],
    },
  ],
  education: [
    {
      id: 1,
      degree: 'Foundational Mentorship Program',
      institution: 'WingMentor Academy',
      year: '2024',
    },
  ],
};

// ─── Inline Styles (ATS: single-column, Arial, black-on-white) ──────────────

const S = {
  page: {
    fontFamily: "'Arial', 'Helvetica', sans-serif",
    fontSize: '11pt',
    lineHeight: 1.55,
    color: '#000',
    background: '#fff',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2.5rem 2.5rem',
  } as React.CSSProperties,

  header: {
    textAlign: 'center' as const,
    marginBottom: '1.5rem',
    borderBottom: '2px solid #000',
    paddingBottom: '1rem',
  } as React.CSSProperties,

  name: {
    margin: 0,
    fontSize: '20pt',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    color: '#000',
  } as React.CSSProperties,

  contactRow: {
    margin: '0.5rem 0 0',
    fontSize: '10pt',
    color: '#000',
    display: 'flex',
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
    gap: '0.35rem',
  } as React.CSSProperties,

  sectionTitle: {
    fontSize: '12pt',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.06em',
    borderBottom: '1px solid #9ca3af',
    paddingBottom: '0.2rem',
    marginTop: '1.25rem',
    marginBottom: '0.5rem',
    color: '#000',
  } as React.CSSProperties,

  bodyText: {
    margin: 0,
    fontSize: '10pt',
    lineHeight: 1.6,
  } as React.CSSProperties,

  experienceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 700,
    fontSize: '10pt',
    margin: 0,
  } as React.CSSProperties,

  bulletList: {
    margin: '0.35rem 0 0',
    paddingLeft: '1.25rem',
    listStyleType: 'disc' as const,
  } as React.CSSProperties,

  bulletItem: {
    margin: '0.15rem 0',
    paddingLeft: '0.15rem',
    fontSize: '10pt',
    lineHeight: 1.5,
  } as React.CSSProperties,

  eduRow: {
    fontSize: '10pt',
    margin: '0.2rem 0',
  } as React.CSSProperties,
};

// ─── Component ───────────────────────────────────────────────────────────────

const AtlasCVGenerator: React.FC<AtlasCVGeneratorProps> = ({ onBack, userProfile }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCVData = async () => {
      // Start from defaults, then overlay Firebase data
      const base: UserData = {
        ...DEFAULT_DATA,
        personalInfo: {
          ...DEFAULT_DATA.personalInfo,
          name: `${userProfile?.firstName || 'Benjamin'} ${userProfile?.lastName || 'Bowler'}`,
          email: userProfile?.email || DEFAULT_DATA.personalInfo.email,
        },
      };

      if (!userProfile?.uid || !db) {
        setUserData(base);
        return;
      }

      try {
        // Fetch pilot profiles from Supabase
        const { data: profileData, error: profileError } = await supabase
          .from('pilot_profiles')
          .select('*')
          .eq('user_id', userProfile.uid)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }

        if (profileData) {
          const p = profileData;

          if (p.phone) base.personalInfo.phone = p.phone;
          if (p.location) base.personalInfo.location = p.location;
          if (p.linkedin) base.personalInfo.linkedin = p.linkedin;
          if (p.summary) base.summary = p.summary;

          if (Array.isArray(p.coreCompetencies) && p.coreCompetencies.length > 0) {
            base.coreCompetencies = p.coreCompetencies;
          } else if (Array.isArray(p.skills) && p.skills.length > 0) {
            base.coreCompetencies = p.skills;
          }

          if (Array.isArray(p.experience) && p.experience.length > 0) {
            base.experience = p.experience.map((e: Record<string, unknown>, i: number) => ({
              id: i + 1,
              jobTitle: (e.jobTitle as string) || '',
              company: (e.company as string) || '',
              location: (e.location as string) || '',
              dates: (e.dates as string) || `${e.startDate || ''} – ${e.endDate || ''}`,
              bullets: Array.isArray(e.bullets) ? (e.bullets as string[]) : [],
            }));
          }

          if (Array.isArray(p.education) && p.education.length > 0) {
            base.education = p.education.map((e: Record<string, unknown>, i: number) => ({
              id: i + 1,
              degree: (e.degree as string) || (e.qualification as string) || '',
              institution: (e.institution as string) || '',
              year: (e.year as string) || '',
            }));
          }
        }

        // Fetch achievements for certifications → append to education
        const { data: achievementData, error: achievementError } = await supabase
          .from('achievements')
          .select('*')
          .eq('user_id', userProfile.uid)
          .eq('category', 'Certification');

        if (achievementError && achievementError.code !== 'PGRST116') {
          throw achievementError;
        }

        const certEntries: EducationEntry[] = [];
        (achievementData || []).forEach((achievement) => {
          certEntries.push({
            id: base.education.length + certEntries.length + 1,
            degree: achievement.title || 'Certification',
            institution: achievement.issuing_organization || 'WingMentor',
            year: new Date(achievement.achievement_date).getFullYear().toString(),
          });
        });
        if (certEntries.length > 0) {
          base.education = [...base.education, ...certEntries];
        }
      } catch (err) {
        console.error('AtlasCVGenerator: Firebase fetch failed', err);
      }

      setUserData(base);
    };

    fetchCVData();
  }, [userProfile?.uid]);

  // ── Loading state ─────────────────────────────────────────────────────────

  if (!userData) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', fontFamily: 'Arial, sans-serif', color: '#6b7280' }}>
        Loading ATS Profile...
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="dashboard-container animate-fade-in" style={{ background: '#f0f4fb' }}>
      <main style={{ position: 'relative', maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>

        {/* ── Toolbar (hidden on print) ─────────────────────── */}
        <div className="atlas-cv-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.5rem 1rem', border: 'none', background: 'white',
              borderRadius: '10px', cursor: 'pointer', fontSize: '0.875rem',
              color: '#475569', fontWeight: 500,
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            }}
          >
            ← Back to Atlas Resume
          </button>
          <button
            onClick={() => window.print()}
            style={{
              padding: '0.65rem 1.5rem', borderRadius: '10px', border: 'none',
              background: '#0ea5e9', color: '#fff', fontWeight: 600,
              cursor: 'pointer', fontSize: '0.875rem',
              boxShadow: '0 2px 8px rgba(14,165,233,0.3)',
            }}
          >
            Print / Save as PDF
          </button>
        </div>

        {/* ── CV Document ───────────────────────────────────── */}
        <div
          ref={printRef}
          id="atlas-cv-document"
          style={{ ...S.page, boxShadow: '0 4px 30px rgba(0,0,0,0.08)', borderRadius: '4px' }}
        >

          {/* 1. Contact Information */}
          <header style={S.header}>
            <h1 style={S.name}>{userData.personalInfo.name}</h1>
            <div style={S.contactRow}>
              <span>{userData.personalInfo.location}</span>
              <span>|</span>
              <span>{userData.personalInfo.phone}</span>
              <span>|</span>
              <span>{userData.personalInfo.email}</span>
              {userData.personalInfo.linkedin && (
                <>
                  <span>|</span>
                  <span>{userData.personalInfo.linkedin}</span>
                </>
              )}
            </div>
          </header>

          {/* 2. Professional Summary */}
          <section>
            <h2 style={S.sectionTitle}>Professional Summary</h2>
            <p style={{ ...S.bodyText, textAlign: 'justify' }}>
              {expandAcronyms(userData.summary)}
            </p>
          </section>

          {/* 3. Core Competencies (Keyword Density) */}
          <section>
            <h2 style={S.sectionTitle}>Core Competencies</h2>
            <p style={S.bodyText}>
              {userData.coreCompetencies.map(c => expandAcronyms(c)).join(' \u2022 ')}
            </p>
          </section>

          {/* 4. Professional Experience */}
          <section>
            <h2 style={S.sectionTitle}>Work Experience</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {userData.experience.map((job) => (
                <div key={job.id}>
                  <div style={S.experienceHeader}>
                    <span>{expandAcronyms(job.jobTitle)} | {job.company}</span>
                    <span>{job.dates}</span>
                  </div>
                  <ul style={S.bulletList}>
                    {job.bullets.map((bullet, idx) => (
                      <li key={idx} style={S.bulletItem}>
                        {expandAcronyms(filterActionVerbs(bullet))}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Education & Licenses */}
          <section>
            <h2 style={S.sectionTitle}>Education & Certifications</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {userData.education.map((edu) => (
                <div key={edu.id} style={S.eduRow}>
                  <strong>{expandAcronyms(edu.degree)}</strong> — {edu.institution} ({edu.year})
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      {/* Print-only styles */}
      <style>{`
        @media print {
          body, html { margin: 0; padding: 0; background: #fff !important; }
          .dashboard-container { background: #fff !important; padding: 0 !important; }
          .atlas-cv-toolbar { display: none !important; }
          #atlas-cv-document {
            box-shadow: none !important;
            border-radius: 0 !important;
            max-width: 100% !important;
            padding: 0.75in !important;
            margin: 0 !important;
          }
          @page { margin: 0.5in; }
        }
      `}</style>
    </div>
  );
};

export default AtlasCVGenerator;
