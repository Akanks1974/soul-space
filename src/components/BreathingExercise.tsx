import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle } from 'lucide-react';

interface BreathingExerciseProps {
  onComplete: () => void;
}

export const BreathingExercise: React.FC<BreathingExerciseProps> = ({ onComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [count, setCount] = useState(4);
  const [cycle, setCycle] = useState(0);
  const [totalCycles, setTotalCycles] = useState(5);

  const phaseDurations = {
    inhale: 4,
    hold: 4,
    exhale: 6,
  };

  const phaseMessages = {
    inhale: 'Breathe in slowly and deeply',
    hold: 'Hold your breath gently',
    exhale: 'Breathe out slowly and completely',
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && count > 0) {
      interval = setInterval(() => {
        setCount(count - 1);
      }, 1000);
    } else if (isActive && count === 0) {
      if (phase === 'inhale') {
        setPhase('hold');
        setCount(phaseDurations.hold);
      } else if (phase === 'hold') {
        setPhase('exhale');
        setCount(phaseDurations.exhale);
      } else if (phase === 'exhale') {
        setCycle(cycle + 1);
        if (cycle + 1 >= totalCycles) {
          setIsActive(false);
          return;
        }
        setPhase('inhale');
        setCount(phaseDurations.inhale);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, count, phase, cycle, totalCycles]);

  const startExercise = () => {
    setIsActive(true);
    setPhase('inhale');
    setCount(phaseDurations.inhale);
    setCycle(0);
  };

  const pauseExercise = () => {
    setIsActive(false);
  };

  const resetExercise = () => {
    setIsActive(false);
    setPhase('inhale');
    setCount(phaseDurations.inhale);
    setCycle(0);
  };

  const isComplete = cycle >= totalCycles && !isActive;

  const getCircleSize = () => {
    if (phase === 'inhale') {
      return 'scale-150';
    } else if (phase === 'exhale') {
      return 'scale-75';
    }
    return 'scale-125';
  };

  const getCircleColor = () => {
    switch (phase) {
      case 'inhale':
        return 'from-blue-400 to-cyan-400';
      case 'hold':
        return 'from-purple-400 to-indigo-400';
      case 'exhale':
        return 'from-green-400 to-emerald-400';
      default:
        return 'from-blue-400 to-cyan-400';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
          Guided Breathing Exercise
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
          Take a few minutes to center yourself with this calming breathing exercise. 
          Follow the visual guide and let your breath bring you peace.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
        {!isComplete ? (
          <>
            <div className="mb-8">
              <div className="relative flex items-center justify-center h-80">
                <div
                  className={`w-48 h-48 rounded-full bg-gradient-to-br ${getCircleColor()} transition-all duration-1000 ease-in-out ${getCircleSize()} flex items-center justify-center shadow-2xl`}
                >
                  <div className="text-white text-center">
                    <div className="text-6xl font-bold mb-2">{count}</div>
                    <div className="text-lg font-medium opacity-90">
                      {phase.charAt(0).toUpperCase() + phase.slice(1)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                {phaseMessages[phase]}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Cycle {cycle + 1} of {totalCycles}
              </p>
            </div>

            <div className="flex justify-center space-x-4 mb-8">
              {!isActive ? (
                <button
                  onClick={startExercise}
                  className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <Play className="w-5 h-5" />
                  <span>{cycle > 0 ? 'Resume' : 'Start'}</span>
                </button>
              ) : (
                <button
                  onClick={pauseExercise}
                  className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <Pause className="w-5 h-5" />
                  <span>Pause</span>
                </button>
              )}
              <button
                onClick={resetExercise}
                className="flex items-center space-x-2 px-6 py-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Reset</span>
              </button>
            </div>
          </>
        ) : (
          <div className="py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Well Done! 🌟
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-md mx-auto">
              You've completed your breathing exercise. Take a moment to notice how you feel now.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={resetExercise}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Do Another Round
              </button>
              <button
                onClick={onComplete}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl border border-blue-100 dark:border-blue-700">
          <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Breathing Benefits</h4>
          <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
            Deep breathing activates your parasympathetic nervous system, helping to reduce stress, 
            lower heart rate, and promote a sense of calm and well-being.
          </p>
        </div>
      </div>
    </div>
  );
};