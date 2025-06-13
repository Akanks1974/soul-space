import React from 'react';
import { Calendar, TrendingUp, Heart, BookOpen, Award, Brain, MessageCircle, Sunrise } from 'lucide-react';
import { ProgressCharts } from './ProgressCharts';
import type { Emotion, JournalEntry, ReflectionEntry } from '../App';

interface ProgressProps {
  emotions: Emotion[];
  journalEntries: JournalEntry[];
  reflectionEntries: ReflectionEntry[];
  onNewEntry: () => void;
}

export const Progress: React.FC<ProgressProps> = ({ 
  emotions, 
  journalEntries, 
  reflectionEntries, 
  onNewEntry 
}) => {
  const today = new Date();
  const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const recentEmotions = emotions.filter(e => new Date(e.timestamp) >= oneWeekAgo);
  const recentEntries = journalEntries.filter(e => new Date(e.timestamp) >= oneWeekAgo);
  const recentReflections = reflectionEntries.filter(e => new Date(e.timestamp) >= oneWeekAgo);

  const getEmotionStats = () => {
    const emotionCounts: Record<string, number> = {};
    const intensitySum: Record<string, number> = {};

    emotions.forEach(emotion => {
      emotionCounts[emotion.name] = (emotionCounts[emotion.name] || 0) + 1;
      intensitySum[emotion.name] = (intensitySum[emotion.name] || 0) + emotion.intensity;
    });

    return Object.entries(emotionCounts).map(([name, count]) => ({
      name,
      count,
      averageIntensity: Math.round(intensitySum[name] / count),
    })).sort((a, b) => b.count - a.count);
  };

  const emotionStats = getEmotionStats();
  const totalEntries = journalEntries.length;
  const totalReflections = reflectionEntries.length;
  const daysActive = new Set([
    ...emotions.map(e => new Date(e.timestamp).toDateString()),
    ...journalEntries.map(e => new Date(e.timestamp).toDateString()),
    ...reflectionEntries.map(e => new Date(e.timestamp).toDateString())
  ]).size;
  const averageIntensity = emotions.length > 0 
    ? Math.round(emotions.reduce((sum, e) => sum + e.intensity, 0) / emotions.length)
    : 0;

  const getInsights = () => {
    const insights = [];
    
    if (daysActive >= 7) {
      insights.push("🌟 You've been consistently tracking your emotions - that's amazing self-awareness!");
    }
    
    if (totalEntries >= 5) {
      insights.push("📝 Your journaling practice is developing beautifully. Keep expressing yourself!");
    }

    if (totalReflections >= 3) {
      insights.push("🌅 Your daily reflection practice is building emotional intelligence!");
    }
    
    if (averageIntensity <= 5) {
      insights.push("🌈 Your emotional intensity has been relatively balanced recently.");
    }
    
    if (recentEmotions.length > 0) {
      const recentPositive = recentEmotions.filter(e => 
        ['Joyful', 'Content', 'Excited', 'Grateful'].includes(e.name)
      ).length;
      
      if (recentPositive > recentEmotions.length / 2) {
        insights.push("✨ You've been experiencing more positive emotions lately - wonderful!");
      }
    }

    if (recentReflections.length >= 3) {
      const avgMood = recentReflections.reduce((sum, r) => sum + r.mood, 0) / recentReflections.length;
      if (avgMood >= 7) {
        insights.push("😊 Your recent reflection moods show you're doing well overall!");
      }
    }

    return insights.length > 0 ? insights : ["🌱 Every emotion you track is a step toward greater self-understanding."];
  };

  const getStreakInfo = () => {
    const dates = [...new Set([
      ...emotions.map(e => new Date(e.timestamp).toDateString()),
      ...journalEntries.map(e => new Date(e.timestamp).toDateString()),
      ...reflectionEntries.map(e => new Date(e.timestamp).toDateString())
    ])].sort();

    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 1;

    for (let i = dates.length - 1; i >= 0; i--) {
      const currentDate = new Date(dates[i]);
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - currentStreak);

      if (currentDate.toDateString() === expectedDate.toDateString()) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate max streak
    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1]);
      const currDate = new Date(dates[i]);
      const diffTime = currDate.getTime() - prevDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempStreak++;
        maxStreak = Math.max(maxStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }

    return { currentStreak: Math.max(0, currentStreak - 1), maxStreak };
  };

  const streakInfo = getStreakInfo();

  if (emotions.length === 0 && journalEntries.length === 0 && reflectionEntries.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
            Your Emotional Journey
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Reflect on your progress and celebrate the growth in your emotional awareness and well-being.
          </p>
        </div>

        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Start Your Journey</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
            Begin tracking your emotions to see your progress and gain insights into your emotional patterns.
          </p>
          <button
            onClick={onNewEntry}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Record Your First Emotion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
          Your Emotional Journey
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
          Reflect on your progress and celebrate the growth in your emotional awareness and well-being.
        </p>
      </div>

      <div className="space-y-8">
        {/* Stats Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{daysActive}</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Days Active</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{emotions.length}</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Emotions Tracked</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{totalEntries}</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Journal Entries</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Sunrise className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{totalReflections}</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Reflections</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{averageIntensity}/10</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Avg. Intensity</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Charts */}
        <ProgressCharts 
          emotions={emotions}
          journalEntries={journalEntries}
          reflectionEntries={reflectionEntries}
        />

        {/* Streak Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-3xl p-6 border border-green-100 dark:border-green-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-green-800 dark:text-green-300">Current Streak</h3>
                <p className="text-green-600 dark:text-green-400 text-sm">Days of consistent tracking</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-green-800 dark:text-green-300">{streakInfo.currentStreak} days</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-3xl p-6 border border-purple-100 dark:border-purple-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-purple-800 dark:text-purple-300">Best Streak</h3>
                <p className="text-purple-600 dark:text-purple-400 text-sm">Your longest streak ever</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-purple-800 dark:text-purple-300">{streakInfo.maxStreak} days</p>
          </div>
        </div>

        {/* Most Common Emotions */}
        {emotionStats.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Most Common Emotions</h3>
            <div className="space-y-4">
              {emotionStats.slice(0, 5).map((stat, index) => (
                <div key={stat.name} className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-800 dark:text-white">{stat.name}</span>
                      <span className="text-gray-600 dark:text-gray-300 text-sm">{stat.count} times</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(stat.count / emotionStats[0].count) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 text-sm">
                    Avg. {stat.averageIntensity}/10
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Insights */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-3xl p-8 border border-green-100 dark:border-green-700">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-4">Your Insights</h3>
              <div className="space-y-3">
                {getInsights().map((insight, index) => (
                  <p key={index} className="text-green-700 dark:text-green-300 leading-relaxed">
                    {insight}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {(recentEmotions.length > 0 || recentEntries.length > 0 || recentReflections.length > 0) && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">This Week's Activity</h3>
            
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recent Emotions */}
              {recentEmotions.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center space-x-2">
                    <Heart className="w-4 h-4" />
                    <span>Emotions</span>
                  </h4>
                  <div className="space-y-2">
                    {recentEmotions.slice(-4).map((emotion, index) => (
                      <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-800 dark:text-white text-sm">{emotion.name}</span>
                          <span className="text-gray-600 dark:text-gray-300 text-xs">{emotion.intensity}/10</span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">
                          {new Date(emotion.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Journal Entries */}
              {recentEntries.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center space-x-2">
                    <BookOpen className="w-4 h-4" />
                    <span>Journal Entries</span>
                  </h4>
                  <div className="space-y-2">
                    {recentEntries.slice(-3).map((entry, index) => (
                      <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2 mb-1">
                          {entry.content.substring(0, 60)}...
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">
                          {new Date(entry.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Reflections */}
              {recentReflections.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center space-x-2">
                    <Sunrise className="w-4 h-4" />
                    <span>Reflections</span>
                  </h4>
                  <div className="space-y-2">
                    {recentReflections.slice(-3).map((reflection, index) => (
                      <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">Daily Reflection</span>
                          <span className="text-gray-600 dark:text-gray-300 text-xs">{reflection.mood}/10</span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">
                          {new Date(reflection.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="text-center">
          <button
            onClick={onNewEntry}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Continue Your Journey
          </button>
        </div>
      </div>
    </div>
  );
};