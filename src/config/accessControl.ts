// Access Control Configuration
// This file defines user tracks and page access control

import type { UserProfile } from '../types/user';

export type UserTrack = 'full_access' | 'restricted_access' | 'transition_track' | 'onboarding_track';

export interface TrackConfig {
  trackId: UserTrack;
  trackName: string;
  description: string;
  allowedPages: string[];
  blockedPages: string[];
  redirectPage: string;
  canAccessPrograms: boolean;
  canAccessMentorManagement: boolean;
  canAccessProfile: boolean;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    bannerMessage: string;
  };
}

export interface PageAccessRule {
  pageId: string;
  pageName: string;
  requiredTracks: UserTrack[];
  fallbackPage: string;
  requiresAuth: boolean;
}

export const TRACK_CONFIGS: Record<UserTrack, TrackConfig> = {
  full_access: {
    trackId: 'full_access',
    trackName: 'Full Access Track',
    description: 'Complete access to all programs and features',
    allowedPages: [
      'dashboard', 'programs', 'foundational', 'transition', 'pathways',
      'atpl_pathway', 'airtaxi_pathway', 'private_sector',
      'pilot-profile', 'mentor-management', 'contact', 'logbook',
      'examination-results', 'atlas-resume', 'digital-logbook'
    ],
    blockedPages: [],
    redirectPage: 'dashboard',
    canAccessPrograms: true,
    canAccessMentorManagement: true,
    canAccessProfile: true,
    theme: {
      primaryColor: '#2563eb',
      secondaryColor: '#1e40af',
      bannerMessage: 'Welcome to WingMentor - Full Access'
    }
  },
  
  restricted_access: {
    trackId: 'restricted_access',
    trackName: 'Restricted Access Track',
    description: 'Limited access to specific pages and resources',
    allowedPages: [
      'dashboard', 'restricted-confirmation', 'restricted-hub', 'appeal-center', 'contact-support',
      'restricted-profile', 'learning-resources', 'community-forum'
    ],
    blockedPages: [
      'programs', 'foundational', 'transition', 'pathways',
      'atpl_pathway', 'airtaxi_pathway', 'private_sector',
      'mentor-management', 'logbook', 'examination-results'
    ],
    redirectPage: 'restricted-confirmation', // First show confirmation page
    canAccessPrograms: false,
    canAccessMentorManagement: false,
    canAccessProfile: false,
    theme: {
      primaryColor: '#dc2626',
      secondaryColor: '#991b1b',
      bannerMessage: 'Access Restricted - Limited Track Active'
    }
  },
  
  transition_track: {
    trackId: 'transition_track',
    trackName: 'Transition Track',
    description: 'Users in transition between access levels',
    allowedPages: [
      'dashboard', 'unrestricted-confirmation', 'transition-hub',
      'profile', 'contact', 'learning-progress'
    ],
    blockedPages: [
      'programs', 'mentor-management', 'logbook', 'examination-results'
    ],
    redirectPage: 'unrestricted-confirmation',
    canAccessPrograms: false,
    canAccessMentorManagement: false,
    canAccessProfile: true,
    theme: {
      primaryColor: '#f59e0b',
      secondaryColor: '#d97706',
      bannerMessage: 'Access Status Changing - Transition Track'
    }
  },
  
  onboarding_track: {
    trackId: 'onboarding_track',
    trackName: 'Onboarding Track',
    description: 'New users going through onboarding process',
    allowedPages: [
      'dashboard', 'onboarding', 'welcome', 'profile-setup',
      'intro-programs', 'getting-started'
    ],
    blockedPages: [
      'mentor-management', 'logbook', 'examination-results',
      'atpl_pathway', 'airtaxi_pathway', 'private_sector'
    ],
    redirectPage: 'onboarding',
    canAccessPrograms: false,
    canAccessMentorManagement: false,
    canAccessProfile: true,
    theme: {
      primaryColor: '#10b981',
      secondaryColor: '#059669',
      bannerMessage: 'Welcome to WingMentor - Getting Started'
    }
  }
};

export const PAGE_ACCESS_RULES: PageAccessRule[] = [
  {
    pageId: 'dashboard',
    pageName: 'Dashboard',
    requiredTracks: ['full_access', 'restricted_access', 'transition_track', 'onboarding_track'],
    fallbackPage: 'dashboard',
    requiresAuth: true
  },
  {
    pageId: 'programs',
    pageName: 'Programs',
    requiredTracks: ['full_access'],
    fallbackPage: 'restricted-hub',
    requiresAuth: true
  },
  {
    pageId: 'foundational',
    pageName: 'Foundational Program',
    requiredTracks: ['full_access'],
    fallbackPage: 'restricted-hub',
    requiresAuth: true
  },
  {
    pageId: 'transition',
    pageName: 'Transition Program',
    requiredTracks: ['full_access'],
    fallbackPage: 'restricted-hub',
    requiresAuth: true
  },
  {
    pageId: 'restricted-confirmation',
    pageName: 'Restricted Confirmation',
    requiredTracks: ['restricted_access'],
    fallbackPage: 'dashboard',
    requiresAuth: true
  },
  {
    pageId: 'restricted-hub',
    pageName: 'Restricted Hub',
    requiredTracks: ['restricted_access'],
    fallbackPage: 'dashboard',
    requiresAuth: true
  },
  {
    pageId: 'unrestricted-confirmation',
    pageName: 'Unrestricted Confirmation',
    requiredTracks: ['transition_track'],
    fallbackPage: 'dashboard',
    requiresAuth: true
  },
  {
    pageId: 'mentor-management',
    pageName: 'Mentor Management',
    requiredTracks: ['full_access'],
    fallbackPage: 'restricted-hub',
    requiresAuth: true
  }
];

// Helper functions
export const getUserTrack = (userProfile: UserProfile): UserTrack => {
  // Check if user has an explicit track assigned
  if (userProfile.track) {
    return userProfile.track;
  }
  
  // Determine track based on status and access
  if (userProfile.status === 'restricted') {
    return 'restricted_access';
  }
  
  if (userProfile.status === 'transitioning') {
    return 'transition_track';
  }
  
  if (userProfile.isNewUser) {
    return 'onboarding_track';
  }
  
  return 'full_access';
};

export const getTrackConfig = (track: UserTrack): TrackConfig => {
  return TRACK_CONFIGS[track];
};

export const canAccessPage = (userProfile: UserProfile, pageId: string): boolean => {
  const userTrack = getUserTrack(userProfile);
  const trackConfig = getTrackConfig(userTrack);
  const pageRule = PAGE_ACCESS_RULES.find(rule => rule.pageId === pageId);
  
  if (!pageRule) {
    // If no specific rule, check if page is in allowed list
    return trackConfig.allowedPages.includes(pageId);
  }
  
  return pageRule.requiredTracks.includes(userTrack);
};

export const getRedirectPage = (userProfile: UserProfile, attemptedPage: string): string => {
  const userTrack = getUserTrack(userProfile);
  const trackConfig = getTrackConfig(userTrack);
  const pageRule = PAGE_ACCESS_RULES.find(rule => rule.pageId === attemptedPage);
  
  if (pageRule && !pageRule.requiredTracks.includes(userTrack)) {
    return pageRule.fallbackPage;
  }
  
  if (!trackConfig.allowedPages.includes(attemptedPage)) {
    return trackConfig.redirectPage;
  }
  
  return attemptedPage;
};

export const updateUserTrack = async (userId: string, newTrack: UserTrack, reason?: string): Promise<void> => {
  // This would be implemented with Firebase
  console.log(`🔄 Updating user ${userId} to track: ${newTrack}`, { reason });
  
  // Firebase implementation would go here
  // const userRef = doc(db, 'users', userId);
  // await updateDoc(userRef, { 
  //   track: newTrack,
  //   trackUpdatedAt: new Date(),
  //   trackChangeReason: reason
  // });
};

export const getTrackTransitionConfig = (fromTrack: UserTrack, toTrack: UserTrack) => {
  const transitions: Partial<Record<`${UserTrack}->${UserTrack}`, {
    transitionPage: string;
    message: string;
    autoRedirectDelay: number;
  }>> = {
    'full_access->restricted_access': {
      transitionPage: 'restricted-confirmation',
      message: 'Your access has been restricted. You are now on the Limited Access Track.',
      autoRedirectDelay: 3000
    },
    'restricted_access->transition_track': {
      transitionPage: 'unrestricted-confirmation',
      message: 'Your access is being restored! You are now on the Transition Track.',
      autoRedirectDelay: 2000
    },
    'transition_track->full_access': {
      transitionPage: 'welcome-back',
      message: 'Welcome back! Your full access has been restored.',
      autoRedirectDelay: 2000
    }
  };
  
  return transitions[`${fromTrack}->${toTrack}`] || {
    transitionPage: 'dashboard',
    message: 'Your access level has been updated.',
    autoRedirectDelay: 2000
  };
};
