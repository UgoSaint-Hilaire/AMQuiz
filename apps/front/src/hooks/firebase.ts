import { FirebaseApp, initializeApp } from "firebase/app";
import {
  Auth,
  initializeAuth,
  getReactNativePersistence,
  onAuthStateChanged,
  browserLocalPersistence
} from "firebase/auth";

import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { Firestore, getFirestore } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { firebaseConfig } from "../config/firebase";

import { Platform } from 'react-native';
import axios from 'axios';

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
    persistence: Platform.OS === 'web' ? browserLocalPersistence : getReactNativePersistence(ReactNativeAsyncStorage),
});

const db = getFirestore(app);

export const useFirebase = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  // useEffect(() => {
  //   if (!auth) return;
  //   onAuthStateChanged(auth, (user) => setIsInitialized(!!user));
  // }, []);

  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       console.log("Utilisateur connecté :", user);

  //       user.getIdToken().then((idToken) => {
  //         axios.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;
  //         setIsInitialized(true);
  //       });
  //     } else {
  //       console.log("Aucun utilisateur connecté.");
  //       setIsInitialized(true);
  //     }
  //   }, (error) => {
  //     console.error("Erreur :", error);
  //     setIsInitialized(false);
  //   });

  useEffect(() => {
  if (!auth) return;

  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("Utilisateur connecté :", user);

      user.getIdToken().then((idToken) => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;
        setIsInitialized(true);
      });
    } else {
      console.log("Aucun utilisateur connecté.");
      setIsInitialized(false);
    }
  }, (error) => {
    console.error("Erreur :", error);
    setIsInitialized(false);
  });

  return () => {
    unsubscribe();
  };
  }, [auth]);



  return {
    app,
    auth,
    db,
    currentUser: auth?.currentUser,
    isInitialized,
  };
};

export default useFirebase;
