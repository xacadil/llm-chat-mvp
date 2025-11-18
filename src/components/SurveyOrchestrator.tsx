'use client';

import React, { useState, useEffect } from 'react';
import { Survey, Response, SurveyState } from '@/types/survey';
import { processLLMResponse } from '@/lib/llmProcessor';
import { generateQuestionPrompt } from '@/lib/llmSimulator';
import SurveyQuestion from './SurveyQuestion';
import ParticleBackground from './animations/ParticleBackground';
import QuestionTransition from './animations/QuestionTransition';
import ProgressBar from './animations/ProgressBar';
import SuccessCelebration from './animations/SuccessCelebration';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
}

interface SurveyOrchestratorProps {
  survey: Survey;
}

export default function SurveyOrchestrator({ survey }: SurveyOrchestratorProps) {
  const [state, setState] = useState<SurveyState>({
    currentQuestionIndex: 0,
    responses: [],
    isComplete: false,
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const currentQuestion = survey.questions[state.currentQuestionIndex];

  // Initialize with welcome message
  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: `Welcome to the ${survey.title}! ${
          survey.description || "I'll guide you through this survey with a few questions."
        }`,
        timestamp: new Date(),
      },
      {
        role: 'assistant',
        content: generateQuestionPrompt(currentQuestion),
        timestamp: new Date(),
      },
    ]);
  }, []);

  const handleResponse = async (value: any) => {
    setIsProcessing(true);

    // Add user response to messages
    const userMessage: Message = {
      role: 'user',
      content: typeof value === 'object' && 'x' in value
        ? `Selected position at (${Math.round(value.x)}%, ${Math.round(value.y)}%)`
        : typeof value === 'object'
        ? JSON.stringify(value)
        : String(value),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Process with LLM (local Ollama or simulator)
    await new Promise((resolve) => setTimeout(resolve, 800));

    const llmResponse = await processLLMResponse(currentQuestion, value);

    // Add LLM response to messages
    const assistantMessage: Message = {
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

        // Add next question prompt
        await new Promise((resolve) => setTimeout(resolve, 500));

        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: generateQuestionPrompt(nextQuestion),
            timestamp: new Date(),
          },
        ]);
      } else {
        // Survey complete
        setState({
          ...state,
          responses: newResponses,
          isComplete: true,
        });

        setShowCelebration(true);

        await new Promise((resolve) => setTimeout(resolve, 500));

        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: "Thank you for completing the survey! Your responses have been recorded.",
            timestamp: new Date(),
          },
        ]);
      }
    }

    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4 relative overflow-hidden">
      <ParticleBackground />
      <SuccessCelebration show={showCelebration} />

      <motion.div
        className="max-w-4xl mx-auto relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.div
          className="bg-white rounded-lg shadow-lg p-6 mb-6"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{survey.title}</h1>
          <ProgressBar current={state.currentQuestionIndex} total={survey.questions.length} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chat/Message History */}
          <motion.div
            className="bg-white rounded-lg shadow-lg p-6"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Conversation</h2>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              <AnimatePresence>
                {messages.map((message, idx) => (
                  <motion.div
                    key={idx}
                    className={`flex ${
                      message.role === 'assistant' ? 'justify-start' : 'justify-end'
                    }`}
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <motion.div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === 'assistant'
                          ? 'bg-gray-100 text-gray-900'
                          : 'bg-primary text-white'
                      }`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isProcessing && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="bg-gray-100 rounded-lg px-4 py-2">
                    <div className="flex space-x-2">
                      <motion.div
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Question UI */}
          <motion.div
            className="bg-white rounded-lg shadow-lg p-6"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {!state.isComplete ? (
              <QuestionTransition questionId={currentQuestion.id}>
                <motion.h2
                  className="text-xl font-semibold mb-4 text-gray-900"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {currentQuestion.question}
                </motion.h2>
                <SurveyQuestion
                  question={currentQuestion}
                  onResponse={handleResponse}
                />
              </QuestionTransition>
            ) : (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <motion.h2
                  className="text-2xl font-bold text-green-600"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  Survey Complete!
                </motion.h2>
                <p className="text-gray-600">
                  Thank you for completing the survey. Here's a summary of your responses:
                </p>

                <div className="space-y-3 mt-6">
                  {state.responses.map((response, idx) => {
                    const question = survey.questions.find((q) => q.id === response.questionId);

                    let displayValue = '';
                    if (response.type === 'image_pin') {
                      displayValue = `Position: (${Math.round(response.x)}%, ${Math.round(response.y)}%)`;
                    } else if ('value' in response) {
                      displayValue = typeof response.value === 'object'
                        ? JSON.stringify(response.value)
                        : String(response.value);
                    } else {
                      displayValue = 'Acknowledged';
                    }

                    return (
                      <motion.div
                        key={idx}
                        className="border-l-4 border-green-500 pl-4 py-2 bg-green-50 rounded"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ x: 5, backgroundColor: '#dcfce7' }}
                      >
                        <p className="font-semibold text-gray-900">{question?.question}</p>
                        <p className="text-gray-600">{displayValue}</p>
                      </motion.div>
                    );
                  })}
                </div>

                <motion.button
                  onClick={() => {
                    console.log('Survey responses:', state.responses);
                    alert('Responses logged to console');
                  }}
                  className="w-full mt-6 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold shadow-lg"
                  whileHover={{ scale: 1.02, backgroundColor: '#16a34a' }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  View JSON Output (Console)
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
