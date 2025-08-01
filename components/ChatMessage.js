import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { format } from 'date-fns';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;

export default function ChatMessage({ message, isOwnMessage }) {
  const messageTime = message.timestamp?.toDate 
    ? message.timestamp.toDate() 
    : new Date(message.timestamp);

  return (
    <View style={[styles.messageContainer, isOwnMessage && styles.ownMessageContainer]}>
      <View style={[styles.messageBubble, isOwnMessage && styles.ownMessageBubble]}>
        {!isOwnMessage && (
          <Text style={styles.userName}>{message.userName}</Text>
        )}
        <Text style={[styles.messageText, isOwnMessage && styles.ownMessageText]}>
          {message.text}
        </Text>
        <Text style={[styles.timestamp, isOwnMessage && styles.ownTimestamp]}>
          {format(messageTime, 'h:mm a')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 4,
    paddingHorizontal: 16,
    alignItems: 'flex-start',
  },
  ownMessageContainer: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    backgroundColor: '#f0f0f0',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxWidth: '80%',
    minWidth: 60,
  },
  ownMessageBubble: {
    backgroundColor: '#3366FF',
  },
  userName: {
    fontSize: isSmallScreen ? 11 : 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  messageText: {
    fontSize: isSmallScreen ? 14 : 16,
    color: '#333',
    lineHeight: 20,
  },
  ownMessageText: {
    color: '#fff',
  },
  timestamp: {
    fontSize: isSmallScreen ? 10 : 11,
    color: '#999',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  ownTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
}); 