import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Welcome } from './components/Welcome';
import { EmotionSelector } from './components/EmotionSelector';
import { JournalSpace } from './components/JournalSpace';
import { Guidance } from './components/Guidance';
import { BreathingExercise } from './components/BreathingExercise';
import { Progress } from './components/Progress';
import { Meditation } from './components/Meditation';
import { SelfReflection } from './components/SelfReflection';
import { AIAssistant } from './components/AIAssistant';
import { FloatingAIAssistant } from './components/FloatingAIAssistant';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import {
  saveEmotionToFirestore,
  saveJournalEntryToFirestore,
  saveReflectionToFirestore,
  subscribeToEmotions,
  subscribeToJournalEntries,
  subscribeToReflections,
  getEmotionsFromFirestore,
  getJournalEntriesFromFirestore,
  getReflectionsFromFirestore
} from './lib/firestore';
import {
  saveProgressLogToFirestore,
  createProgressLogFromEmotion,
  createProgressLogFromJournal,
  createProgressLogFromReflection
} from './lib/progressLogs';

export type Emotion = {
  id: string;
  name: string;
  intensity: number;
  color: string;
  timestamp: Date;
};

export type JournalEntry = {
  id: string;
  content: string;
  emotion: Emotion;
  timestamp: Date;
};

export type ReflectionEntry = {
  id: string;
  date: string;
  gratitude: string;
  challenge: string;
  growth: string;
  tomorrow: string;
  mood: number;
  timestamp: Date;
};

export type AppView = 'welcome' | 'emotions' | 'journal' | 'guidance' | 'breathing' | 'progress' | 'meditation' | 'reflection' | 'ai-assistant';

function AppContent() {
  const [currentView, setCurrentView] = useState<AppView>('welcome');
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [reflectionEntries, setReflectionEntries] = useState<ReflectionEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [firestoreIndexError, setFirestoreIndexError] = useState(false);
  const [firestoreConnectivityIssue, setFirestoreConnectivityIssue] = useState(false);

  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        setFirestoreIndexError(false);
        setFirestoreConnectivityIssue(false);
        
        if (isOnline) {
          // Load from Firestore when online
          const [emotionsData, journalData, reflectionsData] = await Promise.all([
            getEmotionsFromFirestore().catch((error) => {
              console.warn('Failed to load emotions from Firestore:', error);
              if (error?.code === 'failed-precondition') {
                setFirestoreIndexError(true);
              } else if (error?.code === 'unavailable') {
                setFirestoreConnectivityIssue(true);
              }
              return [];
            }),
            getJournalEntriesFromFirestore().catch((error) => {
              console.warn('Failed to load journal entries from Firestore:', error);
              if (error?.code === 'failed-precondition') {
                setFirestoreIndexError(true);
              } else if (error?.code === 'unavailable') {
                setFirestoreConnectivityIssue(true);
              }
              return [];
            }),
            getReflectionsFromFirestore().catch((error) => {
              console.warn('Failed to load reflections from Firestore:', error);
              if (error?.code === 'failed-precondition') {
                setFirestoreIndexError(true);
              } else if (error?.code === 'unavailable') {
                setFirestoreConnectivityIssue(true);
              }
              return [];
            })
          ]);
          
          setEmotions(emotionsData);
          setJournalEntries(journalData);
          setReflectionEntries(reflectionsData);
          
          // Also save to localStorage as backup
          localStorage.setItem('soulful-emotions', JSON.stringify(emotionsData));
          localStorage.setItem('soulful-journal-entries', JSON.stringify(journalData));
          localStorage.setItem('soulful-reflections', JSON.stringify(reflectionsData));
        } else {
          // Load from localStorage when offline
          loadFromLocalStorage();
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
        // Fallback to localStorage if Firestore fails
        loadFromLocalStorage();
      } finally {
        setIsLoading(false);
      }
    };

    const loadFromLocalStorage = () => {
      try {
        const savedEntries = localStorage.getItem('soulful-journal-entries');
        const savedEmotions = localStorage.getItem('soulful-emotions');
        const savedReflections = localStorage.getItem('soulful-reflections');
        
        if (savedEntries) {
          const parsed = JSON.parse(savedEntries);
          setJournalEntries(parsed.map((entry: any) => ({
            ...entry,
            timestamp: new Date(entry.timestamp),
            emotion: {
              ...entry.emotion,
              timestamp: new Date(entry.emotion.timestamp)
            }
          })));
        }
        if (savedEmotions) {
          const parsed = JSON.parse(savedEmotions);
          setEmotions(parsed.map((emotion: any) => ({
            ...emotion,
            timestamp: new Date(emotion.timestamp)
          })));
        }
        if (savedReflections) {
          const parsed = JSON.parse(savedReflections);
          setReflectionEntries(parsed.map((reflection: any) => ({
            ...reflection,
            timestamp: new Date(reflection.timestamp)
          })));
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    };

    loadInitialData();
  }, [isOnline]);

  useEffect(() => {
    // Set up real-time listeners when online and no index errors
    if (!isOnline || firestoreIndexError || firestoreConnectivityIssue) return;

    const unsubscribeEmotions = subscribeToEmotions((emotionsData) => {
      setEmotions(emotionsData);
      localStorage.setItem('soulful-emotions', JSON.stringify(emotionsData));
    });

    const unsubscribeJournal = subscribeToJournalEntries((journalData) => {
      setJournalEntries(journalData);
      localStorage.setItem('soulful-journal-entries', JSON.stringify(journalData));
    });

    const unsubscribeReflections = subscribeToReflections((reflectionsData) => {
      setReflectionEntries(reflectionsData);
      localStorage.setItem('soulful-reflections', JSON.stringify(reflectionsData));
    });

    return () => {
      unsubscribeEmotions();
      unsubscribeJournal();
      unsubscribeReflections();
    };
  }, [isOnline, firestoreIndexError, firestoreConnectivityIssue]);

  const saveJournalEntry = async (entry: JournalEntry) => {
    // Optimistically update local state
    const updatedEntries = [...journalEntries, entry];
    setJournalEntries(updatedEntries);
    localStorage.setItem('soulful-journal-entries', JSON.stringify(updatedEntries));

    // Save to Firestore if online and no connectivity issues
    if (isOnline && !firestoreConnectivityIssue) {
      try {
        await saveJournalEntryToFirestore(entry);
        // Also save to progress logs
        const progressLog = createProgressLogFromJournal(entry);
        await saveProgressLogToFirestore(progressLog);
      } catch (error) {
        console.error('Failed to save journal entry to Firestore:', error);
        // The local state is already updated, so the user can continue working
      }
    }
  };

  const saveEmotion = async (emotion: Emotion) => {
    // Optimistically update local state
    const updatedEmotions = [...emotions, emotion];
    setEmotions(updatedEmotions);
    localStorage.setItem('soulful-emotions', JSON.stringify(updatedEmotions));

    // Save to Firestore if online and no connectivity issues
    if (isOnline && !firestoreConnectivityIssue) {
      try {
        await saveEmotionToFirestore(emotion);
        // Also save to progress logs
        const progressLog = createProgressLogFromEmotion(emotion);
        await saveProgressLogToFirestore(progressLog);
      } catch (error) {
        console.error('Failed to save emotion to Firestore:', error);
      }
    }
  };

  const saveReflection = async (reflection: ReflectionEntry) => {
    // Optimistically update local state
    const updatedReflections = [...reflectionEntries, reflection];
    setReflectionEntries(updatedReflections);
    localStorage.setItem('soulful-reflections', JSON.stringify(updatedReflections));

    // Save to Firestore if online and no connectivity issues
    if (isOnline && !firestoreConnectivityIssue) {
      try {
        await saveReflectionToFirestore(reflection);
        // Also save to progress logs
        const progressLog = createProgressLogFromReflection(reflection);
        await saveProgressLogToFirestore(progressLog);
      } catch (error) {
        console.error('Failed to save reflection to Firestore:', error);
      }
    }
  };

  const handleEmotionSelect = (emotion: Emotion) => {
    setSelectedEmotion(emotion);
    saveEmotion(emotion);
    setCurrentView('journal');
  };

  const renderCurrentView = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-100 dark:border-purple-700 border-t-purple-500 dark:border-t-purple-400 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading your emotional journey...</p>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'welcome':
        return <Welcome onGetStarted={() => setCurrentView('emotions')} />;
      case 'emotions':
        return <EmotionSelector onEmotionSelect={handleEmotionSelect} />;
      case 'journal':
        return (
          <JournalSpace
            selectedEmotion={selectedEmotion}
            onSaveEntry={saveJournalEntry}
            onNext={() => setCurrentView('guidance')}
          />
        );
      case 'guidance':
        return (
          <Guidance
            selectedEmotion={selectedEmotion}
            onStartBreathing={() => setCurrentView('breathing')}
            onStartMeditation={() => setCurrentView('meditation')}
            onViewProgress={() => setCurrentView('progress')}
          />
        );
      case 'breathing':
        return (
          <BreathingExercise
            onComplete={() => setCurrentView('progress')}
          />
        );
      case 'meditation':
        return (
          <Meditation
            selectedEmotion={selectedEmotion}
            onComplete={() => setCurrentView('progress')}
          />
        );
      case 'reflection':
        return (
          <SelfReflection
            onSaveReflection={saveReflection}
            reflectionEntries={reflectionEntries}
          />
        );
      case 'ai-assistant':
        return (
          <AIAssistant
            selectedEmotion={selectedEmotion}
            recentEmotions={emotions.slice(-5)}
          />
        );
      case 'progress':
        return (
          <Progress
            emotions={emotions}
            journalEntries={journalEntries}
            reflectionEntries={reflectionEntries}
            onNewEntry={() => setCurrentView('emotions')}
          />
        );
      default:
        return <Welcome onGetStarted={() => setCurrentView('emotions')} />;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Header 
        currentView={currentView} 
        onNavigate={setCurrentView}
        emotions={emotions}
        journalEntries={journalEntries}
        reflectionEntries={reflectionEntries}
      />
      
      {/* Offline indicator */}
      {!isOnline && (
        <div className="bg-orange-50 dark:bg-orange-900/50 border-l-4 border-orange-400 dark:border-orange-500 text-orange-700 dark:text-orange-300 p-4 text-center">
          <p className="text-sm">
            You're currently offline. Your data will sync when you reconnect to the internet.
          </p>
        </div>
      )}
      
      {/* Firestore connectivity issue indicator */}
      {firestoreConnectivityIssue && isOnline && (
        <div className="bg-red-50 dark:bg-red-900/50 border-l-4 border-red-400 dark:border-red-500 text-red-700 dark:text-red-300 p-4 text-center">
          <p className="text-sm">
            <strong>Connection Issue:</strong> Unable to connect to the cloud database. Your data is being saved locally and will sync when the connection is restored.
          </p>
        </div>
      )}
      
      {/* Firestore index error indicator */}
      {firestoreIndexError && isOnline && (
        <div className="bg-yellow-50 dark:bg-yellow-900/50 border-l-4 border-yellow-400 dark:border-yellow-500 text-yellow-700 dark:text-yellow-300 p-4 text-center">
          <p className="text-sm">
            <strong>Database Setup Required:</strong> Please create the required Firestore indexes in your Firebase Console. 
            Check the browser console for the direct links to create these indexes. Your data is being saved locally in the meantime.
          </p>
        </div>
      )}
      
      <main className="pb-24 pt-4">
        {renderCurrentView()}
      </main>

      {/* Floating AI Assistant - appears on all pages */}
      <FloatingAIAssistant 
        selectedEmotion={selectedEmotion}
        recentEmotions={emotions.slice(-5)}
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;