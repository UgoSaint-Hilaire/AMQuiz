import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { deleteUser, reauthenticateWithCredential, Auth } from "firebase/auth";
import { deleteDoc, doc, getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { EmailAuthProvider, AuthCredential, getAuth } from "firebase/auth";

import { useFirebase } from "../hooks/firebase";

const SuppressionCompteScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { app, db, isInitialized, auth, currentUser } = useFirebase();

  const handleSuppressionCompte = async () => {
    try {
      // Réauthentifier l'utilisateur avec les informations fournies
      const credentials = EmailAuthProvider.credential(email, motDePasse);

      // Supprimer le compte utilisateur
      await reauthenticateWithCredential(currentUser, credentials);

      // Supprimer le document utilisateur dans Firestore
      const userId = currentUser.uid;
      await deleteDoc(doc(db, "Users", userId));

      // Supprimer le compte utilisateur
      await deleteUser(currentUser);

      console.log("Compte utilisateur supprimé avec succès.");

      // Rediriger vers la page d'inscription
      navigation.navigate("Inscription");
    } catch (error) {
      console.error(
        "Erreur lors de la suppression du compte utilisateur :",
        error
      );
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
      }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Suppression de Compte</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          secureTextEntry={true}
          value={motDePasse}
          onChangeText={setMotDePasse}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSuppressionCompte}
        >
          <Text style={styles.buttonText}>Supprimer le compte</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Menu", { screen: "Home" })}
        >
          <Text style={styles.buttonText}>Annuler</Text>
        </TouchableOpacity>

        <Text style={styles.errorMessage}>{errorMessage}</Text>
      </View>
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
  errorMessage: {
    color: "red",
    marginTop: -100,
  },
});

export default SuppressionCompteScreen;
