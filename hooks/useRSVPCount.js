import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

export const useRSVPCount = () => {
  const { user } = useAuth();
  const [rsvpCount, setRsvpCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setRsvpCount(0);
      setLoading(false);
      return;
    }

    // Set up real-time listener for RSVP count
    const rsvpsRef = collection(db, 'users', user.uid, 'rsvps');
    
    const unsubscribe = onSnapshot(rsvpsRef, (snapshot) => {
      setRsvpCount(snapshot.size);
      setLoading(false);
    }, (error) => {
      console.error('Error listening to RSVP count:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  return { rsvpCount, loading };
}; 