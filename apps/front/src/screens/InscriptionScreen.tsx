import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import ConnexionScreen from "./ConnexionScreen";
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import {} from "firebase/firestore";
import {
  getFirestore, // Add this line to import getFirestore
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc, // Add this line to import getDocs
} from "firebase/firestore";

import { useFirebase } from "../hooks/firebase";

const InscriptionScreen = () => {
  const { app, db, isInitialized, auth, currentUser } = useFirebase();

  const navigation = useNavigation();
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmationMotDePasse, setConfirmationMotDePasse] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailDejaUtilise, setEmailDejaUtilise] = useState(false);
  const [emailInvalide, setEmailInvalide] = useState(false);
  const [motsDePasseDifferents, setMotsDePasseDifferents] = useState(false);

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const checkExistingEmail = (email: string) => {
    return new Promise((resolve, reject) => {
      fetchSignInMethodsForEmail(auth, email)
        .then((signInMethods) => {
          if (signInMethods && signInMethods.length > 0) {
            setEmailDejaUtilise(true);
            resolve(true);
          } else {
            setEmailDejaUtilise(false);
            resolve(false);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  const checkExistingUsername = async (username: string) => {
    const usersRef = collection(db, "Users");
    const q = query(usersRef, where("username", "==", username));

    try {
      const querySnapshot = await getDocs(q);

      if (querySnapshot.size > 0) {
        return true; // Username already exists
      } else {
        return false; // Username is available
      }
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async () => {
    setEmailInvalide(false);
    setMotsDePasseDifferents(false);

    if (!validateEmail(email)) {
      setEmailInvalide(true);
      setErrorMessage("L'e-mail n'est pas valide");
      return;
    }

    if (motDePasse !== confirmationMotDePasse) {
      setMotsDePasseDifferents(true);
      setErrorMessage("Les mots de passe ne correspondent pas");
      return;
    }

    if (nom.trim() === "" || email.trim() === "" || motDePasse.trim() === "" || confirmationMotDePasse.trim() === "") {
      setErrorMessage("Veuillez remplir tous les champs");
      return;
    }

    try {
      const emailExiste = await checkExistingEmail(email);
      const usernameExiste = await checkExistingUsername(nom);

      if (!emailExiste && !usernameExiste) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, motDePasse);
        const user = userCredential.user;

        // Store user information in Firestore
        const userDocRef = await setDoc(doc(db, "Users", user.uid), {
          username: nom,
          level: 0, // Set the default values for other fields
          money: 0,
          profilePic:
            "https://images.unsplash.com/photo-1614583225154-5fcdda07019e?q=80&w=1790&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          skills: "",
          userPics: [
            "1",
          ],
          comChestCount: 0,
          rareChestCount: 0,
          legChestCount: 0,
          uid: user.uid,
          userPics: [1],
        });

        navigation.navigate("Connexion");
      } else {
        if (emailExiste) {
          setErrorMessage("L'e-mail est déjà utilisé");
        } else {
          setErrorMessage("Le pseudo est déjà utilisé, veuillez en choisir un autre");
        }
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#DBE9EE",
      }}>
      <View style={styles.container}>
        <Text style={styles.title}>Quiz animés/mangas</Text>

        <TextInput style={[styles.input, emailInvalide && styles.inputInvalid]} placeholder="Email" value={email} onChangeText={setEmail} />

        <TextInput style={styles.input} placeholder="Pseudo" value={nom} onChangeText={setNom} />

        <TextInput style={styles.input} placeholder="Mot de passe" secureTextEntry={true} value={motDePasse} onChangeText={setMotDePasse} />

        <TextInput
          placeholder="Confirmer le mot de passe"
          style={[styles.input, motsDePasseDifferents && styles.inputInvalid]}
          secureTextEntry={true}
          value={confirmationMotDePasse}
          onChangeText={setConfirmationMotDePasse}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>S'inscrire</Text>
        </TouchableOpacity>

        <View style={styles.noAccount}>
          <Text style={styles.greenText}>Déjà un compte ?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Connexion")}>
            <Text style={styles.underscore}>Se Connecter</Text>
          </TouchableOpacity>
        </View>
      </View>
      {errorMessage !== "" && <Text style={styles.errorMessage}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    height: "100%",
    width: "80%",
    backgroundColor: "#DBE9EE",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "bold",
  },
  input: {
    borderColor: "#84AFBE",
    borderWidth: 2,
    borderRadius: 100,
    padding: 18,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#181818",
    padding: 18,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#181818",
    marginBottom: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  underscore: {
    textAlign: "center",
    textDecorationLine: "underline",
    color: "#181818",
  },
  greenText: {
    textAlign: "center",
    color: "#008205",
    marginRight: 8,
  },
  noAccount: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  errorMessage: {
    color: "red",
    marginTop: -100,
  },
  inputInvalid: {
    borderColor: "red",
  },
});

export default InscriptionScreen;
