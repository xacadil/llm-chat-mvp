.PHONY: help install setup-ollama start-ollama stop-ollama dev build clean

help:
	@echo "LLM Survey Assistant - Available Commands"
	@echo ""
	@echo "Setup:"
	@echo "  make install       - Install npm dependencies"
	@echo "  make setup-ollama  - Setup Ollama in Docker (interactive)"
	@echo ""
	@echo "Development:"
	@echo "  make dev           - Start development server"
	@echo "  make dev-with-llm  - Start dev server with local LLM"
	@echo "  make build         - Build for production"
	@echo ""
	@echo "Ollama Management:"
	@echo "  make start-ollama  - Start Ollama container"
	@echo "  make stop-ollama   - Stop Ollama container"
	@echo "  make logs-ollama   - View Ollama logs"
	@echo "  make list-models   - List available models"
	@echo "  make pull-model    - Pull a specific model (e.g., make pull-model MODEL=mistral:7b)"
	@echo ""
	@echo "Utilities:"
	@echo "  make clean         - Clean build artifacts"
	@echo "  make health        - Check Ollama health"

install:
	npm install

setup-ollama:
	@chmod +x scripts/setup-ollama.sh
	@./scripts/setup-ollama.sh

start-ollama:
	@echo "🚀 Starting Ollama container..."
	@docker-compose up -d ollama
	@echo "✅ Ollama is running on http://localhost:11434"

stop-ollama:
	@echo "🛑 Stopping Ollama container..."
	@docker-compose down
	@echo "✅ Ollama stopped"

logs-ollama:
	docker logs -f ollama-survey

list-models:
	@docker exec ollama-survey ollama list || echo "❌ Ollama not running. Run 'make start-ollama' first."

pull-model:
	@if [ -z "$(MODEL)" ]; then \
		echo "Usage: make pull-model MODEL=llama3.2:3b"; \
		exit 1; \
	fi
	@docker exec ollama-survey ollama pull $(MODEL)

health:
	@curl -s http://localhost:11434/api/tags > /dev/null && echo "✅ Ollama is healthy" || echo "❌ Ollama is not responding"

dev:
	npm run dev

dev-with-llm:
	@echo "🚀 Starting dev server with local LLM..."
	@if [ ! -f .env.local ]; then \
		echo "USE_LOCAL_LLM=true" > .env.local; \
		echo "OLLAMA_URL=http://localhost:11434" >> .env.local; \
		echo "MODEL=llama3.2:3b" >> .env.local; \
	fi
	@make health || (echo "⚠️  Ollama not running. Starting..." && make start-ollama && sleep 3)
	@npm run dev

build:
	npm run build

clean:
	rm -rf .next
	rm -rf node_modules
	rm -rf out
	rm -f .env.local
