'use client';

import React from 'react';
import { InfoQuestion as InfoQuestionType } from '@/types/survey';
import { motion } from 'framer-motion';
import AnimatedButton from './animations/AnimatedButton';

interface InfoQuestionProps {
  question: InfoQuestionType;
  onContinue: () => void;
}

export default function InfoQuestion({ question, onContinue }: InfoQuestionProps) {
  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="p-6 bg-blue-50 border-l-4 border-primary rounded-lg"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <motion.p
          className="text-gray-800 whitespace-pre-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {question.content}
        </motion.p>
      </motion.div>

      <AnimatedButton onClick={onContinue} className="w-full">
        Continue
      </AnimatedButton>
    </motion.div>
  );
}
