import React, { useState } from 'react';
import type { Emotion } from '../App';

interface EmotionSelectorProps {
  onEmotionSelect: (emotion: Emotion) => void;
}

const emotionCategories = [
  {
    category: 'Joy & Happiness',
    emotions: [
      { name: 'Joyful', color: 'from-yellow-400 to-amber-500', description: 'Feeling bright and cheerful' },
      { name: 'Content', color: 'from-green-400 to-emerald-500', description: 'Peaceful and satisfied' },
      { name: 'Excited', color: 'from-orange-400 to-red-500', description: 'Energetic and thrilled' },
      { name: 'Grateful', color: 'from-pink-400 to-rose-500', description: 'Thankful and appreciative' },
    ],
  },
  {
    category: 'Sadness & Melancholy',
    emotions: [
      { name: 'Sad', color: 'from-blue-400 to-blue-600', description: 'Feeling down or sorrowful' },
      { name: 'Lonely', color: 'from-indigo-400 to-purple-600', description: 'Isolated or disconnected' },
      { name: 'Disappointed', color: 'from-gray-400 to-slate-600', description: 'Let down or deflated' },
      { name: 'Melancholic', color: 'from-blue-300 to-indigo-500', description: 'Thoughtfully sad' },
    ],
  },
  {
    category: 'Anger & Frustration',
    emotions: [
      { name: 'Angry', color: 'from-red-500 to-red-700', description: 'Feeling upset or mad' },
      { name: 'Frustrated', color: 'from-orange-500 to-red-600', description: 'Blocked or hindered' },
      { name: 'Irritated', color: 'from-yellow-500 to-orange-600', description: 'Annoyed or bothered' },
      { name: 'Resentful', color: 'from-red-400 to-pink-600', description: 'Holding onto hurt' },
    ],
  },
  {
    category: 'Fear & Anxiety',
    emotions: [
      { name: 'Anxious', color: 'from-purple-400 to-indigo-600', description: 'Worried or nervous' },
      { name: 'Fearful', color: 'from-gray-500 to-gray-700', description: 'Scared or afraid' },
      { name: 'Overwhelmed', color: 'from-teal-400 to-cyan-600', description: 'Too much to handle' },
      { name: 'Stressed', color: 'from-red-300 to-orange-500', description: 'Under pressure' },
    ],
  },
];

export const EmotionSelector: React.FC<EmotionSelectorProps> = ({ onEmotionSelect }) => {
  const [selectedIntensity, setSelectedIntensity] = useState(5);

  const handleEmotionClick = (emotionName: string, color: string) => {
    const emotion: Emotion = {
      id: Date.now().toString(),
      name: emotionName,
      intensity: selectedIntensity,
      color,
      timestamp: new Date(),
    };
    onEmotionSelect(emotion);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          How are you feeling right now?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
          Take a moment to identify your current emotional state. There's no right or wrong answer—just be honest with yourself.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 mb-8 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-center text-gray-900 dark:text-white">
          Intensity Level: {selectedIntensity}/10
        </h3>
        <div className="flex items-center justify-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Mild</span>
          <input
            type="range"
            min="1"
            max="10"
            value={selectedIntensity}
            onChange={(e) => setSelectedIntensity(Number(e.target.value))}
            className="flex-1 max-w-md h-2 bg-gradient-to-r from-green-200 via-yellow-200 to-red-200 dark:from-green-800 dark:via-yellow-800 dark:to-red-800 rounded-lg appearance-none cursor-pointer slider"
          />
          <span className="text-sm text-gray-500 dark:text-gray-400">Intense</span>
        </div>
      </div>

      <div className="space-y-8">
        {emotionCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white text-center">
              {category.category}
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {category.emotions.map((emotion, emotionIndex) => (
                <button
                  key={emotionIndex}
                  onClick={() => handleEmotionClick(emotion.name, emotion.color)}
                  className="group relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl"
                  style={{
                    background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                  }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${emotion.color} opacity-90 group-hover:opacity-100 transition-opacity duration-300`} />
                  <div className="relative z-10">
                    <h4 className="text-lg font-semibold text-white mb-2">
                      {emotion.name}
                    </h4>
                    <p className="text-white/90 text-sm">
                      {emotion.description}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8 p-6 bg-purple-50 dark:bg-purple-900/30 rounded-2xl border border-purple-100 dark:border-purple-700">
        <p className="text-purple-800 dark:text-purple-300 font-medium">
          💜 Remember: All emotions are valid and deserve to be acknowledged
        </p>
      </div>
    </div>
  );
};