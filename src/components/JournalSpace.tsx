import React, { useState } from 'react';
import { Save, ArrowRight } from 'lucide-react';
import type { Emotion, JournalEntry } from '../App';

interface JournalSpaceProps {
  selectedEmotion: Emotion | null;
  onSaveEntry: (entry: JournalEntry) => void;
  onNext: () => void;
}

const prompts = [
  "What triggered this feeling?",
  "How is this emotion showing up in your body?",
  "What would you like to say to someone who cares about you?",
  "What do you need right now to feel supported?",
  "If this emotion could speak, what would it tell you?",
  "What would you tell a friend experiencing this same feeling?",
];

export const JournalSpace: React.FC<JournalSpaceProps> = ({
  selectedEmotion,
  onSaveEntry,
  onNext,
}) => {
  const [content, setContent] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    if (!selectedEmotion || !content.trim()) return;

    const entry: JournalEntry = {
      id: Date.now().toString(),
      content: content.trim(),
      emotion: selectedEmotion,
      timestamp: new Date(),
    };

    onSaveEntry(entry);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const usePrompt = (prompt: string) => {
    setSelectedPrompt(prompt);
    setContent(prev => prev + (prev ? '\n\n' : '') + prompt + '\n');
  };

  if (!selectedEmotion) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-600 dark:text-gray-300">Please select an emotion first.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className={`inline-flex items-center space-x-3 px-6 py-3 rounded-2xl bg-gradient-to-r ${selectedEmotion.color} mb-4`}>
          <span className="text-white font-semibold text-lg">{selectedEmotion.name}</span>
          <span className="text-white/80 text-sm">Intensity: {selectedEmotion.intensity}/10</span>
        </div>
        <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
          Your Safe Space to Express
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
          This is your private, judgment-free zone. Write whatever comes to mind—your thoughts, feelings, experiences, or anything you need to express.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Your Thoughts</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Let your thoughts flow freely...</p>
            </div>
            <div className="p-6">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing... Remember, this is your safe space. You can share anything that's on your mind or in your heart."
                className="w-full h-80 p-4 border-0 resize-none focus:outline-none text-gray-700 dark:text-gray-200 leading-relaxed placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-transparent"
                style={{ fontSize: '16px' }}
              />
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {content.length} characters
              </span>
              <div className="flex space-x-3">
                <button
                  onClick={handleSave}
                  disabled={!content.trim()}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    content.trim()
                      ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaved ? 'Saved!' : 'Save Entry'}</span>
                </button>
                <button
                  onClick={onNext}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Writing Prompts</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Need help getting started? Try one of these gentle prompts:
              </p>
              <div className="space-y-2">
                {prompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => usePrompt(prompt)}
                    className="w-full text-left p-3 rounded-xl bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-sm transition-colors duration-200 border border-purple-100 dark:border-purple-700 hover:border-purple-200 dark:hover:border-purple-600"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-3xl p-6 border border-blue-100 dark:border-blue-700">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Gentle Reminder</h4>
              <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
                There's no right or wrong way to express yourself here. Your feelings are valid, and taking time to acknowledge them is an act of self-care.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};