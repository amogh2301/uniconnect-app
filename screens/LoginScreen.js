import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, SafeAreaView, Dimensions, ActivityIndicator } from "react-native";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { isUBCStudentEmail } from "../utils/validators";
import { useAuth } from "../context/AuthContext";

const { width, height } = Dimensions.get('window');
const isSmallScreen = height < 700;

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // If user is already authenticated, they shouldn't see this screen
  // The navigation will handle redirecting them to the main app
  useEffect(() => {
    if (user) {
      // User is already logged in, navigation will handle redirect
      return;
    }
  }, [user]);

  const handleAuth = async () => {
    if (!isUBCStudentEmail(email)) {
      Alert.alert("Invalid Email", "Please use your @student.ubc.ca email address.");
      return;
    }
    if (pw.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters long.");
      return;
    }
    
    setLoading(true);
    try {
      if (mode === "signup") {
        await createUserWithEmailAndPassword(auth, email, pw);
        Alert.alert("Success", "Account created successfully! Welcome to UniConnect!");
      } else {
        await signInWithEmailAndPassword(auth, email, pw);
        Alert.alert("Welcome Back!", "Successfully logged in to UniConnect!");
      }
    } catch (err) {
      console.log(err);
      let errorMessage = "An error occurred. Please try again.";
      
      if (err.code === 'auth/user-not-found') {
        errorMessage = "No account found with this email. Please sign up first.";
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password. Please try again.";
      } else if (err.code === 'auth/email-already-in-use') {
        errorMessage = "An account with this email already exists. Please log in instead.";
      } else if (err.code === 'auth/weak-password') {
        errorMessage = "Password is too weak. Please choose a stronger password.";
      }
      
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>🎓</Text>
          <Text style={styles.title}>UniConnect</Text>
          <Text style={styles.subtitle}>Connect with UBC events</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>UBC Email</Text>
            <TextInput
              style={styles.input}
              placeholder="yourname@student.ubc.ca"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              secureTextEntry
              value={pw}
              onChangeText={setPw}
              editable={!loading}
            />
          </View>

          <TouchableOpacity 
            style={[styles.authButton, loading && styles.authButtonDisabled]} 
            onPress={handleAuth} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.authButtonText}>
                {mode === "signup" ? "Create Account" : "Sign In"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.toggleButton} 
            onPress={() => setMode(mode === "signup" ? "login" : "signup")}
            disabled={loading}
          >
            <Text style={styles.toggleText}>
              {mode === "signup" 
                ? "Already have an account? Sign In" 
                : "Don't have an account? Sign Up"
              }
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: isSmallScreen ? 20 : 24,
  },
  header: {
    alignItems: 'center',
    marginTop: isSmallScreen ? 40 : 60,
  },
  logo: {
    fontSize: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: isSmallScreen ? 28 : 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: isSmallScreen ? 14 : 16,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: isSmallScreen ? 14 : 16,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  authButton: {
    backgroundColor: '#3366FF',
    borderRadius: 12,
    padding: isSmallScreen ? 16 : 18,
    alignItems: 'center',
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  authButtonDisabled: {
    backgroundColor: '#ccc',
  },
  authButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  toggleText: {
    color: '#3366FF',
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    paddingBottom: isSmallScreen ? 20 : 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 16,
  },
});
