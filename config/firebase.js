// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkECPLaiPCKdZk48lDKQ8CMjLXSuIDGk0",
  authDomain: "uniconnect-8fadd.firebaseapp.com",
  projectId: "uniconnect-8fadd",
  storageBucket: "uniconnect-8fadd.firebasestorage.app",
  messagingSenderId: "305588114567",
  appId: "1:305588114567:web:40aad10e216fd390c31422"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
export const db = getFirestore(app);