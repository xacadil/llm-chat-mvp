import React, { useState } from 'react';
import { TextQuestion as TextQuestionType } from '@/types/survey';

interface TextQuestionProps {
  question: TextQuestionType;
  onSubmit: (value: string) => void;
}

export default function TextQuestion({ question, onSubmit }: TextQuestionProps) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value);
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={question.placeholder || 'Type your answer here...'}
        rows={4}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none resize-none"
      />

      <button
        onClick={handleSubmit}
        disabled={!value.trim()}
        className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        Submit Answer
      </button>

      <p className="text-sm text-gray-500">
        {value.trim().split(/\s+/).filter(Boolean).length} words
      </p>
    </div>
  );
}
