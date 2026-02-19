
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : undefined;

// Basic init check
if (!getApps().length) {
    if (serviceAccount) {
        initializeApp({
            credential: cert(serviceAccount)
        });
    } else {
        // Fallback to Application Default Credentials (good for local dev with gcloud authorized, or specific deployment envs)
        initializeApp();
    }
}

const adminDb = getFirestore();

export { adminDb };
