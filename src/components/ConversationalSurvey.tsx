'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Survey, Response, SurveyState, Question } from '@/types/survey';
import { processLLMResponse } from '@/lib/llmProcessor';
import { generateQuestionPrompt } from '@/lib/llmSimulator';
import ParticleBackground from './animations/ParticleBackground';
import SuccessCelebration from './animations/SuccessCelebration';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './chat/ChatMessage';
import ChatInput from './chat/ChatInput';
import QuickReplies from './chat/QuickReplies';
import InlineSurveyElement from './chat/InlineSurveyElement';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
  questionId?: string;
  showQuickReplies?: boolean;
  showInlineElement?: boolean;
}

interface ConversationalSurveyProps {
  survey: Survey;
}

export default function ConversationalSurvey({ survey }: ConversationalSurveyProps) {
  const [state, setState] = useState<SurveyState>({
    currentQuestionIndex: 0,
    responses: [],
    isComplete: false,
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userInput, setUserInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const currentQuestion = survey.questions[state.currentQuestionIndex];

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome
  useEffect(() => {
    const welcomeMessages: Message[] = [
      {
        id: 'welcome-1',
        role: 'assistant',
        content: `Hi! 👋 Welcome to the ${survey.title}.`,
        timestamp: new Date(),
      },
      {
        id: 'welcome-2',
        role: 'assistant',
        content: survey.description || "I'll ask you a few questions. You can click the buttons or just type your answer naturally - whatever feels easier!",
        timestamp: new Date(),
      },
    ];

    setTimeout(() => {
      askQuestion(currentQuestion, welcomeMessages);
    }, 1000);
  }, []);

  const askQuestion = (question: Question, previousMessages: Message[] = messages) => {
    const questionMessage: Message = {
      id: `q-${question.id}`,
      role: 'assistant',
      content: question.question,
      timestamp: new Date(),
      questionId: question.id,
      showQuickReplies: question.type === 'radio',
      showInlineElement: ['slider', 'image_pin'].includes(question.type),
    };

    setMessages([...previousMessages, questionMessage]);
  };

  const handleQuickReply = async (value: string) => {
    await handleResponse(value);
  };

  const handleTextSubmit = async () => {
    if (!userInput.trim()) return;
    const input = userInput;
    setUserInput('');
    await handleResponse(input);
  };

  const handleInlineSubmit = async (value: any) => {
    await handleResponse(value);
  };

  const handleResponse = async (value: any) => {
    setIsProcessing(true);

    // Add user message
    const userMessage: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: typeof value === 'object' && 'x' in value
        ? `📍 Selected location`
        : String(value),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Process with LLM
    await new Promise((resolve) => setTimeout(resolve, 600));

    const llmResponse = await processLLMResponse(currentQuestion, value);

    // Add LLM acknowledgment
    const assistantMessage: Message = {
      id: `a-${Date.now()}`,
      role: 'assistant',
      content: llmResponse.message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);

    // Store response if valid
    if (llmResponse.parsedValue !== null) {
      const response: Response = {
        questionId: currentQuestion.id,
        type: currentQuestion.type,
        value: llmResponse.parsedValue,
      } as Response;

      const newResponses = [...state.responses, response];

      // Move to next question or complete
      if (state.currentQuestionIndex < survey.questions.length - 1) {
        const nextIndex = state.currentQuestionIndex + 1;
        const nextQuestion = survey.questions[nextIndex];

        setState({
          currentQuestionIndex: nextIndex,
          responses: newResponses,
          isComplete: false,
        });

        // Ask next question
        await new Promise((resolve) => setTimeout(resolve, 800));
        askQuestion(nextQuestion, [...messages, userMessage, assistantMessage]);
      } else {
        // Survey complete
        setState({
          ...state,
          responses: newResponses,
          isComplete: true,
        });

        setShowCelebration(true);

        await new Promise((resolve) => setTimeout(resolve, 500));

        const completionMessage: Message = {
          id: 'complete',
          role: 'assistant',
          content: "🎉 Thank you for completing the survey! Your responses have been recorded.",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage, assistantMessage, completionMessage]);
      }
    }

    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
      <ParticleBackground />
      <SuccessCelebration show={showCelebration} />

      <div className="relative z-10 h-screen flex flex-col max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="bg-white shadow-md px-6 py-4 border-b border-gray-200"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h1 className="text-2xl font-bold text-gray-900">{survey.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{
                  width: `${((state.currentQuestionIndex + 1) / survey.questions.length) * 100}%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-sm text-gray-600">
              {state.currentQuestionIndex + 1}/{survey.questions.length}
            </span>
          </div>
        </motion.div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <AnimatePresence>
            {messages.map((message, idx) => (
              <div key={message.id}>
                <ChatMessage message={message} />

                {/* Quick replies for radio questions */}
                {message.showQuickReplies && message.questionId === currentQuestion.id && !state.isComplete && (
                  <QuickReplies
                    question={currentQuestion}
                    onSelect={handleQuickReply}
                  />
                )}

                {/* Inline elements for slider/image_pin */}
                {message.showInlineElement && message.questionId === currentQuestion.id && !state.isComplete && (
                  <InlineSurveyElement
                    question={currentQuestion}
                    onSubmit={handleInlineSubmit}
                  />
                )}
              </div>
            ))}
          </AnimatePresence>

          {isProcessing && (
            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="bg-white rounded-2xl px-4 py-3 shadow-md">
                <div className="flex space-x-2">
                  <motion.div
                    className="w-2 h-2 bg-blue-400 rounded-full"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-blue-400 rounded-full"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-blue-400 rounded-full"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {!state.isComplete && (
          <ChatInput
            value={userInput}
            onChange={setUserInput}
            onSubmit={handleTextSubmit}
            disabled={isProcessing}
            placeholder="Type your answer or use the buttons above..."
          />
        )}

        {/* Completion Summary */}
        {state.isComplete && (
          <motion.div
            className="bg-white border-t border-gray-200 px-6 py-4"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <button
              onClick={() => {
                console.log('Survey responses:', state.responses);
                alert('✅ Responses logged to console!');
              }}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
            >
              📊 View Responses (Console)
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
