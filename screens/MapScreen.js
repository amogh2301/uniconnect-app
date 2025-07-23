import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function MapScreen() {
  return (
    <View style={styles.wrapper}>
      <Text>Map screen placeholder</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  wrapper: { flex: 1, alignItems: "center", justifyContent: "center" },
});
