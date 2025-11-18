'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Question, SliderQuestion, ImagePinQuestion } from '@/types/survey';
import dynamic from 'next/dynamic';

const BodyModel3D = dynamic(() => import('../3d/BodyModel3D'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />,
});

interface InlineSurveyElementProps {
  question: Question;
  onSubmit: (value: any) => void;
}

export default function InlineSurveyElement({ question, onSubmit }: InlineSurveyElementProps) {
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [selectedBody, setSelectedBody] = useState<{
    part: string;
    position: [number, number, number];
  } | null>(null);

  if (question.type === 'slider') {
    const sliderQuestion = question as SliderQuestion;
    const initialValue = Math.floor((sliderQuestion.min + sliderQuestion.max) / 2);

    if (sliderValue === 0) {
      setSliderValue(initialValue);
    }

    return (
      <motion.div
        className="flex justify-start mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="max-w-[80%] ml-13 bg-white rounded-2xl p-4 shadow-md">
          <div className="space-y-4">
            <div className="relative">
              <input
                type="range"
                min={sliderQuestion.min}
                max={sliderQuestion.max}
                step={sliderQuestion.step || 1}
                value={sliderValue}
                onChange={(e) => setSliderValue(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>{sliderQuestion.min}</span>
                <motion.span
                  className="text-2xl font-bold text-blue-600"
                  key={sliderValue}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                >
                  {sliderValue}
                </motion.span>
                <span>{sliderQuestion.max}</span>
              </div>
            </div>

            <motion.button
              onClick={() => onSubmit(sliderValue)}
              className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium shadow-md"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Submit {sliderValue}
            </motion.button>
          </div>

          <style jsx>{`
            input[type='range']::-webkit-slider-thumb {
              appearance: none;
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background: #3b82f6;
              cursor: pointer;
              box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
            }

            input[type='range']::-moz-range-thumb {
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
      </motion.div>
    );
  }

  if (question.type === 'image_pin') {
    return (
      <motion.div
        className="flex justify-start mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="max-w-[90%] ml-13 bg-white rounded-2xl p-4 shadow-md">
          <BodyModel3D
            onSelect={(part, position) => {
              setSelectedBody({ part, position });
            }}
          />
          {selectedBody && (
            <motion.button
              onClick={() => onSubmit(selectedBody.part)}
              className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium shadow-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ✓ Confirm: {selectedBody.part.replace(/-/g, ' ')}
            </motion.button>
          )}
        </div>
      </motion.div>
    );
  }

  return null;
}
