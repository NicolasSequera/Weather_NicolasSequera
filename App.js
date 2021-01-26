import React from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import AppContainer from "./app/navegation/Router";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <AppContainer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",
  },
});
