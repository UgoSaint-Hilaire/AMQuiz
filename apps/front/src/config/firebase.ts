import {
  REACT_APP_FIREBASE_API_KEY,
  AUTHDOMAIN,
  PROJECTID,
  STORAGEBUCKET,
  MESSAGINGSENDERID,
  APPID,
} from "@env";

export const firebaseConfig = {
  // Votre configuration Firebase
  apiKey: REACT_APP_FIREBASE_API_KEY,
  //apiKey: AIzaSyDYz3G--wdyviASFCk3P8gn8uKhexYhlH8,
  authDomain: AUTHDOMAIN,
  projectId: PROJECTID,
  storageBucket: STORAGEBUCKET,
  messagingSenderId: MESSAGINGSENDERID,
  appId: APPID,
  measurementId: "",
};
