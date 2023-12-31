import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Pressable, Image, Dimensions } from "react-native";
import SelectDropdown from "react-native-select-dropdown";

import { questions } from "../config/questions";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useFirebase } from "../hooks/firebase";
// Ecran de Quizz
export default function QuizScreen({ navigation, route }: any) {
  //Appel BDD
  const [username, setUsername] = useState("");
  const [money, setmoney] = useState("");
  const { db, isInitialized, currentUser } = useFirebase();
  // Récupération du thème choisi
  const { params } = route;
  const nomDuQuizz = params?.theme;
  // Données questions.ts
  const [data, setData] = useState(questions.naruto); // choix par défaut
  const totalQuestions = data.length; // compteur questions
  const theme = Object.keys(questions);
  const themeMaj = theme.map((item) => item.charAt(0).toUpperCase() + item.slice(1));
  // Index questions
  const [index, setIndex] = useState(0);
  // Question actuelle
  const currentQuestion = data[index];
  // Compteur score
  const [score, setScore] = useState(0);
  // Statut réponse (True = en cours / False = fini)
  const [quizzStatus, setQuizzStatus] = useState(false);
  // Réponse choisie
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  // Valeurs Timer
  const [countdown, setCountdown] = useState<number>(7);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  // Booléen fin du quizz
  const [finQuizz, setFinQuizz] = useState(false);
  const screenwidth: number = Dimensions.get("window").width;
  const screenheight: number = Dimensions.get("window").height;

  /*************************************************************************************************************************/

  // Gestion du choix de thème
  function setTheme(item: string) {
    // Utiliser le theme récupéré dans le paramètre
    if (item === "Naruto") {
      setData(questions.naruto);
    }
    if (item === "DragonBall") {
      setData(questions.dragonball);
    }
    if (item === "Evangelion") {
      setData(questions.evangelion);
    }
  }

  // Gestion du Timer
  useEffect(() => {
    if (isPaused) return;
    // Si le compteur atteint 0 on passe à la question suivante
    if (countdown === 0 || countdown < 0) {
      // Evite que le score soit négatif
      if (score >= 5) {
        setScore((score) => score - 5);
      } else {
        setScore(0);
      }
      if (index < data.length) {
        setIndex((index) => index + 1);
      }
      setCountdown(7);
    }
    const interval = setInterval(() => {
      setCountdown((countdown) => countdown - 1);
    }, 1000);
    // Reset
    return () => clearInterval(interval);
  }, [countdown, isPaused]);

  const updateUserData = async (newScore: number, newMoney: number) => {
    // Replace 'userId' with the actual user ID (you need to retrieve it from authentication or another source)
    const userId = currentUser?.uid ?? null;
    if (!userId) return;

    // Obtenez une référence au document de l'utilisateur
    const userRef = doc(db, "Users", userId);

    try {
      // Mettez à jour les données de l'utilisateur dans la base de données
      await updateDoc(userRef, {
        score: newScore,
        money: money + newMoney,
      });

      console.log("Données utilisateur mises à jour avec succès !");
      console.log("Nouveau score:", newScore);
      console.log("Nouvelle money:", newMoney);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des données utilisateur:", error);
    }
  };

  // Gestion boucle de jeu
  useEffect(() => {
    // Lancement du Timer
    if (quizzStatus === true) {
      setIsPaused(false);
      setFinQuizz(false);
    }

    // Le quizz s'arrête lorsqu'il n'y a plus de questions
    if ((quizzStatus === true && index >= data.length) || currentQuestion === undefined) {
      setIsPaused(true);
      setFinQuizz(true);

      // Appeler la fonction pour mettre à jour les données utilisateur avec le score actuel et la valeur de money actuelle
      updateUserData(score, score);
    }
  }, [currentQuestion, quizzStatus, score, money]);

  // Gestion choix réponses
  useEffect(() => {
    // Null check
    if (selectedAnswer === null || !currentQuestion) return;

    // Fonction pour passer à la question suivante
    const goToNextQuestion = () => {
      setIndex((index) => index + 1);
      setCountdown(7);
      setSelectedAnswer(null);
    };

    // Si la réponse est correcte...
    if (selectedAnswer === currentQuestion.answerId) {
      setScore((score) => score + 10);
    } else {
      // Si la réponse est fausse...
      if (score >= 5) {
        setScore((score) => score - 5);
      } else {
        setScore(0);
      }
    }

    // Appeler directement la fonction pour passer à la question suivante
    goToNextQuestion();

    // Nettoyage timeout
    return () => {};
  }, [selectedAnswer, currentQuestion]);

  //Recupération du username
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
        setmoney(userData.money);
      }
    };

    fetchUsername();
  }, [isInitialized]);

  /*************************************************************************************************************************/

  // Rendu
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: "center", backgroundColor: "#DBE9EE" }}>
        <View style={styles.container}>
          {quizzStatus === false && finQuizz === false ? (
            <>
              <Text style={styles.title}>{`Lancer le Quiz ${nomDuQuizz} ?`}</Text>
              <Pressable
                style={styles.startButton}
                onPress={() => {
                  setQuizzStatus(true);
                  setTheme(nomDuQuizz);
                }}>
                <Text style={styles.buttonText}>Oui</Text>
              </Pressable>
              <TouchableOpacity
                style={styles.finishButton}
                onPress={() => {
                  setQuizzStatus(false);
                  setIndex(0);
                  setScore(0);
                  setCountdown(7);
                  setFinQuizz(false);
                  navigation.navigate("QuizScreen");
                }}>
                <Text style={styles.buttonText}>Non</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {finQuizz ? (
                <SafeAreaView style={{ backgroundColor: "#DBE9EE", height: screenheight }}>
                  <View style={{ flex: 1, alignItems: "center" }}>
                    <View>
                      <View style={{ flex: 1, alignItems: "center", backgroundColor: "#DBE9EE" }}>
                        <Image source={require("../../assets/img/trophee.png")} style={styles.imageWin} />
                        <Text style={styles.messageWin}>Bien joué !</Text>
                        <Text style={styles.playerName}>{username}</Text>
                        <Text style={styles.playerScore}>{`Tu as obtenue un score de : ${score}`}</Text>
                        <TouchableOpacity
                          style={styles.startButton}
                          onPress={() => {
                            setQuizzStatus(false);
                            setIndex(0);
                            setScore(0);
                            setCountdown(7);
                            setFinQuizz(false);
                            navigation.navigate("QuizScreen");
                          }}>
                          <Text style={styles.buttonText}>Retour</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </SafeAreaView>
              ) : (
                // Afficher le contenu du quiz lorsqu'il est en cours
                <>
                  <Text style={styles.timer}>TIMER: {countdown}s</Text>
                  <Text style={styles.counter}>{`Score : ${score}`}</Text>
                  <View>
                    <Text style={styles.question}>{index === data.length ? undefined : "(" + (index + 1) + "/" + totalQuestions + ") " + currentQuestion?.question}</Text>

                    <View style={{ marginTop: 10 }}>
                      {currentQuestion?.choices.map((item, index) => (
                        <TouchableOpacity key={index} onPress={() => setSelectedAnswer(item.id)} style={{ borderColor: "red", padding: 10 }}>
                          <View style={styles.cards}>
                            <Text style={{ color: selectedAnswer === item.id ? (selectedAnswer === currentQuestion.answerId ? "green" : "red") : undefined }}>
                              {item.id} - {item.answer}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </>
              )}
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

/* Pour CSS */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#DBE9EE",
    width: "90%",
    marginTop: "50%",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000000",
  },
  startButton: {
    width: "70%",
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
  timer: {
    fontSize: 20,
    color: "#000000",
  },
  question: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginTop: 20,
  },
  cards: {
    width: "100%",
    height: 70,
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  counter: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  messageWin: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000000",
    marginTop: 20,
  },

  imageWin: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
  playerName: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000000",
    marginTop: 20,
  },
  playerScore: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginTop: 20,
  },
  finishButton: {
    width: "70%",
    height: 70,
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
    backgroundColor: "#B22222",
    justifyContent: "center",
    alignItems: "center",
  },
});
