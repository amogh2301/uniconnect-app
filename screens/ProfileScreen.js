import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.wrapper}>
      <Text>Logged in as: {user?.email}</Text>
      <Button title="Log out" onPress={logout} />
    </View>
  );
}
const styles = StyleSheet.create({
  wrapper: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16 },
});
