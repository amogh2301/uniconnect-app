import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ style }) => {
  const { theme, isDarkMode, toggleTheme } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.surface }, style]}
      onPress={toggleTheme}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={isDarkMode ? 'moon' : 'sunny'}
            size={24}
            color={theme.primary}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.text }]}>
            {isDarkMode ? 'Dark Mode' : 'Light Mode'}
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
          </Text>
        </View>
        <View style={styles.toggleContainer}>
          <View style={[styles.toggle, { backgroundColor: theme.border }]}>
            <View
              style={[
                styles.toggleThumb,
                {
                  backgroundColor: theme.primary,
                  transform: [{ translateX: isDarkMode ? 20 : 0 }],
                },
              ]}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
  },
  toggleContainer: {
    alignItems: 'center',
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default ThemeToggle; 