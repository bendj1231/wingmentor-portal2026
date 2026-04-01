import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import type { UserProfile, UserRole } from '../types/user';
import { AVAILABLE_APPS, ROLE_PERMISSIONS } from '../types/user';

export interface AuthState {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  currentSystem: 'pms' | 'wms' | 'super_admin';
}

export const SUPER_ADMIN_EMAIL = 'benjamintigerbowler@gmail.com';

export const createUserProfile = async (user: User, role: UserRole['type'] = 'mentee'): Promise<UserProfile> => {
  // Use real Firebase if available, otherwise use mock
  if (!db || db._mockUsers) {
    console.log("Using mock profile creation (development mode)");
    const mockProfile: UserProfile = {
      id: user.uid,
      email: user.email || 'benjamintigerbowler@gmail.com',
      displayName: user.displayName || 'Benjamin Bowler',
      firstName: user.displayName?.split(' ')[0] || 'Benjamin',
      lastName: user.displayName?.split(' ').slice(1).join(' ') || 'Bowler',
      role: user.email === SUPER_ADMIN_EMAIL ? 'super_admin' : role,
      totalHours: user.email === SUPER_ADMIN_EMAIL ? 100 : 0,
      enrolledPrograms: user.email === SUPER_ADMIN_EMAIL ? ['Foundational'] : [],
      appAccess: AVAILABLE_APPS.map(app => ({
        appId: app.id,
        appName: app.name,
        granted: true,
        restricted: false
      })),
      createdAt: new Date(),
      lastLogin: new Date(),
      status: 'active'
    };
    return mockProfile;
  }

  // Real Firebase operations
  const userRef = doc(db, 'users', user.uid);
  
  const defaultAppAccess = AVAILABLE_APPS.map(app => ({
    appId: app.id,
    appName: app.name,
    granted: app.required,
    restricted: false
  }));

  const userProfile: UserProfile = {
    id: user.uid,
    email: user.email || '',
    displayName: user.displayName || '',
    firstName: user.displayName?.split(' ')[0] || '',
    lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
    role: user.email === SUPER_ADMIN_EMAIL ? 'super_admin' : role,
    totalHours: 0,
    enrolledPrograms: [],
    appAccess: defaultAppAccess,
    createdAt: new Date(),
    lastLogin: new Date(),
    status: 'active'
  };

  await setDoc(userRef, {
    ...userProfile,
    createdAt: serverTimestamp(),
    lastLogin: serverTimestamp()
  }, { merge: true });

  return userProfile;
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  // Use mock data for development mode
  if (!db || db._mockUsers) {
    console.log("Using mock user profile (development mode)");
    const mockProfile: UserProfile = {
      id: uid,
      email: 'benjamintigerbowler@gmail.com',
      displayName: 'Benjamin Bowler',
      firstName: 'Benjamin',
      lastName: 'Bowler',
      role: 'super_admin',
      totalHours: 100,
      enrolledPrograms: ['Foundational'],
      appAccess: AVAILABLE_APPS.map(app => ({
        appId: app.id,
        appName: app.name,
        granted: true,
        restricted: false
      })),
      createdAt: new Date(),
      lastLogin: new Date(),
      status: 'active'
    };
    return mockProfile;
  }

  // Real Firebase operations
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        lastLogin: data.lastLogin?.toDate?.(),
        appAccess: data.appAccess || []
      } as UserProfile;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
  }

  return null;
};

export const updateUserLastLogin = async (_uid: string) => {
  console.log("Mock update user last login (development mode)");
  // No-op for development
};

export const switchSystem = async (_uid: string, system: 'pms' | 'wms' | 'super_admin') => {
  console.log(`Mock switch system to ${system} (development mode)`);
  // No-op for development
};

export const hasPermission = (userProfile: UserProfile | null, permission: string): boolean => {
  if (!userProfile) return false;
  
  // Super admin has all permissions
  if (userProfile.role === 'super_admin') return true;
  
  // Check role-based permissions
  const userPermissions = ROLE_PERMISSIONS[userProfile.role] || [];
  return userPermissions.includes(permission);
};

export const canAccessApp = (userProfile: UserProfile | null, appId: string): boolean => {
  if (!userProfile) return false;
  
  // Super admin can access all apps
  if (userProfile.role === 'super_admin') return true;
  
  const appAccess = userProfile.appAccess.find(app => app.appId === appId);
  return appAccess?.granted || false;
};

export const onAuthStateChange = (callback: (authState: AuthState) => void) => {
  // Use real Firebase auth for both development and production
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        let userProfile = await getUserProfile(user.uid);
        
        if (!userProfile) {
          userProfile = await createUserProfile(user);
        } else {
          await updateUserLastLogin(user.uid);
        }

        // Ensure super admin role for the specific email
        if (user.email === SUPER_ADMIN_EMAIL && userProfile.role !== 'super_admin') {
          userProfile.role = 'super_admin';
          // Only try to update if db is available
          if (db && !db._mockUsers) {
            try {
              await setDoc(doc(db, 'users', user.uid), {
                role: 'super_admin'
              }, { merge: true });
            } catch (updateError) {
              console.warn('Failed to update super admin role:', updateError);
            }
          }
        }

        callback({
          user,
          userProfile,
          loading: false,
          currentSystem: (userProfile as any).currentSystem || 'pms'
        });
      } catch (error: any) {
        console.error('Error loading user profile:', error);
        
        // Only use fallback if Firebase is completely unavailable
        if (error?.code === 'unavailable' || error?.code === 'failed-precondition' || !db) {
          console.log('Firebase unavailable, using fallback profile for super admin');
          if (user.email === SUPER_ADMIN_EMAIL) {
            const fallbackProfile: UserProfile = {
              id: user.uid,
              email: user.email,
              displayName: 'Benjamin Bowler',
              firstName: 'Benjamin',
              lastName: 'Bowler',
              role: 'super_admin',
              totalHours: 100,
              enrolledPrograms: ['Foundational'],
              appAccess: AVAILABLE_APPS.map(app => ({
                appId: app.id,
                appName: app.name,
                granted: true,
                restricted: false
              })),
              createdAt: new Date(),
              lastLogin: new Date(),
              status: 'active'
            };
            
            callback({
              user,
              userProfile: fallbackProfile,
              loading: false,
              currentSystem: 'pms'
            });
          } else {
            callback({
              user,
              userProfile: null,
              loading: false,
              currentSystem: 'pms'
            });
          }
        } else {
          // For other errors, show error state
          callback({
            user,
            userProfile: null,
            loading: false,
            currentSystem: 'pms'
          });
        }
      }
    } else {
      callback({
        user: null,
        userProfile: null,
        loading: false,
        currentSystem: 'pms'
      });
    }
  });
};
