import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, deleteField } from 'firebase/firestore';

const firebaseConfig = {
    projectId: "wingmentor-ab3ad"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function resetUser() {
    const uid = "hDoBusAzleU5CMDCGpzXitERjO13";
    const userRef = doc(db, 'users', uid);

    try {
        await updateDoc(userRef, {
            enrolledPrograms: [],
            onboardingResponses: deleteField(),
            enrollmentAgreementTimestamp: deleteField()
        });
        console.log("Successfully reset user enrollment for UID:", uid);
    } catch (error) {
        console.error("Error resetting user:", error);
    }
}

resetUser();
