'use client';

import React, { useState } from 'react';
import { TextQuestion as TextQuestionType } from '@/types/survey';
import { motion } from 'framer-motion';
import AnimatedButton from './animations/AnimatedButton';

interface TextQuestionProps {
  question: TextQuestionType;
  onSubmit: (value: string) => void;
}

export default function TextQuestion({ question, onSubmit }: TextQuestionProps) {
  const [value, setValue] = useState('');
  const wordCount = value.trim().split(/\s+/).filter(Boolean).length;

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value);
    }
  };

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={question.placeholder || 'Type your answer here...'}
        rows={4}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none resize-none"
        whileFocus={{ borderColor: '#3b82f6', scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300 }}
      />

      <AnimatedButton
        onClick={handleSubmit}
        disabled={!value.trim()}
        className="w-full"
      >
        Submit Answer
      </AnimatedButton>

      <motion.p
        className="text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.span
          key={wordCount}
          initial={{ scale: 1.2, color: '#3b82f6' }}
          animate={{ scale: 1, color: '#6b7280' }}
        >
          {wordCount}
        </motion.span>{' '}
        words
      </motion.p>
    </motion.div>
  );
}
