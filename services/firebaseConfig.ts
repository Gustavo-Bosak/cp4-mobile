import { initializeApp, FirebaseApp } from "firebase/app";
import { initializeAuth, Auth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import AsyncStorage from "@react-native-async-storage/async-storage";

const {getReactNativePersistence} = require("firebase/auth") as any;

// Ative "Authentication" > "Sign-in method" > "E-mail/senha" no seu projeto.
const firebaseConfig = {
  apiKey: "AIzaSyB124pvDRHNKqortDCt-gSea03BSfZWNX8",
  authDomain: "cp4-mobile-28f1d.firebaseapp.com",
  projectId: "cp4-mobile-28f1d",
  storageBucket: "cp4-mobile-28f1d.firebasestorage.app",
  messagingSenderId: "9476054478",
  appId: "1:9476054478:web:820190e7fbda4d1aaadf9f",
  measurementId: "G-C8X07WM1EE"
};

const app: FirebaseApp = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

export const auth: Auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
