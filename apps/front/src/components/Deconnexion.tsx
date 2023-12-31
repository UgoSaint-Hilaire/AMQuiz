// Deconnexion.js

import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const Deconnexion = ({ closeModal }) => {
  const { navigate } = useNavigation();
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      navigate("Connexion");
      setIsLoggedIn(true);
      closeModal(); // Appeler closeModal pour fermer le modal après la déconnexion
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };

  const checkSession = async () => {
    try {
      const user = await AsyncStorage.getItem("user");
      if (user) {
        const savedEmail = JSON.parse(user).email;
        const emailParts = savedEmail.split("@");
        const username = emailParts[0];
        setUsername(username);
      }
    } catch (error) {
      console.log("Error checking session:", error);
    }
  };

  // Rendu du composant
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#C0D6DF",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
  },
});

export default Deconnexion;
