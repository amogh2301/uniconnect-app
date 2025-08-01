import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  constructor() {
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Notification permissions not granted');
        return false;
      }

      // Configure for Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Error initializing notifications:', error);
      return false;
    }
  }

  async scheduleEventReminder(event) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const eventDate = event.timestamp?.toDate 
        ? event.timestamp.toDate() 
        : new Date(event.timestamp);
      
      // Schedule reminder 1 hour before event
      const reminderTime = new Date(eventDate.getTime() - 60 * 60 * 1000);
      
      // Don't schedule if the event is in the past or reminder time is in the past
      if (reminderTime <= new Date()) {
        console.log('Event reminder time is in the past, not scheduling');
        return null;
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `🚀 Event Reminder: ${event.title}`,
          body: `Your event starts in 1 hour at ${event.location}`,
          data: { 
            eventId: event.id,
            eventTitle: event.title,
            type: 'event_reminder'
          },
          sound: true,
        },
        trigger: {
          date: reminderTime,
        },
      });

      console.log(`Scheduled reminder for event: ${event.title} at ${reminderTime}`);
      return notificationId;
    } catch (error) {
      console.error('Error scheduling event reminder:', error);
      return null;
    }
  }

  async cancelEventReminder(notificationId) {
    try {
      if (notificationId) {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
        console.log('Cancelled event reminder');
      }
    } catch (error) {
      console.error('Error cancelling event reminder:', error);
    }
  }

  async scheduleRSVPNotification(event, userName) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `👋 New RSVP for ${event.title}`,
          body: `${userName} just RSVP'd to your event!`,
          data: { 
            eventId: event.id,
            eventTitle: event.title,
            type: 'rsvp_notification'
          },
          sound: true,
        },
        trigger: null, // Send immediately
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling RSVP notification:', error);
      return null;
    }
  }

  async scheduleChatNotification(event, message, userName) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `💬 New message in ${event.title}`,
          body: `${userName}: ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}`,
          data: { 
            eventId: event.id,
            eventTitle: event.title,
            type: 'chat_notification'
          },
          sound: true,
        },
        trigger: null, // Send immediately
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling chat notification:', error);
      return null;
    }
  }

  async getScheduledNotifications() {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('Cancelled all scheduled notifications');
    } catch (error) {
      console.error('Error cancelling all notifications:', error);
    }
  }
}

export default new NotificationService(); 