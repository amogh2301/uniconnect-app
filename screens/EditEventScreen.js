import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { db } from '../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import LocationPicker from '../components/LocationPicker';
import CategoryPicker from '../components/CategoryPicker';

const { width, height } = Dimensions.get('window');
const isSmallScreen = height < 700;

export default function EditEventScreen({ route, navigation }) {
  const { event } = route.params;
  const { user } = useAuth();

  const [title, setTitle] = useState(event.title || '');
  const [description, setDescription] = useState(event.description || '');
  const [location, setLocation] = useState(event.location || '');
  const [latitude, setLatitude] = useState(event.latitude || null);
  const [longitude, setLongitude] = useState(event.longitude || null);
  const [date, setDate] = useState(event.timestamp?.toDate ? event.timestamp.toDate() : new Date(event.timestamp));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [category, setCategory] = useState(event.category || 'other');

  // Check if user is the event creator
  if (user?.uid !== event.createdBy) {
    Alert.alert("Access Denied", "You can only edit events you created.");
    navigation.goBack();
    return null;
  }

  const handleLocationSelect = (locationData) => {
    setLatitude(locationData.latitude);
    setLongitude(locationData.longitude);
    setLocation(locationData.address || 'Selected location');
  };

  const handleUpdateEvent = async () => {
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
      const eventRef = doc(db, 'events', event.id);
      await updateDoc(eventRef, {
        title,
        description,
        location,
        latitude,
        longitude,
        category, // Add category to update
        timestamp: date,
      });

      Alert.alert("Success", "Event updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating event:", error);
      Alert.alert("Error", "Could not update event.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Event Title</Text>
        <TextInput 
          style={styles.input} 
          value={title} 
          onChangeText={setTitle}
          placeholder="Enter event title"
        />

        <Text style={styles.label}>Category</Text>
        <CategoryPicker
          selectedCategory={category}
          onSelectCategory={setCategory}
          style={styles.categoryPicker}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput 
          style={[styles.input, { height: 80 }]} 
          value={description} 
          onChangeText={setDescription} 
          multiline
          placeholder="Enter event description"
        />

        <Text style={styles.label}>Location</Text>
        <TouchableOpacity 
          style={styles.locationButton} 
          onPress={() => setShowLocationPicker(true)}
        >
          <Text style={styles.locationButtonText}>
            {location ? '📍 ' + location : '🗺️ Select Location on Map'}
          </Text>
        </TouchableOpacity>
        
        {latitude && longitude && (
          <Text style={styles.coordinates}>
            ✅ Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </Text>
        )}

        <Text style={styles.label}>Date & Time</Text>
        <Button title={date.toLocaleString()} onPress={() => setShowDatePicker(true)} />

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
          style={[styles.updateButton, isLoading && styles.updateButtonDisabled]} 
          onPress={handleUpdateEvent}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.updateButtonText}>Update Event</Text>
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
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    marginTop: 15,
    fontWeight: 'bold',
    fontSize: 16
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginTop: 5
  },
  locationButton: {
    borderWidth: 1,
    borderColor: '#3366FF',
    borderStyle: 'dashed',
    padding: 15,
    borderRadius: 8,
    marginTop: 5,
    backgroundColor: '#f8f9ff',
    alignItems: 'center',
  },
  locationButtonText: {
    fontSize: 16,
    color: '#3366FF',
    fontWeight: '500',
  },
  coordinates: {
    marginTop: 5,
    fontSize: 12,
    color: '#28a745',
    fontStyle: 'italic'
  },
  buttonContainer: {
    marginTop: 20,
  },
  categoryPicker: {
    marginTop: 10,
    marginBottom: 10,
  },
  updateButton: {
    backgroundColor: '#3366FF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  updateButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.7,
  },
}); 