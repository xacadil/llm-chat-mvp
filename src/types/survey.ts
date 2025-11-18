// Base question interface
export interface BaseQuestion {
  id: string;
  question: string;
  type: QuestionType;
}

// Question types
export type QuestionType = 'radio' | 'slider' | 'text' | 'image_pin' | 'info';

// Radio question
export interface RadioQuestion extends BaseQuestion {
  type: 'radio';
  options: string[];
}

// Slider question
export interface SliderQuestion extends BaseQuestion {
  type: 'slider';
  min: number;
  max: number;
  step?: number;
}

// Text question
export interface TextQuestion extends BaseQuestion {
  type: 'text';
  placeholder?: string;
}

// Image pin question
export interface ImagePinQuestion extends BaseQuestion {
  type: 'image_pin';
  image: string;
}

// Info question (display only)
export interface InfoQuestion extends BaseQuestion {
  type: 'info';
  content: string;
}

// Union type for all questions
export type Question =
  | RadioQuestion
  | SliderQuestion
  | TextQuestion
  | ImagePinQuestion
  | InfoQuestion;

// Survey definition
export interface Survey {
  title: string;
  description?: string;
  questions: Question[];
}

// Response types
export interface RadioResponse {
  questionId: string;
  type: 'radio';
  value: string;
  naturalLanguageInput?: string;
}

export interface SliderResponse {
  questionId: string;
  type: 'slider';
  value: number;
}

export interface TextResponse {
  questionId: string;
  type: 'text';
  value: string;
}

export interface ImagePinResponse {
  questionId: string;
  type: 'image_pin';
  x: number;
  y: number;
}

export interface InfoResponse {
  questionId: string;
  type: 'info';
  acknowledged: boolean;
}

export type Response =
  | RadioResponse
  | SliderResponse
  | TextResponse
  | ImagePinResponse
  | InfoResponse;

// LLM Response
export interface LLMResponse {
  message: string;
  parsedValue?: any;
  confidence?: number;
}

// Survey state
export interface SurveyState {
  currentQuestionIndex: number;
  responses: Response[];
  isComplete: boolean;
}
