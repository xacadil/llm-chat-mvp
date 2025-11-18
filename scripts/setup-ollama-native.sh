#!/bin/bash

echo "🔄 Switching from Docker to Native Ollama for M1 GPU acceleration"
echo ""

# Stop Docker container
echo "1️⃣ Stopping Docker container..."
docker compose down

# Install Ollama natively
echo "2️⃣ Installing Ollama natively for macOS..."
if ! command -v ollama &> /dev/null; then
    echo "   Downloading Ollama..."
    curl -fsSL https://ollama.com/install.sh | sh
else
    echo "   ✅ Ollama already installed"
fi

# Start Ollama service
echo "3️⃣ Starting Ollama service..."
ollama serve &
OLLAMA_PID=$!
echo "   Started Ollama with PID: $OLLAMA_PID"

# Wait for service to be ready
sleep 5

# Check if model exists, if not pull it
echo "4️⃣ Checking for models..."
if ollama list | grep -q "mistral:7b"; then
    echo "   ✅ mistral:7b already downloaded"
else
    echo "   📥 Pulling mistral:7b (this will take a few minutes)..."
    ollama pull mistral:7b
fi

# Update .env.local to use native Ollama
echo "5️⃣ Updating configuration..."
cat > .env.local << EOF
USE_LOCAL_LLM=true
OLLAMA_URL=http://localhost:11434
MODEL=mistral:7b
EOF

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "   1. Run: npm run dev"
echo "   2. Open: http://localhost:3000"
echo ""
echo "📊 To verify GPU usage:"
echo "   - Open Activity Monitor"
echo "   - Window → GPU History"
echo "   - You should see GPU activity when LLM processes requests"
echo ""
echo "⚠️  To stop Ollama later: killall ollama"
