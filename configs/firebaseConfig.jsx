// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "ai-vid-gen-6b8d0.firebaseapp.com",
  projectId: "ai-vid-gen-6b8d0",
  storageBucket: "ai-vid-gen-6b8d0.firebasestorage.app",
  messagingSenderId: "498667441558",
  appId: "1:498667441558:web:1e95c0d9766d9276d761b7",
  measurementId: "G-7EEW45E963"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth=getAuth(app);