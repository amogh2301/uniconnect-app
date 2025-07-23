import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.wrapper}>
      <Text>Home - Event Feed (coming soon)</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  wrapper: { flex: 1, alignItems: "center", justifyContent: "center" },
});
