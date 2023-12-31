import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Pressable, Image, Dimensions } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { doc, getDoc } from "firebase/firestore";
import { useFirebase } from "../hooks/firebase";
import { questions } from "../config/questions";
import socket from "../socket";
import { Player, Room } from "../../../back/src/events/room.service";

export default function QuizScreen({ navigation, route }: any) {
  const [receivedRoom, setReceivedRoom] = useState<Room | undefined>(undefined);
  const [winnerPlayer, setwinnerPlayer] = useState<Player | undefined>(undefined);
  const [looserPlayer, setlooserPlayer] = useState<Player | undefined>(undefined);
  const [phraseGagnant, setPhraseGagnant] = useState("Bravo");
  const [phrasePerdant, setPhrasePerdant] = useState("T'es nul Izan");
  const [username, setUsername] = useState("");
  const { params } = route;
  const nomDuQuizz = params?.theme;
  const [data, setData] = useState(questions.naruto);
  const totalQuestions = data.length;
  const theme = Object.keys(questions);
  const themeMaj = theme.map((item) => item.charAt(0).toUpperCase() + item.slice(1));
  const [index, setIndex] = useState(0);
  const currentQuestion = data[index];
  const [score, setScore] = useState(0);
  const [quizzStatus, setQuizzStatus] = useState(true); // Commencer le quiz immédiatement
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number>(7);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [finQuizz, setFinQuizz] = useState(false);
  const screenwidth: number = Dimensions.get("window").width;
  const screenheight: number = Dimensions.get("window").height;
  const { db, isInitialized, currentUser } = useFirebase();

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
      }
    };

    fetchUsername();
  }, [isInitialized]);
  useEffect(() => {
    if (isPaused) return;

    if (countdown === 0 || countdown < 0) {
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

    return () => clearInterval(interval);
  }, [countdown, isPaused]);

  useEffect(() => {
    if (quizzStatus === true) {
      setIsPaused(false);
      setFinQuizz(false);
    }

    if ((quizzStatus === true && index >= data.length) || currentQuestion === undefined) {
      setIsPaused(true);
      setFinQuizz(true);
    }
  }, [currentQuestion, quizzStatus]);

  useEffect(() => {
    if (selectedAnswer === null || !currentQuestion) return;

    const goToNextQuestion = () => {
      setIndex((index) => index + 1);
      setCountdown(7);
      setSelectedAnswer(null);
    };

    if (selectedAnswer === currentQuestion.answerId) {
      setScore((score) => score + 10);
    } else {
      if (score >= 5) {
        setScore((score) => score - 5);
      } else {
        setScore(0);
      }
    }

    goToNextQuestion();

    return () => {};
  }, [selectedAnswer, currentQuestion]);

  useEffect(() => {
    const onNextQuestionREAL = () => {
      setIndex((index) => index + 1);
      setCountdown(7);
    };
    socket.on("nextQuestionREAL", onNextQuestionREAL);
    return () => {
      socket.off("nextQuestionREAL", onNextQuestionREAL);
    };
  }, [score]);

  useEffect(() => {
    const handleEndOfQuiz = async (room: Room) => {
      setReceivedRoom(() => {
        const winnerPlayer = room.players.find((player) => player.pseudo === room.winner);
        setwinnerPlayer(winnerPlayer);
        console.log("winner: " + room.winner);
        console.log("looser: " + room.looser);

        const looserPlayer = room.players.find((player) => player.pseudo === room.looser);
        setlooserPlayer(looserPlayer);

        return room;
      });
    };

    socket.on("endOfQuiz", handleEndOfQuiz);

    return () => {
      socket.off("endOfQuiz", handleEndOfQuiz);
    };
  }, []);

  const sendResponse = async (idReponse: number) => {
    const repsonseScore = await socket.emitWithAck("playerSendResponse", idReponse);
    setScore(repsonseScore);
    console.log("score: " + score);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: "center", backgroundColor: "#DBE9EE" }}>
        <View style={styles.container}>
          <Text style={styles.title}>{`Quiz multijoueur`}</Text>
          {finQuizz ? (
            <SafeAreaView style={{ backgroundColor: "#DBE9EE", height: screenheight }}>
              <View style={{ flex: 1, alignItems: "center", marginTop: "25%" }}>
                <View>
                  <View style={{ flex: 1, alignItems: "center", backgroundColor: "#DBE9EE" }}>
                    <Text style={styles.title}>
                      {looserPlayer?.score === winnerPlayer?.score
                        ? "Egalité"
                        : username === receivedRoom?.winner
                        ? "Félicitations ! Vous avez gagné le quiz."
                        : username === receivedRoom?.looser
                        ? "Dommage ! Vous avez perdu le quiz."
                        : "Le quiz est terminé."}
                    </Text>
                    <Image source={require("../../assets/img/trophee.png")} style={{ width: screenwidth * 0.5, aspectRatio: 1 / 1 }} />
                    <Text style={{ fontSize: 30, fontWeight: "bold", color: "#000000", marginTop: 50 }}>{receivedRoom?.winner}</Text>
                    <Text style={{ fontSize: 28, fontWeight: "bold", color: "#000000" }}>{`Score : ${winnerPlayer?.score}`}</Text>
                    <Text style={{ fontSize: 16, color: "#000000", marginTop: 40 }}>{receivedRoom?.looser}</Text>
                    <Text style={{ fontSize: 16, color: "#000000" }}>{`Score : ${looserPlayer?.score}`}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.finishButton}
                    onPress={() => {
                      setQuizzStatus(false);
                      setIndex(0);
                      setScore(0);
                      setCountdown(7);
                      setFinQuizz(false);
                      navigation.navigate("Home");
                    }}>
                    <Text style={styles.counter}>Revenir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </SafeAreaView>
          ) : (
            <>
              <Text style={styles.timer}>TIMER: {countdown}s</Text>
              <Text style={styles.counter}>{`Score : ${score}`}</Text>
              <View>
                <Text style={styles.question}>{index === data.length ? undefined : "(" + (index + 1) + "/" + totalQuestions + ") " + currentQuestion?.question}</Text>

                <View style={{ marginTop: 10 }}>
                  {currentQuestion?.choices.map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => sendResponse(item.id)} style={{ borderColor: "red", padding: 10 }}>
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
    marginTop: "25%",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000000",
  },
  startButton: {
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
  timer: {
    fontSize: 20,
    color: "#000000",
    marginTop: 20,
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
  finishButton: {
    width: "100%",
    borderRadius: 8,
    padding: 16,
    marginTop: 50,
    backgroundColor: "#4F6D7A",
    justifyContent: "center",
    alignItems: "center",
  },
});
