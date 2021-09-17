// Import Firebase SDK
import admin from "firebase-admin";

// Initialize Firebase Admin SDK using Cloud Functions
const app = admin.initializeApp();

// Export default reference to Firestore to use throughout the app
export const firestore = app.firestore();
