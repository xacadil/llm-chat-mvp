# Complete Setup Guide: Animated UI + Local LLM (Docker)

This guide shows you how to run the **full experience**: Beautiful animated UI + Real local LLM running in Docker with M1 GPU acceleration.

---

## 🎯 Two Ways to Run

### **Option A: Quick Start (Simulator Mode)**
- No Docker needed
- Uses pattern matching for responses
- Good for testing animations
- **Setup time**: 2 minutes

### **Option B: Full Experience (Local LLM Mode)** ⭐ Recommended
- Runs Ollama in Docker
- Real AI responses with GPU acceleration
- Much better, more natural responses
- **Setup time**: 10 minutes (first time only)

---

## 🚀 Option A: Quick Start (Simulator Mode)

Perfect for quickly testing the animations without setting up Docker.

### Step 1: Switch to Animated Branch

```bash
# Navigate to project directory
cd /path/to/llm-chat-mvp

# Switch to animated UI branch
git checkout claude/animated-ui-01GDx8f8a4GSUjh2VUNKjHwN

# Verify you're on the right branch
git branch
# Should show: * claude/animated-ui-01GDx8f8a4GSUjh2VUNKjHwN
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Run the App (Simulator Mode)

```bash
npm run dev
```

### Step 4: Open Browser

Visit: **http://localhost:3000**

**You're done!** The app will use the built-in simulator for responses.

---

## 🎊 Option B: Full Experience (Local LLM + Animated UI)

This gives you the **complete experience** with real AI responses.

### Prerequisites

- ✅ Docker Desktop installed and running
- ✅ At least 8GB RAM available
- ✅ 5-10GB free disk space (for models)
- ✅ M1/M2/M3 Mac (for GPU acceleration) or any Mac/Linux/Windows

---

### Step 1: Switch to Animated Branch

```bash
cd /path/to/llm-chat-mvp
git checkout claude/animated-ui-01GDx8f8a4GSUjh2VUNKjHwN
```

---

### Step 2: Install Dependencies

```bash
npm install
```

---

### Step 3: Setup Ollama in Docker (One-Time Setup)

#### **Method A: Automated Setup** (Recommended)

```bash
# Run the interactive setup script
make setup-ollama
```

**What this does:**
1. Starts Ollama container in Docker
2. Asks which model you want (choose option 1: llama3.2:3b)
3. Downloads the model (~2GB, takes 2-5 minutes)
4. Creates `.env.local` with configuration
5. Verifies everything works

**Expected output:**
```
🚀 Setting up Ollama for LLM Survey Assistant...
✅ Docker is running
📦 Starting Ollama container...
✅ Ollama is ready!

📥 Available models to download:
1. llama3.2:3b (2GB)   - Fast, good for demos
2. llama3.2:1b (1GB)   - Very fast, lighter
3. mistral:7b (4GB)    - Better quality, slower
4. qwen2.5:3b (2GB)    - Good balance

Which model would you like to pull? (1-4, or 'skip'): 1

📥 Pulling llama3.2:3b...
[Download progress bars...]
✅ Setup complete!
```

#### **Method B: Manual Setup**

If `make` doesn't work, do it manually:

```bash
# 1. Start Ollama container
docker-compose up -d ollama

# 2. Wait for it to start (about 5 seconds)
sleep 5

# 3. Pull the model (choose one)
docker exec ollama-survey ollama pull llama3.2:3b

# 4. Create configuration file
cat > .env.local << EOF
USE_LOCAL_LLM=true
OLLAMA_URL=http://localhost:11434
MODEL=llama3.2:3b
EOF

# 5. Verify it's working
curl http://localhost:11434/api/tags
```

**Expected output from curl:**
```json
{
  "models": [
    {
      "name": "llama3.2:3b",
      "model": "llama3.2:3b",
      ...
    }
  ]
}
```

---

### Step 4: Verify Docker Container is Running

```bash
# Check if Ollama container is running
docker ps | grep ollama
```

**Expected output:**
```
CONTAINER ID   IMAGE           ...   STATUS          PORTS                      NAMES
abc123def456   ollama/ollama   ...   Up 2 minutes    0.0.0.0:11434->11434/tcp   ollama-survey
```

**If you don't see it:**
```bash
# Start it
docker-compose up -d ollama

# Check logs
docker logs ollama-survey
```

---

### Step 5: Verify Model is Downloaded

```bash
# List installed models
make list-models

# Or manually:
docker exec ollama-survey ollama list
```

**Expected output:**
```
NAME              ID            SIZE      MODIFIED
llama3.2:3b       abc123...     2.0 GB    2 minutes ago
```

**If no models are listed:**
```bash
# Download one
docker exec ollama-survey ollama pull llama3.2:3b
```

---

### Step 6: Run the App with Local LLM

```bash
# Option 1: Use the convenience command
make dev-with-llm

# Option 2: Manual
npm run dev
```

**The `make dev-with-llm` command:**
1. Checks if Ollama is running
2. Starts it if needed
3. Verifies `.env.local` is configured
4. Starts the dev server

---

### Step 7: Open Browser

Visit: **http://localhost:3000**

---

### Step 8: Verify LLM is Working

#### **Check 1: No Errors in Terminal**

Your terminal should show:
```
▲ Next.js 14.2.33
- Local:        http://localhost:3000

✓ Ready in 2.3s
```

NO errors about Ollama or LLM.

#### **Check 2: Test Natural Language**

1. Get to Question 2 (Radio question: "How are you feeling today?")
2. Click **"Type Answer"** mode
3. Type something natural like: **"I'm doing pretty well today"**
4. Click **"Submit Answer"**
5. **Wait 1-2 seconds** for LLM to process

**With Simulator (not using LLM):**
- Response is instant
- Generic message like "Got it! I understand you mean..."

**With Local LLM (working correctly):**
- Takes 1-2 seconds to respond
- More natural message like "Glad to hear you're doing well! Let's continue."
- More contextual and varied responses

#### **Check 3: Browser Console**

Open DevTools (F12), check Console tab:
- **No red errors** about "Failed to fetch" or "Ollama"
- May see network requests to `localhost:11434`

---

## 🧪 Testing Both Modes Together

### Test the Full Experience

Go through the survey and notice the differences:

#### **Question 1 (Info):**
- Smooth slide-in animation
- Click "Continue"

#### **Question 2 (Radio with LLM):**
**Test natural language processing:**

1. Switch to "Type Answer"
2. Try these inputs:

| You Type | LLM Should Understand As |
|----------|--------------------------|
| "I feel amazing" | → "Great" |
| "not so good" | → "Not so good" or "Bad" |
| "meh, okay I guess" | → "Okay" |
| "pretty bad today" | → "Bad" |

**Watch the chat:** The LLM's response should be contextual and natural, not just template text.

#### **Question 3 (Slider with LLM):**
**Test numeric interpretation:**

1. Switch to "Type Answer"
2. Try these:

| You Type | LLM Should Interpret |
|----------|---------------------|
| "8" | → 8 |
| "high pain" | → 7-9 |
| "medium" | → 5 |
| "very low" | → 1-2 |

**Response time:** 1-2 seconds (LLM is processing)

#### **Question 4 (3D Body Model):**
This doesn't use LLM - it's pure 3D interaction!

- Rotate the body
- Click on a body part
- Watch it glow red
- Confirm selection

#### **Question 5 (Text with LLM):**
Write a longer response and watch the LLM provide a more thoughtful acknowledgment.

Example:
```
You: "I've been experiencing sharp pain in my lower back, especially when I wake up in the morning. It gets better during the day."

LLM: "Thank you for sharing those details about your lower back pain and how it varies throughout the day. That's helpful information."
```

**With simulator:** Generic "Thank you for that detailed response."
**With LLM:** More specific acknowledgment referencing your actual words.

---

## 📊 Performance Comparison

### Simulator Mode
- ⚡ **Instant responses** (<100ms)
- 💾 **No extra memory** usage
- 🎯 **Pattern matching** - predictable but limited
- ✅ Good for testing UI

### Local LLM Mode (llama3.2:3b on M1 Pro)
- ⏱️ **1-2 second responses**
- 💾 **2-3GB RAM** usage
- 🤖 **Real AI** - natural, varied, contextual
- ✨ Impressive for demos

---

## 🎨 What to Look For

### Animations (Both Modes)
- ✅ Floating particles
- ✅ Smooth transitions
- ✅ 3D body model
- ✅ Confetti celebration
- ✅ All micro-interactions

### LLM Responses (Local LLM Mode Only)
- ✅ Takes 1-2 seconds to respond
- ✅ More natural language
- ✅ Contextual acknowledgments
- ✅ Varied responses (not identical each time)
- ✅ Better at interpreting ambiguous input

---

## 🔍 Troubleshooting

### Issue: "Cannot connect to Ollama"

**Symptoms:**
- Responses are instant (falls back to simulator)
- Console shows: "Ollama not available, falling back to simulator"

**Solution:**
```bash
# Check if Ollama is running
docker ps | grep ollama

# If not running, start it
docker-compose up -d ollama

# Wait 5 seconds
sleep 5

# Test connection
curl http://localhost:11434/api/tags

# Restart dev server
# Press Ctrl+C in terminal
npm run dev
```

---

### Issue: "Model not found"

**Symptoms:**
- Error in browser console: "model 'llama3.2:3b' not found"

**Solution:**
```bash
# Check what models you have
docker exec ollama-survey ollama list

# If empty, pull a model
docker exec ollama-survey ollama pull llama3.2:3b

# Wait for download to complete (2-5 minutes)
# Restart dev server
```

---

### Issue: Slow LLM Responses (>5 seconds)

**Solutions:**

1. **Check system resources:**
```bash
# Monitor Docker container
docker stats ollama-survey
# Should see CPU and memory usage during requests
```

2. **Use a smaller model:**
```bash
# Pull faster model
docker exec ollama-survey ollama pull llama3.2:1b

# Update .env.local
echo "MODEL=llama3.2:1b" >> .env.local

# Restart dev server
```

3. **Close other apps:**
- Browsers with many tabs
- Video editors
- Other memory-intensive apps

---

### Issue: Docker Container Won't Start

**Solution:**
```bash
# Check Docker Desktop is running
# (Look for Docker icon in menu bar)

# Check logs
docker logs ollama-survey

# Remove and recreate
docker-compose down
docker-compose up -d ollama

# Check if port is in use
lsof -i :11434
```

---

### Issue: ".env.local not being read"

**Solution:**
```bash
# Verify file exists
cat .env.local

# Should show:
# USE_LOCAL_LLM=true
# OLLAMA_URL=http://localhost:11434
# MODEL=llama3.2:3b

# If file doesn't exist, create it
cat > .env.local << EOF
USE_LOCAL_LLM=true
OLLAMA_URL=http://localhost:11434
MODEL=llama3.2:3b
EOF

# Restart dev server (Ctrl+C then npm run dev)
```

---

## 🎯 Convenience Commands

### Start Everything
```bash
# Start Ollama and dev server with LLM enabled
make dev-with-llm
```

### Stop Ollama
```bash
# When you're done, save memory
make stop-ollama
```

### Restart Ollama
```bash
make stop-ollama
make start-ollama
```

### Check Status
```bash
# Is Ollama healthy?
make health

# What models are installed?
make list-models

# View Ollama logs
make logs-ollama
```

### Download Different Model
```bash
# Pull a specific model
make pull-model MODEL=mistral:7b

# Update .env.local to use it
echo "MODEL=mistral:7b" > .env.local
echo "USE_LOCAL_LLM=true" >> .env.local
echo "OLLAMA_URL=http://localhost:11434" >> .env.local
```

---

## 📋 Complete Checklist

Use this to verify everything is working:

### Setup Checklist
- [ ] Git branch: `claude/animated-ui-01GDx8f8a4GSUjh2VUNKjHwN`
- [ ] Dependencies installed (`npm install`)
- [ ] Docker Desktop running
- [ ] Ollama container running (`docker ps | grep ollama`)
- [ ] Model downloaded (`make list-models`)
- [ ] `.env.local` file exists with `USE_LOCAL_LLM=true`
- [ ] Ollama is healthy (`make health` shows ✅)

### Testing Checklist
- [ ] App loads at http://localhost:3000
- [ ] Animations are smooth (particles, transitions)
- [ ] Radio question accepts natural language
- [ ] LLM responses take 1-2 seconds (not instant)
- [ ] LLM responses are natural and varied
- [ ] 3D body model loads and rotates
- [ ] Slider accepts text input
- [ ] Text question shows word count
- [ ] Survey completes with confetti
- [ ] No errors in browser console
- [ ] No errors in terminal

---

## 🎬 Demo Script (Full Experience)

When showing this to others:

1. **Start:**
   > "I've built an interactive survey with AI-powered natural language understanding and 3D graphics. Everything runs locally with GPU acceleration."

2. **Show Animations:**
   > "Notice the smooth animations - floating particles, transitions, and the progress bar."

3. **Demonstrate Natural Language:**
   > "Instead of clicking options, I can just type how I'm feeling naturally... *types 'pretty good'*... watch, it takes a moment to process with the local AI... and it correctly interprets that as 'Good'."

4. **Show 3D Body:**
   > "Here's the impressive part - a fully interactive 3D body model. I can rotate it, zoom in, and click on specific parts. *rotates and clicks*... See how it highlights the selected area?"

5. **Emphasize Tech:**
   > "This is all running locally - the AI model is running in Docker using my Mac's GPU, and the 3D graphics are rendered with Three.js. No cloud APIs, completely private."

6. **Finish:**
   > "And when I complete it... confetti! The whole experience is smooth, engaging, and shows how modern web tech can transform boring forms into interactive experiences."

---

## 💾 Saving Resources When Done

After testing:

```bash
# Stop Ollama to free up memory
make stop-ollama

# Or stop everything
docker-compose down

# Models are saved in Docker volume, so they won't re-download
```

When you want to run again:

```bash
# Start everything
make dev-with-llm
# Models are already there, starts immediately
```

---

## 🎉 Success!

You're running the **complete experience**:
- ✨ Beautiful animated UI
- 🤖 Real local LLM with GPU acceleration
- 🎨 3D interactive graphics
- 🎊 Polished user experience

Perfect for:
- Impressive demos
- Showcasing modern web capabilities
- Demonstrating LLM integration
- Privacy-focused applications
- Offline functionality

---

## 📚 Additional Resources

- **Animated UI Guide**: `ANIMATED_UI_GUIDE.md`
- **Docker Setup Guide**: `DOCKER_SETUP.md`
- **Local LLM Summary**: `LOCAL_LLM_SUMMARY.md`
- **Main README**: `README.md`
- **Quick Start**: `QUICKSTART.md`

---

**Enjoy your fully animated, AI-powered survey assistant!** 🚀
