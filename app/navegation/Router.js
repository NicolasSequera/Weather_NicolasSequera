import React from "react";
import { View, Image } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Home from "../screens/Home.js";
import * as theme from "../utils/Theme";
const HomeStack = createStackNavigator({
  Home: {
    screen: Home,
    navigationOptions: ({ navigation }) => ({
      title: "Inicio",
      headerBackTitle: null,
      headerTintColor: theme.colors.primary,
      headerShown: false,
    }),
  },
});

const MainTabs = createBottomTabNavigator({
  Inicio: {
    screen: HomeStack,
    navigationOptions: {
      tabBarLabel: "Inicio",
      tabBarIcon: ({ tintColor }) => (
        <MaterialCommunityIcons type="font-awesome" name="home" size={22} color={theme.colors.primary} />
      ),
    },
  },
});

const App = createSwitchNavigator(
  {
    MainTabs: MainTabs,
  },
  {
    initialRouteName: "MainTabs",
    tabBarOptions: {
      inactiveTintColor: theme.colors.gray,
      activeTintColor: theme.colors.primary,
    },
  }
);

export default createAppContainer(App);
