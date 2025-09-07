import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Theme colors configuration
export const lightTheme = {
  // Background colors
  background: '#FFFFFF',
  surface: '#F8F9FA',
  card: '#FFFFFF',
  
  // Text colors
  text: '#1A1A1A',
  textSecondary: '#666666',
  textTertiary: '#999999',
  
  // Primary colors
  primary: '#3366FF',
  primaryLight: '#E8F0FF',
  primaryDark: '#2952CC',
  
  // Secondary colors
  secondary: '#6C757D',
  secondaryLight: '#F8F9FA',
  
  // Status colors
  success: '#28A745',
  warning: '#FFC107',
  error: '#DC3545',
  info: '#17A2B8',
  
  // Border colors
  border: '#E0E0E0',
  borderLight: '#F0F0F0',
  
  // Shadow colors
  shadow: 'rgba(0, 0, 0, 0.1)',
  
  // Tab bar colors
  tabBar: '#FFFFFF',
  tabBarBorder: '#E0E0E0',
  
  // Input colors
  inputBackground: '#FFFFFF',
  inputBorder: '#CCCCCC',
  inputPlaceholder: '#999999',
  
  // Button colors
  buttonPrimary: '#3366FF',
  buttonSecondary: '#6C757D',
  buttonDisabled: '#CCCCCC',
  
  // Modal colors
  modalBackground: 'rgba(0, 0, 0, 0.5)',
  modalSurface: '#FFFFFF',
};

export const darkTheme = {
  // Background colors
  background: '#121212',
  surface: '#1E1E1E',
  card: '#2D2D2D',
  
  // Text colors
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textTertiary: '#808080',
  
  // Primary colors
  primary: '#4D7CFF',
  primaryLight: '#1A2332',
  primaryDark: '#3D5ACC',
  
  // Secondary colors
  secondary: '#9CA3AF',
  secondaryLight: '#2D2D2D',
  
  // Status colors
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#60A5FA',
  
  // Border colors
  border: '#404040',
  borderLight: '#2D2D2D',
  
  // Shadow colors
  shadow: 'rgba(0, 0, 0, 0.3)',
  
  // Tab bar colors
  tabBar: '#1E1E1E',
  tabBarBorder: '#404040',
  
  // Input colors
  inputBackground: '#2D2D2D',
  inputBorder: '#404040',
  inputPlaceholder: '#808080',
  
  // Button colors
  buttonPrimary: '#4D7CFF',
  buttonSecondary: '#9CA3AF',
  buttonDisabled: '#404040',
  
  // Modal colors
  modalBackground: 'rgba(0, 0, 0, 0.7)',
  modalSurface: '#2D2D2D',
};

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved theme preference
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      } else {
        // Default to light mode if no preference is saved
        setIsDarkMode(false);
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
      setIsDarkMode(false);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  const value = {
    theme,
    isDarkMode,
    toggleTheme,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 