import {
  Question,
  QuestionType,
  RadioQuestion,
  SliderQuestion,
  LLMResponse,
} from '@/types/survey';

/**
 * Simulates LLM behavior for processing natural language responses
 * In a real implementation, this would call an actual LLM API
 */

/**
 * Process radio question responses
 * Maps natural language to the closest option
 */
function processRadioResponse(
  question: RadioQuestion,
  userInput: string
): LLMResponse {
  const input = userInput.toLowerCase().trim();

  // Simple keyword matching for demo purposes
  // In production, this would use actual LLM embeddings/reasoning
  const scores = question.options.map((option) => {
    const optionLower = option.toLowerCase();
    let score = 0;

    // Exact match
    if (input === optionLower) score = 100;

    // Contains option
    else if (input.includes(optionLower)) score = 80;

    // Option contains input
    else if (optionLower.includes(input)) score = 60;

    // Common phrase mappings
    else {
      const mappings: Record<string, string[]> = {
        'good': ['great', 'excellent', 'fine', 'well', 'happy', 'positive'],
        'okay': ['ok', 'alright', 'fine', 'decent', 'so-so', 'meh'],
        'bad': ['not good', 'poor', 'terrible', 'awful', 'negative', 'sad'],
        'yes': ['yeah', 'yep', 'sure', 'absolutely', 'definitely', 'correct'],
        'no': ['nope', 'nah', 'negative', 'not really', 'never'],
      };

      for (const [key, synonyms] of Object.entries(mappings)) {
        if (optionLower.includes(key)) {
          for (const syn of synonyms) {
            if (input.includes(syn)) {
              score = 50;
              break;
            }
          }
        }
      }
    }

    return { option, score };
  });

  // Get best match
  const bestMatch = scores.reduce((a, b) => (a.score > b.score ? a : b));

  if (bestMatch.score > 0) {
    return {
      message: `Got it! I understand you mean "${bestMatch.option}". Let's move to the next question.`,
      parsedValue: bestMatch.option,
      confidence: bestMatch.score / 100,
    };
  }

  // No match found
  return {
    message: `I'm not sure which option you meant. Could you clarify? The options are: ${question.options.join(', ')}`,
    parsedValue: null,
    confidence: 0,
  };
}

/**
 * Process slider question responses
 * Extracts numeric value and provides acknowledgment
 */
function processSliderResponse(
  question: SliderQuestion,
  userInput: string | number
): LLMResponse {
  const input = String(userInput).toLowerCase().trim();

  // Extract number from input
  const numberMatch = input.match(/\d+/);

  if (numberMatch) {
    const value = parseInt(numberMatch[0]);

    if (value >= question.min && value <= question.max) {
      // Generate contextual response based on value
      let message = '';
      const range = question.max - question.min;
      const relative = (value - question.min) / range;

      if (relative < 0.3) {
        message = `Thanks for sharing. A ${value} is on the lower end - that's noted.`;
      } else if (relative < 0.7) {
        message = `I see, a ${value}. That's somewhere in the middle range.`;
      } else {
        message = `Got it, ${value} - that's on the higher side. Thanks for letting me know.`;
      }

      return {
        message,
        parsedValue: value,
        confidence: 1.0,
      };
    }
  }

  // Try to extract relative terms
  const range = question.max - question.min;
  const relativeMappings: Record<string, number> = {
    'none': question.min,
    'zero': question.min,
    'minimal': question.min + 1,
    'low': Math.floor(question.min + range * 0.25),
    'medium': Math.floor(question.min + range * 0.5),
    'moderate': Math.floor(question.min + range * 0.5),
    'high': Math.floor(question.min + range * 0.75),
    'maximum': question.max,
    'extreme': question.max,
  };

  for (const [term, value] of Object.entries(relativeMappings)) {
    if (input.includes(term)) {
      return {
        message: `I interpret "${term}" as about a ${value} on the scale. Does that sound right?`,
        parsedValue: value,
        confidence: 0.7,
      };
    }
  }

  return {
    message: `I need a number between ${question.min} and ${question.max}. What would you say?`,
    parsedValue: null,
    confidence: 0,
  };
}

/**
 * Process text question responses
 * Simply acknowledges and stores the input
 */
function processTextResponse(userInput: string): LLMResponse {
  const wordCount = userInput.trim().split(/\s+/).length;

  let message = '';
  if (wordCount < 3) {
    message = 'Thanks for that brief answer! Moving on...';
  } else if (wordCount < 20) {
    message = 'Thank you for sharing that. Let\'s continue.';
  } else {
    message = 'I appreciate the detailed response. Let me move us to the next question.';
  }

  return {
    message,
    parsedValue: userInput,
    confidence: 1.0,
  };
}

/**
 * Process image pin responses
 * Interprets the selected coordinates
 */
function processImagePinResponse(x: number, y: number): LLMResponse {
  // In a real implementation, this might use image analysis
  // to describe what body part was selected, etc.

  return {
    message: `I've noted the location you selected (x: ${Math.round(x)}, y: ${Math.round(y)}). Thank you!`,
    parsedValue: { x, y },
    confidence: 1.0,
  };
}

/**
 * Main LLM simulator function
 * Routes to appropriate handler based on question type
 */
export function simulateLLMResponse(
  question: Question,
  userInput: string | { x: number; y: number }
): LLMResponse {
  switch (question.type) {
    case 'radio':
      return processRadioResponse(question, userInput as string);

    case 'slider':
      return processSliderResponse(question, userInput as string);

    case 'text':
      return processTextResponse(userInput as string);

    case 'image_pin':
      const coords = userInput as { x: number; y: number };
      return processImagePinResponse(coords.x, coords.y);

    case 'info':
      return {
        message: 'Got it! Let\'s move forward.',
        parsedValue: true,
        confidence: 1.0,
      };

    default:
      return {
        message: 'I\'m not sure how to process that response.',
        parsedValue: null,
        confidence: 0,
      };
  }
}

/**
 * Generate initial question prompt with LLM personality
 */
export function generateQuestionPrompt(question: Question): string {
  const prompts: Record<QuestionType, () => string> = {
    radio: () => {
      const q = question as RadioQuestion;
      return `${q.question} You can tell me naturally, or select from: ${q.options.join(', ')}.`;
    },
    slider: () => {
      const q = question as SliderQuestion;
      return `${q.question} You can tell me the number or use the slider (${q.min}-${q.max}).`;
    },
    text: () => {
      return `${question.question} Feel free to answer in your own words.`;
    },
    image_pin: () => {
      return `${question.question} Just click on the image where you'd like to indicate.`;
    },
    info: () => {
      return question.question;
    },
  };

  return prompts[question.type]();
}
