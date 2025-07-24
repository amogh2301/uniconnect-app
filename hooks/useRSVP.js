import { useEffect, useState } from "react";
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../context/AuthContext";

export const useRSVP = (eventId) => {
  const { user } = useAuth();
  const [isRSVPed, setIsRSVPed] = useState(false);
  const [loading, setLoading] = useState(true);

  const rsvpRef = doc(db, "users", user.uid, "rsvps", eventId);

  useEffect(() => {
    const checkRSVP = async () => {
      const snap = await getDoc(rsvpRef);
      setIsRSVPed(snap.exists());
      setLoading(false);
    };

    if (user && eventId) {
      checkRSVP();
    }
  }, [user, eventId]);

  const toggleRSVP = async () => {
    try {
      if (isRSVPed) {
        await deleteDoc(rsvpRef);
        setIsRSVPed(false);
      } else {
        await setDoc(rsvpRef, { createdAt: new Date() });
        setIsRSVPed(true);
      }
    } catch (err) {
      console.error("RSVP error:", err);
    }
  };

  return { isRSVPed, toggleRSVP, loading };
};
