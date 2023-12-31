import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import ConnexionScreen from "./src/screens/ConnexionScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import MenuScreen from "./src/screens/MenuScreen";
import InscriptionScreen from "./src/screens/InscriptionScreen";
import QuizGameScreen from "./src/screens/QuizGameScreen";
import ShopScreen from "./src/screens/ShopScreen";
import QuizScreen from "./src/screens/QuizScreen";
import SuppressionCompteScreen from "./src/screens/SuppressionCompteScreen";
import RechercheQuiz from "./src/screens/RechercheQuiz";
import QuizGameMultiScreen from "./src/screens/QuizGameMultiScreen";
import { QueryClient, QueryClientProvider } from "react-query";

const Stack = createStackNavigator();
const queryClient = new QueryClient()


const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name="Connexion" component={ConnexionScreen} options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="Menu" component={MenuScreen} options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="Inscription" component={InscriptionScreen} options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="QuizScreen" component={QuizScreen} options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="QuizGameScreen" component={QuizGameScreen} options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="Suppression" component={SuppressionCompteScreen} options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="RechercheQuiz" component={RechercheQuiz} options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="QuizGameMultiScreen" component={QuizGameMultiScreen} options={{ headerShown: false, gestureEnabled: false }} />
      </Stack.Navigator>
        </NavigationContainer>
    </QueryClientProvider>
  );
};

export default App;