import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { Calendar, TrendingUp, PieChart as PieChartIcon, BarChart3, RefreshCw } from 'lucide-react';
import { 
  getProgressLogsFromFirestore, 
  subscribeToProgressLogs, 
  getProgressLogsByDateRange,
  type ProgressLog 
} from '../lib/progressLogs';
import type { Emotion, JournalEntry, ReflectionEntry } from '../App';

interface ProgressChartsProps {
  emotions: Emotion[];
  journalEntries: JournalEntry[];
  reflectionEntries: ReflectionEntry[];
}

type TimeRange = 'week' | 'month';

const EMOTION_COLORS = {
  'Joyful': '#F59E0B',
  'Content': '#10B981',
  'Excited': '#F97316',
  'Grateful': '#EC4899',
  'Sad': '#3B82F6',
  'Lonely': '#6366F1',
  'Disappointed': '#6B7280',
  'Melancholic': '#8B5CF6',
  'Angry': '#EF4444',
  'Frustrated': '#F97316',
  'Irritated': '#FBBF24',
  'Resentful': '#F87171',
  'Anxious': '#8B5CF6',
  'Fearful': '#6B7280',
  'Overwhelmed': '#06B6D4',
  'Stressed': '#F87171',
  'Reflective': '#8B5CF6'
};

export const ProgressCharts: React.FC<ProgressChartsProps> = ({ 
  emotions, 
  journalEntries, 
  reflectionEntries 
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [activeChart, setActiveChart] = useState<'bar' | 'pie' | 'line'>('bar');
  const [progressLogs, setProgressLogs] = useState<ProgressLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load progress logs from Firestore
  useEffect(() => {
    const loadProgressLogs = async () => {
      if (!isOnline) {
        // Use local data when offline
        const localData = emotions.map(emotion => ({
          id: emotion.id,
          userId: 'local',
          emotion: emotion.name,
          intensity: emotion.intensity,
          timestamp: emotion.timestamp,
          type: 'emotion' as const
        }));
        setProgressLogs(localData);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const logs = await getProgressLogsFromFirestore();
        setProgressLogs(logs);
      } catch (error) {
        console.error('Error loading progress logs:', error);
        // Fallback to local data
        const localData = emotions.map(emotion => ({
          id: emotion.id,
          userId: 'local',
          emotion: emotion.name,
          intensity: emotion.intensity,
          timestamp: emotion.timestamp,
          type: 'emotion' as const
        }));
        setProgressLogs(localData);
      } finally {
        setIsLoading(false);
      }
    };

    loadProgressLogs();
  }, [emotions, isOnline]);

  // Set up real-time listener when online
  useEffect(() => {
    if (!isOnline) return;

    const unsubscribe = subscribeToProgressLogs((logs) => {
      setProgressLogs(logs);
      setIsLoading(false);
    });

    return unsubscribe;
  }, [isOnline]);

  const filteredData = useMemo(() => {
    const now = new Date();
    const daysBack = timeRange === 'week' ? 7 : 30;
    const cutoffDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
    
    return progressLogs.filter(log => new Date(log.timestamp) >= cutoffDate);
  }, [progressLogs, timeRange]);

  // Prepare data for bar chart (emotion frequencies)
  const barChartData = useMemo(() => {
    const emotionCounts: Record<string, number> = {};
    
    filteredData.forEach(log => {
      emotionCounts[log.emotion] = (emotionCounts[log.emotion] || 0) + 1;
    });

    return Object.entries(emotionCounts)
      .map(([name, count]) => ({
        emotion: name,
        count,
        fill: EMOTION_COLORS[name as keyof typeof EMOTION_COLORS] || '#8B5CF6'
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8); // Show top 8 emotions
  }, [filteredData]);

  // Prepare data for pie chart (mood distribution)
  const pieChartData = useMemo(() => {
    const moodCategories = {
      'Positive': ['Joyful', 'Content', 'Excited', 'Grateful'],
      'Neutral': ['Melancholic', 'Reflective'],
      'Challenging': ['Sad', 'Lonely', 'Disappointed', 'Angry', 'Frustrated', 'Irritated', 'Resentful', 'Anxious', 'Fearful', 'Overwhelmed', 'Stressed']
    };

    const categoryCounts = {
      'Positive': 0,
      'Neutral': 0,
      'Challenging': 0
    };

    filteredData.forEach(log => {
      for (const [category, emotionList] of Object.entries(moodCategories)) {
        if (emotionList.includes(log.emotion)) {
          categoryCounts[category as keyof typeof categoryCounts]++;
          break;
        }
      }
    });

    return [
      { name: 'Positive', value: categoryCounts.Positive, fill: '#10B981' },
      { name: 'Neutral', value: categoryCounts.Neutral, fill: '#F59E0B' },
      { name: 'Challenging', value: categoryCounts.Challenging, fill: '#EF4444' }
    ].filter(item => item.value > 0);
  }, [filteredData]);

  // Prepare data for line chart (mood trend over time)
  const lineChartData = useMemo(() => {
    const dailyData: Record<string, { date: string; averageIntensity: number; count: number; total: number }> = {};
    
    filteredData.forEach(log => {
      const date = new Date(log.timestamp).toLocaleDateString();
      if (!dailyData[date]) {
        dailyData[date] = { date, averageIntensity: 0, count: 0, total: 0 };
      }
      dailyData[date].total += log.intensity;
      dailyData[date].count += 1;
    });

    return Object.values(dailyData)
      .map(day => ({
        ...day,
        averageIntensity: Math.round(day.total / day.count)
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-14); // Show last 14 days max
  }, [filteredData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
          <p className="text-gray-800 dark:text-white font-medium">{label}</p>
          <p className="text-purple-600 dark:text-purple-400">
            {`${payload[0].dataKey}: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const refreshData = async () => {
    if (!isOnline) return;
    
    setIsLoading(true);
    try {
      const logs = await getProgressLogsFromFirestore();
      setProgressLogs(logs);
    } catch (error) {
      console.error('Error refreshing progress logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-purple-100 dark:border-purple-700 border-t-purple-500 dark:border-t-purple-400 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Loading your progress data...</p>
      </div>
    );
  }

  if (progressLogs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <BarChart3 className="w-12 h-12 text-purple-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">No Data Yet</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
          Start tracking your emotions to see beautiful insights and trends about your emotional journey.
        </p>
        {!isOnline && (
          <div className="bg-orange-50 dark:bg-orange-900/50 border border-orange-200 dark:border-orange-700 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-orange-700 dark:text-orange-300 text-sm">
              You're currently offline. Charts will sync when you reconnect to the internet.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Progress Analytics</h2>
        {isOnline && (
          <button
            onClick={refreshData}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        )}
      </div>

      {/* Offline indicator */}
      {!isOnline && (
        <div className="bg-orange-50 dark:bg-orange-900/50 border border-orange-200 dark:border-orange-700 rounded-lg p-4">
          <p className="text-orange-700 dark:text-orange-300 text-sm">
            You're currently offline. Showing cached data. Charts will sync when you reconnect.
          </p>
        </div>
      )}

      {/* Time Range Toggle */}
      <div className="flex justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-sm border border-gray-100 dark:border-gray-700">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              timeRange === 'week'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              timeRange === 'month'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
            }`}
          >
            This Month
          </button>
        </div>
      </div>

      {/* Chart Type Selector */}
      <div className="flex justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-sm border border-gray-100 dark:border-gray-700">
          <button
            onClick={() => setActiveChart('bar')}
            className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeChart === 'bar'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Frequency</span>
          </button>
          <button
            onClick={() => setActiveChart('pie')}
            className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeChart === 'pie'
                ? 'bg-green-600 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400'
            }`}
          >
            <PieChartIcon className="w-4 h-4" />
            <span>Distribution</span>
          </button>
          <button
            onClick={() => setActiveChart('line')}
            className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeChart === 'line'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Trend</span>
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
        {activeChart === 'bar' && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
              Emotion Frequency - {timeRange === 'week' ? 'This Week' : 'This Month'}
            </h3>
            {barChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="emotion" 
                    tick={{ fontSize: 12 }}
                    className="text-gray-600 dark:text-gray-300"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    className="text-gray-600 dark:text-gray-300"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                No emotion data for the selected time period
              </div>
            )}
          </div>
        )}

        {activeChart === 'pie' && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
              Mood Distribution - {timeRange === 'week' ? 'This Week' : 'This Month'}
            </h3>
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                No mood data for the selected time period
              </div>
            )}
          </div>
        )}

        {activeChart === 'line' && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
              Emotion Intensity Trend - {timeRange === 'week' ? 'This Week' : 'This Month'}
            </h3>
            {lineChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={lineChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    className="text-gray-600 dark:text-gray-300"
                  />
                  <YAxis 
                    domain={[1, 10]}
                    tick={{ fontSize: 12 }}
                    className="text-gray-600 dark:text-gray-300"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="averageIntensity" 
                    stroke="#8B5CF6" 
                    strokeWidth={3}
                    dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: '#8B5CF6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                No trend data for the selected time period
              </div>
            )}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl p-6 border border-blue-100 dark:border-blue-700">
          <div className="flex items-center space-x-3 mb-2">
            <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h4 className="font-semibold text-blue-800 dark:text-blue-300">Total Entries</h4>
          </div>
          <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">{filteredData.length}</p>
          <p className="text-blue-600 dark:text-blue-400 text-sm">
            {timeRange === 'week' ? 'This week' : 'This month'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl p-6 border border-green-100 dark:border-green-700">
          <div className="flex items-center space-x-3 mb-2">
            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            <h4 className="font-semibold text-green-800 dark:text-green-300">Avg. Intensity</h4>
          </div>
          <p className="text-2xl font-bold text-green-800 dark:text-green-300">
            {filteredData.length > 0 
              ? Math.round(filteredData.reduce((sum, log) => sum + log.intensity, 0) / filteredData.length)
              : 0
            }/10
          </p>
          <p className="text-green-600 dark:text-green-400 text-sm">
            Emotional intensity
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl p-6 border border-purple-100 dark:border-purple-700">
          <div className="flex items-center space-x-3 mb-2">
            <PieChartIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h4 className="font-semibold text-purple-800 dark:text-purple-300">Most Common</h4>
          </div>
          <p className="text-2xl font-bold text-purple-800 dark:text-purple-300">
            {barChartData.length > 0 ? barChartData[0].emotion : 'None'}
          </p>
          <p className="text-purple-600 dark:text-purple-400 text-sm">
            Primary emotion
          </p>
        </div>
      </div>

      {/* Data Source Info */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 text-center">
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          {isOnline ? (
            <>
              📊 Data synced with Firestore • {progressLogs.length} total entries • Real-time updates enabled
            </>
          ) : (
            <>
              💾 Showing cached data • Will sync when online • {progressLogs.length} total entries
            </>
          )}
        </p>
      </div>
    </div>
  );
};