import React, { useState } from 'react';
import { Calendar, Save, Eye, ChevronLeft, ChevronRight, Star, Heart, Target, Sunrise } from 'lucide-react';
import type { ReflectionEntry } from '../App';

interface SelfReflectionProps {
  onSaveReflection: (reflection: ReflectionEntry) => void;
  reflectionEntries: ReflectionEntry[];
}

export const SelfReflection: React.FC<SelfReflectionProps> = ({ 
  onSaveReflection, 
  reflectionEntries 
}) => {
  const [currentView, setCurrentView] = useState<'new' | 'history'>('new');
  const [gratitude, setGratitude] = useState('');
  const [challenge, setChallenge] = useState('');
  const [growth, setGrowth] = useState('');
  const [tomorrow, setTomorrow] = useState('');
  const [mood, setMood] = useState(7);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];
  const todayEntry = reflectionEntries.find(entry => entry.date === today);

  const handleSave = () => {
    if (!gratitude.trim() && !challenge.trim() && !growth.trim() && !tomorrow.trim()) return;

    const reflection: ReflectionEntry = {
      id: Date.now().toString(),
      date: today,
      gratitude: gratitude.trim(),
      challenge: challenge.trim(),
      growth: growth.trim(),
      tomorrow: tomorrow.trim(),
      mood,
      timestamp: new Date(),
    };

    onSaveReflection(reflection);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const resetForm = () => {
    setGratitude('');
    setChallenge('');
    setGrowth('');
    setTomorrow('');
    setMood(7);
  };

  const getReflectionByDate = (date: string) => {
    return reflectionEntries.find(entry => entry.date === date);
  };

  const getMoodColor = (moodValue: number) => {
    if (moodValue <= 3) return 'from-red-400 to-red-600';
    if (moodValue <= 5) return 'from-orange-400 to-yellow-500';
    if (moodValue <= 7) return 'from-yellow-400 to-green-500';
    return 'from-green-400 to-emerald-500';
  };

  const getMoodEmoji = (moodValue: number) => {
    if (moodValue <= 2) return '😢';
    if (moodValue <= 4) return '😔';
    if (moodValue <= 6) return '😐';
    if (moodValue <= 8) return '🙂';
    return '😊';
  };

  const getRecentEntries = () => {
    return reflectionEntries
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 7);
  };

  if (currentView === 'history') {
    const recentEntries = getRecentEntries();
    
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
            Your Reflection Journey
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Look back on your daily reflections and see how you've grown over time.
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-sm border border-gray-100 dark:border-gray-700">
            <button
              onClick={() => setCurrentView('new')}
              className="px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium rounded-xl transition-colors duration-200"
            >
              Today's Reflection
            </button>
            <button
              onClick={() => setCurrentView('history')}
              className="px-6 py-3 bg-purple-600 text-white font-medium rounded-xl"
            >
              View History
            </button>
          </div>
        </div>

        {recentEntries.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">No Reflections Yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Start your daily reflection practice to see your journey here.</p>
            <button
              onClick={() => setCurrentView('new')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Reflecting
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {recentEntries.map((entry) => (
              <div key={entry.id} className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span className="font-semibold text-gray-800 dark:text-white">
                      {new Date(entry.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{entry.mood}/10</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {entry.gratitude && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-xl border border-green-100 dark:border-green-700">
                      <div className="flex items-center space-x-2 mb-2">
                        <Heart className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="font-medium text-green-800 dark:text-green-300">Gratitude</span>
                      </div>
                      <p className="text-green-700 dark:text-green-300 text-sm">{entry.gratitude}</p>
                    </div>
                  )}

                  {entry.challenge && (
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/30 rounded-xl border border-orange-100 dark:border-orange-700">
                      <div className="flex items-center space-x-2 mb-2">
                        <Target className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        <span className="font-medium text-orange-800 dark:text-orange-300">Challenge</span>
                      </div>
                      <p className="text-orange-700 dark:text-orange-300 text-sm">{entry.challenge}</p>
                    </div>
                  )}

                  {entry.growth && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-100 dark:border-blue-700">
                      <div className="flex items-center space-x-2 mb-2">
                        <Star className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="font-medium text-blue-800 dark:text-blue-300">Growth</span>
                      </div>
                      <p className="text-blue-700 dark:text-blue-300 text-sm">{entry.growth}</p>
                    </div>
                  )}

                  {entry.tomorrow && (
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-xl border border-purple-100 dark:border-purple-700">
                      <div className="flex items-center space-x-2 mb-2">
                        <Sunrise className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span className="font-medium text-purple-800 dark:text-purple-300">Tomorrow</span>
                      </div>
                      <p className="text-purple-700 dark:text-purple-300 text-sm">{entry.tomorrow}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
          Daily Self-Reflection
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
          Take a few moments to reflect on your day. This practice helps build self-awareness and emotional intelligence.
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-sm border border-gray-100 dark:border-gray-700">
          <button
            onClick={() => setCurrentView('new')}
            className="px-6 py-3 bg-purple-600 text-white font-medium rounded-xl"
          >
            Today's Reflection
          </button>
          <button
            onClick={() => setCurrentView('history')}
            className="px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium rounded-xl transition-colors duration-200"
          >
            View History
          </button>
        </div>
      </div>

      {todayEntry ? (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Today's Reflection Complete! ✨
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
            You've already reflected on today. Come back tomorrow for your next daily reflection.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setCurrentView('history')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              View Past Reflections
            </button>
            <button
              onClick={resetForm}
              className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Reflect Again
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="space-y-8">
            {/* Mood Slider */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-8 h-8 bg-gradient-to-br ${getMoodColor(mood)} rounded-full flex items-center justify-center`}>
                  <span className="text-white text-lg">{getMoodEmoji(mood)}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  How are you feeling today? ({mood}/10)
                </h3>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">Low</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={mood}
                  onChange={(e) => setMood(Number(e.target.value))}
                  className={`flex-1 h-3 bg-gradient-to-r ${getMoodColor(mood)} rounded-lg appearance-none cursor-pointer slider`}
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">High</span>
              </div>
            </div>

            {/* Gratitude */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">What are you grateful for today?</h3>
              </div>
              <textarea
                value={gratitude}
                onChange={(e) => setGratitude(e.target.value)}
                placeholder="I'm grateful for..."
                className="w-full h-24 p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>

            {/* Challenge */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">What challenged you today?</h3>
              </div>
              <textarea
                value={challenge}
                onChange={(e) => setChallenge(e.target.value)}
                placeholder="Today I found it difficult when..."
                className="w-full h-24 p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>

            {/* Growth */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">How did you grow today?</h3>
              </div>
              <textarea
                value={growth}
                onChange={(e) => setGrowth(e.target.value)}
                placeholder="I learned or realized that..."
                className="w-full h-24 p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>

            {/* Tomorrow */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Sunrise className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">What's your intention for tomorrow?</h3>
              </div>
              <textarea
                value={tomorrow}
                onChange={(e) => setTomorrow(e.target.value)}
                placeholder="Tomorrow I want to focus on..."
                className="w-full h-24 p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>

            {/* Save Button */}
            <div className="text-center pt-4">
              <button
                onClick={handleSave}
                disabled={!gratitude.trim() && !challenge.trim() && !growth.trim() && !tomorrow.trim()}
                className={`flex items-center space-x-2 px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 mx-auto ${
                  gratitude.trim() || challenge.trim() || growth.trim() || tomorrow.trim()
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                <Save className="w-5 h-5" />
                <span>{isSaved ? 'Reflection Saved!' : 'Save Reflection'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl border border-blue-100 dark:border-blue-700">
        <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Daily Reflection Benefits</h4>
        <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
          Regular self-reflection helps increase self-awareness, process emotions, identify patterns, 
          and make more intentional choices. Even a few minutes of reflection can significantly impact your well-being.
        </p>
      </div>
    </div>
  );
};