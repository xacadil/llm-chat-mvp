#!/bin/bash

# Setup script for Ollama in Docker on M1 Mac

echo "🚀 Setting up Ollama for LLM Survey Assistant..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi

echo "✅ Docker is running"

# Start Ollama container
echo "📦 Starting Ollama container..."
docker-compose up -d ollama

# Wait for Ollama to be ready
echo "⏳ Waiting for Ollama to be ready..."
sleep 5

# Check if Ollama is accessible
until curl -s http://localhost:11434/api/tags > /dev/null 2>&1; do
    echo "   Still waiting for Ollama..."
    sleep 2
done

echo "✅ Ollama is ready!"

# Pull recommended models
echo ""
echo "📥 Available models to download:"
echo ""
echo "1. llama3.2:3b (2GB)   - Fast, good for demos"
echo "2. llama3.2:1b (1GB)   - Very fast, lighter"
echo "3. mistral:7b (4GB)    - Better quality, slower"
echo "4. qwen2.5:3b (2GB)    - Good balance"
echo ""
read -p "Which model would you like to pull? (1-4, or 'skip'): " choice

case $choice in
    1)
        echo "📥 Pulling llama3.2:3b..."
        docker exec ollama-survey ollama pull llama3.2:3b
        echo "MODEL=llama3.2:3b" > .env.local
        ;;
    2)
        echo "📥 Pulling llama3.2:1b..."
        docker exec ollama-survey ollama pull llama3.2:1b
        echo "MODEL=llama3.2:1b" > .env.local
        ;;
    3)
        echo "📥 Pulling mistral:7b..."
        docker exec ollama-survey ollama pull mistral:7b
        echo "MODEL=mistral:7b" > .env.local
        ;;
    4)
        echo "📥 Pulling qwen2.5:3b..."
        docker exec ollama-survey ollama pull qwen2.5:3b
        echo "MODEL=qwen2.5:3b" > .env.local
        ;;
    *)
        echo "⏭️  Skipping model download"
        echo "MODEL=llama3.2:3b" > .env.local
        ;;
esac

# Add other env variables
echo "OLLAMA_URL=http://localhost:11434" >> .env.local
echo "USE_LOCAL_LLM=true" >> .env.local

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Run: npm run dev"
echo "   2. Visit: http://localhost:3000"
echo ""
echo "🔧 Useful commands:"
echo "   - List models: docker exec ollama-survey ollama list"
echo "   - Pull model: docker exec ollama-survey ollama pull <model>"
echo "   - Stop: docker-compose down"
echo "   - View logs: docker logs ollama-survey"
echo ""
