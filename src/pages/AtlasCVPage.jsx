import React from 'react';
import './atlas-cv.css';

const AtlasCVPage = ({ user }) => {
  return (
    <div className="cv-page-container">
      <div className="cv-paper">

        {/* ── Header ── */}
        <header className="cv-header">
          <h1 className="cv-name">BENJAMIN BOWLER</h1>
          <p className="cv-contact">
            London, United Kingdom | +44 7000 000000 | benjamintigerbowler@gmail.com | linkedin.com/in/bbowler
          </p>
        </header>

        {/* ── 1. Licenses & Ratings (High Visibility – Above Summary) ── */}
        <section className="cv-section">
          <h2 className="cv-section-title">Licenses & Ratings</h2>
          <ul className="cv-block-list">
            <li>Airline Transport Pilot License (ATPL) (Frozen)</li>
            <li>UAE GCAA (General Civil Aviation Authority) License</li>
            <li>Class 1 Medical Certificate (Valid)</li>
          </ul>
        </section>

        {/* ── 2. Professional Summary ── */}
        <section className="cv-section">
          <h2 className="cv-section-title">Professional Summary</h2>
          <p className="cv-text">
            Dedicated aviation professional currently enrolled in the Wingman Network Foundational Program.
            Proven track record in Crew Resource Management (CRM) and Evidence-Based Training (EBT) methodologies.
            Committed to achieving the Airline Transport Pilot License and contributing to airline operational
            excellence through competency-based assessment frameworks.
          </p>
        </section>

        {/* ── 3. Core Competencies ── */}
        <section className="cv-section">
          <h2 className="cv-section-title">Core Competencies</h2>
          <p className="cv-text">
            Aviation Training & Evidence-Based Training (EBT) • Crew Resource Management (CRM) •
            Standard Operating Procedures (SOPs) • Flight Safety & Risk Assessment •
            Evidence-Based Training • Competency-Based Training and Assessment •
            Situational Awareness • Decision Making • Teamwork & Communication
          </p>
        </section>

        {/* ── 4. Flight Experience Breakdown (No Tables – Block Layout) ── */}
        <section className="cv-section">
          <h2 className="cv-section-title">Flight Experience Breakdown</h2>
          <p className="cv-data-item"><strong>Total Flight Time:</strong> 1,540 hr</p>
          <p className="cv-data-item"><strong>Pilot-in-Command (PIC):</strong> 620 hr</p>
          <p className="cv-data-item"><strong>IFR / IMC:</strong> 210 hr</p>
          <p className="cv-data-item"><strong>Night Operations:</strong> 95 hr</p>
          <p className="cv-data-item"><strong>Simulators:</strong> Airbus A320 | Boeing 737 MAX</p>
        </section>

        {/* ── 5. Professional Experience ── */}
        <section className="cv-section">
          <h2 className="cv-section-title">Professional Experience</h2>
          <div className="cv-job-header">
            <span>Student Pilot – Foundational Program | Wingman Network</span>
            <span>Jan 2024 - Present</span>
          </div>
          <ul className="cv-bullets">
            <li>Spearheaded completion of structured Evidence-Based Training (EBT) modules covering advanced Crew Resource Management (CRM) techniques.</li>
            <li>Managed pre-flight risk assessments and threat-and-error management (TEM) protocols under mentor supervision.</li>
            <li>Contributed to Line-Oriented Flight Training (LOFT) scenarios on Airbus A320 simulators.</li>
            <li>Demonstrated competency in Standard Operating Procedures (SOPs) and non-normal procedures.</li>
          </ul>
        </section>

        {/* ── 6. Mentorship & Leadership ── */}
        <section className="cv-section">
          <h2 className="cv-section-title">Mentorship & Leadership</h2>
          <div className="cv-job-header">
            <span>Wingman Network Recognition Portfolio</span>
            <span>2024 - Present</span>
          </div>
          <ul className="cv-bullets">
            <li><strong>WingMentor Hours:</strong> 22 hr of dedicated peer mentorship and leadership training.</li>
            <li><strong>Peer Observation:</strong> Completed 10 hours of structured consultation on 4 cases involving complex flight decision-making.</li>
          </ul>
        </section>

        {/* ── 7. Education ── */}
        <section className="cv-section">
          <h2 className="cv-section-title">Education</h2>
          <p className="cv-text"><strong>Foundational Mentorship Program</strong> — WingMentor Academy (2024)</p>
        </section>

        {/* ── 8. Highlighted Achievements ── */}
        <section className="cv-section">
          <h2 className="cv-section-title">Highlighted Achievements</h2>
          <ul className="cv-block-list">
            <li>WingMentor Foundational Program – Verified</li>
            <li>Airbus Evidence-Based Training Certified</li>
            <li>Emirates ATPL Readiness Program – Enrolled</li>
          </ul>
        </section>

        {/* ATS Tip — visible on screen, hidden when printing */}
        <p className="ats-tip">
          *Tip: Include full names of certifications followed by the acronym in parentheses for better ATS visibility.*
        </p>
      </div>
    </div>
  );
};

export default AtlasCVPage;
