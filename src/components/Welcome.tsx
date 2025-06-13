import React from 'react';
import { Heart, Shield, Compass, Users, ArrowRight, Sparkles } from 'lucide-react';

interface WelcomeProps {
  onGetStarted: () => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onGetStarted }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Heart className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Welcome to Your Safe Space
        </h2>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          A judgment-free zone where you can explore, express, and understand your emotions with gentle guidance and support.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            icon: Shield,
            title: 'Safe & Private',
            description: 'Your thoughts and feelings are completely private and secure.',
            color: 'from-green-400 to-emerald-500',
          },
          {
            icon: Heart,
            title: 'No Judgment',
            description: 'Express yourself freely without fear of criticism or analysis.',
            color: 'from-pink-400 to-rose-500',
          },
          {
            icon: Compass,
            title: 'Gentle Guidance',
            description: 'Receive supportive suggestions and coping strategies.',
            color: 'from-blue-400 to-indigo-500',
          },
          {
            icon: Users,
            title: 'Personal Growth',
            description: 'Develop emotional awareness and regulation skills.',
            color: 'from-purple-400 to-violet-500',
          },
        ].map((feature, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
          >
            <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-3 md:mb-4`}>
              <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
        <h3 className="text-xl md:text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">How It Works</h3>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              step: '1',
              title: 'Check Your Emotions',
              description: 'Start by selecting how you\'re feeling right now from our emotion selector.',
            },
            {
              step: '2',
              title: 'Express Yourself',
              description: 'Write freely in your private journal space. Let your thoughts flow without worry.',
            },
            {
              step: '3',
              title: 'Find Your Balance',
              description: 'Get personalized breathing exercises, meditations, and gentle guidance.',
            },
          ].map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4 shadow-lg">
                {step.step}
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={onGetStarted}
          className="inline-flex items-center space-x-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-lg"
        >
          <Sparkles className="w-5 h-5" />
          <span>Begin Your Journey</span>
          <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">
          Take the first step towards emotional well-being
        </p>
      </div>

      {/* Quick Stats Preview */}
      <div className="mt-12 grid grid-cols-3 gap-4 max-w-md mx-auto">
        <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-xl border border-purple-100 dark:border-purple-700">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">5+</div>
          <div className="text-xs text-purple-600 dark:text-purple-400">Features</div>
        </div>
        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-100 dark:border-blue-700">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">24/7</div>
          <div className="text-xs text-blue-600 dark:text-blue-400">Available</div>
        </div>
        <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-xl border border-green-100 dark:border-green-700">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">100%</div>
          <div className="text-xs text-green-600 dark:text-green-400">Private</div>
        </div>
      </div>
    </div>
  );
};