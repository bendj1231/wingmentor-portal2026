import React, { useState } from 'react';
import { Icons } from '../icons';

const jobApplicationListings = [
  {
    title: 'Captain - A320 family',
    company: 'Etihad',
    aircraft: 'A320 family',
    location: 'United Arab Emirates (UAE) | Abu Dhabi',
    role: 'Captain',
    url: 'https://pilotsglobal.com/job/A320-family-captain-etihad-AE-81Oyt9ulnn',
    posted: '2025-03-19',
    status: 'Hiring Now!',
    applicationUrl: '',
    flightTime: '5500',
    license: 'ATP / ATPL',
    visaSponsorship: 'Yes',
    picTime: '2500',
    picInTypeTime: '1500',
    typeRating: 'Required',
    medicalClass: 'Class 1',
    icaoElpLevel: '4',
    compensation: 'Up to AED 637,304 (USD 171,589) per year'
  },
  {
    title: 'Captain - B777',
    company: 'Etihad',
    aircraft: 'B777',
    location: 'United Arab Emirates (UAE) | Abu Dhabi',
    role: 'Captain',
    url: 'https://pilotsglobal.com/job/B777-captain-etihad-AE-81Oyt9ulnn',
    posted: '2025-03-19',
    status: 'Hiring Now!',
    applicationUrl: '',
    flightTime: '7000',
    license: 'ATP / ATPL',
    visaSponsorship: 'Yes',
    picTime: '3000',
    picInTypeTime: '1000',
    typeRating: 'Required',
    medicalClass: 'Class 1',
    icaoElpLevel: '4',
    compensation: 'Up to AED 840,000 (USD 228,000) per year'
  },
  {
    title: 'Direct Entry Captain A320 in London',
    company: 'Scandinavian Airlines',
    aircraft: 'Airbus 320',
    location: 'United Kingdom',
    role: 'Captain',
    url: 'https://www.latestpilotjobs.com/jobs/view/id/18168.html',
    posted: '2025-03-18',
    status: 'Hiring Now!',
    applicationUrl: '',
    flightTime: '5000',
    license: 'ATP / ATPL',
    visaSponsorship: 'Yes',
    picTime: '2000',
    picInTypeTime: '500',
    typeRating: 'Required',
    medicalClass: 'Class 1',
    icaoElpLevel: '4',
    compensation: 'Competitive salary package'
  },
  {
    title: 'B757/B767 to B777 Captains',
    company: 'Root Aviation',
    aircraft: 'Boeing 757, Boeing 767, Boeing 777',
    location: 'Asia',
    role: 'Captain',
    url: 'https://www.latestpilotjobs.com/jobs/view/id/19692.html',
    posted: '2025-03-19',
    status: 'Hiring Now!',
    applicationUrl: '',
    flightTime: '6000',
    license: 'ATP / ATPL',
    visaSponsorship: 'Yes',
    picTime: '3000',
    picInTypeTime: '1000',
    typeRating: 'Required',
    medicalClass: 'Class 1',
    icaoElpLevel: '4',
    compensation: 'Expat package with benefits'
  },
  {
    title: 'B747 to B777 PIC',
    company: 'Root Aviation',
    aircraft: 'Boeing 747 - 400, Boeing 777',
    location: 'Asia',
    role: 'Captain',
    url: 'https://www.latestpilotjobs.com/jobs/view/id/19691.html',
    posted: '2025-03-19',
    status: 'Hiring Now!',
    applicationUrl: '',
    flightTime: '8000',
    license: 'ATP / ATPL',
    visaSponsorship: 'Yes',
    picTime: '4000',
    picInTypeTime: '1500',
    typeRating: 'Required',
    medicalClass: 'Class 1',
    icaoElpLevel: '4',
    compensation: 'Top-tier expat compensation'
  },
  {
    title: 'A320 Captains (EASA/ICAO)',
    company: 'WingJet Aviation',
    aircraft: 'Airbus 320',
    location: 'Europe',
    role: 'Captain',
    url: 'https://www.latestpilotjobs.com/jobs/view/id/19674.html',
    posted: '2025-03-18',
    status: 'Hiring Now!',
    applicationUrl: '',
    flightTime: '4500',
    license: 'ATP / ATPL',
    visaSponsorship: 'Yes',
    picTime: '2000',
    picInTypeTime: '500',
    typeRating: 'Required',
    medicalClass: 'Class 1',
    icaoElpLevel: '4',
    compensation: 'Improved salary and benefits'
  },
  {
    title: 'BA Cityflyer Direct Entry Captain',
    company: 'BA Cityflyer',
    aircraft: 'All Pilot',
    location: 'United Kingdom',
    role: 'Captain',
    url: 'https://www.latestpilotjobs.com/jobs/view/id/17697.html',
    posted: '2025-03-18',
    status: 'Hiring Now!',
    applicationUrl: '',
    flightTime: '4000',
    license: 'ATP / ATPL',
    visaSponsorship: 'Yes',
    picTime: '1500',
    picInTypeTime: '500',
    typeRating: 'Required',
    medicalClass: 'Class 1',
    icaoElpLevel: '4',
    compensation: 'British Airways package'
  },
  {
    title: 'Captain / Commander A320 - 100%',
    company: 'Chair Airlines',
    aircraft: 'Airbus 320',
    location: 'Switzerland',
    role: 'Captain',
    url: 'https://www.latestpilotjobs.com/jobs/view/id/17483.html',
    posted: '2025-03-18',
    status: 'Hiring Now!',
    applicationUrl: '',
    flightTime: '5000',
    license: 'ATP / ATPL',
    visaSponsorship: 'Yes',
    picTime: '2500',
    picInTypeTime: '1000',
    typeRating: 'Required',
    medicalClass: 'Class 1',
    icaoElpLevel: '4',
    compensation: 'Swiss airline compensation'
  },
  {
    title: 'Wizz Air UK is looking for First Officers and Captains',
    company: 'Wizz Air UK',
    aircraft: 'All Pilot',
    location: 'United Kingdom',
    role: 'Captain, First Officer',
    url: 'https://www.latestpilotjobs.com/jobs/view/id/19685.html',
    posted: '2025-03-17',
    status: 'Hiring Now!',
    applicationUrl: '',
    flightTime: '4000',
    license: 'ATP / ATPL',
    visaSponsorship: 'Yes',
    picTime: '2000',
    picInTypeTime: '500',
    typeRating: 'Required',
    medicalClass: 'Class 1',
    icaoElpLevel: '4',
    compensation: 'Competitive European package'
  },
  {
    title: 'Skyflyers Aviation is Hiring A320 Captains (EASA /ICAO Holders)!',
    company: 'SKYFLYERS AVIATION',
    aircraft: 'Airbus 320',
    location: 'Europe',
    role: 'Captain',
    url: 'https://www.latestpilotjobs.com/jobs/view/id/19673.html',
    posted: '2025-03-17',
    status: 'Hiring Now!',
    applicationUrl: '',
    flightTime: '4500',
    license: 'ATP / ATPL',
    visaSponsorship: 'Yes',
    picTime: '2000',
    picInTypeTime: '500',
    typeRating: 'Required',
    medicalClass: 'Class 1',
    icaoElpLevel: '4',
    compensation: 'European captain salary'
  },
  {
    title: 'Captain (m/f/d)',
    company: 'SkyAlps',
    aircraft: 'All Pilot',
    location: 'Italy',
    role: 'Captain',
    url: 'https://www.latestpilotjobs.com/jobs/view/id/18908.html',
    posted: '2025-03-19',
    status: 'Hiring Now!',
    applicationUrl: '',
    flightTime: '4000',
    license: 'ATP / ATPL',
    visaSponsorship: 'Yes',
    picTime: '2000',
    picInTypeTime: '500',
    typeRating: 'Required',
    medicalClass: 'Class 1',
    icaoElpLevel: '4',
    compensation: 'Italian airline package'
  },
  {
    title: 'B777 PIC with China Southern',
    company: 'Root Aviation',
    aircraft: 'Boeing 777',
    location: 'Asia',
    role: 'Captain',
    url: 'https://www.latestpilotjobs.com/jobs/view/id/19697.html',
    posted: '2025-03-18',
    status: 'Hiring Now!',
    applicationUrl: '',
    flightTime: '7000',
    license: 'ATP / ATPL',
    visaSponsorship: 'Yes',
    picTime: '3500',
    picInTypeTime: '1000',
    typeRating: 'Required',
    medicalClass: 'Class 1',
    icaoElpLevel: '4',
    compensation: 'China Southern expat package'
  },
  {
    title: 'Upgrade to B777 PIC',
    company: 'Root Aviation',
    aircraft: 'Boeing 777',
    location: 'Asia',
    role: 'Captain',
    url: 'https://www.latestpilotjobs.com/jobs/view/id/19690.html',
    posted: '2025-03-19',
    status: 'Hiring Now!',
    applicationUrl: '',
    flightTime: '6500',
    license: 'ATP / ATPL',
    visaSponsorship: 'Yes',
    picTime: '3000',
    picInTypeTime: '1000',
    typeRating: 'Required',
    medicalClass: 'Class 1',
    icaoElpLevel: '4',
    compensation: 'Upgrade opportunity with premium pay'
  }
];

const AirlinesHighTimersPage: React.FC = () => {
  const [selectedAircraft, setSelectedAircraft] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');

  const aircraftTypes = Array.from(new Set(jobApplicationListings.map(job => job.aircraft)));
  const locations = Array.from(new Set(jobApplicationListings.map(job => job.location)));
  const roles = Array.from(new Set(jobApplicationListings.map(job => job.role)));

  const filteredJobs = jobApplicationListings.filter(job => {
    const aircraftMatch = selectedAircraft === 'all' || job.aircraft === selectedAircraft;
    const locationMatch = selectedLocation === 'all' || job.location.includes(selectedLocation);
    const roleMatch = selectedRole === 'all' || job.role === selectedRole;
    return aircraftMatch && locationMatch && roleMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hiring Now!':
        return '#10b981';
      case 'Accepting Apps':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Captain':
        return '#3b82f6';
      case 'First Officer':
        return '#8b5cf6';
      case 'Captain, First Officer':
        return '#06b6d4';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="dashboard-container animate-fade-in" style={{ alignItems: 'flex-start', justifyContent: 'center', padding: '3rem 1rem 2rem' }}>
      <main className="dashboard-card" style={{ width: '100%', maxWidth: '1400px' }}>
        <header className="dashboard-header" style={{ borderBottom: '1px solid rgba(226, 232, 240, 0.7)', paddingBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Icons.ArrowRight className="icon" style={{ fontSize: '2rem', color: '#3b82f6' }} />
            <h1 style={{ fontSize: '2rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>
              Airlines - High Timers
            </h1>
          </div>
          <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Premium airline captain positions for experienced pilots with 4,000+ total flight hours. 
            Major airlines, wide-body aircraft, and competitive expat packages.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
                Aircraft Type
              </label>
              <select
                value={selectedAircraft}
                onChange={(e) => setSelectedAircraft(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', backgroundColor: 'white' }}
              >
                <option value="all">All Aircraft</option>
                {aircraftTypes.map(aircraft => (
                  <option key={aircraft} value={aircraft}>{aircraft}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
                Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', backgroundColor: 'white' }}
              >
                <option value="all">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
                Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', backgroundColor: 'white' }}
              >
                <option value="all">All Roles</option>
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>
        </header>

        <div style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#1e293b' }}>
              High Timer Captain Positions ({filteredJobs.length} available)
            </h2>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
                Min. 4,000+ hours required
              </span>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
              <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Hiring Now</span>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Position</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Airline</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Aircraft</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Location</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Requirements</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Compensation</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#374151' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job, index) => (
                  <tr 
                    key={index} 
                    style={{ 
                      borderBottom: '1px solid #e2e8f0', 
                      backgroundColor: index % 2 === 0 ? 'white' : '#f8fafc',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f1f5f9';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'white' : '#f8fafc';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <td style={{ padding: '1rem' }}>
                      <div>
                        <a 
                          href={job.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ 
                            color: '#3b82f6', 
                            textDecoration: 'none', 
                            fontWeight: 500
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                          onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                        >
                          {job.title}
                        </a>
                        <div style={{ marginTop: '0.5rem' }}>
                          <span 
                            style={{ 
                              backgroundColor: getRoleColor(job.role), 
                              color: 'white', 
                              padding: '0.25rem 0.75rem', 
                              borderRadius: '1rem', 
                              fontSize: '0.75rem', 
                              fontWeight: 500 
                            }}
                          >
                            {job.role}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 500, color: '#1e293b' }}>
                      {job.company}
                    </td>
                    <td style={{ padding: '1rem', color: '#475569' }}>
                      {job.aircraft}
                    </td>
                    <td style={{ padding: '1rem', color: '#475569' }}>
                      {job.location}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                        <div><strong>Total:</strong> {job.flightTime}+ hours</div>
                        <div><strong>PIC:</strong> {job.picTime}+ hours</div>
                        <div><strong>License:</strong> {job.license}</div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: '#059669', fontWeight: 500 }}>
                      {job.compensation}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span 
                        style={{ 
                          backgroundColor: getStatusColor(job.status), 
                          color: 'white', 
                          padding: '0.5rem 1rem', 
                          borderRadius: '1rem', 
                          fontSize: '0.8rem', 
                          fontWeight: 600 
                        }}
                      >
                        {job.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredJobs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              <Icons.ArrowRight style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }} />
              <p style={{ fontSize: '1.1rem' }}>No high timer positions match your current filters.</p>
              <p style={{ fontSize: '0.9rem' }}>Try adjusting your filter criteria to see more opportunities.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AirlinesHighTimersPage;
