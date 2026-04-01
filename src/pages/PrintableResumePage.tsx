import React, { useRef } from 'react';
import { usePilotData, type PilotExperience, type PilotLicense, type PilotEducation, type PilotAchievement } from '../hooks/usePilotData';
import './atlas-cv.css';

// ─── Types ───────────────────────────────────────────────────────────────────

interface PrintableResumePageProps {
  onBack: () => void;
  userProfile?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    uid?: string;
  } | null;
}

interface ExperienceDisplay {
  id: number;
  jobTitle: string;
  company: string;
  dates: string;
  bullets: string[];
}

interface EducationDisplay {
  id: number;
  degree: string;
  institution: string;
  year: string;
}

// ─── UI Hint Helper ──────────────────────────────────────────────────────────

const CERTIFICATION_HINT = 'Tip: Include the full name of certifications followed by the acronym in parentheses (e.g., Airline Transport Pilot License (ATPL)) for better ATS visibility.';

// ─── ATLAS Logic: License Formatting ─────────────────────────────────────────

function formatLicense(licenseName: string): string {
  const licenseMap: Record<string, string> = {
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
    'GCAA': 'General Civil Aviation Authority (GCAA)',
    'EASA': 'European Union Aviation Safety Agency (EASA)',
    'FAA': 'Federal Aviation Administration (FAA)',
    'ICAO': 'International Civil Aviation Organization (ICAO)',
    'SOP': 'Standard Operating Procedures (SOP)',
    'ATC': 'Air Traffic Control (ATC)',
    'IFR': 'Instrument Flight Rules (IFR)',
    'VFR': 'Visual Flight Rules (VFR)',
    'SMS': 'Safety Management System (SMS)',
    'CFI': 'Certified Flight Instructor (CFI)',
    'AWD': 'Automated Workflow Diagnostics (AWD)',
  };
  
  // Check if the license name is just an acronym
  if (licenseMap[licenseName]) {
    return licenseMap[licenseName];
  }
  
  // Otherwise, expand any acronyms within the text
  let result = licenseName;
  for (const [acronym, expanded] of Object.entries(licenseMap)) {
    const regex = new RegExp(`\\b${acronym}\\b`, 'g');
    result = result.replace(regex, expanded);
  }
  return result;
}

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
  'GCAA': 'General Civil Aviation Authority (GCAA)',
  'EASA': 'European Union Aviation Safety Agency (EASA)',
  'FAA': 'Federal Aviation Administration (FAA)',
  'ICAO': 'International Civil Aviation Organization (ICAO)',
  'SOP': 'Standard Operating Procedures (SOP)',
  'ATC': 'Air Traffic Control (ATC)',
  'IFR': 'Instrument Flight Rules (IFR)',
  'VFR': 'Visual Flight Rules (VFR)',
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

const PASSIVE_REPLACEMENTS: { pattern: RegExp; replacement: string }[] = [
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
  { pattern: /^I handled /i, replacement: 'Oversaw ' },
  { pattern: /^Handled /i, replacement: 'Oversaw ' },
];

function filterActionVerbs(bullet: string): string {
  let result = bullet.trim();
  for (const { pattern, replacement } of PASSIVE_REPLACEMENTS) {
    if (pattern.test(result)) {
      result = result.replace(pattern, replacement);
      break;
    }
  }
  return result;
}

// ─── Default / Fallback Data ─────────────────────────────────────────────────

const ORG_SYNONYMS: Record<string, string> = {
  'WingMentor': 'Wingman Network',
  'WingMentor Academy': 'Wingman Network Academy',
  'WingMentor Foundational Program': 'Wingman Network Foundational Program',
};

function normalizeOrg(input: string): string {
  if (!input) return input;
  const normalized = Object.keys(ORG_SYNONYMS).reduce((current, key) => {
    const regex = new RegExp(key, 'gi');
    return current.replace(regex, ORG_SYNONYMS[key]);
  }, input);
  return normalized;
}

function normalizeDate(input: string): string {
  return input.replace(/—/g, '-').replace(/–/g, '-');
}

function normalizeSummary(text: string): string {
  return normalizeOrg(text);
}

function ensureCRMFullTerm(items: string[]): string[] {
  const normalized = items.map(item => normalizeOrg(item));
  const crmIndex = normalized.findIndex((item) => /Crew Resource Management/i.test(item));
  if (crmIndex !== -1) {
    normalized[crmIndex] = 'Crew Resource Management (CRM)';
  }
  return normalized;
}

// ─── Default Constants ──────────────────────────────────────────────────────

const DEFAULT_SUMMARY =
  'Dedicated and safety-conscious aviation professional currently enrolled in the Wingman Network Foundational Program. Proven track record in Crew Resource Management and Evidence-Based Training methodologies. Committed to achieving the Airline Transport Pilot License and contributing to airline operational excellence through competency-based assessment frameworks.';

const DEFAULT_COMPETENCIES = [
  'Aviation Training & EBT',
  'Crew Resource Management',
  'Standard Operating Procedures',
  'Flight Safety & Risk Assessment',
  'Evidence-Based Training',
  'Competency-Based Training and Assessment',
  'Situational Awareness',
  'Decision Making',
  'Teamwork & Communication',
];

const DEFAULT_LICENSES = [
  'Airline Transport Pilot License (ATPL) (Frozen)',
  'UAE GCAA (General Civil Aviation Authority) License',
  'Class 1 Medical Certificate (Valid)',
];

const DEFAULT_ACHIEVEMENTS = [
  'WingMentor Foundational Program – Verified',
  'Airbus Evidence-Based Training Certified',
  'Emirates ATPL Readiness Program – Enrolled',
];

// ─── Data Resolvers (PilotProfile → display format) ─────────────────────────

function resolveLicenses(raw?: string[] | PilotLicense[]): string[] {
  if (!raw || raw.length === 0) return DEFAULT_LICENSES;
  return raw.map((lic) => {
    if (typeof lic === 'string') return formatLicense(lic);
    return formatLicense(lic.type || lic.name || lic.licenseName || 'License');
  });
}

function resolveExperience(raw?: PilotExperience[]): ExperienceDisplay[] {
  if (!raw || raw.length === 0) {
    return [{
      id: 1,
      jobTitle: 'Student Pilot – Foundational Program',
      company: 'Wingman Network',
      dates: 'Jan 2024 - Present',
      bullets: [
        'Spearheaded completion of structured Evidence-Based Training modules covering advanced CRM techniques.',
        'Managed pre-flight risk assessments under mentor supervision.',
        'Participated in Line-Oriented Flight Training scenarios on Airbus A320 simulators.',
        'Demonstrated competency in Standard Operating Procedures and threat-and-error management.',
      ],
    }];
  }
  return raw.map((e, i) => ({
    id: i + 1,
    jobTitle: e.role || e.jobTitle || '',
    company: normalizeOrg(e.company || ''),
    dates: normalizeDate(e.dates || `${e.startDate || ''} - ${e.endDate || 'Present'}`),
    bullets: e.achievements || e.bullets || [],
  }));
}

function resolveEducation(raw?: PilotEducation[]): EducationDisplay[] {
  if (!raw || raw.length === 0) {
    return [{ id: 1, degree: 'Foundational Mentorship Program', institution: 'WingMentor Academy', year: '2024' }];
  }
  return raw.map((e, i) => ({
    id: i + 1,
    degree: e.degree || e.qualification || '',
    institution: normalizeOrg(e.institution || ''),
    year: e.year || '',
  }));
}

function resolveAchievements(raw: PilotAchievement[]): string[] {
  if (!raw || raw.length === 0) return DEFAULT_ACHIEVEMENTS;
  const items = raw
    .map((a) => {
      const title = a.title || a.name || '';
      const status = a.type || a.category || '';
      return status ? `${title} – ${status}` : title;
    })
    .filter(Boolean);
  return items.length > 0 ? items : DEFAULT_ACHIEVEMENTS;
}


const PrintableResumePage: React.FC<PrintableResumePageProps> = ({ onBack, userProfile }) => {
  const printRef = useRef<HTMLDivElement>(null);
  const { pilotData, achievements, loading } = usePilotData(userProfile?.uid);

  if (loading || !pilotData) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', fontFamily: 'Arial, sans-serif', color: '#6b7280' }}>
        Loading ATS Profile...
      </div>
    );
  }

  // ── Derive display values from real-time pilotData ──────────────────────
  const pi = pilotData.personalInfo;
  const fullName = pi
    ? `${pi.firstName || ''} ${pi.lastName || ''}`.trim()
    : `${userProfile?.firstName || 'Benjamin'} ${userProfile?.lastName || 'Bowler'}`;
  const email = pi?.email || userProfile?.email || 'contact@wingmentor.app';
  const phone = pi?.phone || pilotData.phone || '+44 7000 000000';
  const loc = pi?.location || pilotData.location ||
    ((pi?.city || pilotData.city)
      ? `${pi?.city || pilotData.city || ''}, ${pi?.country || pilotData.country || ''}`.replace(/,\s*$/, '')
      : 'London, United Kingdom');
  const linkedin = pi?.linkedin || pilotData.linkedin || pilotData.linkedIn || 'linkedin.com/in/bbowler';

  const summary = expandAcronyms(normalizeSummary(
    pilotData.summary || pilotData.bio || DEFAULT_SUMMARY,
  ));

  const competencies = ensureCRMFullTerm(
    (pilotData.coreCompetencies || pilotData.skills || DEFAULT_COMPETENCIES).map((c: string) => normalizeOrg(c)),
  );

  const stats = pilotData.stats || { totalHours: 1540, picHours: 620, ifrHours: 210, nightHours: 95 };
  const simulators = stats.simulators || ['Airbus A320', 'Boeing 737 MAX'];
  const mentorship = pilotData.mentorship || { hours: 22, observations: 10, cases: 4 };

  const licenses = resolveLicenses(pilotData.licenses);
  const experience = resolveExperience(pilotData.experience);
  const education = resolveEducation(pilotData.education);
  const highlightedAchievements = resolveAchievements(achievements);

  return (
    <div className="cv-page-container">
      {/* Toolbar — hidden on print */}
      <div className="atlas-cv-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '850px', margin: '0 auto 20px' }}>
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

      {/* ═══ ATS CV Document ═══ */}
      <div ref={printRef} id="atlas-cv-document" className="cv-paper">

        {/* ── Header ── */}
        <header className="cv-header">
          <h1 className="cv-name">{fullName.toUpperCase()}</h1>
          <p className="cv-contact">
            {loc} | {phone} | {email}
            {linkedin && ` | ${linkedin}`}
          </p>
        </header>

        {/* ── 1. Licenses & Ratings (High Visibility – Above Summary) ── */}
        <section className="cv-section">
          <h2 className="cv-section-title">Licenses & Ratings</h2>
          <ul className="cv-block-list">
            {licenses.map((lic, i) => <li key={i}>{lic}</li>)}
          </ul>
        </section>

        {/* ── 2. Professional Summary ── */}
        <section className="cv-section">
          <h2 className="cv-section-title">Professional Summary</h2>
          <p className="cv-text">{summary}</p>
        </section>

        {/* ── 3. Core Competencies ── */}
        <section className="cv-section">
          <h2 className="cv-section-title">Core Competencies</h2>
          <p className="cv-text">
            {competencies.map((c: string) => expandAcronyms(c)).join(' • ')}
          </p>
        </section>

        {/* ── 4. Flight Experience Breakdown (No Tables – Block Layout) ── */}
        <section className="cv-section">
          <h2 className="cv-section-title">Flight Experience Breakdown</h2>
          <p className="cv-data-item"><strong>Total Flight Time:</strong> {stats.totalHours.toLocaleString()} hr</p>
          <p className="cv-data-item"><strong>Pilot-in-Command (PIC):</strong> {stats.picHours.toLocaleString()} hr</p>
          <p className="cv-data-item"><strong>IFR / IMC:</strong> {stats.ifrHours.toLocaleString()} hr</p>
          <p className="cv-data-item"><strong>Night Operations:</strong> {stats.nightHours.toLocaleString()} hr</p>
          <p className="cv-data-item"><strong>Simulators:</strong> {simulators.join(' | ')}</p>
        </section>

        {/* ── 5. Professional Experience ── */}
        <section className="cv-section">
          <h2 className="cv-section-title">Professional Experience</h2>
          {experience.map((job) => (
            <div key={job.id} style={{ marginBottom: '12px' }}>
              <div className="cv-job-header">
                <span>{expandAcronyms(job.jobTitle)} | {job.company}</span>
                <span>{job.dates}</span>
              </div>
              <ul className="cv-bullets">
                {job.bullets.map((bullet, idx) => (
                  <li key={idx}>{expandAcronyms(filterActionVerbs(bullet))}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* ── 6. Mentorship & Leadership ── */}
        <section className="cv-section">
          <h2 className="cv-section-title">Mentorship & Leadership</h2>
          <div className="cv-job-header">
            <span>Wingman Network Recognition Portfolio</span>
            <span>2024 - Present</span>
          </div>
          <ul className="cv-bullets">
            <li><strong>WingMentor Hours:</strong> {mentorship.hours} hr of dedicated peer mentorship and leadership training.</li>
            <li><strong>Peer Observation:</strong> Completed {mentorship.observations} hours of structured consultation on {mentorship.cases} cases involving complex flight decision-making.</li>
          </ul>
        </section>

        {/* ── 7. Education ── */}
        <section className="cv-section">
          <h2 className="cv-section-title">Education</h2>
          {education.map((edu) => (
            <p key={edu.id} className="cv-text">
              <strong>{expandAcronyms(formatLicense(edu.degree))}</strong> — {edu.institution} ({edu.year})
            </p>
          ))}
        </section>

        {/* ── 8. Highlighted Achievements ── */}
        <section className="cv-section">
          <h2 className="cv-section-title">Highlighted Achievements</h2>
          <ul className="cv-block-list">
            {highlightedAchievements.map((ach, i) => <li key={i}>{ach}</li>)}
          </ul>
        </section>

        {/* ATS Tip — visible on screen, hidden when printing */}
        <p className="ats-tip">
          {CERTIFICATION_HINT}
        </p>
      </div>
    </div>
  );
};

export default PrintableResumePage;
