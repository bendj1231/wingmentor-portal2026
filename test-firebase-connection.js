// Test Firebase Connection
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'wingmentor-ab3ad',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

console.log('Testing Firebase connection...');
console.log('Config:', {
    apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : 'missing',
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain
});

try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log('✅ Firebase initialized successfully');
    console.log('📊 Testing Firestore connection...');
    
    // Test connection by trying to fetch users
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    
    console.log(`✅ Firestore connection successful! Found ${querySnapshot.docs.length} users`);
    
    if (querySnapshot.docs.length > 0) {
        console.log('Sample user data:', querySnapshot.docs[0].data());
    }
    
} catch (error) {
    console.error('❌ Firebase connection failed:', error);
    console.error('Error details:', error.code, error.message);
}
