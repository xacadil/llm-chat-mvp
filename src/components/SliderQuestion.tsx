'use client';

import React, { useState } from 'react';
import { SliderQuestion as SliderQuestionType } from '@/types/survey';
import { motion } from 'framer-motion';
import AnimatedButton from './animations/AnimatedButton';

interface SliderQuestionProps {
  question: SliderQuestionType;
  onSubmit: (value: number) => void;
}

export default function SliderQuestion({ question, onSubmit }: SliderQuestionProps) {
  const [value, setValue] = useState<number>(
    Math.floor((question.min + question.max) / 2)
  );
  const [textInput, setTextInput] = useState('');
  const [inputMode, setInputMode] = useState<'slider' | 'text'>('slider');

  const handleSliderSubmit = () => {
    onSubmit(value);
  };

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      const numValue = parseInt(textInput);
      if (!isNaN(numValue) && numValue >= question.min && numValue <= question.max) {
        onSubmit(numValue);
      } else {
        onSubmit(textInput as any);
      }
    }
  };

  return (
    <div className="space-y-4">
      <motion.div
        className="flex gap-2 mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.button
          onClick={() => setInputMode('slider')}
          className={`px-3 py-1 rounded text-sm ${
            inputMode === 'slider'
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Use Slider
        </motion.button>
        <motion.button
          onClick={() => setInputMode('text')}
          className={`px-3 py-1 rounded text-sm ${
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

      {inputMode === 'slider' ? (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="relative pt-6">
            <input
              type="range"
              min={question.min}
              max={question.max}
              step={question.step || 1}
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />

            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>{question.min}</span>
              <motion.span
                className="text-3xl font-bold text-primary"
                key={value}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {value}
              </motion.span>
              <span>{question.max}</span>
            </div>
          </div>

          <AnimatedButton onClick={handleSliderSubmit} className="w-full mt-4">
            Continue with {value}
          </AnimatedButton>
        </motion.div>
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
            placeholder={`Enter a number (${question.min}-${question.max}) or describe naturally...`}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
            whileFocus={{ scale: 1.01 }}
          />

          <AnimatedButton
            onClick={handleTextSubmit}
            disabled={!textInput.trim()}
            className="w-full"
          >
            Submit Answer
          </AnimatedButton>
        </motion.div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </div>
  );
}
