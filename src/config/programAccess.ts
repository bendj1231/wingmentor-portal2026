// Program Access Configuration
// This file defines the relationship between app access restrictions and user status changes

import type { UserProfile } from '../types/user';

export interface ProgramAccessRule {
  appId: string;
  appName: string;
  affectsUserStatus: boolean;
  restrictedStatus: UserProfile['status'];
  grantedStatus?: UserProfile['status'];
  requiredForAccess: boolean;
  category: string;
}

export interface GrantConfig {
  appId: string;
  appName: string;
  requiresEnquiryCleanup: boolean;
  deletePreviousEnquiries: boolean;
  keepLatestEnquiry: boolean;
  statusChangeCondition: 'always' | 'if_restricted' | 'never';
  targetStatus: UserProfile['status'];
  successMessage: string;
}

export interface RestrictConfig {
  appId: string;
  appName: string;
  affectsUserStatus: boolean;
  statusChangeCondition: 'always' | 'if_active' | 'never';
  targetStatus: UserProfile['status'];
  requiresEnquiryCreation: boolean;
  autoGenerateEnquiry: boolean;
  enquiryUrgency: 'low' | 'medium' | 'high' | 'urgent';
  successMessage: string;
  logAction: boolean;
}

export const PROGRAM_ACCESS_RULES: ProgramAccessRule[] = [
  {
    appId: 'foundational',
    appName: 'Foundational Program',
    affectsUserStatus: true,
    restrictedStatus: 'restricted',
    grantedStatus: 'active',
    requiredForAccess: true,
    category: 'core_programs'
  },
  {
    appId: 'transition',
    appName: 'Transition Program',
    affectsUserStatus: true, // Now affects user status too
    restrictedStatus: 'restricted',
    grantedStatus: 'active',
    requiredForAccess: false,
    category: 'core_programs'
  },
  {
    appId: 'atpl_pathway',
    appName: 'ATPL Pathway',
    affectsUserStatus: false,
    restrictedStatus: 'active',
    requiredForAccess: false,
    category: 'pathways'
  },
  {
    appId: 'airtaxi_pathway',
    appName: 'Air Taxi Pathway',
    affectsUserStatus: false,
    restrictedStatus: 'active',
    requiredForAccess: false,
    category: 'pathways'
  },
  {
    appId: 'private_sector',
    appName: 'Private Sector Pathway',
    affectsUserStatus: false,
    restrictedStatus: 'active',
    requiredForAccess: false,
    category: 'pathways'
  }
];

export const GRANT_CONFIG: GrantConfig[] = [
  {
    appId: 'foundational',
    appName: 'Foundational Program',
    requiresEnquiryCleanup: true,
    deletePreviousEnquiries: true,
    keepLatestEnquiry: true,
    statusChangeCondition: 'if_restricted',
    targetStatus: 'active',
    successMessage: 'Access to Foundational Program has been restored. User status updated to active.'
  },
  {
    appId: 'transition',
    appName: 'Transition Program',
    requiresEnquiryCleanup: true,
    deletePreviousEnquiries: true,
    keepLatestEnquiry: true,
    statusChangeCondition: 'if_restricted',
    targetStatus: 'active',
    successMessage: 'Access to Transition Program has been restored. User status updated to active.'
  },
  {
    appId: 'atpl_pathway',
    appName: 'ATPL Pathway',
    requiresEnquiryCleanup: false,
    deletePreviousEnquiries: false,
    keepLatestEnquiry: false,
    statusChangeCondition: 'never',
    targetStatus: 'active',
    successMessage: 'Access to ATPL Pathway has been restored.'
  },
  {
    appId: 'airtaxi_pathway',
    appName: 'Air Taxi Pathway',
    requiresEnquiryCleanup: false,
    deletePreviousEnquiries: false,
    keepLatestEnquiry: false,
    statusChangeCondition: 'never',
    targetStatus: 'active',
    successMessage: 'Access to Air Taxi Pathway has been restored.'
  },
  {
    appId: 'private_sector',
    appName: 'Private Sector Pathway',
    requiresEnquiryCleanup: false,
    deletePreviousEnquiries: false,
    keepLatestEnquiry: false,
    statusChangeCondition: 'never',
    targetStatus: 'active',
    successMessage: 'Access to Private Sector Pathway has been restored.'
  }
];

export const RESTRICT_CONFIG: RestrictConfig[] = [
  {
    appId: 'foundational',
    appName: 'Foundational Program',
    affectsUserStatus: true,
    statusChangeCondition: 'if_active',
    targetStatus: 'restricted',
    requiresEnquiryCreation: true,
    autoGenerateEnquiry: true,
    enquiryUrgency: 'high',
    successMessage: 'Foundational Program access has been restricted. User status updated to restricted.',
    logAction: true
  },
  {
    appId: 'transition',
    appName: 'Transition Program',
    affectsUserStatus: true,
    statusChangeCondition: 'if_active',
    targetStatus: 'restricted',
    requiresEnquiryCreation: true,
    autoGenerateEnquiry: true,
    enquiryUrgency: 'high',
    successMessage: 'Transition Program access has been restricted. User status updated to restricted.',
    logAction: true
  },
  {
    appId: 'atpl_pathway',
    appName: 'ATPL Pathway',
    affectsUserStatus: false,
    statusChangeCondition: 'never',
    targetStatus: 'active',
    requiresEnquiryCreation: false,
    autoGenerateEnquiry: false,
    enquiryUrgency: 'low',
    successMessage: 'ATPL Pathway access has been restricted.',
    logAction: true
  },
  {
    appId: 'airtaxi_pathway',
    appName: 'Air Taxi Pathway',
    affectsUserStatus: false,
    statusChangeCondition: 'never',
    targetStatus: 'active',
    requiresEnquiryCreation: false,
    autoGenerateEnquiry: false,
    enquiryUrgency: 'low',
    successMessage: 'Air Taxi Pathway access has been restricted.',
    logAction: true
  },
  {
    appId: 'private_sector',
    appName: 'Private Sector Pathway',
    affectsUserStatus: false,
    statusChangeCondition: 'never',
    targetStatus: 'active',
    requiresEnquiryCreation: false,
    autoGenerateEnquiry: false,
    enquiryUrgency: 'low',
    successMessage: 'Private Sector Pathway access has been restricted.',
    logAction: true
  }
];

// Firebase collection names
export const FIREBASE_COLLECTIONS = {
  USERS: 'users',
  NOTIFICATIONS: 'notifications',
  SUPPORT_ENQUIRIES: 'supportEnquiries',
  APP_ACCESS_LOGS: 'appAccessLogs'
} as const;

// Program access log entry structure
export interface AppAccessLogEntry {
  userId: string;
  userEmail: string;
  appId: string;
  appName: string;
  action: 'granted' | 'restricted' | 'revoked' | 'unrestricted';
  previousStatus: UserProfile['status'];
  newStatus?: UserProfile['status'];
  grantedBy: string;
  grantedAt: Date;
  reason?: string;
  enquiriesDeleted?: number;
}

// Get program access rule by app ID
export const getProgramAccessRule = (appId: string): ProgramAccessRule | undefined => {
  return PROGRAM_ACCESS_RULES.find(rule => rule.appId === appId);
};

// Get grant config by app ID
export const getGrantConfig = (appId: string): GrantConfig | undefined => {
  return GRANT_CONFIG.find(config => config.appId === appId);
};

// Get restrict config by app ID
export const getRestrictConfig = (appId: string): RestrictConfig | undefined => {
  return RESTRICT_CONFIG.find(config => config.appId === appId);
};

// Check if restricting an app should change user status
export const shouldChangeUserStatus = (appId: string, restricted: boolean): boolean => {
  const rule = getProgramAccessRule(appId);
  return rule?.affectsUserStatus === true && restricted === true;
};

// Get the target user status when restricting an app
export const getRestrictedStatus = (appId: string): UserProfile['status'] => {
  const rule = getProgramAccessRule(appId);
  return rule?.restrictedStatus || 'active';
};

// Get the target user status when granting an app
export const getGrantedStatus = (appId: string, currentStatus: UserProfile['status']): UserProfile['status'] => {
  const rule = getProgramAccessRule(appId);
  if (rule?.grantedStatus && currentStatus === rule.restrictedStatus) {
    return rule.grantedStatus;
  }
  return currentStatus;
};

// Check if granting should change user status
export const shouldChangeStatusOnGrant = (appId: string, currentStatus: UserProfile['status']): boolean => {
  const config = getGrantConfig(appId);
  if (config?.statusChangeCondition === 'always') return true;
  if (config?.statusChangeCondition === 'if_restricted' && currentStatus === 'restricted') return true;
  return false;
};

// Get the target status when granting
export const getGrantTargetStatus = (appId: string, currentStatus: UserProfile['status']): UserProfile['status'] => {
  const config = getGrantConfig(appId);
  if (shouldChangeStatusOnGrant(appId, currentStatus)) {
    return config?.targetStatus || currentStatus;
  }
  return currentStatus;
};

// Check if granting should clean up enquiries
export const shouldCleanupEnquiriesOnGrant = (appId: string): boolean => {
  const config = getGrantConfig(appId);
  return config?.requiresEnquiryCleanup === true;
};

// Get success message for grant action
export const getGrantSuccessMessage = (appId: string, userName: string, enquiriesDeleted: number = 0): string => {
  const config = getGrantConfig(appId);
  let message = config?.successMessage || `Access restored for ${userName}`;
  
  if (enquiriesDeleted > 0) {
    message += ` ${enquiriesDeleted} previous enquiry(s) were deleted.`;
  }
  
  return message;
};

// Check if restricting should change user status based on configuration
export const shouldChangeStatusOnRestrict = (appId: string, currentStatus: UserProfile['status']): boolean => {
  const config = getRestrictConfig(appId);
  if (config?.statusChangeCondition === 'always') return true;
  if (config?.statusChangeCondition === 'if_active' && currentStatus === 'active') return true;
  return false;
};

// Get the target status when restricting
export const getRestrictTargetStatus = (appId: string, currentStatus: UserProfile['status']): UserProfile['status'] => {
  const config = getRestrictConfig(appId);
  if (shouldChangeStatusOnRestrict(appId, currentStatus)) {
    return config?.targetStatus || currentStatus;
  }
  return currentStatus;
};

// Check if restricting should create an enquiry
export const shouldCreateEnquiryOnRestrict = (appId: string): boolean => {
  const config = getRestrictConfig(appId);
  return config?.requiresEnquiryCreation === true;
};

// Check if restricting should auto-generate an enquiry
export const shouldAutoGenerateEnquiry = (appId: string): boolean => {
  const config = getRestrictConfig(appId);
  return config?.autoGenerateEnquiry === true;
};

// Get enquiry urgency for restriction
export const getRestrictEnquiryUrgency = (appId: string): 'low' | 'medium' | 'high' | 'urgent' => {
  const config = getRestrictConfig(appId);
  return config?.enquiryUrgency || 'medium';
};

// Get success message for restrict action
export const getRestrictSuccessMessage = (appId: string, userName: string): string => {
  const config = getRestrictConfig(appId);
  return config?.successMessage || `Access restricted for ${userName}`;
};

// Check if restriction should be logged
export const shouldLogRestrictAction = (appId: string): boolean => {
  const config = getRestrictConfig(appId);
  return config?.logAction === true;
};
