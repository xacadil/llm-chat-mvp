# LLM Survey Assistant - MVP Demo

An interactive survey application that combines traditional UI components with natural language processing to create a conversational survey experience.

## Overview

This MVP demonstrates how an LLM can be integrated into a survey system to:
- Accept natural language responses alongside traditional UI inputs
- Intelligently parse and normalize user answers
- Provide conversational feedback and guidance
- Adapt behavior based on question types

## Features

### Supported Question Types

1. **Radio Questions**
   - Traditional radio button selection
   - Natural language input mapping (e.g., "I feel okay" → "Okay")
   - Synonym recognition and fuzzy matching

2. **Slider Questions**
   - Visual slider for numeric input
   - Natural language number extraction
   - Relative term interpretation (e.g., "high pain" → 8)

3. **Text Questions**
   - Free-form text input
   - Word count tracking
   - Contextual acknowledgment based on response length

4. **Image Pin Questions**
   - Interactive image clicking
   - Coordinate capture and normalization
   - Visual feedback with pin markers

5. **Info Displays**
   - Informational screens between questions
   - Simple acknowledgment flow

## Project Structure

```
llm-chat-mvp/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Main page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── SurveyOrchestrator.tsx   # Main state machine
│   │   ├── SurveyQuestion.tsx       # Question router
│   │   ├── RadioQuestion.tsx        # Radio component
│   │   ├── SliderQuestion.tsx       # Slider component
│   │   ├── TextQuestion.tsx         # Text input component
│   │   ├── ImagePinQuestion.tsx     # Image pin component
│   │   └── InfoQuestion.tsx         # Info display component
│   ├── lib/
│   │   ├── llmSimulator.ts     # Pattern-based simulator (fallback)
│   │   ├── llmProcessor.ts     # Main LLM router (Ollama/simulator)
│   │   └── ollamaClient.ts     # Ollama API client
│   ├── types/
│   │   └── survey.ts           # TypeScript definitions
│   └── data/
│       └── health-survey.json  # Example survey definition
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### LLM Modes

The application supports two modes for processing natural language:

#### 1. Simulator Mode (Default)
No setup required! Uses built-in pattern matching for demos.
```bash
npm run dev
```

#### 2. Local LLM Mode (Recommended for Real Demos)
Uses Ollama running locally in Docker with GPU acceleration.

**Quick Setup (M1/M2 Macs):**
```bash
# One-command setup
make setup-ollama

# Start development with local LLM
make dev-with-llm
```

**Manual Setup:**
```bash
# 1. Start Ollama in Docker
docker-compose up -d ollama

# 2. Pull a model
docker exec ollama-survey ollama pull llama3.2:3b

# 3. Enable local LLM
cat > .env.local << EOF
USE_LOCAL_LLM=true
OLLAMA_URL=http://localhost:11434
MODEL=llama3.2:3b
EOF

# 4. Run the app
npm run dev
```

📖 **Detailed Guide**: See [DOCKER_SETUP.md](./DOCKER_SETUP.md) for complete Docker + M1 GPU setup

**Makefile Commands:**
```bash
make help           # Show all available commands
make setup-ollama   # Interactive Ollama setup
make start-ollama   # Start Ollama container
make stop-ollama    # Stop Ollama container
make list-models    # List available models
make dev-with-llm   # Start dev server with LLM enabled
```

### Building for Production

```bash
npm run build
npm start
```

## How It Works

### Survey Flow

1. **Survey Definition**: Load a JSON file defining questions and their types
2. **State Machine**: `SurveyOrchestrator` manages current question, responses, and completion state
3. **UI Rendering**: Appropriate component renders based on question type
4. **User Input**: User provides answer via UI or natural language
5. **LLM Processing**: `llmSimulator` parses and validates the response
6. **Feedback**: LLM provides conversational acknowledgment
7. **Progression**: Move to next question or complete survey

### LLM Simulation

The `llmSimulator.ts` file demonstrates how an LLM would process different input types:

- **Radio**: Keyword matching, synonym detection, phrase mapping
- **Slider**: Number extraction, relative term interpretation
- **Text**: Simple acknowledgment with context awareness
- **Image Pin**: Coordinate processing and feedback
- **Info**: Basic acknowledgment

In production, these functions would call actual LLM APIs (OpenAI, Anthropic, etc.).

### Creating Custom Surveys

Edit `src/data/health-survey.json` or create a new JSON file:

```json
{
  "title": "My Custom Survey",
  "description": "Survey description",
  "questions": [
    {
      "id": "q1",
      "type": "radio",
      "question": "Your question here?",
      "options": ["Option 1", "Option 2", "Option 3"]
    },
    {
      "id": "q2",
      "type": "slider",
      "question": "Rate something?",
      "min": 0,
      "max": 10,
      "step": 1
    }
  ]
}
```

Then import and use it in `src/app/page.tsx`:

```typescript
import customSurvey from '@/data/custom-survey.json';

export default function Home() {
  return <SurveyOrchestrator survey={customSurvey as Survey} />;
}
```

## Key Components

### SurveyOrchestrator

The main component managing:
- Survey state and progression
- Message history (conversation log)
- LLM interaction orchestration
- Response collection

### LLM Simulator

Located in `src/lib/llmSimulator.ts`, this module:
- Simulates LLM natural language understanding
- Maps user input to structured data
- Generates conversational responses
- Provides confidence scores

**In production**, replace these functions with actual LLM API calls:

```typescript
// Example production implementation
async function callRealLLM(question: Question, userInput: string) {
  const response = await fetch('/api/llm', {
    method: 'POST',
    body: JSON.stringify({ question, userInput }),
  });
  return response.json();
}
```

## Extending the System

### Adding New Question Types

1. Define the type in `src/types/survey.ts`:
```typescript
export interface MyCustomQuestion extends BaseQuestion {
  type: 'custom';
  customProp: string;
}
```

2. Create a component in `src/components/MyCustomQuestion.tsx`

3. Add to the question router in `src/components/SurveyQuestion.tsx`

4. Add LLM processing logic in `src/lib/llmSimulator.ts`

### Integrating Real LLM APIs

Replace the simulator functions with actual API calls:

```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function processWithClaude(question: Question, userInput: string) {
  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `Question: ${question.question}\nUser answer: ${userInput}\n\nParse this answer and return structured data.`
    }],
  });

  // Process the response
  return parseClaudeResponse(message);
}
```

## Architecture Decisions

### Why Next.js?
- Server-side rendering capabilities for future enhancements
- File-based routing
- API routes for LLM integration
- Great developer experience

### Why Tailwind CSS?
- Rapid prototyping
- Consistent design system
- No CSS file management
- Production-optimized

### State Management
- React hooks for local state
- No external state library needed for MVP
- Scalable to Redux/Zustand if needed

### TypeScript
- Type safety for survey definitions
- Better IDE support
- Catch errors at compile time
- Self-documenting code

## Example Use Cases

1. **Healthcare**: Patient symptom collection
2. **Market Research**: Consumer feedback with natural responses
3. **HR**: Employee satisfaction surveys
4. **Education**: Student assessments with flexible input
5. **Customer Support**: Issue reporting with conversational flow

## Future Enhancements

- [ ] Save/resume survey progress
- [ ] Multi-language support
- [ ] Voice input integration
- [ ] Advanced image analysis (body part detection)
- [ ] Response validation and error handling
- [ ] Survey branching/conditional logic
- [ ] Analytics dashboard
- [ ] Export responses to CSV/PDF
- [ ] Real-time collaboration
- [ ] A/B testing framework

## Performance Considerations

- Lazy load question components
- Optimize image assets
- Cache LLM responses
- Use React.memo for expensive components
- Implement virtual scrolling for long surveys

## Security & Privacy

For production deployment:
- Sanitize user inputs
- Implement rate limiting on LLM calls
- Encrypt sensitive responses
- GDPR compliance for data collection
- Secure API keys (environment variables)
- Input validation and XSS prevention

## License

MIT License - feel free to use this as a starting point for your own projects!

## Contributing

This is an MVP demo. For production use:
1. Add comprehensive error handling
2. Implement proper form validation
3. Add loading states and error messages
4. Write unit and integration tests
5. Add accessibility features (ARIA labels, keyboard navigation)
6. Optimize for mobile devices

## Support

For questions or issues, please open a GitHub issue or contact the development team.

---

Built with Next.js, React, TypeScript, and Tailwind CSS
