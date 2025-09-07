import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { db } from '../config/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import LocationPicker from '../components/LocationPicker';
import CategoryPicker from '../components/CategoryPicker';

const { width, height } = Dimensions.get('window');
const isSmallScreen = height < 700;

export default function CreateEventScreen({ navigation }) {
  const { user } = useAuth();
  const { theme } = useTheme();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [category, setCategory] = useState('other'); // Default category

  const handleLocationSelect = (locationData) => {
    setLatitude(locationData.latitude);
    setLongitude(locationData.longitude);
    setLocation(locationData.address || 'Selected location');
  };

  const handleCreateEvent = async () => {
    if (!title || !description || !location || !date) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    if (!latitude || !longitude) {
      Alert.alert("Error", "Please select a location using the map picker.");
      return;
    }

    setIsLoading(true);

    try {
      await addDoc(collection(db, 'events'), {
        title,
        description,
        location,
        latitude,
        longitude,
        category, // Add category to event data
        timestamp: Timestamp.fromDate(date),
        createdBy: user.uid,
      });

      Alert.alert("Success", "Event created!");
      navigation.goBack();
    } catch (error) {
      console.error("Error creating event:", error);
      Alert.alert("Error", "Could not create event.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={[styles.label, { color: theme.text }]}>Event Title</Text>
        <TextInput 
          style={[styles.input, { 
            backgroundColor: theme.inputBackground,
            borderColor: theme.inputBorder,
            color: theme.text
          }]} 
          value={title} 
          onChangeText={setTitle}
          placeholder="Enter event title"
          placeholderTextColor={theme.inputPlaceholder}
        />

        <Text style={[styles.label, { color: theme.text }]}>Category</Text>
        <CategoryPicker
          selectedCategory={category}
          onSelectCategory={setCategory}
          style={styles.categoryPicker}
        />

        <Text style={[styles.label, { color: theme.text }]}>Description</Text>
        <TextInput 
          style={[styles.input, { 
            height: 80,
            backgroundColor: theme.inputBackground,
            borderColor: theme.inputBorder,
            color: theme.text
          }]} 
          value={description} 
          onChangeText={setDescription} 
          multiline
          placeholder="Enter event description"
          placeholderTextColor={theme.inputPlaceholder}
        />

        <Text style={[styles.label, { color: theme.text }]}>Location</Text>
        <TouchableOpacity 
          style={[styles.locationButton, { 
            borderColor: theme.primary,
            backgroundColor: theme.primaryLight
          }]} 
          onPress={() => setShowLocationPicker(true)}
        >
          <Text style={[styles.locationButtonText, { color: theme.primary }]}>
            {location ? '📍 ' + location : '🗺️ Select Location on Map'}
          </Text>
        </TouchableOpacity>
        
        {latitude && longitude && (
          <Text style={[styles.coordinates, { color: theme.success }]}>
            ✅ Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </Text>
        )}

        <Text style={[styles.label, { color: theme.text }]}>Date & Time</Text>
        <Button 
          title={date.toLocaleString()} 
          onPress={() => setShowDatePicker(true)}
          color={theme.primary}
        />

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="datetime"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setDate(selectedDate);
              }
            }}
          />
        )}

        <TouchableOpacity 
          style={[styles.createButton, { 
            backgroundColor: isLoading ? theme.buttonDisabled : theme.buttonPrimary
          }, isLoading && styles.createButtonDisabled]} 
          onPress={handleCreateEvent}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={theme.background} size="small" />
          ) : (
            <Text style={[styles.createButtonText, { color: theme.background }]}>Create Event</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {showLocationPicker && (
        <LocationPicker
          onLocationSelect={handleLocationSelect}
          onClose={() => setShowLocationPicker(false)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 20,
    flex: 1,
  },
  label: {
    marginTop: 15,
    fontWeight: 'bold',
    fontSize: 16
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginTop: 5
  },
  categoryPicker: {
    marginTop: 10,
    marginBottom: 10,
  },
  locationButton: {
    borderWidth: 1,
    borderStyle: 'dashed',
    padding: 15,
    borderRadius: 8,
    marginTop: 5,
    alignItems: 'center',
  },
  locationButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  coordinates: {
    marginTop: 5,
    fontSize: 12,
    fontStyle: 'italic'
  },
  createButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  createButtonDisabled: {
    opacity: 0.7,
  },
});
