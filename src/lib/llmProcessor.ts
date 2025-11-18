/**
 * LLM Processor - Handles both local Ollama and simulator
 */

import {
  Question,
  RadioQuestion,
  SliderQuestion,
  LLMResponse,
} from '@/types/survey';
import { generateCompletion, checkOllamaHealth } from './ollamaClient';
import { simulateLLMResponse as simulatorResponse } from './llmSimulator';

const USE_LOCAL_LLM = process.env.NEXT_PUBLIC_USE_LOCAL_LLM === 'true';

/**
 * Process response using local Ollama LLM
 */
async function processWithOllama(
  question: Question,
  userInput: string | { x: number; y: number }
): Promise<LLMResponse> {
  // Handle non-text inputs
  if (question.type === 'image_pin' && typeof userInput === 'object') {
    return {
      message: `I've noted the location you selected (x: ${Math.round(userInput.x)}, y: ${Math.round(userInput.y)}). Thank you!`,
      parsedValue: userInput,
      confidence: 1.0,
    };
  }

  if (question.type === 'info') {
    return {
      message: 'Got it! Let\'s move forward.',
      parsedValue: true,
      confidence: 1.0,
    };
  }

  const input = userInput as string;

  // Build prompt based on question type
  let prompt = '';
  let parseResponse: (llmOutput: string) => LLMResponse;

  switch (question.type) {
    case 'radio': {
      const q = question as RadioQuestion;
      prompt = `You are a helpful survey assistant. A user answered a multiple choice question.

Question: ${q.question}
Available options: ${q.options.join(', ')}
User's answer: "${input}"

Your task:
1. Determine which option best matches the user's answer
2. Provide a friendly, brief acknowledgment (1 sentence)

Respond in this exact JSON format:
{
  "option": "the matched option from the list",
  "confidence": 0.95,
  "message": "friendly acknowledgment"
}`;

      parseResponse = (output: string) => {
        try {
          const jsonMatch = output.match(/\{[\s\S]*\}/);
          if (!jsonMatch) throw new Error('No JSON found');

          const parsed = JSON.parse(jsonMatch[0]);

          // Validate the option exists
          if (!q.options.includes(parsed.option)) {
            return {
              message: `I'm not sure which option you meant. Please choose from: ${q.options.join(', ')}`,
              parsedValue: null,
              confidence: 0,
            };
          }

          return {
            message: parsed.message,
            parsedValue: parsed.option,
            confidence: parsed.confidence,
          };
        } catch (error) {
          // Fallback to simple matching
          const lowerInput = input.toLowerCase();
          const match = q.options.find(opt =>
            lowerInput.includes(opt.toLowerCase())
          );

          if (match) {
            return {
              message: `I understand you mean "${match}". Let's continue!`,
              parsedValue: match,
              confidence: 0.7,
            };
          }

          return {
            message: `Could you clarify? Options are: ${q.options.join(', ')}`,
            parsedValue: null,
            confidence: 0,
          };
        }
      };
      break;
    }

    case 'slider': {
      const q = question as SliderQuestion;
      prompt = `You are a helpful survey assistant. A user answered a numeric scale question.

Question: ${q.question}
Scale range: ${q.min} to ${q.max}
User's answer: "${input}"

Your task:
1. Extract or interpret the numeric value from their answer
2. Provide a brief, empathetic acknowledgment

Respond in this exact JSON format:
{
  "value": ${q.min},
  "message": "acknowledgment message"
}`;

      parseResponse = (output: string) => {
        try {
          const jsonMatch = output.match(/\{[\s\S]*\}/);
          if (!jsonMatch) throw new Error('No JSON found');

          const parsed = JSON.parse(jsonMatch[0]);
          const value = parseInt(parsed.value);

          if (isNaN(value) || value < q.min || value > q.max) {
            return {
              message: `I need a number between ${q.min} and ${q.max}.`,
              parsedValue: null,
              confidence: 0,
            };
          }

          return {
            message: parsed.message,
            parsedValue: value,
            confidence: 0.9,
          };
        } catch (error) {
          // Try to extract number directly
          const numMatch = input.match(/\d+/);
          if (numMatch) {
            const value = parseInt(numMatch[0]);
            if (value >= q.min && value <= q.max) {
              return {
                message: `Got it, ${value}. Thanks for letting me know.`,
                parsedValue: value,
                confidence: 0.8,
              };
            }
          }

          return {
            message: `I need a number between ${q.min} and ${q.max}.`,
            parsedValue: null,
            confidence: 0,
          };
        }
      };
      break;
    }

    case 'text': {
      prompt = `You are a helpful survey assistant. A user answered an open-ended question.

Question: ${question.question}
User's answer: "${input}"

Provide a brief (1 sentence), empathetic acknowledgment that shows you read their response.

Respond with just the acknowledgment message, no JSON needed.`;

      parseResponse = (output: string) => {
        return {
          message: output.trim(),
          parsedValue: input,
          confidence: 1.0,
        };
      };
      break;
    }

    default:
      return {
        message: 'Thank you for your response.',
        parsedValue: input,
        confidence: 1.0,
      };
  }

  try {
    const llmOutput = await generateCompletion(prompt, {
      temperature: 0.3,
      max_tokens: 150,
    });

    return parseResponse(llmOutput);
  } catch (error) {
    console.error('LLM processing error:', error);
    // Fallback to simulator on error
    return simulatorResponse(question, userInput);
  }
}

/**
 * Main entry point - routes to either Ollama or simulator
 */
export async function processLLMResponse(
  question: Question,
  userInput: string | { x: number; y: number }
): Promise<LLMResponse> {
  if (USE_LOCAL_LLM) {
    // Check if Ollama is available
    const isHealthy = await checkOllamaHealth();

    if (isHealthy) {
      return processWithOllama(question, userInput);
    } else {
      console.warn('Ollama not available, falling back to simulator');
    }
  }

  // Use simulator as default/fallback
  return simulatorResponse(question, userInput);
}

/**
 * Check current LLM mode
 */
export function getLLMMode(): 'ollama' | 'simulator' {
  return USE_LOCAL_LLM ? 'ollama' : 'simulator';
}
