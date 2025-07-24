import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { format } from "date-fns";

export default function EventCard({ event }) {
  const eventDate = event.timestamp?.toDate
    ? event.timestamp.toDate()
    : new Date(event.timestamp);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.meta}>
        📅 {format(eventDate, "MMMM d, yyyy • h:mm a")}
      </Text>
      <Text style={styles.meta}>📍 {event.location}</Text>
      <Button title="RSVP" onPress={() => alert("RSVP coming soon")} />
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
});
