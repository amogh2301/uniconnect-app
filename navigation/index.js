import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from '@expo/vector-icons';
import { Dimensions, Platform, View, Text, ActivityIndicator, StyleSheet } from 'react-native';

import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import MapScreen from "../screens/MapScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CreateEventScreen from "../screens/CreateEventScreen";
import EditEventScreen from "../screens/EditEventScreen";
import EventChatScreen from "../screens/EventChatScreen";
import OTPVerificationScreen from "../screens/OTPVerificationScreen";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Get screen dimensions
const { width, height } = Dimensions.get('window');
const isSmallScreen = height < 700;
const isLargeScreen = height > 800;

function LoadingScreen() {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
      <Text style={styles.loadingLogo}>🎓</Text>
      <Text style={[styles.loadingTitle, { color: theme.text }]}>UniConnect</Text>
      <ActivityIndicator size="large" color={theme.primary} style={styles.loadingSpinner} />
      <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading...</Text>
    </View>
  );
}

function AppTabs() {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopWidth: 1,
          borderTopColor: theme.tabBarBorder,
          paddingBottom: Platform.OS === 'ios' ? (isSmallScreen ? 5 : 10) : 5,
          paddingTop: Platform.OS === 'ios' ? (isSmallScreen ? 5 : 10) : 5,
          height: Platform.OS === 'ios' ? (isSmallScreen ? 70 : 85) : 60,
          paddingHorizontal: 10,
        },
        tabBarLabelStyle: {
          fontSize: isSmallScreen ? 10 : 12,
          fontWeight: '500',
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { user, loading } = useAuth();
  const { isLoading: themeLoading } = useTheme();

  if (loading || themeLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {user ? (
        <Stack.Navigator>
          <Stack.Screen
            name="MainTabs"
            component={AppTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CreateEvent"
            component={CreateEventScreen}
            options={{ title: "Create Event" }}
          />
          <Stack.Screen
            name="EditEvent"
            component={EditEventScreen}
            options={{ title: "Edit Event" }}
          />
          <Stack.Screen
            name="EventChat"
            component={EventChatScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="OTPVerification"
            component={OTPVerificationScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingLogo: {
    fontSize: 60,
    marginBottom: 16,
  },
  loadingTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  loadingSpinner: {
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
  },
});
