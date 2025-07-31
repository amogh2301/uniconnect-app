import { useEffect, useState } from "react";
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../context/AuthContext";

export const useRSVP = (eventId) => {
  const { user } = useAuth();
  const [isRSVPed, setIsRSVPed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rsvpData, setRsvpData] = useState(null);

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
      } catch (error) {
        console.error("Error checking RSVP:", error);
      } finally {
        setLoading(false);
      }
    };

    checkRSVP();
  }, [user, eventId]);

  const toggleRSVP = async () => {
    if (!user || !eventId) return;

    try {
      if (isRSVPed) {
        await deleteDoc(rsvpRef);
        setIsRSVPed(false);
        setRsvpData(null);
      } else {
        const rsvpData = {
          eventId,
          createdAt: new Date(),
          updatedAt: new Date(),
          status: 'confirmed'
        };
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
