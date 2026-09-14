import { initializeApp, FirebaseApp } from "firebase/app";
import { initializeAuth, Auth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const {getReactNativePersistence} = require("firebase/auth") as any;

// Ative "Authentication" > "Sign-in method" > "E-mail/senha" no seu projeto.
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID",
};

const app: FirebaseApp = initializeApp(firebaseConfig);

export const auth: Auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
