import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import firebaseConfigJson from '../../firebase-applet-config.json';

// Initialize Firebase App instance
let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let storage: FirebaseStorage;

const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  projectId: firebaseConfigJson.projectId,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
  appId: firebaseConfigJson.appId,
};

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }

  // Use custom firestore databaseId if specified in config, otherwise default
  if (firebaseConfigJson.firestoreDatabaseId && firebaseConfigJson.firestoreDatabaseId !== '(default)') {
    db = getFirestore(app, firebaseConfigJson.firestoreDatabaseId);
  } else {
    db = getFirestore(app);
  }

  auth = getAuth(app);
  storage = getStorage(app);
} catch (error) {
  console.warn('Firebase initialization error, fallback initialized:', error);
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);
}

export { app, db, auth, storage, firebaseConfig };
