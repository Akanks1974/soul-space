import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  Timestamp 
} from 'firebase/firestore';
import { db, auth } from './firebase';
import type { Emotion, JournalEntry, ReflectionEntry } from '../App';

// Get current user ID from Firebase Auth
const getUserId = () => {
  const user = auth.currentUser;
  if (user) {
    return user.uid;
  }
  
  // Fallback to localStorage user ID for offline functionality
  let userId = localStorage.getItem('soulful-space-user-id');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('soulful-space-user-id', userId);
  }
  return userId;
};

// Helper function to check if error is due to missing index
const isIndexError = (error: any): boolean => {
  return error?.code === 'failed-precondition' && 
         error?.message?.includes('query requires an index');
};

// Emotions
export const saveEmotionToFirestore = async (emotion: Emotion) => {
  try {
    const userId = getUserId();
    const emotionData = {
      ...emotion,
      userId,
      timestamp: Timestamp.fromDate(emotion.timestamp),
      createdAt: Timestamp.now()
    };
    
    await addDoc(collection(db, 'emotions'), emotionData);
    console.log('Emotion saved to Firestore');
  } catch (error) {
    console.error('Error saving emotion to Firestore:', error);
    throw error;
  }
};

export const getEmotionsFromFirestore = async (): Promise<Emotion[]> => {
  try {
    const userId = getUserId();
    const q = query(
      collection(db, 'emotions'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const emotions: Emotion[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      emotions.push({
        id: data.id,
        name: data.name,
        intensity: data.intensity,
        color: data.color,
        timestamp: data.timestamp.toDate()
      });
    });
    
    return emotions;
  } catch (error) {
    if (isIndexError(error)) {
      console.warn('Firestore index not ready for emotions. Please create the required indexes in Firebase Console.');
      return [];
    }
    console.error('Error getting emotions from Firestore:', error);
    return [];
  }
};

// Journal Entries
export const saveJournalEntryToFirestore = async (entry: JournalEntry) => {
  try {
    const userId = getUserId();
    const entryData = {
      ...entry,
      userId,
      timestamp: Timestamp.fromDate(entry.timestamp),
      emotion: {
        ...entry.emotion,
        timestamp: Timestamp.fromDate(entry.emotion.timestamp)
      },
      createdAt: Timestamp.now()
    };
    
    await addDoc(collection(db, 'journalEntries'), entryData);
    console.log('Journal entry saved to Firestore');
  } catch (error) {
    console.error('Error saving journal entry to Firestore:', error);
    throw error;
  }
};

export const getJournalEntriesFromFirestore = async (): Promise<JournalEntry[]> => {
  try {
    const userId = getUserId();
    const q = query(
      collection(db, 'journalEntries'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const entries: JournalEntry[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      entries.push({
        id: data.id,
        content: data.content,
        emotion: {
          id: data.emotion.id,
          name: data.emotion.name,
          intensity: data.emotion.intensity,
          color: data.emotion.color,
          timestamp: data.emotion.timestamp.toDate()
        },
        timestamp: data.timestamp.toDate()
      });
    });
    
    return entries;
  } catch (error) {
    if (isIndexError(error)) {
      console.warn('Firestore index not ready for journal entries. Please create the required indexes in Firebase Console.');
      return [];
    }
    console.error('Error getting journal entries from Firestore:', error);
    return [];
  }
};

// Reflection Entries
export const saveReflectionToFirestore = async (reflection: ReflectionEntry) => {
  try {
    const userId = getUserId();
    const reflectionData = {
      ...reflection,
      userId,
      timestamp: Timestamp.fromDate(reflection.timestamp),
      createdAt: Timestamp.now()
    };
    
    await addDoc(collection(db, 'reflections'), reflectionData);
    console.log('Reflection saved to Firestore');
  } catch (error) {
    console.error('Error saving reflection to Firestore:', error);
    throw error;
  }
};

export const getReflectionsFromFirestore = async (): Promise<ReflectionEntry[]> => {
  try {
    const userId = getUserId();
    const q = query(
      collection(db, 'reflections'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const reflections: ReflectionEntry[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      reflections.push({
        id: data.id,
        date: data.date,
        gratitude: data.gratitude,
        challenge: data.challenge,
        growth: data.growth,
        tomorrow: data.tomorrow,
        mood: data.mood,
        timestamp: data.timestamp.toDate()
      });
    });
    
    return reflections;
  } catch (error) {
    if (isIndexError(error)) {
      console.warn('Firestore index not ready for reflections. Please create the required indexes in Firebase Console.');
      return [];
    }
    console.error('Error getting reflections from Firestore:', error);
    return [];
  }
};

// Real-time listeners with better error handling
export const subscribeToEmotions = (callback: (emotions: Emotion[]) => void) => {
  const userId = getUserId();
  const q = query(
    collection(db, 'emotions'),
    where('userId', '==', userId),
    orderBy('timestamp', 'desc')
  );
  
  return onSnapshot(q, 
    (querySnapshot) => {
      const emotions: Emotion[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        emotions.push({
          id: data.id,
          name: data.name,
          intensity: data.intensity,
          color: data.color,
          timestamp: data.timestamp.toDate()
        });
      });
      callback(emotions);
    },
    (error) => {
      if (isIndexError(error)) {
        console.warn('Firestore index not ready for emotions subscription. Please create the required indexes in Firebase Console.');
        callback([]); // Return empty array to prevent app crash
      } else {
        console.error('Error in emotions subscription:', error);
      }
    }
  );
};

export const subscribeToJournalEntries = (callback: (entries: JournalEntry[]) => void) => {
  const userId = getUserId();
  const q = query(
    collection(db, 'journalEntries'),
    where('userId', '==', userId),
    orderBy('timestamp', 'desc')
  );
  
  return onSnapshot(q, 
    (querySnapshot) => {
      const entries: JournalEntry[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        entries.push({
          id: data.id,
          content: data.content,
          emotion: {
            id: data.emotion.id,
            name: data.emotion.name,
            intensity: data.emotion.intensity,
            color: data.emotion.color,
            timestamp: data.emotion.timestamp.toDate()
          },
          timestamp: data.timestamp.toDate()
        });
      });
      callback(entries);
    },
    (error) => {
      if (isIndexError(error)) {
        console.warn('Firestore index not ready for journal entries subscription. Please create the required indexes in Firebase Console.');
        callback([]); // Return empty array to prevent app crash
      } else {
        console.error('Error in journal entries subscription:', error);
      }
    }
  );
};

export const subscribeToReflections = (callback: (reflections: ReflectionEntry[]) => void) => {
  const userId = getUserId();
  const q = query(
    collection(db, 'reflections'),
    where('userId', '==', userId),
    orderBy('timestamp', 'desc')
  );
  
  return onSnapshot(q, 
    (querySnapshot) => {
      const reflections: ReflectionEntry[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        reflections.push({
          id: data.id,
          date: data.date,
          gratitude: data.gratitude,
          challenge: data.challenge,
          growth: data.growth,
          tomorrow: data.tomorrow,
          mood: data.mood,
          timestamp: data.timestamp.toDate()
        });
      });
      callback(reflections);
    },
    (error) => {
      if (isIndexError(error)) {
        console.warn('Firestore index not ready for reflections subscription. Please create the required indexes in Firebase Console.');
        callback([]); // Return empty array to prevent app crash
      } else {
        console.error('Error in reflections subscription:', error);
      }
    }
  );
};