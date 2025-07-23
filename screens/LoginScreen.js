import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { isUBCStudentEmail } from "../utils/validators";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!isUBCStudentEmail(email)) {
      Alert.alert("Invalid Email", "Please use your @student.ubc.ca email.");
      return;
    }
    if (pw.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        await createUserWithEmailAndPassword(auth, email, pw);
      } else {
        await signInWithEmailAndPassword(auth, email, pw);
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>UniConnect</Text>
      <TextInput
        style={styles.input}
        placeholder="UBC Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={pw}
        onChangeText={setPw}
      />
      <Button title={loading ? "Please wait..." : mode === "signup" ? "Sign Up" : "Login"} onPress={handleAuth} disabled={loading} />
      <Text style={styles.toggleText} onPress={() => setMode(mode === "signup" ? "login" : "signup")}>
        {mode === "signup" ? "Already have an account? Log in" : "Create an account"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 32, fontWeight: "bold", textAlign: "center", marginBottom: 32 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 12, marginBottom: 12, borderRadius: 8 },
  toggleText: { marginTop: 16, textAlign: "center", color: "blue" },
});
