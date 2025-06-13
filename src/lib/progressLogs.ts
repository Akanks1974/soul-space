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

export interface ProgressLog {
  id: string;
  userId: string;
  emotion: string;
  intensity: number;
  timestamp: Date;
  note?: string;
  type: 'emotion' | 'journal' | 'reflection';
  metadata?: {
    journalContent?: string;
    reflectionData?: {
      gratitude?: string;
      challenge?: string;
      growth?: string;
      tomorrow?: string;
      mood?: number;
    };
  };
}

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

// Save progress log to Firestore
export const saveProgressLogToFirestore = async (progressLog: Omit<ProgressLog, 'id' | 'userId'>) => {
  try {
    const userId = getUserId();
    const logData = {
      ...progressLog,
      userId,
      timestamp: Timestamp.fromDate(progressLog.timestamp),
      createdAt: Timestamp.now()
    };
    
    // Save to user's subcollection
    const userProgressRef = collection(db, 'users', userId, 'progressLogs');
    const docRef = await addDoc(userProgressRef, logData);
    
    console.log('Progress log saved to Firestore with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving progress log to Firestore:', error);
    throw error;
  }
};

// Get progress logs from Firestore
export const getProgressLogsFromFirestore = async (): Promise<ProgressLog[]> => {
  try {
    const userId = getUserId();
    const userProgressRef = collection(db, 'users', userId, 'progressLogs');
    const q = query(userProgressRef, orderBy('timestamp', 'desc'));
    
    const querySnapshot = await getDocs(q);
    const progressLogs: ProgressLog[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      progressLogs.push({
        id: doc.id,
        userId: data.userId,
        emotion: data.emotion,
        intensity: data.intensity,
        timestamp: data.timestamp.toDate(),
        note: data.note,
        type: data.type,
        metadata: data.metadata
      });
    });
    
    return progressLogs;
  } catch (error) {
    if (isIndexError(error)) {
      console.warn('Firestore index not ready for progress logs. Please create the required indexes in Firebase Console.');
      return [];
    }
    console.error('Error getting progress logs from Firestore:', error);
    return [];
  }
};

// Get progress logs for a specific time range
export const getProgressLogsByDateRange = async (startDate: Date, endDate: Date): Promise<ProgressLog[]> => {
  try {
    const userId = getUserId();
    const userProgressRef = collection(db, 'users', userId, 'progressLogs');
    const q = query(
      userProgressRef,
      where('timestamp', '>=', Timestamp.fromDate(startDate)),
      where('timestamp', '<=', Timestamp.fromDate(endDate)),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const progressLogs: ProgressLog[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      progressLogs.push({
        id: doc.id,
        userId: data.userId,
        emotion: data.emotion,
        intensity: data.intensity,
        timestamp: data.timestamp.toDate(),
        note: data.note,
        type: data.type,
        metadata: data.metadata
      });
    });
    
    return progressLogs;
  } catch (error) {
    if (isIndexError(error)) {
      console.warn('Firestore index not ready for progress logs date range query. Please create the required indexes in Firebase Console.');
      return [];
    }
    console.error('Error getting progress logs by date range from Firestore:', error);
    return [];
  }
};

// Real-time listener for progress logs
export const subscribeToProgressLogs = (callback: (progressLogs: ProgressLog[]) => void) => {
  const userId = getUserId();
  const userProgressRef = collection(db, 'users', userId, 'progressLogs');
  const q = query(userProgressRef, orderBy('timestamp', 'desc'));
  
  return onSnapshot(q, 
    (querySnapshot) => {
      const progressLogs: ProgressLog[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        progressLogs.push({
          id: doc.id,
          userId: data.userId,
          emotion: data.emotion,
          intensity: data.intensity,
          timestamp: data.timestamp.toDate(),
          note: data.note,
          type: data.type,
          metadata: data.metadata
        });
      });
      callback(progressLogs);
    },
    (error) => {
      if (isIndexError(error)) {
        console.warn('Firestore index not ready for progress logs subscription. Please create the required indexes in Firebase Console.');
        callback([]); // Return empty array to prevent app crash
      } else {
        console.error('Error in progress logs subscription:', error);
      }
    }
  );
};

// Delete a progress log
export const deleteProgressLogFromFirestore = async (logId: string) => {
  try {
    const userId = getUserId();
    const logRef = doc(db, 'users', userId, 'progressLogs', logId);
    await deleteDoc(logRef);
    console.log('Progress log deleted from Firestore');
  } catch (error) {
    console.error('Error deleting progress log from Firestore:', error);
    throw error;
  }
};

// Update a progress log
export const updateProgressLogInFirestore = async (logId: string, updates: Partial<ProgressLog>) => {
  try {
    const userId = getUserId();
    const logRef = doc(db, 'users', userId, 'progressLogs', logId);
    
    const updateData: any = { ...updates };
    if (updates.timestamp) {
      updateData.timestamp = Timestamp.fromDate(updates.timestamp);
    }
    updateData.updatedAt = Timestamp.now();
    
    await setDoc(logRef, updateData, { merge: true });
    console.log('Progress log updated in Firestore');
  } catch (error) {
    console.error('Error updating progress log in Firestore:', error);
    throw error;
  }
};

// Helper function to create progress log from emotion
export const createProgressLogFromEmotion = (emotion: any, note?: string): Omit<ProgressLog, 'id' | 'userId'> => {
  return {
    emotion: emotion.name,
    intensity: emotion.intensity,
    timestamp: emotion.timestamp,
    note: note || '',
    type: 'emotion'
  };
};

// Helper function to create progress log from journal entry
export const createProgressLogFromJournal = (journalEntry: any, note?: string): Omit<ProgressLog, 'id' | 'userId'> => {
  return {
    emotion: journalEntry.emotion.name,
    intensity: journalEntry.emotion.intensity,
    timestamp: journalEntry.timestamp,
    note: note || 'Journal entry',
    type: 'journal',
    metadata: {
      journalContent: journalEntry.content
    }
  };
};

// Helper function to create progress log from reflection
export const createProgressLogFromReflection = (reflection: any, note?: string): Omit<ProgressLog, 'id' | 'userId'> => {
  return {
    emotion: 'Reflective',
    intensity: reflection.mood,
    timestamp: reflection.timestamp,
    note: note || 'Daily reflection',
    type: 'reflection',
    metadata: {
      reflectionData: {
        gratitude: reflection.gratitude,
        challenge: reflection.challenge,
        growth: reflection.growth,
        tomorrow: reflection.tomorrow,
        mood: reflection.mood
      }
    }
  };
};