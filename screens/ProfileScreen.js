import React, { useState } from "react";
import { View, Text, Button, StyleSheet, SafeAreaView, Dimensions, TextInput, TouchableOpacity, Alert } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useRSVPCount } from "../hooks/useRSVPCount";

const { width, height } = Dimensions.get('window');
const isSmallScreen = height < 700;

export default function ProfileScreen() {
  const { user, userProfile, logout, updateUserProfile } = useAuth();
  const { rsvpCount } = useRSVPCount();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userProfile?.name || '');

  const handleSaveName = async () => {
    if (name.trim().length === 0) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    try {
      await updateUserProfile({ name: name.trim() });
      setIsEditing(false);
      Alert.alert('Success', 'Name updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update name');
    }
  };

  const handleCancelEdit = () => {
    setName(userProfile?.name || '');
    setIsEditing(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(userProfile?.name || 'U').charAt(0).toUpperCase()}
            </Text>
          </View>
          
          <View style={styles.nameSection}>
            {isEditing ? (
              <View style={styles.editContainer}>
                <TextInput
                  style={styles.nameInput}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                  autoFocus
                />
                <View style={styles.editButtons}>
                  <TouchableOpacity onPress={handleSaveName} style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleCancelEdit} style={styles.cancelButton}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.nameContainer}>
                <Text style={styles.userName}>{userProfile?.name || 'User'}</Text>
                <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editButton}>
                  <Text style={styles.editButtonText}>✏️ Edit</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Member Since</Text>
            <Text style={styles.infoValue}>
              {userProfile?.createdAt ? 
                new Date(userProfile.createdAt.toDate()).toLocaleDateString() : 
                'Recently'
              }
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Events RSVP'd</Text>
            <Text style={styles.infoValue}>{rsvpCount}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button 
            title="Log out" 
            onPress={logout}
            color="#dc3545"
          />
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
  },
  header: {
    padding: isSmallScreen ? 16 : 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: isSmallScreen ? 20 : 24,
    fontWeight: "bold",
    color: '#333',
  },
  profileSection: {
    backgroundColor: '#fff',
    padding: isSmallScreen ? 20 : 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatar: {
    width: isSmallScreen ? 80 : 100,
    height: isSmallScreen ? 80 : 100,
    borderRadius: isSmallScreen ? 40 : 50,
    backgroundColor: '#3366FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: isSmallScreen ? 32 : 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  nameSection: {
    alignItems: 'center',
    width: '100%',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userName: {
    fontSize: isSmallScreen ? 20 : 24,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    padding: 8,
  },
  editButtonText: {
    fontSize: 14,
    color: '#3366FF',
  },
  editContainer: {
    width: '100%',
    alignItems: 'center',
  },
  nameInput: {
    borderWidth: 1,
    borderColor: '#3366FF',
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    width: '100%',
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  editButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  saveButton: {
    backgroundColor: '#3366FF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  infoSection: {
    backgroundColor: '#fff',
    marginTop: 16,
    padding: isSmallScreen ? 20 : 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    margin: isSmallScreen ? 20 : 24,
    marginTop: 'auto',
  },
});
