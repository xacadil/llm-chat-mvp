# Quick Start Guide

Get the LLM Survey Assistant running in 3 simple steps!

## Prerequisites

- Node.js 18 or higher installed
- npm (comes with Node.js)
- *Optional*: Docker Desktop (for local LLM mode)

## Setup & Run

### Option 1: Simulator Mode (Fastest)

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open your browser
# Visit: http://localhost:3000
```

That's it! The survey will start automatically with a built-in simulator.

### Option 2: Local LLM Mode (Better Responses)

For more realistic AI responses using a local LLM:

```bash
# 1. Install dependencies
npm install

# 2. Setup Ollama (one-time, interactive)
make setup-ollama
# This starts Docker, downloads a 2GB model, and configures everything

# 3. Start with local LLM
make dev-with-llm

# 4. Open your browser
# Visit: http://localhost:3000
```

The local LLM provides much more natural and contextual responses!

## What You'll See

- **Left Panel**: Conversational message history showing the LLM's responses
- **Right Panel**: Interactive UI components for answering questions
- **Top Bar**: Progress indicator showing which question you're on

## Try These Features

### 1. Natural Language Input
On radio questions, switch to "Type Answer" mode and try:
- "I feel great"
- "Not so good today"
- "Doing okay"

The LLM will map your answer to the closest option!

### 2. Slider Control
Try both:
- Using the slider directly
- Typing numbers or phrases like "medium pain" or "high energy"

### 3. Image Pin
Click anywhere on the body diagram to mark a location.

### 4. Text Questions
Answer freely - the system tracks word count and provides appropriate feedback.

## Switch Surveys

To use the customer feedback survey instead:

Edit `src/app/page.tsx`:
```typescript
import customerSurvey from '@/data/customer-feedback.json';

export default function Home() {
  return <SurveyOrchestrator survey={customerSurvey as Survey} />;
}
```

## Create Your Own Survey

1. Copy `src/data/health-survey.json`
2. Modify the questions
3. Import and use in `page.tsx`

See `README.md` for full documentation!

## Production Build

```bash
npm run build
npm start
```

## Troubleshooting

**Port already in use?**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

**Build errors?**
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

## Next Steps

- Read the full `README.md` for architecture details
- Explore `src/lib/llmSimulator.ts` to see how NLP works
- Check out component files in `src/components/`
- Replace the simulator with real LLM API calls

Happy surveying! 🎉
