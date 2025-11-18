'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      <div className={`flex items-start gap-3 max-w-[80%] ${isUser ? 'flex-row-reverse' : ''}`}>
        {/* Avatar */}
        <motion.div
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg ${
            isUser ? 'bg-gradient-to-br from-blue-500 to-purple-500' : 'bg-gray-200'
          }`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          {isUser ? '👤' : '🤖'}
        </motion.div>

        {/* Message bubble */}
        <motion.div
          className={`rounded-2xl px-4 py-3 shadow-md ${
            isUser
              ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white'
              : 'bg-white text-gray-900'
          }`}
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
          <p className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-gray-400'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
