'use client';

import React, { KeyboardEvent } from 'react';
import { motion } from 'framer-motion';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = 'Type your answer...',
}: ChatInputProps) {
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !disabled) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <motion.div
      className="bg-white border-t border-gray-200 px-6 py-4"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="flex items-center gap-3">
        <motion.input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-full focus:border-blue-500 focus:outline-none transition-colors disabled:bg-gray-100"
          whileFocus={{ scale: 1.01 }}
        />
        <motion.button
          onClick={onSubmit}
          disabled={disabled || !value.trim()}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={!disabled && value.trim() ? { scale: 1.05 } : {}}
          whileTap={!disabled && value.trim() ? { scale: 0.95 } : {}}
        >
          Send
        </motion.button>
      </div>
    </motion.div>
  );
}
