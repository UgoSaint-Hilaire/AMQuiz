import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, SafeAreaView, Image, Modal, ScrollView, useWindowDimensions, Dimensions } from "react-native";

export default function SocialScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const { width, height } = useWindowDimensions();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: "center", backgroundColor: "#DBE9EE" }}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Inviter un ami</Text>
          </TouchableOpacity>
          {/* Il faudra faire une petite boucle for pour afficher qu'une view 4 fois ICI AFFICHAGE STATIQUE Pour le moment */}
          <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.cards}>
              <Image style={styles.imgProfil} source={require("../../assets/img/Avatar1.png")} />
              <View style={{ flexDirection: "column" }}>
                <Text style={styles.pseudo}>Pseudo</Text>
                <Text style={styles.description}>Description</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.cards}>
              <Image style={styles.imgProfil} source={require("../../assets/img/Avatar1.png")} />
              <View style={{ flexDirection: "column" }}>
                <Text style={styles.pseudo}>Pseudo</Text>
                <Text style={styles.description}>Description</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.cards}>
              <Image style={styles.imgProfil} source={require("../../assets/img/Avatar1.png")} />
              <View style={{ flexDirection: "column" }}>
                <Text style={styles.pseudo}>Pseudo</Text>
                <Text style={styles.description}>Description</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.cards}>
              <Image style={styles.imgProfil} source={require("../../assets/img/Avatar1.png")} />
              <View style={{ flexDirection: "column" }}>
                <Text style={styles.pseudo}>Pseudo</Text>
                <Text style={styles.description}>Description</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.cards}>
              <Image style={styles.imgProfil} source={require("../../assets/img/Avatar1.png")} />
              <View style={{ flexDirection: "column" }}>
                <Text style={styles.pseudo}>Pseudo</Text>
                <Text style={styles.description}>Description</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.cards}>
              <Image style={styles.imgProfil} source={require("../../assets/img/Avatar1.png")} />
              <View style={{ flexDirection: "column" }}>
                <Text style={styles.pseudo}>Pseudo</Text>
                <Text style={styles.description}>Description</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.cards}>
              <Image style={styles.imgProfil} source={require("../../assets/img/Avatar1.png")} />
              <View style={{ flexDirection: "column" }}>
                <Text style={styles.pseudo}>Pseudo</Text>
                <Text style={styles.description}>Description</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.cards}>
              <Image style={styles.imgProfil} source={require("../../assets/img/Avatar1.png")} />
              <View style={{ flexDirection: "column" }}>
                <Text style={styles.pseudo}>Pseudo</Text>
                <Text style={styles.description}>Description</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
      <View style={{ backgroundColor: "#DBE9EE", height: "8%" }}>
        <TouchableOpacity style={styles.buttonRefresh}>
          <Text style={styles.buttonText}>R</Text>
        </TouchableOpacity>
      </View>
      <Modal
        style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: "white", marginTop: "50%", margin: 50, padding: 20, borderRadius: 16 }}>
          <Text style={{ fontSize: 26, fontWeight: "bold" }}>Pseudo</Text>
          <View style={styles.containerModal}>
            {/** Remplacer les lettres par des icones*/}
            <TouchableOpacity style={styles.buttonPopUp}>
              <Text style={styles.buttonText}>V</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonPopUp}>
              <Text style={styles.buttonText}>A</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonPopUp}>
              <Text style={styles.buttonText}>D</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonPopUp}>
              <Text style={styles.buttonText}>L</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonPopUp}>
              <Text style={styles.buttonText}>R</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.buttonClose} onPress={() => setModalVisible(!modalVisible)}>
            <Text style={styles.buttonText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "space-around",
    width: "80%",
    backgroundColor: "#DBE9EE",
    marginTop: 50,
  },
  containerModal: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    flexWrap: "wrap",
    width: "80%",
    backgroundColor: "white",
    borderRadius: 12,
    paddingTop: 20,
  },
  button: {
    backgroundColor: "#4F6D7A",
    padding: 12,
    borderRadius: 100,
    marginBottom: 32,
  },
  buttonRefresh: {
    backgroundColor: "#4F6D7A",
    padding: 8,
    borderRadius: 100,
    width: 100,
    position: "absolute",
    bottom: 16,
    left: "50%",
    marginLeft: -50,
  },
  buttonPopUp: {
    backgroundColor: "#4F6D7A",
    padding: 20,
    borderRadius: 12,
    marginBottom: 32,
  },
  buttonClose: {
    backgroundColor: "#4F6D7A",
    padding: 12,
    borderRadius: 100,
    marginTop: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 22,
    textAlign: "center",
    fontWeight: "900",
  },
  cards: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#C0D6DF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  imgProfil: {
    width: 100,
    height: 100,
    borderRadius: 100,
    marginRight: 20,
  },
  pseudo: {
    fontWeight: "900",
    fontSize: 16,
    marginBottom: 10,
  },
  description: {
    fontSize: 12,
    color: "#4F6D7A",
  },
});
