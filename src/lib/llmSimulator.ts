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

  // Handle common idiomatic expressions FIRST (before keyword matching)
  // These need special handling because they contain contradictory keywords
  const idiomaticPhrases: Record<string, { targetOption: string; confidence: number }> = {
    'not too bad': { targetOption: 'good', confidence: 0.85 },
    'not bad': { targetOption: 'good', confidence: 0.85 },
    'pretty good': { targetOption: 'good', confidence: 0.9 },
    'pretty well': { targetOption: 'good', confidence: 0.9 },
    'doing well': { targetOption: 'good', confidence: 0.95 },
    'doing fine': { targetOption: 'good', confidence: 0.9 },
    'can\'t complain': { targetOption: 'good', confidence: 0.8 },
    'could be worse': { targetOption: 'okay', confidence: 0.75 },
    'could be better': { targetOption: 'okay', confidence: 0.75 },
    'hanging in there': { targetOption: 'okay', confidence: 0.75 },
    'getting by': { targetOption: 'okay', confidence: 0.75 },
    'so-so': { targetOption: 'okay', confidence: 0.9 },
    'not great': { targetOption: 'not so good', confidence: 0.8 },
    'not feeling great': { targetOption: 'not so good', confidence: 0.85 },
    'bit rough': { targetOption: 'not so good', confidence: 0.8 },
    'struggling': { targetOption: 'bad', confidence: 0.85 },
    'terrible': { targetOption: 'bad', confidence: 0.95 },
    'awful': { targetOption: 'bad', confidence: 0.95 },
  };

  // Check for idiomatic expressions first
  for (const [phrase, mapping] of Object.entries(idiomaticPhrases)) {
    if (input.includes(phrase)) {
      // Find best matching option
      const matchedOption = question.options.find(opt =>
        opt.toLowerCase().includes(mapping.targetOption)
      );

      if (matchedOption) {
        return {
          message: `Got it! I understand you mean "${matchedOption}". Let's move to the next question.`,
          parsedValue: matchedOption,
          confidence: mapping.confidence,
        };
      }
    }
  }

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

    // Common phrase mappings (excluding negations to avoid conflicts)
    else {
      const mappings: Record<string, string[]> = {
        'good': ['great', 'excellent', 'fine', 'well', 'happy', 'positive', 'fantastic', 'wonderful'],
        'okay': ['ok', 'alright', 'decent', 'meh', 'fair', 'average'],
        'bad': ['poor', 'negative', 'sad', 'unwell', 'sick'],
        'yes': ['yeah', 'yep', 'sure', 'absolutely', 'definitely', 'correct'],
        'no': ['nope', 'nah', 'never'],
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
    // Generate empathetic response based on the selected option
    const optionLower = bestMatch.option.toLowerCase();
    let message = '';

    // Positive responses
    if (optionLower.includes('great') || optionLower.includes('excellent')) {
      message = `That's wonderful! I'm so glad you're feeling ${bestMatch.option.toLowerCase()}! 😊 Let's continue.`;
    }
    else if (optionLower.includes('good') || optionLower.includes('fine') || optionLower.includes('well')) {
      message = `Great to hear you're feeling ${bestMatch.option.toLowerCase()}! Thanks for sharing that.`;
    }
    // Neutral responses
    else if (optionLower.includes('okay') || optionLower.includes('alright')) {
      message = `Got it, ${bestMatch.option.toLowerCase()}. I appreciate your honesty! Let's move forward.`;
    }
    // Negative responses
    else if (optionLower.includes('not so good') || optionLower.includes('not great')) {
      message = `I hear you. ${bestMatch.option} days can be tough. Thank you for sharing how you're feeling.`;
    }
    else if (optionLower.includes('bad') || optionLower.includes('terrible') || optionLower.includes('awful')) {
      message = `I'm sorry you're feeling ${bestMatch.option.toLowerCase()}. 😔 Thanks for being open with me about it.`;
    }
    // Time-based responses (for duration questions)
    else if (optionLower.includes('day') || optionLower.includes('week') || optionLower.includes('month')) {
      message = `Got it, "${bestMatch.option}". That's helpful context - thank you!`;
    }
    // Default
    else {
      message = `Perfect! I understand you mean "${bestMatch.option}". Let's keep going! ✨`;
    }

    return {
      message,
      parsedValue: bestMatch.option,
      confidence: bestMatch.score / 100,
    };
  }

  // No match found
  return {
    message: `Hmm, I'm not quite sure which option you meant. Could you try again? The options are: ${question.options.join(', ')}`,
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
      // Generate empathetic response based on context and value
      let message = '';
      const range = question.max - question.min;
      const relative = (value - question.min) / range;
      const questionText = question.question.toLowerCase();

      // Detect if it's a pain scale vs energy/positive scale
      const isPainScale = questionText.includes('pain') || questionText.includes('discomfort');
      const isEnergyScale = questionText.includes('energy') || questionText.includes('feel');

      if (isPainScale) {
        // For pain: low is good, high is concerning
        if (relative < 0.3) {
          message = `That's great! A ${value} is pretty minimal on the pain scale. 😊`;
        } else if (relative < 0.7) {
          message = `I see, a ${value}. That's moderate - definitely something to keep an eye on.`;
        } else {
          message = `I hear you - ${value} is quite significant. Thank you for being honest about your pain level. 😔`;
        }
      } else if (isEnergyScale) {
        // For energy: high is good, low is concerning
        if (relative < 0.3) {
          message = `A ${value}... that sounds pretty low. I hope you can get some rest soon! 💤`;
        } else if (relative < 0.7) {
          message = `Got it, ${value}. That's moderate energy - not bad, but room for improvement!`;
        } else {
          message = `Awesome! ${value} is great energy! I'm glad you're feeling energized today! ⚡`;
        }
      } else {
        // Generic responses
        if (relative < 0.3) {
          message = `Thanks for sharing. A ${value} is on the lower end - I've noted that.`;
        } else if (relative < 0.7) {
          message = `I see, a ${value}. That's somewhere in the middle range.`;
        } else {
          message = `Got it, ${value} - that's on the higher side. Thanks for letting me know!`;
        }
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
 * Acknowledges with empathy based on content
 */
function processTextResponse(userInput: string): LLMResponse {
  const input = userInput.toLowerCase();
  const wordCount = userInput.trim().split(/\s+/).length;

  // Detect sentiment and keywords for empathetic responses
  let message = '';

  // Check for pain/discomfort keywords
  if (input.includes('pain') || input.includes('hurt') || input.includes('ache') || input.includes('sore')) {
    message = "I hear you - dealing with pain is really challenging. Thank you for sharing that with me.";
  }
  // Check for positive keywords
  else if (input.includes('better') || input.includes('improving') || input.includes('good') || input.includes('fine')) {
    message = "That's great to hear! I'm glad things are improving. Thanks for letting me know!";
  }
  // Check for concern keywords
  else if (input.includes('worried') || input.includes('concerned') || input.includes('afraid') || input.includes('anxious')) {
    message = "I understand your concerns. Thank you for being open about how you're feeling.";
  }
  // Check for fatigue keywords
  else if (input.includes('tired') || input.includes('exhausted') || input.includes('fatigue') || input.includes('weak')) {
    message = "Fatigue can really affect everything. I appreciate you sharing this important information.";
  }
  // Default based on length
  else if (wordCount < 3) {
    message = 'Got it! Thanks for that. Let\'s keep going.';
  } else if (wordCount < 20) {
    message = 'Thank you for sharing that with me. I really appreciate your openness!';
  } else {
    message = 'Wow, thank you for the detailed response! That really helps me understand your situation better.';
  }

  return {
    message,
    parsedValue: userInput,
    confidence: 1.0,
  };
}

/**
 * Process image pin responses
 * Interprets the selected body part
 */
function processImagePinResponse(bodyPartOrCoords: string | { x: number; y: number }): LLMResponse {
  // Handle old format (coordinates) or new format (body part name)
  let bodyPart: string;

  if (typeof bodyPartOrCoords === 'string') {
    bodyPart = bodyPartOrCoords;
  } else {
    // Fallback for coordinate format
    return {
      message: `I've noted the location you indicated. Thank you for showing me!`,
      parsedValue: bodyPartOrCoords,
      confidence: 1.0,
    };
  }

  // Format body part name nicely
  const formattedPart = bodyPart.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  // Empathetic responses based on body part
  const responses: Record<string, string> = {
    'head': `Got it, you're experiencing discomfort in your ${formattedPart}. I've noted that - headaches can be really tough! 😔`,
    'neck': `I understand, ${formattedPart} pain can be quite uncomfortable. Thanks for showing me where it hurts.`,
    'chest': `Thank you for letting me know about your ${formattedPart}. I've noted this important information.`,
    'stomach': `I see, your ${formattedPart} area. That must be uncomfortable. I've got that recorded. 🩺`,
    'abdomen': `Got it, your ${formattedPart}. Digestive issues can be really bothersome. Thanks for sharing.`,
    'back': `${formattedPart} pain noted. That's a really common issue and I know it can be quite limiting!`,
    'shoulder': `Got it, your ${formattedPart}. I know that can really affect your day. Thanks for pinpointing it! 💪`,
    'arm': `I've noted your ${formattedPart}. Thanks for showing me exactly where the discomfort is.`,
    'hand': `Your ${formattedPart}, understood. That must make daily tasks challenging. I've recorded this.`,
    'leg': `${formattedPart} discomfort noted. I appreciate you taking the time to show me the exact area.`,
    'knee': `Your ${formattedPart}, understood. That must make movement difficult. I've recorded this. 🦵`,
    'foot': `Got it, your ${formattedPart}. I know that can really affect mobility. Thanks for sharing!`,
    'ankle': `${formattedPart} pain noted. That can make walking really challenging. Thanks for pointing it out.`,
  };

  // Find matching response or use default
  let message = `I've noted the ${formattedPart} area. Thank you for showing me where you're experiencing discomfort! 📍`;

  for (const [key, response] of Object.entries(responses)) {
    if (bodyPart.toLowerCase().includes(key)) {
      message = response;
      break;
    }
  }

  return {
    message,
    parsedValue: bodyPart,
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
      // Handle both string (body part name) and coordinate format
      return processImagePinResponse(userInput as string | { x: number; y: number });

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
