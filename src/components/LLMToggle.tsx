'use client';

import { useLLM } from '@/contexts/LLMContext';
import { motion } from 'framer-motion';

export default function LLMToggle() {
  const { mode, setMode, isOllamaAvailable } = useLLM();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-4"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">AI Response Mode</h3>
          <p className="text-xs text-gray-600">
            Choose between pattern matching or smart LLM responses
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setMode('simulator')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === 'simulator'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📋 Pattern Match
          </button>

          <button
            onClick={() => setMode('ollama')}
            disabled={!isOllamaAvailable}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === 'ollama'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md'
                : isOllamaAvailable
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            title={!isOllamaAvailable ? 'Ollama not available' : ''}
          >
            🧠 Smart LLM
            {!isOllamaAvailable && (
              <span className="ml-1 text-xs">❌</span>
            )}
          </button>
        </div>
      </div>

      {/* Status indicator */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs">
          <div className={`w-2 h-2 rounded-full ${
            mode === 'simulator' ? 'bg-blue-500' : 'bg-green-500'
          } animate-pulse`}></div>
          <span className="text-gray-600">
            {mode === 'simulator'
              ? 'Using pattern matching with empathetic responses'
              : isOllamaAvailable
              ? 'Using llama3.2:3b via Ollama'
              : 'Ollama not running (using pattern matching)'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
