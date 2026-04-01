import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { UserProfile } from '../types/user';

// Firebase config verification
const ensureFirebaseConfig = () => {
  if (!db) {
    console.error('[verifyProgramAccess] Firebase not initialized. Check firebase config.');
    return false;
  }
  return true;
};

export type ProgramVerificationStatus = 'granted' | 'restricted' | 'not_configured';

export interface ProgramVerificationResult {
  latestProfile: UserProfile;
  status: ProgramVerificationStatus;
}

export const verifyProgramAccess = async (
  userProfile: UserProfile,
  programAppId: string
): Promise<ProgramVerificationResult> => {
  if (!ensureFirebaseConfig()) {
    console.warn('[verifyProgramAccess] Firebase not configured. Using cached profile for verification.');
    // Fallback: use cached profile only
    const programAccess = userProfile.appAccess?.find(access => access.appId === programAppId);
    let status: ProgramVerificationStatus = 'not_configured';
    if (programAccess) {
      status = programAccess.granted && !programAccess.restricted ? 'granted' : 'restricted';
    }
    return {
      latestProfile: userProfile,
      status
    };
  }

  let latestProfile = userProfile;

  try {
    const userRef = doc(db, 'users', userProfile.id);
    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) {
      latestProfile = snapshot.data() as UserProfile;
    }
  } catch (error) {
    console.warn('[verifyProgramAccess] Failed to sync profile from Firebase, using cached profile.', error);
  }

  const programAccess = latestProfile.appAccess?.find(access => access.appId === programAppId);
  let status: ProgramVerificationStatus = 'not_configured';

  if (programAccess) {
    status = programAccess.granted && !programAccess.restricted ? 'granted' : 'restricted';
  }

  return {
    latestProfile,
    status
  };
};
