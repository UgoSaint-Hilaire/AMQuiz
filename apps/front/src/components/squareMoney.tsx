import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Text, ImageProps, TouchableOpacity, useWindowDimensions } from "react-native";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useFirebase } from "../hooks/firebase";

type RoundedSquareMoneyProps = {
  euros: string;
  image: ImageProps["source"];
};

const RoundedSquareMoney: React.FC<RoundedSquareMoneyProps> = ({ euros, image, piece }) => {
  const { width, height } = useWindowDimensions();
  const contentWidth = width * 0.8;

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.content}>
        <Image
          source={image} // Remplacez le chemin par le chemin réel de votre image
          style={styles.image}
        />
      </View>
      <View style={styles.content2}>
        <Text style={styles.text}>{euros}</Text>
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
    width: 80, // Ajustez la largeur de l'image selon vos besoins
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

export default RoundedSquareMoney;
