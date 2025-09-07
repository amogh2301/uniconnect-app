import React, { useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import RootNavigator from "./navigation";
import NotificationService from "./services/NotificationService";
import * as Notifications from 'expo-notifications';

export default function App() {
  useEffect(() => {
    // Initialize notifications when app starts
    NotificationService.initialize();
    
    // Handle notification responses
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      
      // Handle different notification types
      if (data.type === 'event_reminder') {
        console.log('User tapped event reminder for:', data.eventTitle);
        // Could navigate to event details here
      } else if (data.type === 'rsvp_notification') {
        console.log('User tapped RSVP notification for:', data.eventTitle);
        // Could navigate to event details here
      } else if (data.type === 'chat_notification') {
        console.log('User tapped chat notification for:', data.eventTitle);
        // Could navigate to chat here
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider>
        <RootNavigator />
      </ThemeProvider>
    </AuthProvider>
  );
}
