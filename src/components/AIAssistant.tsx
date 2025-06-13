import React, { useState } from 'react';
import { MessageCircle, Send, Heart, Brain, Lightbulb, Shield, AlertTriangle } from 'lucide-react';
import type { Emotion } from '../App';

interface AIAssistantProps {
  selectedEmotion: Emotion | null;
  recentEmotions: Emotion[];
}

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const getContextualResponse = (userMessage: string, emotion: Emotion | null, recentEmotions: Emotion[]) => {
  const message = userMessage.toLowerCase();
  
  // Safety responses for crisis situations
  if (message.includes('hurt myself') || message.includes('suicide') || message.includes('end it all') || message.includes('kill myself')) {
    return {
      content: "I'm really concerned about you right now. Please reach out to someone who can help immediately:\n\n🆘 National Suicide Prevention Lifeline: 988\n🆘 Crisis Text Line: Text HOME to 741741\n🆘 International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/\n\nYou matter, and there are people who want to help you through this difficult time. Please don't face this alone.",
      type: 'crisis'
    };
  }

  // Emotional context responses
  if (emotion) {
    const emotionName = emotion.name.toLowerCase();
    
    if (message.includes('why') && (emotionName.includes('sad') || emotionName.includes('angry') || emotionName.includes('anxious'))) {
      return {
        content: `It sounds like you're trying to understand your ${emotion.name.toLowerCase()} feelings, which shows great self-awareness. Sometimes our emotions arise from:\n\n• Unmet needs or expectations\n• Past experiences being triggered\n• Physical factors like stress or fatigue\n• Changes in our environment or relationships\n\nWhat do you think might be contributing to how you're feeling right now?`,
        type: 'supportive'
      };
    }

    if (message.includes('help') || message.includes('what should i do')) {
      const suggestions = {
        'sad': 'When feeling sad, it can help to:\n• Allow yourself to feel the emotion without judgment\n• Reach out to someone you trust\n• Engage in gentle self-care\n• Consider what your sadness might be telling you about what you need',
        'angry': 'When feeling angry, try:\n• Taking slow, deep breaths\n• Physical movement to release the energy\n• Identifying what boundary might need to be set\n• Expressing your feelings in a safe way (like journaling)',
        'anxious': 'For anxiety, consider:\n• Grounding techniques (5-4-3-2-1 method)\n• Slow, deep breathing\n• Reminding yourself that feelings are temporary\n• Breaking overwhelming tasks into smaller steps',
        'joyful': 'To nurture your joy:\n• Share it with someone you care about\n• Take time to savor this positive feeling\n• Practice gratitude for what brought you happiness\n• Consider how you can create more moments like this'
      };
      
      return {
        content: suggestions[emotionName as keyof typeof suggestions] || 'Every emotion has wisdom to offer. What feels most supportive for you right now?',
        type: 'guidance'
      };
    }
  }

  // Pattern recognition from recent emotions
  if (recentEmotions.length >= 3) {
    const recentNames = recentEmotions.slice(-3).map(e => e.name.toLowerCase());
    const hasPattern = recentNames.every(name => name === recentNames[0]);
    
    if (hasPattern && message.includes('pattern') || message.includes('always feel')) {
      return {
        content: `I notice you've been experiencing ${recentNames[0]} feelings recently. Patterns in our emotions often point to something important:\n\n• They might highlight a recurring need\n• They could indicate an area for growth\n• They may show us what environments or situations affect us most\n\nWhat do you think this pattern might be telling you about what you need right now?`,
        type: 'insight'
      };
    }
  }

  // General supportive responses
  const supportiveResponses = [
    "Thank you for sharing that with me. Your feelings are completely valid, and it takes courage to express them.",
    "I hear you, and I want you to know that whatever you're experiencing right now is okay. You're not alone in this.",
    "It sounds like you're going through something difficult. Remember that emotions are temporary visitors, not permanent residents.",
    "Your emotional experience is unique and important. What feels most supportive for you in this moment?",
    "I appreciate you trusting me with your feelings. What would you like to explore more about what you're experiencing?"
  ];

  return {
    content: supportiveResponses[Math.floor(Math.random() * supportiveResponses.length)],
    type: 'supportive'
  };
};

const quickStarters = [
  "I'm feeling overwhelmed and don't know what to do",
  "Why do I keep feeling this way?",
  "I need help processing my emotions",
  "How can I feel better right now?",
  "I'm struggling with my thoughts today",
  "Can you help me understand what I'm feeling?"
];

export const AIAssistant: React.FC<AIAssistantProps> = ({ selectedEmotion, recentEmotions }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hello! I'm here to provide gentle support and a listening ear. ${selectedEmotion ? `I see you're feeling ${selectedEmotion.name.toLowerCase()} right now.` : ''} How can I support you today?`,
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const response = getContextualResponse(inputMessage, selectedEmotion, recentEmotions);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const useQuickStarter = (starter: string) => {
    setInputMessage(starter);
  };

  const getMessageIcon = (content: string) => {
    if (content.includes('Crisis') || content.includes('Suicide')) return AlertTriangle;
    if (content.includes('pattern') || content.includes('insight')) return Brain;
    if (content.includes('try:') || content.includes('consider:')) return Lightbulb;
    return Heart;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
          AI Emotional Support
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
          A compassionate AI companion to help you process your emotions and find gentle guidance.
        </p>
      </div>

      {/* Important Notice */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl p-6 border border-amber-200 dark:border-amber-700 mb-8">
        <div className="flex items-start space-x-3">
          <Shield className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">Important Notice</h3>
            <p className="text-amber-700 dark:text-amber-300 text-sm leading-relaxed">
              This AI assistant provides emotional support and guidance, but it's not a replacement for professional mental health care. 
              If you're experiencing a crisis or persistent mental health concerns, please reach out to a qualified mental health professional 
              or crisis helpline.
            </p>
          </div>
        </div>
      </div>

      {/* Dappier AI Widget Integration */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Enhanced AI Support</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Get additional AI-powered insights and support for your emotional journey.
          </p>
        </div>
        <div className="p-6">
          <div id="dappier-ask-ai-widget">
            <dappier-ask-ai-widget widgetId="wd_01jxjvr9pmf5zr2dxdjz6ddwcq" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.isUser
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}>
                {!message.isUser && (
                  <div className="flex items-center space-x-2 mb-2">
                    {React.createElement(getMessageIcon(message.content), { 
                      className: "w-4 h-4 text-purple-600 dark:text-purple-400" 
                    })}
                    <span className="text-xs font-medium text-purple-600 dark:text-purple-400">AI Assistant</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                <p className={`text-xs mt-2 ${
                  message.isUser ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-3 rounded-2xl max-w-xs">
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-xs font-medium text-purple-600 dark:text-purple-400">AI Assistant</span>
                </div>
                <div className="flex space-x-1 mt-2">
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Starters */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quick conversation starters:</h4>
          <div className="flex flex-wrap gap-2">
            {quickStarters.slice(0, 3).map((starter, index) => (
              <button
                key={index}
                onClick={() => useQuickStarter(starter)}
                className="text-xs px-3 py-2 bg-white dark:bg-gray-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-purple-200 dark:hover:border-purple-600 transition-colors duration-200"
              >
                {starter}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-700">
          <div className="flex space-x-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Share what's on your mind..."
              className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
              disabled={isTyping}
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                inputMessage.trim() && !isTyping
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl border border-blue-100 dark:border-blue-700">
        <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">How This AI Assistant Helps</h4>
        <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
          This AI provides emotional support through active listening, validation, gentle guidance, and coping strategies. 
          It's designed to be non-judgmental and supportive, helping you process emotions in a safe space.
        </p>
      </div>
    </div>
  );
};