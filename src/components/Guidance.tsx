import React from 'react';
import { Wind, Heart, BookOpen, ArrowRight, Lightbulb, Shield, Brain } from 'lucide-react';
import type { Emotion } from '../App';

interface GuidanceProps {
  selectedEmotion: Emotion | null;
  onStartBreathing: () => void;
  onStartMeditation: () => void;
  onViewProgress: () => void;
}

const getGuidanceForEmotion = (emotionName: string) => {
  const guidanceMap: Record<string, {
    message: string;
    strategies: string[];
    affirmation: string;
  }> = {
    'Joyful': {
      message: "It's wonderful that you're feeling joyful! This positive energy is precious.",
      strategies: [
        "Share your joy with someone you care about",
        "Take a moment to savor this feeling",
        "Consider what brought you this happiness",
        "Practice gratitude for this moment"
      ],
      affirmation: "I deserve to feel joy and happiness in my life."
    },
    'Content': {
      message: "Contentment is a beautiful state of being. You're at peace with where you are right now.",
      strategies: [
        "Notice the stillness and peace within you",
        "Appreciate this moment of balance",
        "Reflect on what contributes to your contentment",
        "Let this feeling ground you for the day ahead"
      ],
      affirmation: "I am at peace with myself and my life as it is right now."
    },
    'Excited': {
      message: "Your excitement is contagious! This energy can fuel positive action.",
      strategies: [
        "Channel this energy into meaningful activities",
        "Share your enthusiasm with others",
        "Use this momentum to tackle important tasks",
        "Remember to stay grounded while embracing the excitement"
      ],
      affirmation: "My excitement and enthusiasm are gifts that I can share with the world."
    },
    'Grateful': {
      message: "Gratitude is one of the most powerful emotions for well-being and connection.",
      strategies: [
        "Write down three specific things you're grateful for",
        "Express your gratitude to someone who matters to you",
        "Notice how gratitude feels in your body",
        "Let this appreciation expand to include small daily blessings"
      ],
      affirmation: "I am blessed with abundance, and my gratitude multiplies my joy."
    },
    'Sad': {
      message: "It's okay to feel sad. Sadness is a natural part of the human experience.",
      strategies: [
        "Allow yourself to feel this emotion without judgment",
        "Reach out to a trusted friend or family member",
        "Engage in gentle self-care activities",
        "Consider what your sadness might be telling you"
      ],
      affirmation: "My feelings are valid, and it's okay to not be okay sometimes."
    },
    'Lonely': {
      message: "Loneliness is a signal that you need connection. You're not alone in feeling this way.",
      strategies: [
        "Reach out to someone you trust, even with a simple message",
        "Practice self-compassion - be kind to yourself",
        "Consider joining a community activity or group",
        "Remember that feeling lonely doesn't mean you are alone"
      ],
      affirmation: "I am worthy of connection and love, and I can reach out when I need support."
    },
    'Disappointed': {
      message: "Disappointment shows that you care deeply about something. That caring is valuable.",
      strategies: [
        "Acknowledge what you were hoping for",
        "Allow yourself to grieve the unmet expectation",
        "Look for lessons or new opportunities in this situation",
        "Practice self-compassion during this difficult time"
      ],
      affirmation: "Disappointment is temporary, and I can find new paths forward."
    },
    'Melancholic': {
      message: "Melancholy can be a deeply reflective state. There's wisdom in this contemplative feeling.",
      strategies: [
        "Allow yourself to sit with these deeper feelings",
        "Journal about what's stirring within you",
        "Consider what this melancholy might be teaching you",
        "Be gentle with yourself during this introspective time"
      ],
      affirmation: "My deeper feelings have wisdom to offer, and I can honor them with patience."
    },
    'Angry': {
      message: "Anger can be a signal that something important to you needs attention.",
      strategies: [
        "Take slow, deep breaths to calm your nervous system",
        "Physical exercise can help release angry energy",
        "Journal about what triggered your anger",
        "Consider what boundary might need to be set"
      ],
      affirmation: "I can acknowledge my anger while choosing how to respond thoughtfully."
    },
    'Frustrated': {
      message: "Frustration often arises when we feel blocked from something we want or need.",
      strategies: [
        "Identify what specific obstacle is causing the frustration",
        "Break down the problem into smaller, manageable steps",
        "Take a break and return with fresh perspective",
        "Ask for help or support if needed"
      ],
      affirmation: "I can work through obstacles with patience and creative problem-solving."
    },
    'Irritated': {
      message: "Irritation is often a sign that your boundaries or needs aren't being respected.",
      strategies: [
        "Take a few deep breaths before responding",
        "Identify what specifically is bothering you",
        "Consider if you need to communicate a boundary",
        "Practice patience with yourself and others"
      ],
      affirmation: "I can respond to irritation with clarity rather than reactivity."
    },
    'Resentful': {
      message: "Resentment is like carrying a heavy burden. It's time to explore what you need to let go.",
      strategies: [
        "Acknowledge the hurt that's underneath the resentment",
        "Consider what forgiveness might look like for you",
        "Focus on what you can control in the situation",
        "Seek support from a counselor or trusted friend"
      ],
      affirmation: "I can release resentment and choose peace for my own well-being."
    },
    'Anxious': {
      message: "Anxiety is your mind's way of trying to protect you, even when it feels overwhelming.",
      strategies: [
        "Practice grounding techniques (5-4-3-2-1 method)",
        "Focus on slow, deep breathing",
        "Remind yourself that feelings are temporary",
        "Break overwhelming tasks into smaller steps"
      ],
      affirmation: "I am safe in this moment, and I have the strength to handle whatever comes."
    },
    'Fearful': {
      message: "Fear is a natural response to perceived danger. Let's explore what feels threatening right now.",
      strategies: [
        "Identify what specifically you're afraid of",
        "Distinguish between real and imagined threats",
        "Practice grounding techniques to feel more secure",
        "Remind yourself of times you've overcome fear before"
      ],
      affirmation: "I am braver than I believe and stronger than I feel."
    },
    'Overwhelmed': {
      message: "Feeling overwhelmed is a sign that you're carrying a lot right now.",
      strategies: [
        "Take a step back and breathe deeply",
        "List your priorities and focus on one thing at a time",
        "Ask for help when you need it",
        "Practice saying no to additional commitments"
      ],
      affirmation: "I don't have to do everything at once. I can take it one step at a time."
    },
    'Stressed': {
      message: "Stress is your body's response to pressure. Let's find ways to support yourself through this.",
      strategies: [
        "Identify the main sources of your stress",
        "Practice stress-reduction techniques like deep breathing",
        "Make sure you're getting enough rest and nutrition",
        "Consider what support systems you can activate"
      ],
      affirmation: "I can handle stress by taking care of myself and asking for support when needed."
    }
  };

  return guidanceMap[emotionName] || {
    message: "Every emotion you experience is valid and serves a purpose.",
    strategies: [
      "Take time to sit with your feelings without judgment",
      "Practice self-compassion and kindness",
      "Consider what this emotion might be trying to tell you",
      "Remember that all feelings are temporary"
    ],
    affirmation: "I accept my emotions with kindness and understanding."
  };
};

export const Guidance: React.FC<GuidanceProps> = ({
  selectedEmotion,
  onStartBreathing,
  onStartMeditation,
  onViewProgress,
}) => {
  if (!selectedEmotion) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-600 dark:text-gray-300">Please select an emotion first to receive personalized guidance.</p>
      </div>
    );
  }

  const guidance = getGuidanceForEmotion(selectedEmotion.name);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className={`inline-flex items-center space-x-3 px-6 py-3 rounded-2xl bg-gradient-to-r ${selectedEmotion.color} mb-4`}>
          <Heart className="w-5 h-5 text-white" />
          <span className="text-white font-semibold text-lg">{selectedEmotion.name}</span>
        </div>
        <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
          Gentle Guidance & Support
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
          Here's some personalized support based on what you're experiencing right now.
        </p>
      </div>

      <div className="space-y-6">
        {/* Main Message */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Understanding Your Emotion</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">{guidance.message}</p>
            </div>
          </div>
        </div>

        {/* Coping Strategies */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-start space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Helpful Strategies</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Try these gentle approaches to support yourself:</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {guidance.strategies.map((strategy, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-purple-50 dark:bg-purple-900/30 rounded-xl border border-purple-100 dark:border-purple-700">
                <div className="w-6 h-6 bg-purple-200 dark:bg-purple-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-purple-700 dark:text-purple-300 text-sm font-semibold">{index + 1}</span>
                </div>
                <p className="text-purple-800 dark:text-purple-300 text-sm leading-relaxed">{strategy}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Affirmation */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-3xl p-8 border border-green-100 dark:border-green-700">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-3">Your Personal Affirmation</h3>
              <p className="text-green-700 dark:text-green-300 text-lg leading-relaxed italic">"{guidance.affirmation}"</p>
              <p className="text-green-600 dark:text-green-400 text-sm mt-3">
                Repeat this to yourself whenever you need a gentle reminder of your worth and strength.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={onStartBreathing}
            className="flex items-center justify-center space-x-3 p-6 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <Wind className="w-6 h-6" />
            <span>Breathing Exercise</span>
          </button>
          <button
            onClick={onStartMeditation}
            className="flex items-center justify-center space-x-3 p-6 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <Brain className="w-6 h-6" />
            <span>Guided Meditation</span>
          </button>
          <button
            onClick={onViewProgress}
            className="flex items-center justify-center space-x-3 p-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <ArrowRight className="w-6 h-6" />
            <span>View Progress</span>
          </button>
        </div>

        {/* Additional Resources */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <span>Remember</span>
          </h3>
          <div className="text-gray-600 dark:text-gray-300 text-sm space-y-2">
            <p>• Emotions are temporary visitors, not permanent residents</p>
            <p>• It's okay to feel whatever you're feeling right now</p>
            <p>• Taking care of your emotional health is a sign of strength</p>
            <p>• You're not alone in your emotional journey</p>
          </div>
        </div>
      </div>
    </div>
  );
};