import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, SafeAreaView, Modal, BackHandler, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Deconnexion from "../components/Deconnexion";
import { Pressable } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { doc, getDoc } from "firebase/firestore";
import { useFirebase } from "../hooks/firebase";
import ProfileImgSelector from "../components/ProfileImgSelector";
import ProfileUserInfos from "../components/ProfileUserInfos";
import ProfileUserEdit from "../components/ProfileUserEdit";
import socket from "../socket";

const HomeScreen = () => {
  useEffect(() => {
    const backAction = () => {
      // Bloquer le bouton de retour
      return true;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    // Nettoyer l'effet lors du démontage de l'écran
    return () => backHandler.remove();
  }, []); // Assurez-vous

  const { navigate } = useNavigation();
  //const { params } = useRoute();
  const [username, setUsername] = useState("");
  const [level, setlevel] = useState("");
  const [money, setmoney] = useState("");
  const [pic, setpic] = useState("");

  const { db, isInitialized, currentUser } = useFirebase();
  // Sample list of image URLs
  const imageList = [
    "https://images.unsplash.com/photo-1615592389070-bcc97e05ad01?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1621478374422-35206faeddfb?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1614583225154-5fcdda07019e?q=80&w=1790&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1615592389070-bcc97e05ad01?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1614583225154-5fcdda07019e?q=80&w=1790&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1614583225154-5fcdda07019e?q=80&w=1790&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  useFocusEffect(
    React.useCallback(() => {
      const fetchUsername = async () => {
        // Replace 'userId' with the actual user ID (you need to retrieve it from authentication or another source)
        const userId = currentUser?.uid ?? null;
        console.log({ userId });
        if (!userId) return;

        console.log({ userId });
        const userDoc = await getDoc(doc(db, "Users", userId));

        console.log({ userDoc });
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUsername(userData.username);
          setlevel(userData.level);
          setmoney(userData.money);
          setpic(userData.profilePic); // Replace 'username' with the actual field name in your database
        }
      };

      fetchUsername();
    }, [isInitialized])
  );

  useEffect(() => {
    if (!isInitialized) return;
    const fetchUsername = async () => {
      // Replace 'userId' with the actual user ID (you need to retrieve it from authentication or another source)
      const userId = currentUser?.uid ?? null;
      console.log({ userId });
      if (!userId) return;

      console.log({ userId });
      const userDoc = await getDoc(doc(db, "Users", userId));

      console.log({ userDoc });
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUsername(userData.username);
        setlevel(userData.level);
        setmoney(userData.money);
        setpic(userData.profilePic); // Replace 'username' with the actual field name in your database
      }
    };

    fetchUsername();
  }, [isInitialized]);

  interface RenderImageItemProps {
    item: string;
  }

  const renderImageItem = ({ item }: RenderImageItemProps) => <Image source={{ uri: item }} style={styles.image} />;
  const [modalVisible, setModalVisible] = useState(false);

  const handleDeleteAccount = () => {
    // Ajoutez ici le code pour supprimer le compte

    // Fermez le modal
    setModalVisible(false);

    // Naviguez vers la page "Suppression"
    navigate("Suppression");
  };

  //Partie socket
  useEffect(() => {
    const onPlayerJoined = () => {
      //Afficher page recherche Quiz
      navigate("RechercheQuiz");
    };
    // subscribe to sockets
    socket.on("playerJoined", onPlayerJoined);

    return () => {
      // clean subscriptions to socket
      socket.off("playerJoined", onPlayerJoined);
    };
  }, []);

  useEffect(() => {
    const nextQuestion = () => {
      //Afficher page question
      navigate("QuizGameMultiScreen");
    };
    // subscribe to sockets
    socket.on("nextQuestion", nextQuestion);

    return () => {
      // clean subscriptions to socket
      socket.off("nextQuestion", nextQuestion);
    };
  }, []);

  const searchRoom2 = () => {
    //Envoyer socket
    socket.emitWithAck("searchRoom", username);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: "center", backgroundColor: "#DBE9EE" }}>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image
              source={{
                uri: "https://img.icons8.com/color/48/settings--v1.png",
              }}
              style={styles.iconeSettings}
            />
          </TouchableOpacity>
          {/* Photo de profil */}
          <View style={styles.blocProfil}>
            <View style={styles.blocProfilRight}>
              <Text style={styles.playerNameText}>{username}</Text>
            </View>
            {pic ? (
              <Image
                source={{
                  uri: pic,
                }}
                style={styles.profileImage}
              />
            ) : null}
          </View>

          {/* Barre de pièces */}
          <View style={styles.blocPieces}>
            <View style={styles.blocPiecesLeft}>
              <Image source={require("../../assets/img/coin.png")} style={styles.coinImage} />
              <Text style={styles.coinsText}>{money}</Text>
            </View>
            <View style={styles.blocLvlRight}>
              <Image source={require("../../assets/img/lvl.png")} style={styles.lvlImage} />
              <Text style={styles.levelText}>{level}</Text>
            </View>
          </View>

          {/* Horizontal list of photos */}
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={imageList}
            renderItem={renderImageItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            contentContainerStyle={styles.imageListContainer}
          />

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={searchRoom2}>
              <Text style={styles.text}>Jouer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigate("QuizScreen")}>
              <Text style={styles.text}>Aventure</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Modal
        style={{ display: "flex", justifyContent: "center", alignItems: "center", borderColor: "black", borderWidth: 2 }}
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modal}>
          <Text style={{ fontSize: 26, fontWeight: "bold" }}>PARAMETRE</Text>
          <View style={styles.containerModal}>
            <View style={styles.verticalButtonsContainer}>
              <TouchableOpacity style={styles.buttonModal}>
                <Text style={styles.buttonText}>Son</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonModal}>
                <Text style={styles.buttonText}>Conditions d'utilisation</Text>
              </TouchableOpacity>
            </View>

            {/* Nouvelle structure pour les boutons horizontaux */}
            <View style={styles.horizontalButtonsContainer}>
              <TouchableOpacity style={styles.horizontalButton}>
                <Deconnexion closeModal={() => setModalVisible(!modalVisible)} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.horizontalButton} onPress={handleDeleteAccount}>
                <Text style={styles.buttonText}>Supprimer mon compte</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
            <Text style={styles.buttonText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "space-around",
    width: "90%",
    backgroundColor: "#DBE9EE",
    marginTop: 50,
  },
  iconeSettings: {
    width: 30,
    height: 30,
    alignSelf: "flex-start",
  },

  blocProfil: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#DBE9EE",
    paddingTop: 10,
  },
  blocProfilRight: {
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "flex-start",
    backgroundColor: "#DBE9EE",
  },
  playerNameText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000000",
  },
  playerDescriptionText: {
    fontSize: 15,
    color: "#000000",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#000000",
  },
  blocPieces: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#DBE9EE",
    padding: 16,
    marginTop: 30,
    borderBottomWidth: 2,
    borderBottomColor: "#000000",
  },
  coinsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
  },

  coinImage: {
    width: 30,
    height: 30,
  },
  lvlImage: {
    width: 40,
    height: 30,
  },

  blocPiecesLeft: {
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#DBE9EE",
  },

  blocLvlRight: {
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#DBE9EE",
  },

  levelText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
  },
  imageListContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#DBE9EE",
    marginTop: 40,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#DBE9EE",
    marginTop: 50,
  },
  button: {
    width: 200,
    paddingVertical: 30,
    borderRadius: 8,
    backgroundColor: "#4F6D7A",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  modal: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    marginTop: "50%",
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: "black",
    elevation: 20,
  },

  buttonModal: {
    width: 200,
    paddingVertical: 30,
    borderRadius: 8,
    backgroundColor: "#C0D6DF",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },

  containerModal: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    flexWrap: "wrap",
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 20,
  },

  // Styles pour les boutons horizontaux
  verticalButtonsContainer: {
    flexDirection: "column",
    justifyContent: "space-around",
  },
  // Styles pour les boutons horizontaux
  horizontalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%", // La largeur est définie à 100% de l'écran
    marginTop: 50,
  },
  horizontalButton: {
    backgroundColor: "#C0D6DF",
    paddingVertical: 15,
    borderRadius: 10,
    width: "45%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
  },
});
export default HomeScreen;
