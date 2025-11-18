'use client';

import React, { useState } from 'react';
import { RadioQuestion as RadioQuestionType } from '@/types/survey';
import { motion } from 'framer-motion';
import AnimatedButton from './animations/AnimatedButton';

interface RadioQuestionProps {
  question: RadioQuestionType;
  onSubmit: (value: string, naturalLanguageInput?: string) => void;
}

export default function RadioQuestion({ question, onSubmit }: RadioQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [textInput, setTextInput] = useState('');
  const [inputMode, setInputMode] = useState<'buttons' | 'text'>('buttons');

  const handleButtonSubmit = () => {
    if (selectedOption) {
      onSubmit(selectedOption);
    }
  };

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      onSubmit(textInput, textInput);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toggle between button and text input */}
      <motion.div
        className="flex gap-2 mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.button
          onClick={() => setInputMode('buttons')}
          className={`px-3 py-1 rounded text-sm transition-colors ${
            inputMode === 'buttons'
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Select Option
        </motion.button>
        <motion.button
          onClick={() => setInputMode('text')}
          className={`px-3 py-1 rounded text-sm transition-colors ${
            inputMode === 'text'
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Type Answer
        </motion.button>
      </motion.div>

      {inputMode === 'buttons' ? (
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <motion.label
              key={option}
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedOption === option
                  ? 'border-primary bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <input
                type="radio"
                name={question.id}
                value={option}
                checked={selectedOption === option}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="w-4 h-4 text-primary"
              />
              <span className="ml-3 text-gray-900">{option}</span>
              {selectedOption === option && (
                <motion.span
                  className="ml-auto text-primary"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500 }}
                >
                  ✓
                </motion.span>
              )}
            </motion.label>
          ))}

          <AnimatedButton
            onClick={handleButtonSubmit}
            disabled={!selectedOption}
            className="w-full mt-4"
          >
            Continue
          </AnimatedButton>
        </div>
      ) : (
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
            placeholder="Type your answer naturally..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            whileFocus={{ scale: 1.01 }}
          />

          <AnimatedButton
            onClick={handleTextSubmit}
            disabled={!textInput.trim()}
            className="w-full"
          >
            Submit Answer
          </AnimatedButton>

          <motion.p
            className="text-sm text-gray-500 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Available options: {question.options.join(', ')}
          </motion.p>
        </motion.div>
      )}
    </div>
  );
}
