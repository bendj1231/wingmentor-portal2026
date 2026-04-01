import React from 'react';
import { CloudBackground } from '../components/CloudBackground';
import type { UserProfile } from '../types/user';
import { Icons } from '../icons';

interface UnrestrictedConfirmationPageProps {
  userProfile: UserProfile;
  onContinue: () => void;
  onNavigateTo: (pageId: string) => void;
}

const nextSteps = [
  {
    title: 'Continue Core Training',
    description:
      'Jump back into the Foundational Program modules or explore the pathways that align with your mentorship plan.'
  },
  {
    title: 'Review Mentor Notes',
    description:
      'Your mentor’s latest observations and milestones are available in Mentor Management. Use them to plan the next session.'
  },
  {
    title: 'Visit the Recognition Hub',
    description:
      'Capture new badges and upload evidence so partner airlines can track your latest achievements in real time.'
  }
];

export const UnrestrictedConfirmationPage: React.FC<UnrestrictedConfirmationPageProps> = ({
  userProfile,
  onContinue,
  onNavigateTo
}) => {
  const displayName =
    (userProfile.displayName && userProfile.displayName.trim()) ||
    [userProfile.firstName, userProfile.lastName].filter(Boolean).join(' ').trim() ||
    userProfile.email ||
    'Pilot';

  return (
    <CloudBackground>
      <div className="restricted-confirmation">
        <div className="restricted-card" style={{ maxWidth: 860 }}>
          <div className="restricted-header">
            <div className="restricted-pill unrestricted">ACCESS RESTORED</div>
            <h1>Welcome back, {displayName}.</h1>
            <p>
              Mentor Management has confirmed that your access has been fully restored. You can now resume your core
              training flow, track recognition milestones, or skip directly to the pathways that matter most.
            </p>
          </div>

          <div className="restricted-content-grid" style={{ marginBottom: '2rem' }}>
            {nextSteps.map((step) => (
              <div key={step.title} className="restricted-step unrestricted">
                <div className="step-icon">
                  <Icons.Activity style={{ width: 20, height: 20 }} />
                </div>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="restricted-actions">
            <button className="btn-secondary" onClick={() => onNavigateTo('mentor-management')}>
              Open Mentor Management
            </button>
            <button className="btn-primary" onClick={onContinue}>
              Continue to Programs
            </button>
          </div>
        </div>
      </div>
    </CloudBackground>
  );
};

export default UnrestrictedConfirmationPage;
