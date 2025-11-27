'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface AnimatedAvatarProps {
  isThinking?: boolean;
  emotion?: 'happy' | 'neutral' | 'excited' | 'concerned';
}

export default function AnimatedAvatar({ isThinking = false, emotion = 'happy' }: AnimatedAvatarProps) {
  const [blink, setBlink] = useState(false);

  // Random blinking effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, Math.random() * 3000 + 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Eye shapes based on emotion
  const getEyeShape = () => {
    if (blink) return 'M20,0 L80,0';

    switch (emotion) {
      case 'happy':
        return 'M20,10 Q50,-10 80,10';
      case 'excited':
        return 'M20,0 Q50,-20 80,0';
      case 'concerned':
        return 'M20,-10 Q50,10 80,-10';
      default:
        return 'M20,0 L80,0';
    }
  };

  const getMouthShape = () => {
    switch (emotion) {
      case 'happy':
        return 'M30,20 Q50,40 70,20';
      case 'excited':
        return 'M25,15 Q50,50 75,15';
      case 'concerned':
        return 'M30,30 Q50,20 70,30';
      default:
        return 'M30,25 L70,25';
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Floating animation container */}
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative"
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full blur-2xl opacity-30"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Main avatar container */}
        <motion.div className="relative z-10">
          <svg
            width="300"
            height="400"
            viewBox="0 0 300 400"
            className="drop-shadow-2xl"
          >
            {/* Head */}
            <motion.ellipse
              cx="150"
              cy="150"
              rx="90"
              ry="100"
              fill="#FFE4C4"
              stroke="#FFA07A"
              strokeWidth="2"
              animate={isThinking ? { rotate: [-2, 2, -2] } : {}}
              transition={{ duration: 0.5, repeat: isThinking ? Infinity : 0 }}
            />

            {/* Hair */}
            <motion.path
              d="M60,100 Q50,50 90,40 Q120,20 150,30 Q180,20 210,40 Q250,50 240,100 Z"
              fill="#4A4A4A"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Hair details */}
            <path
              d="M100,50 Q110,30 120,40"
              stroke="#333"
              strokeWidth="3"
              fill="none"
              opacity="0.3"
            />
            <path
              d="M180,50 Q170,30 160,40"
              stroke="#333"
              strokeWidth="3"
              fill="none"
              opacity="0.3"
            />

            {/* Left eye */}
            <motion.g>
              <ellipse cx="120" cy="130" rx="15" ry="18" fill="white" />
              <motion.circle
                cx="120"
                cy="130"
                r="8"
                fill="#4A90E2"
                animate={isThinking ? { x: [0, 5, 0] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <circle cx="123" cy="127" r="3" fill="white" opacity="0.8" />
              <motion.path
                d={getEyeShape()}
                transform="translate(105, 110)"
                stroke="#4A4A4A"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
            </motion.g>

            {/* Right eye */}
            <motion.g>
              <ellipse cx="180" cy="130" rx="15" ry="18" fill="white" />
              <motion.circle
                cx="180"
                cy="130"
                r="8"
                fill="#4A90E2"
                animate={isThinking ? { x: [0, 5, 0] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <circle cx="183" cy="127" r="3" fill="white" opacity="0.8" />
              <motion.path
                d={getEyeShape()}
                transform="translate(165, 110)"
                stroke="#4A4A4A"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
            </motion.g>

            {/* Nose */}
            <line
              x1="150"
              y1="150"
              x2="145"
              y2="160"
              stroke="#FFA07A"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Mouth */}
            <motion.path
              d={getMouthShape()}
              transform="translate(100, 155)"
              stroke="#FF6B6B"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              animate={isThinking ? { d: 'M30,25 L70,25' } : {}}
            />

            {/* Blush */}
            <ellipse
              cx="100"
              cy="160"
              rx="15"
              ry="8"
              fill="#FFB6C1"
              opacity="0.4"
            />
            <ellipse
              cx="200"
              cy="160"
              rx="15"
              ry="8"
              fill="#FFB6C1"
              opacity="0.4"
            />

            {/* Neck */}
            <rect
              x="130"
              y="240"
              width="40"
              height="30"
              fill="#FFE4C4"
              stroke="#FFA07A"
              strokeWidth="2"
            />

            {/* Body */}
            <motion.path
              d="M110,270 L190,270 L210,380 L90,380 Z"
              fill="#E8E8FF"
              stroke="#9B9BFF"
              strokeWidth="2"
              animate={{ scale: [1, 1.01, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Shirt collar */}
            <path
              d="M130,270 L150,290 L170,270"
              fill="#D8D8FF"
              stroke="#9B9BFF"
              strokeWidth="2"
            />

            {/* Thinking bubbles */}
            {isThinking && (
              <>
                <motion.circle
                  cx="220"
                  cy="100"
                  r="5"
                  fill="white"
                  stroke="#CCC"
                  strokeWidth="2"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 1 }}
                />
                <motion.circle
                  cx="240"
                  cy="80"
                  r="8"
                  fill="white"
                  stroke="#CCC"
                  strokeWidth="2"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2, repeat: Infinity, repeatDelay: 1 }}
                />
                <motion.circle
                  cx="265"
                  cy="60"
                  r="12"
                  fill="white"
                  stroke="#CCC"
                  strokeWidth="2"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.4, repeat: Infinity, repeatDelay: 1 }}
                />
              </>
            )}
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
