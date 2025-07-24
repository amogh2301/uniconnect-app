import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { format } from "date-fns";
import { useRSVP } from "../hooks/useRSVP";

export default function EventCard({ event }) {
  const eventDate = event.timestamp?.toDate
    ? event.timestamp.toDate()
    : new Date(event.timestamp);

  const { isRSVPed, toggleRSVP, loading } = useRSVP(event.id);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.meta}>
        📅 {format(eventDate, "MMMM d, yyyy • h:mm a")}
      </Text>
      <Text style={styles.meta}>📍 {event.location}</Text>

      <TouchableOpacity onPress={toggleRSVP} disabled={loading}>
        <Text style={[styles.rsvp, isRSVPed && styles.going]}>
          {loading ? "Loading..." : isRSVPed ? "✅ Going" : "RSVP"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  meta: {
    marginTop: 4,
    marginBottom: 8,
    color: "#666",
  },
  rsvp: {
    marginTop: 10,
    fontWeight: "600",
    color: "#3366FF",
    textAlign: "right",
  },
  going: {
    color: "green",
  },
});
