'use client';

import React from 'react';
import { Question } from '@/types/survey';
import RadioQuestion from './RadioQuestion';
import SliderQuestion from './SliderQuestion';
import TextQuestion from './TextQuestion';
import ImagePinQuestion3D from './ImagePinQuestion3D';
import InfoQuestion from './InfoQuestion';

interface SurveyQuestionProps {
  question: Question;
  onResponse: (value: any) => void;
}

export default function SurveyQuestion({ question, onResponse }: SurveyQuestionProps) {
  switch (question.type) {
    case 'radio':
      return <RadioQuestion question={question} onSubmit={onResponse} />;

    case 'slider':
      return <SliderQuestion question={question} onSubmit={onResponse} />;

    case 'text':
      return <TextQuestion question={question} onSubmit={onResponse} />;

    case 'image_pin':
      return <ImagePinQuestion3D question={question} onSubmit={onResponse} />;

    case 'info':
      return <InfoQuestion question={question} onContinue={() => onResponse(true)} />;

    default:
      return <div>Unsupported question type</div>;
  }
}
