// src/utils/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAdMnrksl2fzIT-xYXVjdsIQjTVAahFtbI",
  authDomain: "braid-on-call.firebaseapp.com",
  projectId: "braid-on-call",
  storageBucket: "braid-on-call.firebasestorage.app",
  messagingSenderId: "210193830331",
  appId: "1:210193830331:web:c30f15f97245d193edf49e",
  measurementId: "G-0VH5SCBPTR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

// export { messaging };