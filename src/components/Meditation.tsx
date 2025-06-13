import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, Heart, Leaf, Flame, Shield } from 'lucide-react';
import type { Emotion } from '../App';

interface MeditationProps {
  selectedEmotion: Emotion | null;
  onComplete: () => void;
}

const meditationTypes = {
  'Joyful': {
    title: 'Gratitude & Joy Meditation',
    duration: 8,
    icon: Heart,
    color: 'from-yellow-400 to-amber-500',
    script: [
      "Close your eyes and take a deep breath in... and slowly breathe out.",
      "Feel the joy that's present in your heart right now.",
      "Notice how this happiness feels in your body - perhaps a lightness, a warmth.",
      "Think of three things you're grateful for in this moment.",
      "Let this gratitude expand through your chest, your arms, your whole being.",
      "Breathe in appreciation... breathe out love.",
      "You deserve this joy. You deserve this happiness.",
      "Take one more deep breath and slowly open your eyes when you're ready."
    ]
  },
  'Content': {
    title: 'Peaceful Contentment Meditation',
    duration: 7,
    icon: Leaf,
    color: 'from-green-400 to-emerald-500',
    script: [
      "Settle into a comfortable position and close your eyes.",
      "Notice the natural rhythm of your breath.",
      "Feel the contentment that's already within you.",
      "This peaceful feeling is your natural state.",
      "Let go of any need to be anywhere else or feel anything different.",
      "You are exactly where you need to be.",
      "Breathe in peace... breathe out tension.",
      "Rest in this moment of perfect contentment."
    ]
  },
  'Sad': {
    title: 'Loving-Kindness for Sadness',
    duration: 10,
    icon: Heart,
    color: 'from-blue-400 to-blue-600',
    script: [
      "Close your eyes and place your hand on your heart.",
      "Acknowledge the sadness you're feeling with kindness.",
      "This sadness is part of your human experience.",
      "Breathe in compassion for yourself... breathe out self-judgment.",
      "Send loving-kindness to the part of you that's hurting.",
      "May I be kind to myself in this difficult moment.",
      "May I give myself the compassion I need.",
      "May I remember that this feeling will pass.",
      "You are not alone in your sadness.",
      "Breathe in love... breathe out healing."
    ]
  },
  'Angry': {
    title: 'Cooling Fire Meditation',
    duration: 9,
    icon: Flame,
    color: 'from-red-500 to-orange-600',
    script: [
      "Sit comfortably and close your eyes.",
      "Notice where you feel the anger in your body.",
      "Don't try to push it away - just observe it.",
      "Imagine a cool, blue light surrounding this feeling.",
      "Breathe in cooling calm... breathe out heated tension.",
      "Your anger has a message - what is it trying to protect?",
      "Thank your anger for trying to keep you safe.",
      "Now let the cool light transform this energy into clarity.",
      "You can respond from wisdom rather than reaction."
    ]
  },
  'Anxious': {
    title: 'Grounding & Safety Meditation',
    duration: 8,
    icon: Shield,
    color: 'from-purple-400 to-indigo-600',
    script: [
      "Close your eyes and feel your feet on the ground.",
      "You are safe in this moment.",
      "Notice five things you can hear around you.",
      "Feel the support of the chair or surface beneath you.",
      "Breathe in safety... breathe out worry.",
      "Your breath is your anchor to the present moment.",
      "The future hasn't happened yet. The past is over.",
      "Right now, in this breath, you are okay.",
      "You have survived difficult moments before, and you will again."
    ]
  },
  'default': {
    title: 'Mindful Awareness Meditation',
    duration: 7,
    icon: Heart,
    color: 'from-purple-500 to-pink-500',
    script: [
      "Find a comfortable position and close your eyes.",
      "Begin to notice your natural breath.",
      "There's no need to change anything - just observe.",
      "Notice any thoughts that arise, and gently let them pass.",
      "Return your attention to your breath.",
      "You are the observer of your thoughts and feelings.",
      "Rest in this awareness, this peaceful presence.",
      "Take one more deep breath and open your eyes when ready."
    ]
  }
};

export const Meditation: React.FC<MeditationProps> = ({ selectedEmotion, onComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const meditationType = selectedEmotion 
    ? meditationTypes[selectedEmotion.name as keyof typeof meditationTypes] || meditationTypes.default
    : meditationTypes.default;

  const stepDuration = (meditationType.duration * 60) / meditationType.script.length; // seconds per step

  useEffect(() => {
    setTimeRemaining(meditationType.duration * 60);
  }, [meditationType]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsActive(false);
            setIsComplete(true);
            return 0;
          }
          return prev - 1;
        });

        // Update current step based on time
        const elapsed = (meditationType.duration * 60) - timeRemaining;
        const newStep = Math.floor(elapsed / stepDuration);
        if (newStep < meditationType.script.length && newStep !== currentStep) {
          setCurrentStep(newStep);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeRemaining, currentStep, meditationType, stepDuration]);

  const startMeditation = () => {
    setIsActive(true);
    setCurrentStep(0);
    setIsComplete(false);
    setTimeRemaining(meditationType.duration * 60);
  };

  const pauseMeditation = () => {
    setIsActive(false);
  };

  const resetMeditation = () => {
    setIsActive(false);
    setCurrentStep(0);
    setIsComplete(false);
    setTimeRemaining(meditationType.duration * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((meditationType.duration * 60 - timeRemaining) / (meditationType.duration * 60)) * 100;

  const IconComponent = meditationType.icon;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className={`inline-flex items-center space-x-3 px-6 py-3 rounded-2xl bg-gradient-to-r ${meditationType.color} mb-4`}>
          <IconComponent className="w-5 h-5 text-white" />
          <span className="text-white font-semibold text-lg">{meditationType.title}</span>
        </div>
        <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
          Guided Meditation
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
          Take a few minutes to center yourself with this personalized meditation designed for your current emotional state.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
        {!isComplete ? (
          <>
            {/* Progress Circle */}
            <div className="relative flex items-center justify-center h-80 mb-8">
              <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-gray-200 dark:text-gray-600"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                  className={`text-purple-500 transition-all duration-1000 ease-in-out`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
                    {formatTime(timeRemaining)}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    {isActive ? 'Meditating...' : 'Ready to begin'}
                  </div>
                </div>
              </div>
            </div>

            {/* Current Instruction */}
            <div className="text-center mb-8">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-2xl p-6 border border-purple-100 dark:border-purple-700">
                <p className="text-lg text-purple-800 dark:text-purple-300 leading-relaxed font-medium">
                  {isActive && currentStep < meditationType.script.length
                    ? meditationType.script[currentStep]
                    : "Click start when you're ready to begin your meditation journey."
                  }
                </p>
                {isActive && (
                  <div className="mt-4">
                    <div className="text-sm text-purple-600 dark:text-purple-400">
                      Step {currentStep + 1} of {meditationType.script.length}
                    </div>
                    <div className="w-full bg-purple-200 dark:bg-purple-700 rounded-full h-2 mt-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${((currentStep + 1) / meditationType.script.length) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center space-x-4">
              {!isActive ? (
                <button
                  onClick={startMeditation}
                  className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <Play className="w-5 h-5" />
                  <span>Begin Meditation</span>
                </button>
              ) : (
                <button
                  onClick={pauseMeditation}
                  className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <Pause className="w-5 h-5" />
                  <span>Pause</span>
                </button>
              )}
              <button
                onClick={resetMeditation}
                className="flex items-center space-x-2 px-6 py-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Reset</span>
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Beautiful Work! 🌟
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-md mx-auto">
              You've completed your meditation. Take a moment to notice any shifts in how you feel.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={resetMeditation}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Meditate Again
              </button>
              <button
                onClick={onComplete}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Continue Journey
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl border border-blue-100 dark:border-blue-700">
          <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Meditation Benefits</h4>
          <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
            Regular meditation practice helps reduce stress, improve emotional regulation, increase self-awareness, 
            and promote overall mental well-being. Even a few minutes can make a meaningful difference.
          </p>
        </div>
      </div>
    </div>
  );
};