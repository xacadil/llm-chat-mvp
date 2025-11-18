'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Question, RadioQuestion } from '@/types/survey';

interface QuickRepliesProps {
  question: Question;
  onSelect: (value: string) => void;
}

export default function QuickReplies({ question, onSelect }: QuickRepliesProps) {
  if (question.type !== 'radio') return null;

  const radioQuestion = question as RadioQuestion;

  return (
    <motion.div
      className="flex justify-start mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="max-w-[80%] ml-13">
        <p className="text-xs text-gray-500 mb-2 ml-1">Quick replies:</p>
        <div className="flex flex-wrap gap-2">
          {radioQuestion.options.map((option, index) => (
            <motion.button
              key={option}
              onClick={() => onSelect(option)}
              className="px-4 py-2 bg-white border-2 border-gray-200 hover:border-blue-500 rounded-full text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors shadow-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {option}
            </motion.button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2 ml-1">
          💡 Or type your answer below in your own words
        </p>
      </div>
    </motion.div>
  );
}
