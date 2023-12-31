import * as React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import HomeScreen from "./HomeScreen";
import BoutiqueScreen from "./ShopScreen";
import OuvertureScreen from "./UnboxingScreen";
import AmisScreen from "./SocialScreen";
import ProfilScreen from "./ProfileScreen";

const Tab = createBottomTabNavigator();

/* VRAI APP A CONSERVER */
export default function MenuScreen() {
  return (
    <Tab.Navigator initialRouteName="Feed" screenOptions={{ tabBarActiveTintColor: "#4A6FA5" }}>
      <Tab.Screen
        name="Shop"
        component={BoutiqueScreen}
        options={{
          tabBarLabel: "Shop",
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="shopping" color={color} size={size} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Unboxing"
        component={OuvertureScreen}
        options={{
          tabBarLabel: "Unboxing",
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="treasure-chest" color={color} size={size} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="home" color={color} size={size} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Social"
        component={AmisScreen}
        options={{
          tabBarLabel: "Social",
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account-multiple-plus" color={color} size={size} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfilScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account" color={color} size={size} />,
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
