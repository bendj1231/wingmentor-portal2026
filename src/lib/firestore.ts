import {
    doc,
    updateDoc,
    setDoc,
    arrayUnion,
    collection,
    addDoc,
    query,
    where,
    getDocs,
    serverTimestamp,
    Timestamp,
    getDoc,
    onSnapshot,
    orderBy,
    limit
} from 'firebase/firestore';
import { db } from './firebase';

export interface MentorshipLog {
    id?: string;
    mentorId: string;
    menteeId: string;
    menteeEmail: string;
    hoursLogged: number;
    sessionDescription: string;
    program: string;
    status: 'pending' | 'verified';
    createdAt: Timestamp | any;
}

/**
 * Enroll a user in the Foundational Program
 */
export const enrollInProgram = async (uid: string, programName: string = 'Foundational') => {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
        enrolledPrograms: arrayUnion(programName)
    }, { merge: true });
};

/**
 * Complete enrollment with onboarding data
 */
export const completeEnrollment = async (uid: string, onboardingData: any) => {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
        enrolledPrograms: arrayUnion('Foundational'),
        onboardingResponses: onboardingData,
        enrollmentAgreementTimestamp: serverTimestamp()
    }, { merge: true });
};

/**
 * Fetch current user enrollment status
 */
export const getEnrollmentStatus = async (uid: string): Promise<string[]> => {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        return userSnap.data().enrolledPrograms || [];
    }
    return [];
};

/**
 * Submit a new mentorship log and check for dual-verification matches
 */
export const submitMentorshipLog = async (logData: Omit<MentorshipLog, 'status' | 'createdAt'>) => {
    // 1. Submit the new log as pending
    const logsRef = collection(db, 'mentorship_logs');
    const newLog = {
        ...logData,
        status: 'pending',
        createdAt: serverTimestamp()
    };

    const docRef = await addDoc(logsRef, newLog);

    // 2. Trigger verification check
    await checkAndVerifyLogs(logData.mentorId, logData.menteeId, logData.hoursLogged);

    return docRef.id;
};

/**
 * Internal helper to find matching logs and verify them
 */
const checkAndVerifyLogs = async (mentorId: string, menteeId: string, hours: number) => {
    const logsRef = collection(db, 'mentorship_logs');

    // Look for all pending logs between these two for these hours
    const q = query(
        logsRef,
        where('mentorId', '==', mentorId),
        where('menteeId', '==', menteeId),
        where('hoursLogged', '==', hours),
        where('status', '==', 'pending')
    );

    const querySnapshot = await getDocs(q);

    // If we have at least 2 logs, it means both parties have submitted
    if (querySnapshot.size >= 2) {
        const batchUpdates = querySnapshot.docs.map(logDoc =>
            updateDoc(doc(db, 'mentorship_logs', logDoc.id), { status: 'verified' })
        );
        await Promise.all(batchUpdates);
        return true;
    }

    return false;
};

/**
 * Fetch logs for a specific user (either as mentor or mentee)
 */
export const getUserLogs = async (uid: string) => {
    const logsRef = collection(db, 'mentorship_logs');

    // In a real app, you'd probably use a composite index or just fetch twice
    // For simplicity, we'll query as mentee for now as this is the "Portal" for pilots
    const q = query(logsRef, where('menteeId', '==', uid));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as MentorshipLog[];
};

// --- WINGMENTOR NETWORK (CHAT & DIRECTORY) ---

export interface WingMentorUser {
    id: string;
    firstName: string;
    role: 'Mentor' | 'Mentee';
    totalHours: number;
    region?: string;
    flightSchool?: string;
}

export interface ChatMessage {
    id?: string;
    senderId: string;
    text: string;
    timestamp: any;
}

/**
 * Search the users directory based on filters
 */
export const searchUsers = async (
    regionFilter: string,
    flightSchoolFilter: string,
    searchQuery: string
): Promise<WingMentorUser[]> => {
    const usersRef = collection(db, 'users');
    let q = query(usersRef);

    // Filter by region if provided
    if (regionFilter) {
        q = query(q, where('region', '==', regionFilter));
    }

    // Filter by flight school if provided
    if (flightSchoolFilter) {
        q = query(q, where('flightSchool', '==', flightSchoolFilter));
    }

    const querySnapshot = await getDocs(q);

    // We filter firstName manually client-side for simplicity on substring match
    // since Firestore standard queries don't natively support substring search easily without Algolia
    const queryLower = searchQuery.toLowerCase();

    return querySnapshot.docs
        .map(doc => {
            const data = doc.data();
            // Try different name fields
            let firstName = data.firstName;
            if (!firstName && data.fullName) {
                firstName = data.fullName.split(' ')[0];
            }
            if (!firstName && data.displayName) {
                firstName = data.displayName.split(' ')[0];
            }

            return {
                id: doc.id,
                firstName: firstName || 'Unknown',
                role: (data.totalHours >= 20) ? 'Mentor' : 'Mentee', // Calculate role based on hours
                totalHours: data.totalHours || 0,
                region: data.region,
                flightSchool: data.flightSchool
            } as WingMentorUser;
        })
        .filter(user =>
            !searchQuery || user.firstName.toLowerCase().includes(queryLower)
        );
};

/**
 * Fetch a single user's profile from Firestore
 */
export const getUserProfile = async (uid: string): Promise<WingMentorUser | null> => {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        const data = userSnap.data();
        let firstName = data.firstName;
        if (!firstName && data.fullName) {
            firstName = data.fullName.split(' ')[0];
        }
        if (!firstName && data.displayName) {
            firstName = data.displayName.split(' ')[0];
        }

        return {
            id: userSnap.id,
            firstName: firstName || 'Unknown',
            role: (data.totalHours >= 20) ? 'Mentor' : 'Mentee',
            totalHours: data.totalHours || 0,
            region: data.region,
            flightSchool: data.flightSchool
        } as WingMentorUser;
    }

    return null;
};

/**
 * Get or Create a chat document deterministically
 */
export const getOrCreateChat = async (userAId: string, userBId: string) => {
    const chatId = [userAId, userBId].sort().join('_');
    const chatRef = doc(db, 'chats', chatId);
    const chatSnap = await getDoc(chatRef);

    if (!chatSnap.exists()) {
        await setDoc(chatRef, {
            participants: [userAId, userBId],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            lastMessage: null
        });
    }

    return chatId;
};

/**
 * Send a message within a chat
 */
export const sendMessage = async (chatId: string, senderId: string, text: string) => {
    const messagesRef = collection(db, `chats/${chatId}/messages`);

    // Add the new message
    await addDoc(messagesRef, {
        senderId,
        text,
        timestamp: serverTimestamp()
    });

    // Update the parent chat metadata
    const chatRef = doc(db, 'chats', chatId);
    await updateDoc(chatRef, {
        lastMessage: text,
        updatedAt: serverTimestamp()
    });
};

/**
 * Subscribe to messages in a chat (Real-time)
 */
export const subscribeToMessages = (chatId: string, callback: (messages: ChatMessage[]) => void) => {
    const messagesRef = collection(db, `chats/${chatId}/messages`);
    const q = query(messagesRef, orderBy('timestamp', 'asc'), limit(50));

    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as ChatMessage[];
        callback(messages);
    });
};
