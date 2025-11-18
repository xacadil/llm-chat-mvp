'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuestionTransitionProps {
  children: React.ReactNode;
  questionId: string;
}

export default function QuestionTransition({ children, questionId }: QuestionTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={questionId}
        initial={{ opacity: 0, x: 50, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: -50, scale: 0.95 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
