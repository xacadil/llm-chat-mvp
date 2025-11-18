import React, { useState } from 'react';
import { RadioQuestion as RadioQuestionType } from '@/types/survey';

interface RadioQuestionProps {
  question: RadioQuestionType;
  onSubmit: (value: string, naturalLanguageInput?: string) => void;
}

export default function RadioQuestion({ question, onSubmit }: RadioQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [textInput, setTextInput] = useState('');
  const [inputMode, setInputMode] = useState<'buttons' | 'text'>('buttons');

  const handleButtonSubmit = () => {
    if (selectedOption) {
      onSubmit(selectedOption);
    }
  };

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      onSubmit(textInput, textInput);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toggle between button and text input */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setInputMode('buttons')}
          className={`px-3 py-1 rounded text-sm ${
            inputMode === 'buttons'
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Select Option
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

      {inputMode === 'buttons' ? (
        <div className="space-y-3">
          {question.options.map((option) => (
            <label
              key={option}
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedOption === option
                  ? 'border-primary bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name={question.id}
                value={option}
                checked={selectedOption === option}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="w-4 h-4 text-primary"
              />
              <span className="ml-3 text-gray-900">{option}</span>
            </label>
          ))}

          <button
            onClick={handleButtonSubmit}
            disabled={!selectedOption}
            className="w-full mt-4 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Continue
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
            placeholder="Type your answer naturally..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
          />

          <button
            onClick={handleTextSubmit}
            disabled={!textInput.trim()}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Submit Answer
          </button>

          <p className="text-sm text-gray-500 mt-2">
            Available options: {question.options.join(', ')}
          </p>
        </div>
      )}
    </div>
  );
}
