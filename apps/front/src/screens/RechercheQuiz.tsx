// page de chargement pour le quiz
import React from "react";
import { StyleSheet, View, Text, SafeAreaView, Image } from "react-native";

export default function RechercheQuiz() {
  // Rendu
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.titleBarContainer}>
          <View style={styles.titleContent}>
            <Text style={styles.titleText}>Recherche de quiz</Text>
          </View>
        </View>
        <View style={styles.line}>
          <Text style={styles.text}>En attente d'autres joueurs...</Text>
        </View>
        <View style={styles.line}></View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E90FF",
    alignItems: "center",
    justifyContent: "center",
  },
  titleBarContainer: {
    width: "100%",
    height: 50,
    backgroundColor: "#1E90FF",
    alignItems: "center",
    justifyContent: "center",
  },
  titleContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  line: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  image: {
    width: 50,
    height: 50,
  },
});
