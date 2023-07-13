import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Home from "../screens/Home";
import { Ionicons } from "@expo/vector-icons";
import Favorites from "../screens/Favorites";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "ios-home" : "ios-home-outline";
          } else if (route.name === "Favorites") {
            iconName = focused ? "heart-sharp" : "heart-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home">{(props) => <Home {...props} />}</Tab.Screen>
      <Tab.Screen name="Favorites">
        {(props) => <Favorites {...props} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default TabNavigator;

const styles = StyleSheet.create({});
