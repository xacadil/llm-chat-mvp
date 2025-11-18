import React, { useState } from 'react';
import { SliderQuestion as SliderQuestionType } from '@/types/survey';

interface SliderQuestionProps {
  question: SliderQuestionType;
  onSubmit: (value: number) => void;
}

export default function SliderQuestion({ question, onSubmit }: SliderQuestionProps) {
  const [value, setValue] = useState<number>(
    Math.floor((question.min + question.max) / 2)
  );
  const [textInput, setTextInput] = useState('');
  const [inputMode, setInputMode] = useState<'slider' | 'text'>('slider');

  const handleSliderSubmit = () => {
    onSubmit(value);
  };

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      const numValue = parseInt(textInput);
      if (!isNaN(numValue) && numValue >= question.min && numValue <= question.max) {
        onSubmit(numValue);
      } else {
        // Let LLM simulator handle natural language
        onSubmit(textInput as any);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Toggle between slider and text input */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setInputMode('slider')}
          className={`px-3 py-1 rounded text-sm ${
            inputMode === 'slider'
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Use Slider
        </button>
        <button
          onClick={() => setInputMode('text')}
          className={`px-3 py-1 rounded text-sm ${
            inputMode === 'text'
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Type Answer
        </button>
      </div>

      {inputMode === 'slider' ? (
        <div className="space-y-4">
          <div className="relative pt-6">
            <input
              type="range"
              min={question.min}
              max={question.max}
              step={question.step || 1}
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />

            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>{question.min}</span>
              <span className="text-2xl font-bold text-primary">{value}</span>
              <span>{question.max}</span>
            </div>
          </div>

          <button
            onClick={handleSliderSubmit}
            className="w-full mt-4 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Continue with {value}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
            placeholder={`Enter a number (${question.min}-${question.max}) or describe naturally...`}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
          />

          <button
            onClick={handleTextSubmit}
            disabled={!textInput.trim()}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Submit Answer
          </button>
        </div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}
