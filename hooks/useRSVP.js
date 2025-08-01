import { useEffect, useState } from "react";
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../context/AuthContext";
import NotificationService from "../services/NotificationService";

export const useRSVP = (eventId) => {
  const { user, userProfile } = useAuth();
  const [isRSVPed, setIsRSVPed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rsvpData, setRsvpData] = useState(null);
  const [notificationId, setNotificationId] = useState(null);

  const rsvpRef = doc(db, "users", user.uid, "rsvps", eventId);

  useEffect(() => {
    const checkRSVP = async () => {
      if (!user || !eventId) {
        setLoading(false);
        return;
      }

      try {
        const snap = await getDoc(rsvpRef);
        setIsRSVPed(snap.exists());
        setRsvpData(snap.exists() ? snap.data() : null);
        
        // Get notification ID if it exists
        if (snap.exists() && snap.data().notificationId) {
          setNotificationId(snap.data().notificationId);
        }
      } catch (error) {
        console.error("Error checking RSVP:", error);
      } finally {
        setLoading(false);
      }
    };

    checkRSVP();
  }, [user, eventId]);

  const toggleRSVP = async (eventData = null) => {
    if (!user || !eventId) return;

    try {
      if (isRSVPed) {
        // Cancel RSVP
        await deleteDoc(rsvpRef);
        setIsRSVPed(false);
        setRsvpData(null);
        
        // Cancel the scheduled reminder
        if (notificationId) {
          await NotificationService.cancelEventReminder(notificationId);
          setNotificationId(null);
        }
      } else {
        // Add RSVP
        const rsvpData = {
          eventId,
          createdAt: new Date(),
          updatedAt: new Date(),
          status: 'confirmed'
        };
        
        // Schedule event reminder if we have event data
        if (eventData) {
          const newNotificationId = await NotificationService.scheduleEventReminder(eventData);
          
          if (newNotificationId) {
            rsvpData.notificationId = newNotificationId;
            setNotificationId(newNotificationId);
          }
          
          // Notify event creator (if not the same user)
          if (eventData.createdBy && eventData.createdBy !== user.uid) {
            await NotificationService.scheduleRSVPNotification(
              eventData, 
              userProfile?.name || user.email?.split('@')[0] || 'Someone'
            );
          }
        }
        
        await setDoc(rsvpRef, rsvpData);
        setIsRSVPed(true);
        setRsvpData(rsvpData);
      }
    } catch (err) {
      console.error("RSVP error:", err);
      throw err;
    }
  };

  return { isRSVPed, toggleRSVP, loading, rsvpData };
};
