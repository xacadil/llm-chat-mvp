'use client';

import React, { useState } from 'react';
import { ImagePinQuestion as ImagePinQuestionType } from '@/types/survey';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import AnimatedButton from './animations/AnimatedButton';

// Dynamically import 3D component to avoid SSR issues
const BodyModel3D = dynamic(() => import('./3d/BodyModel3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Loading 3D body model...</p>
      </div>
    </div>
  ),
});

interface ImagePinQuestion3DProps {
  question: ImagePinQuestionType;
  onSubmit: (bodyPart: string, position: [number, number, number]) => void;
}

export default function ImagePinQuestion3D({ question, onSubmit }: ImagePinQuestion3DProps) {
  const [selectedPart, setSelectedPart] = useState<{
    part: string;
    position: [number, number, number];
  } | null>(null);

  const handleSelect = (part: string, position: [number, number, number]) => {
    setSelectedPart({ part, position });
  };

  const handleSubmit = () => {
    if (selectedPart) {
      onSubmit(selectedPart.part, selectedPart.position);
    }
  };

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> This is a 3D interactive model! Rotate it by dragging, zoom with your mouse wheel, and click on body parts to select them.
        </p>
      </motion.div>

      <BodyModel3D onSelect={handleSelect} />

      {selectedPart && (
        <motion.div
          className="p-4 bg-green-50 border border-green-200 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-green-800">
            <strong>Selected:</strong> {selectedPart.part.replace(/-/g, ' ')}
          </p>
          <p className="text-sm text-green-600 mt-1">
            Position: ({selectedPart.position.map(v => v.toFixed(1)).join(', ')})
          </p>
        </motion.div>
      )}

      <AnimatedButton
        onClick={handleSubmit}
        disabled={!selectedPart}
        className="w-full"
      >
        {selectedPart ? '✓ Confirm Selection' : 'Select a body part to continue'}
      </AnimatedButton>
    </motion.div>
  );
}
