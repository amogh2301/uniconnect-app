import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { format } from "date-fns";
import { useRSVP } from "../hooks/useRSVP";
import { useAuth } from "../context/AuthContext";
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { getCategoryIcon, getCategoryColor, getCategoryName } from "../utils/categories";

// Custom hook to fetch user profile
const useUserProfile = (userId) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  return { userProfile, loading };
};

export default function EventCard({ event, onEdit, onDelete, onChat }) {
  const { user } = useAuth();
  const { isRSVPed, toggleRSVP, loading } = useRSVP(event.id);
  const { userProfile: creatorProfile } = useUserProfile(event.createdBy);
  
  const eventDate = event.timestamp?.toDate
    ? event.timestamp.toDate()
    : new Date(event.timestamp);

  const isEventCreator = user?.uid === event.createdBy;

  const handleDelete = () => {
    Alert.alert(
      "Delete Event",
      `Are you sure you want to delete "${event.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "events", event.id));
              if (onDelete) onDelete(event.id);
            } catch (error) {
              console.error("Error deleting event:", error);
              Alert.alert("Error", "Failed to delete event.");
            }
          }
        }
      ]
    );
  };

  const handleEdit = () => {
    if (onEdit) onEdit(event);
  };

  const handleChat = () => {
    if (onChat) onChat(event);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{event.title}</Text>
            {event.category && (
              <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(event.category) }]}>
                <Text style={styles.categoryIcon}>{getCategoryIcon(event.category)}</Text>
                <Text style={styles.categoryText}>{getCategoryName(event.category)}</Text>
              </View>
            )}
          </View>
          <Text style={styles.creator}>
            by {creatorProfile?.name || 'Unknown User'}
          </Text>
        </View>
        {isEventCreator && (
          <View style={styles.actions}>
            <TouchableOpacity onPress={handleEdit} style={styles.actionButton}>
              <Text style={styles.actionText}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
              <Text style={styles.actionText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      <Text style={styles.meta}>
        📅 {format(eventDate, "MMMM d, yyyy • h:mm a")}
      </Text>
      <Text style={styles.meta}>📍 {event.location}</Text>
      {event.description && (
        <Text style={styles.description} numberOfLines={2}>
          {event.description}
        </Text>
      )}

      <View style={styles.bottomActions}>
        <TouchableOpacity onPress={() => toggleRSVP(event)} disabled={loading}>
          <Text style={[styles.rsvp, isRSVPed && styles.going]}>
            {loading ? "Loading..." : isRSVPed ? "✅ Going" : "RSVP"}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handleChat} style={styles.chatButton}>
          <Text style={styles.chatButtonText}>💬 Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  titleSection: {
    flex: 1,
    marginRight: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 60,
  },
  categoryIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  categoryText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  creator: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  actionText: {
    fontSize: 16,
  },
  meta: {
    marginTop: 4,
    marginBottom: 6,
    color: "#666",
    fontSize: 14,
  },
  description: {
    color: '#666',
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 18,
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  rsvp: {
    fontWeight: "600",
    color: "#3366FF",
  },
  going: {
    color: "green",
  },
  chatButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  chatButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
});
