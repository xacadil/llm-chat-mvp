'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Survey, Response, SurveyState } from '@/types/survey';
import { processLLMResponse, getLLMMode } from '@/lib/llmProcessor';
import { generateQuestionPrompt } from '@/lib/llmSimulator';
import SurveyQuestion from './SurveyQuestion';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{survey.title}</h1>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Question {state.currentQuestionIndex + 1} of {survey.questions.length}
            </p>
            <div className="flex gap-1">
              {survey.questions.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-8 h-2 rounded ${
                    idx < state.currentQuestionIndex
                      ? 'bg-green-500'
                      : idx === state.currentQuestionIndex
                      ? 'bg-primary'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chat/Message History */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Conversation</h2>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {messages.map((message, idx) => (
                <div
                  key={idx}
                  className={`flex items-end gap-2 ${
                    message.role === 'assistant' ? 'justify-start' : 'justify-end'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0 mb-1">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-blue-400 shadow-md avatar-float">
                        <Image
                          src="/images/atagar-avatar.svg"
                          alt="Assistant Avatar"
                          width={40}
                          height={40}
                          className="object-cover"
                          priority
                        />
                      </div>
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === 'assistant'
                        ? 'bg-gray-100 text-gray-900'
                        : 'bg-primary text-white'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}

              {isProcessing && (
                <div className="flex items-end gap-2 justify-start">
                  <div className="flex-shrink-0 mb-1">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-blue-400 shadow-md avatar-pulse">
                      <Image
                        src="/images/atagar-avatar.svg"
                        alt="Assistant Avatar"
                        width={40}
                        height={40}
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-lg px-4 py-2">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Question UI */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            {!state.isComplete ? (
              <>
                <h2 className="text-xl font-semibold mb-4 text-gray-900">
                  {currentQuestion.question}
                </h2>
                <SurveyQuestion
                  question={currentQuestion}
                  onResponse={handleResponse}
                />
              </>
            ) : (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-green-600">Survey Complete!</h2>
                <p className="text-gray-600">
                  Thank you for completing the survey. Here's a summary of your responses:
                </p>

                <div className="space-y-3 mt-6">
                  {state.responses.map((response, idx) => {
                    const question = survey.questions.find((q) => q.id === response.questionId);

                    // Format response value based on type
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
                      <div key={idx} className="border-l-4 border-green-500 pl-4 py-2">
                        <p className="font-semibold text-gray-900">{question?.question}</p>
                        <p className="text-gray-600">{displayValue}</p>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => {
                    console.log('Survey responses:', state.responses);
                    alert('Responses logged to console');
                  }}
                  className="w-full mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  View JSON Output (Console)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
