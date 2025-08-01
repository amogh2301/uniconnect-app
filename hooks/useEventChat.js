import { useState, useEffect } from 'react';
import { collection, addDoc, orderBy, query, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

export const useEventChat = (eventId) => {
  const { user, userProfile } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!eventId || !user?.uid) {
      setLoading(false);
      return;
    }

    // Set up real-time listener for chat messages
    const messagesRef = collection(db, 'events', eventId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageList = [];
      snapshot.forEach((doc) => {
        messageList.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setMessages(messageList);
      setLoading(false);
    }, (error) => {
      console.error('Error listening to chat messages:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [eventId, user?.uid]);

  const sendMessage = async (text) => {
    if (!text.trim() || !user?.uid || !eventId) return;

    setSending(true);
    try {
      const messagesRef = collection(db, 'events', eventId, 'messages');
      const messageData = {
        text: text.trim(),
        userId: user.uid,
        userName: userProfile?.name || user.email?.split('@')[0] || 'Anonymous',
        timestamp: serverTimestamp(),
      };
      
      await addDoc(messagesRef, messageData);
      
      // Send notification to other users (this would require a cloud function for production)
      // For now, we'll just log it
      console.log('Message sent, notification would be sent to other users');
      
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    } finally {
      setSending(false);
    }
  };

  return { messages, loading, sending, sendMessage };
}; 