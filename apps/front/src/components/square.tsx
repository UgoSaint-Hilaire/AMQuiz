import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Text, ImageProps, TouchableOpacity, useWindowDimensions } from "react-native";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useFirebase } from "../hooks/firebase";

type RoundedSquareProps = {
  montant: number;
  image: ImageProps["source"];
  piece: ImageProps["source"];
};

const RoundedSquare: React.FC<RoundedSquareProps> = ({ montant, image, piece }) => {
  const { width, height } = useWindowDimensions();
  const { currentUser, db } = useFirebase();

  const contentWidth = width * 0.8;
  const updateUserData = async () => {
    // Récupérez l'ID de l'utilisateur connecté
    const userId = currentUser?.uid;
    if (!userId) return;

    try {
      // Obtenez le document de l'utilisateur
      const userDoc = await getDoc(doc(db, "Users", userId));

      if (userDoc.exists()) {
        // Obtenez les données actuelles de l'utilisateur
        const userData = userDoc.data();

        // Vérifiez si l'utilisateur a assez d'argent
        const newMoney = userData.money - montant; // Soustrayez le coût du coffre
        const newChestCount = userData.comChestCount + 1; // Ajoutez 1 au compteur de coffre
        //Afficher une alerte sur l'écran

        if (newMoney < 0) {
          // L'utilisateur n'a pas assez d'argent
          // Afficher une aletre sur l'écran
          alert("Vous n'avez pas assez d'argent pour acheter ce coffre !");
          return;
        } else {
          // L'utilisateur a assez d'argent
          // Afficher une alerte sur l'écran
          alert("Vous avez acheté un coffre !");
        }

        // Mettez à jour les données de l'utilisateur dans Firebase
        await updateDoc(doc(db, "Users", userId), {
          money: newMoney,
          comChestCount: newChestCount,
        });

        console.log("Données utilisateur mises à jour avec succès !");
      } else {
        console.log("Aucun document utilisateur trouvé !");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour des données utilisateur :", error);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        // Appeler la fonction d'actualisation des données lorsque le coffre est cliqué
        updateUserData();
      }}>
      <View style={styles.content}>
        <Image
          source={image} // Remplacez le chemin par le chemin réel de votre image
          style={styles.image}
        />
      </View>
      <View style={styles.content2}>
        <Text style={styles.text}>{montant}</Text>
        <Image
          source={piece} // Remplacez le chemin par le chemin réel de votre image
          style={styles.image2}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginHorizontal: 8,
    backgroundColor: "#ADCFDD",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    width: "28%",
    height: 150,
  },
  content: {
    alignItems: "center",
  },
  content2: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 100, // Ajustez la largeur de l'image selon vos besoins
    height: 80, // Ajustez la hauteur de l'image selon vos besoins
    marginBottom: 8,
  },
  image2: {
    width: 15, // Ajustez la largeur de l'image selon vos besoins
    height: 15, // Ajustez la hauteur de l'image selon vos besoins
    marginLeft: 3,
  },
  text: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RoundedSquare;
