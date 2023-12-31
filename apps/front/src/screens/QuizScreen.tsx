import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Image } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { questions } from "../config/questions";

const QuizScreen = ({ navigation, route }: any) => {
  const [searchText, setSearchText] = useState("");

  // Liste des thèmes de quiz récupérés depuis le fichier questions.ts
  const theme = Object.keys(questions);
  const themeMaj = theme.map((item) => item.charAt(0).toUpperCase() + item.slice(1));

  // Liste des boutons
  const buttons = ["Naruto", "DragonBall", "Evangelion"];

  // Fonction pour gérer la recherche
  const filteredButtons = buttons.filter((button) => button.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: "center", backgroundColor: "#DBE9EE" }}>
        <View style={styles.container}>
          {/* Ligne en haut */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.icone} onPress={() => navigation.navigate("Home")}>
              {/* image dans assets/img */}
              <Image source={require("../../assets/img/back.png")} style={styles.iconeHome} />
            </TouchableOpacity>
          </View>

          <View style={styles.blocProfil}>
            {/* Titre de la page */}
            <View>
              <Text style={styles.title}>Liste des quizs</Text>
            </View>

            {/* Gros bloc rouge */}
            <View style={styles.redBlock}>
              {/* Input de recherche */}
              <TextInput style={styles.searchInput} placeholder="Rechercher..." value={searchText} onChangeText={(text) => setSearchText(text)} />

              {/* Liste de boutons filtrés */}
              {filteredButtons.map((themeMaj, index) => (
                <TouchableOpacity key={index} style={styles.quizButton} onPress={() => navigation.navigate("QuizGameScreen", { theme: themeMaj })}>
                  <Text style={styles.buttonText}>{themeMaj}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#DBE9EE",
    width: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#DBE9EE",
    marginTop: 50,
  },
  icone: {
    width: 30,
    height: 30,
    alignSelf: "flex-start",
  },
  iconeHome: {
    width: 30,
    height: 30,
  },
  blocProfil: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: "33%",
  },

  searchContent: {
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000000",
  },

  redBlock: {
    width: "90%",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#DBE9EE",
    borderWidth: 2,
    borderColor: "#000000",
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
  },
  searchInput: {
    width: "100%",
    height: 50,
    borderWidth: 2,
    borderColor: "#000000",
    borderRadius: 8,
    padding: 16,
  },
  quizButton: {
    width: "100%",
    height: 70,
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
    backgroundColor: "#4F6D7A",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});

export default QuizScreen;
