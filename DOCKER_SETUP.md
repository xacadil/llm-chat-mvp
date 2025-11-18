# Running Ollama in Docker on M1 Mac

This guide explains how to run Ollama locally in Docker on your M1 Pro Mac with GPU acceleration.

## Why Docker + Ollama on M1?

- **GPU Acceleration**: Automatically uses your M1 Pro's GPU via Metal API
- **Isolated Environment**: Doesn't clutter your system
- **Easy Management**: Start/stop with simple commands
- **No API Costs**: Completely free after setup
- **Privacy**: All data stays local

## Prerequisites

1. **Docker Desktop for Mac** installed and running
   - Download from: https://www.docker.com/products/docker-desktop/
   - Make sure it's the Apple Silicon version

2. **Minimum Requirements**:
   - 8GB RAM (16GB+ recommended)
   - 10GB free disk space (for models)
   - macOS 12.0 or later

## Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# Run the setup script
make setup-ollama

# Or manually:
chmod +x scripts/setup-ollama.sh
./scripts/setup-ollama.sh
```

This will:
1. Start Ollama in Docker
2. Let you choose and download a model
3. Create `.env.local` with configuration
4. Verify everything works

### Option 2: Manual Setup

```bash
# 1. Start Ollama container
docker-compose up -d ollama

# 2. Pull a model (choose one)
docker exec ollama-survey ollama pull llama3.2:3b    # Recommended: 2GB, fast
docker exec ollama-survey ollama pull llama3.2:1b    # Fastest: 1GB
docker exec ollama-survey ollama pull mistral:7b     # Better quality: 4GB
docker exec ollama-survey ollama pull qwen2.5:3b     # Alternative: 2GB

# 3. Create .env.local
cat > .env.local << EOF
USE_LOCAL_LLM=true
OLLAMA_URL=http://localhost:11434
MODEL=llama3.2:3b
EOF

# 4. Test it
curl http://localhost:11434/api/tags
```

## Model Recommendations for M1 Pro

### For Quick Demos (Recommended)
```bash
docker exec ollama-survey ollama pull llama3.2:3b
```
- **Size**: ~2GB
- **Speed**: Very fast on M1 Pro
- **Quality**: Good for survey responses
- **Best for**: MVP demos, development

### For Maximum Speed
```bash
docker exec ollama-survey ollama pull llama3.2:1b
```
- **Size**: ~1GB
- **Speed**: Extremely fast
- **Quality**: Decent, may be less nuanced
- **Best for**: Testing, rapid iteration

### For Better Quality
```bash
docker exec ollama-survey ollama pull mistral:7b
```
- **Size**: ~4GB
- **Speed**: Slower but acceptable
- **Quality**: Significantly better reasoning
- **Best for**: Production-like demos

## GPU Acceleration

### How It Works

Docker Desktop on M1 automatically provides GPU access through:
- **Metal API**: Apple's GPU framework
- **Unified Memory**: M1's shared CPU/GPU memory architecture
- **Neural Engine**: For some operations

### Verify GPU Usage

```bash
# Check activity while running a query
# In another terminal:
docker stats ollama-survey

# You should see significant CPU/Memory usage
# Metal GPU usage visible in Activity Monitor
```

### Performance Tips

1. **Close other GPU-intensive apps** (Chrome with many tabs, video editors)
2. **Ensure good cooling** - M1 throttles when hot
3. **Use smaller models** for faster responses
4. **Adjust temperature settings** in prompts (lower = faster, more consistent)

## Usage

### Start Everything

```bash
# Start Ollama
make start-ollama

# Start development server with LLM enabled
make dev-with-llm

# Or manually:
npm run dev
```

Visit `http://localhost:3000`

### Daily Workflow

```bash
# Morning: Start Ollama
make start-ollama

# Work on the app
make dev

# Evening: Stop Ollama
make stop-ollama
```

### Switch Models

```bash
# Pull a new model
make pull-model MODEL=mistral:7b

# Update .env.local
echo "MODEL=mistral:7b" > .env.local
echo "USE_LOCAL_LLM=true" >> .env.local
echo "OLLAMA_URL=http://localhost:11434" >> .env.local

# Restart dev server
```

## Useful Commands

### Model Management

```bash
# List installed models
make list-models

# Or directly:
docker exec ollama-survey ollama list

# Remove a model
docker exec ollama-survey ollama rm llama3.2:3b

# Check model info
docker exec ollama-survey ollama show llama3.2:3b
```

### Container Management

```bash
# View logs
make logs-ollama

# Restart Ollama
make stop-ollama && make start-ollama

# Check health
make health

# Shell into container (advanced)
docker exec -it ollama-survey /bin/bash
```

### Troubleshooting

```bash
# Check if container is running
docker ps | grep ollama

# Check resource usage
docker stats ollama-survey

# View detailed logs
docker logs ollama-survey --tail 100

# Restart everything
docker-compose restart
```

## Performance Benchmarks (M1 Pro)

### llama3.2:3b
- **First token**: ~200-500ms
- **Generation**: ~40-60 tokens/sec
- **Survey question**: ~1-2 seconds total
- **Memory**: ~2-3GB

### llama3.2:1b
- **First token**: ~100-200ms
- **Generation**: ~60-80 tokens/sec
- **Survey question**: <1 second
- **Memory**: ~1-2GB

### mistral:7b
- **First token**: ~500-800ms
- **Generation**: ~20-30 tokens/sec
- **Survey question**: ~2-4 seconds
- **Memory**: ~4-5GB

## Troubleshooting

### Issue: "Cannot connect to Ollama"

```bash
# Check if container is running
docker ps | grep ollama

# Start if not running
make start-ollama

# Check health
make health
```

### Issue: Slow responses

1. Use a smaller model (llama3.2:1b)
2. Close other apps
3. Check Activity Monitor for thermal throttling
4. Ensure Docker has enough resources:
   - Docker Desktop → Settings → Resources
   - Recommended: 6GB RAM, 4 CPUs

### Issue: Out of memory

1. Stop container: `make stop-ollama`
2. Remove unused models: `docker exec ollama-survey ollama rm <model>`
3. Use smaller model
4. Increase Docker memory limit

### Issue: Model download failed

```bash
# Retry download
docker exec ollama-survey ollama pull llama3.2:3b

# Check internet connection
ping -c 3 ollama.ai

# Check disk space
df -h
```

## Storage Management

### Model Locations

Models are stored in Docker volume:
```bash
# Check volume size
docker volume inspect llm-chat-mvp_ollama_data

# Remove volume (deletes all models!)
docker-compose down -v
```

### Clean Up

```bash
# Remove unused models
docker exec ollama-survey ollama rm <model-name>

# Stop and remove everything
docker-compose down

# Remove volume (careful!)
docker volume rm llm-chat-mvp_ollama_data
```

## Switching Between Local and Simulator

### Use Local LLM
```bash
echo "USE_LOCAL_LLM=true" > .env.local
npm run dev
```

### Use Simulator (No Docker needed)
```bash
echo "USE_LOCAL_LLM=false" > .env.local
npm run dev
```

## Production Considerations

For production deployment:

1. **Don't use Docker in production** - Use Ollama directly or cloud APIs
2. **Model choice**: Larger models for better quality
3. **Scaling**: Ollama doesn't support horizontal scaling well
4. **Latency**: Cloud APIs may be faster due to larger infrastructure
5. **Cost**: Calculate total cost of ownership (hardware + electricity vs API costs)

## Resources

- **Ollama Docs**: https://github.com/ollama/ollama
- **Model Library**: https://ollama.com/library
- **Docker Docs**: https://docs.docker.com/desktop/mac/apple-silicon/
- **Metal Performance**: https://developer.apple.com/metal/

## Summary

✅ **Setup**: 5-10 minutes
✅ **Models**: 1-4GB download
✅ **Performance**: Fast enough for demos
✅ **Cost**: Free
✅ **Privacy**: Complete

Perfect for MVP demos and development!
