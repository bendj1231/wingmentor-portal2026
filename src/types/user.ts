export interface UserRole {
  type: 'super_admin' | 'mentor_manager' | 'mentor' | 'mentee';
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface AppAccess {
  appId: string;
  appName: string;
  granted: boolean;
  grantedBy?: string;
  grantedAt?: Date;
  restricted?: boolean;
}

import type { UserTrack } from '../config/accessControl';

export interface UserProfile {
  id: string;
  uid?: string; // Firebase UID for backward compatibility
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  role: UserRole['type'];
  totalHours?: number;
  region?: string;
  flightSchool?: string;
  enrolledPrograms: string[];
  appAccess: AppAccess[];
  createdAt: Date;
  lastLogin?: Date;
  status: 'active' | 'suspended' | 'pending' | 'terminated' | 'restricted' | 'transitioning';
  isNewUser?: boolean;
  track?: UserTrack; // User's current access track
  managedBy?: string; // ID of mentor manager who manages this user
  moduleProgress?: Record<string, number>; // module id -> completion %
  performanceScore?: number; // 0-100
  notifications?: { type: string; message: string; date: string; read: boolean }[];
}

export const PERMISSIONS = {
  // User Management
  VIEW_ALL_USERS: 'view_all_users',
  SEARCH_USERS: 'search_users',
  MODIFY_USER_ROLE: 'modify_user_role',
  SUSPEND_USER: 'suspend_user',
  
  // App Access Control
  GRANT_APP_ACCESS: 'grant_app_access',
  RESTRICT_APP_ACCESS: 'restrict_app_access',
  VIEW_APP_ACCESS_LOGS: 'view_app_access_logs',
  
  // System Management
  VIEW_SYSTEM_STATS: 'view_system_stats',
  MANAGE_MENTORS: 'manage_mentors',
  SUPER_ADMIN: 'super_admin'
} as const;

export const ROLE_PERMISSIONS: Record<UserRole['type'], Permission['id'][]> = {
  super_admin: Object.values(PERMISSIONS),
  mentor_manager: [
    PERMISSIONS.VIEW_ALL_USERS,
    PERMISSIONS.SEARCH_USERS,
    PERMISSIONS.MODIFY_USER_ROLE,
    PERMISSIONS.GRANT_APP_ACCESS,
    PERMISSIONS.RESTRICT_APP_ACCESS,
    PERMISSIONS.VIEW_APP_ACCESS_LOGS,
    PERMISSIONS.VIEW_SYSTEM_STATS,
    PERMISSIONS.MANAGE_MENTORS
  ],
  mentor: [
    PERMISSIONS.SEARCH_USERS,
    PERMISSIONS.VIEW_SYSTEM_STATS
  ],
  mentee: []
};

export const AVAILABLE_APPS = [
  { id: 'foundational', name: 'Foundational Program', required: true, category: 'programs' },
  { id: 'transition', name: 'Transition Program', required: false, category: 'programs' },
  { id: 'atpl_pathway', name: 'ATPL Pathway', required: false, category: 'pathways' },
  { id: 'airtaxi_pathway', name: 'Air Taxi Pathway', required: false, category: 'pathways' },
  { id: 'private_sector', name: 'Private Sector Pathway', required: false, category: 'pathways' },
  { id: 'w1000', name: 'W1000 Simulator', required: false, category: 'applications' },
  { id: 'mentorship', name: 'Mentorship Supervision', required: false, category: 'applications' },
  { id: 'pilot_gap', name: 'Pilot Gap Module', required: false, category: 'applications' },
  { id: 'mentorship_protocols', name: 'Mentorship Protocols', required: false, category: 'applications' },
  { id: 'peer_advocacy', name: 'Peer Advocacy', required: false, category: 'applications' },
  { id: 'pilot_recognition', name: 'Pilot Recognition System', required: false, category: 'systems' },
  { id: 'atlas_cv', name: 'ATLAS CV System', required: false, category: 'systems' }
] as const;

export const APP_CATEGORIES = {
  programs: { name: 'Programs', description: 'Core training programs' },
  pathways: { name: 'Pathways', description: 'Career progression pathways' },
  applications: { name: 'Applications', description: 'Specialized applications and tools' },
  systems: { name: 'Systems', description: 'Platform systems and services' }
} as const;
