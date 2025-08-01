import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions, SafeAreaView } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useEvents } from "../hooks/useEvents";
import { useAuth } from "../context/AuthContext";
import { useRSVPCount } from "../hooks/useRSVPCount";
import EventCard from "../components/EventCard";
import CategoryFilter from "../components/CategoryFilter";

const { width, height } = Dimensions.get('window');
const isSmallScreen = height < 700;

export default function HomeScreen() {
  const navigation = useNavigation();
  const { events, loading, refetch } = useEvents();
  const { userProfile } = useAuth();
  const { rsvpCount } = useRSVPCount();
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Refresh events when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );

  const handleEditEvent = (event) => {
    navigation.navigate('EditEvent', { event });
  };

  const handleDeleteEvent = (eventId) => {
    // Event is already deleted from Firebase in EventCard
    // Just refresh the list to reflect the change
    refetch();
  };

  const handleChatEvent = (event) => {
    navigation.navigate('EventChat', { event });
  };

  const getUserGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Filter events by selected category
  const filteredEvents = selectedCategory 
    ? events.filter(event => event.category === selectedCategory)
    : events;

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#3366FF" />
        </View>
      </SafeAreaView>
    );
  }

  if (events.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>{getUserGreeting()}</Text>
              <Text style={styles.userName}>{userProfile?.name || 'User'}</Text>
              <Text style={styles.rsvpCount}>🎯 {rsvpCount} events RSVP'd</Text>
            </View>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(userProfile?.name || 'U').charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>
          
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No events yet 😔</Text>
            <Text style={styles.emptySubtitle}>Be the first to create an event!</Text>
          </View>
          
          <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreateEvent')}>
            <Text style={styles.fabText}>+</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>{getUserGreeting()}</Text>
            <Text style={styles.userName}>{userProfile?.name || 'User'}</Text>
            <Text style={styles.rsvpCount}>🎯 {rsvpCount} events RSVP'd</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(userProfile?.name || 'U').charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>

        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {filteredEvents.length === 0 && selectedCategory && (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsTitle}>No events in this category</Text>
            <Text style={styles.noResultsSubtitle}>
              Try selecting a different category or create a new event!
            </Text>
          </View>
        )}

        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <EventCard 
              event={item} 
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
              onChat={handleChatEvent}
            />
          )}
          refreshing={loading}
          onRefresh={refetch}
          showsVerticalScrollIndicator={false}
        />
        
        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreateEvent')}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: isSmallScreen ? 16 : 20,
    paddingVertical: isSmallScreen ? 16 : 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: isSmallScreen ? 14 : 16,
    color: '#666',
    marginBottom: 4,
  },
  userName: {
    fontSize: isSmallScreen ? 20 : 24,
    fontWeight: 'bold',
    color: '#333',
  },
  rsvpCount: {
    fontSize: isSmallScreen ? 14 : 16,
    color: '#666',
    marginTop: 4,
  },
  avatar: {
    width: isSmallScreen ? 40 : 48,
    height: isSmallScreen ? 40 : 48,
    borderRadius: isSmallScreen ? 20 : 24,
    backgroundColor: '#3366FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  list: {
    padding: isSmallScreen ? 12 : 16,
    paddingBottom: 100, // Extra space for FAB
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: isSmallScreen ? 14 : 16,
    color: '#666',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: isSmallScreen ? 80 : 90,
    right: isSmallScreen ? 16 : 20,
    width: isSmallScreen ? 50 : 56,
    height: isSmallScreen ? 50 : 56,
    borderRadius: isSmallScreen ? 25 : 28,
    backgroundColor: '#3366FF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabText: {
    fontSize: isSmallScreen ? 20 : 24,
    color: 'white',
    fontWeight: 'bold',
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  noResultsTitle: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  noResultsSubtitle: {
    fontSize: isSmallScreen ? 14 : 16,
    color: '#666',
    textAlign: 'center',
  },
});
