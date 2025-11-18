'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary';
}

export default function AnimatedButton({
  onClick,
  disabled = false,
  children,
  className = '',
  variant = 'primary',
}: AnimatedButtonProps) {
  const baseClass = variant === 'primary'
    ? 'bg-primary text-white hover:bg-blue-600'
    : 'bg-gray-200 text-gray-700 hover:bg-gray-300';

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-lg font-medium transition-colors ${baseClass} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
      whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
    >
      {children}
    </motion.button>
  );
}
