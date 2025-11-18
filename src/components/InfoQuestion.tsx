import React from 'react';
import { InfoQuestion as InfoQuestionType } from '@/types/survey';

interface InfoQuestionProps {
  question: InfoQuestionType;
  onContinue: () => void;
}

export default function InfoQuestion({ question, onContinue }: InfoQuestionProps) {
  return (
    <div className="space-y-4">
      <div className="p-6 bg-blue-50 border-l-4 border-primary rounded-lg">
        <p className="text-gray-800 whitespace-pre-wrap">{question.content}</p>
      </div>

      <button
        onClick={onContinue}
        className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Continue
      </button>
    </div>
  );
}
