import React from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView } from "react-native";
import MapView, { Marker, Callout, CalloutSubview } from "react-native-maps";
import { useEvents } from "../hooks/useEvents";
import { useRSVP } from "../hooks/useRSVP";
import { useFocusEffect } from "@react-navigation/native";
import { format } from "date-fns";

const { width, height } = Dimensions.get("window");
const isSmallScreen = height < 700;

export default function MapScreen() {
  const { events, loading, refetch } = useEvents();

  // Refresh events when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );

  // UBC Campus coordinates as initial region
  const initialRegion = {
    latitude: 49.2606,
    longitude: -123.2460,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <MapView 
          style={styles.map} 
          initialRegion={initialRegion}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {events.map((event) => (
            <Marker
              key={event.id}
              coordinate={{
                latitude: event.latitude || 49.2606,
                longitude: event.longitude || -123.2460,
              }}
              pinColor="#3366FF"
            >
              <Callout tooltip>
                <View style={styles.calloutContainer}>
                  <EventPopup event={event} />
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      </View>
    </SafeAreaView>
  );
}

function EventPopup({ event }) {
  const { isRSVPed, toggleRSVP, loading } = useRSVP(event.id);
  const eventDate = event.timestamp?.toDate ? event.timestamp.toDate() : new Date(event.timestamp);

  return (
    <View style={styles.popupContainer}>
      <Text style={styles.eventTitle}>{event.title}</Text>
      
      <Text style={styles.eventTime}>
        📅 {format(eventDate, "MMM d, yyyy • h:mm a")}
      </Text>
      
      <Text style={styles.eventLocation}>
        📍 {event.location}
      </Text>
      
      {event.description && (
        <Text style={styles.eventDescription} numberOfLines={2}>
          {event.description}
        </Text>
      )}

      {/* Spacer */}
      <View style={{ height: 12 }} />
      
      {/* RSVP Button */}
      <CalloutSubview onPress={toggleRSVP}>
        <View style={styles.rsvpButton}>
          <Text style={[styles.rsvpText, isRSVPed && styles.rsvpTextGoing]}>
            {loading ? "..." : isRSVPed ? "✅ Going" : "RSVP"}
          </Text>
        </View>
      </CalloutSubview>
    </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    fontSize: isSmallScreen ? 14 : 16,
    color: "#666",
  },
  map: {
    width: width,
    height: height - (isSmallScreen ? 70 : 85), // Adjust for tab bar height
  },
  calloutContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 0,
    minWidth: isSmallScreen ? 220 : 250,
    maxWidth: isSmallScreen ? 280 : 300,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  popupContainer: {
    padding: isSmallScreen ? 12 : 16,
    alignItems: "center",
  },
  eventTitle: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  eventTime: {
    fontSize: isSmallScreen ? 12 : 14,
    color: "#666",
    marginBottom: 4,
    textAlign: "center",
  },
  eventLocation: {
    fontSize: isSmallScreen ? 12 : 14,
    color: "#666",
    marginBottom: 8,
    textAlign: "center",
  },
  eventDescription: {
    fontSize: isSmallScreen ? 11 : 13,
    color: "#888",
    textAlign: "center",
    lineHeight: isSmallScreen ? 16 : 18,
  },
  rsvpButton: {
    backgroundColor: "#3366FF",
    paddingVertical: isSmallScreen ? 8 : 10,
    paddingHorizontal: isSmallScreen ? 20 : 24,
    borderRadius: 20,
    minWidth: isSmallScreen ? 80 : 100,
    alignItems: "center",
    justifyContent: "center",
  },
  rsvpText: {
    color: "white",
    fontWeight: "600",
    fontSize: isSmallScreen ? 12 : 14,
  },
  rsvpTextGoing: {
    color: "white",
  },
});
