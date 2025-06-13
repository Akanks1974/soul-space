import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { AIAssistant } from './AIAssistant';
import type { Emotion } from '../App';

interface FloatingAIAssistantProps {
  selectedEmotion: Emotion | null;
  recentEmotions: Emotion[];
}

export const FloatingAIAssistant: React.FC<FloatingAIAssistantProps> = ({ 
  selectedEmotion, 
  recentEmotions 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating AI Assistant Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-24 right-4 z-40 w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group ${
          isOpen ? 'rotate-180' : 'hover:-translate-y-1'
        }`}
        title="AI Emotional Support"
        aria-label="Open AI Assistant"
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform duration-300" />
        ) : (
          <MessageCircle className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
        )}
        
        {/* Pulse animation when closed */}
        {!isOpen && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 animate-ping opacity-20"></div>
        )}
      </button>

      {/* Chat Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div 
            className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 animate-in slide-in-from-bottom-4 fade-in-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">AI Emotional Support</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Your compassionate companion</p>
                </div>
              </div>
              <button
                onClick={toggleChat}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors duration-200"
                aria-label="Close AI Assistant"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <AIAssistant 
                selectedEmotion={selectedEmotion} 
                recentEmotions={recentEmotions}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};