'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type LLMMode = 'simulator' | 'ollama';

interface LLMContextType {
  mode: LLMMode;
  setMode: (mode: LLMMode) => void;
  isOllamaAvailable: boolean;
  setIsOllamaAvailable: (available: boolean) => void;
}

const LLMContext = createContext<LLMContextType | undefined>(undefined);

export function LLMProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<LLMMode>('simulator');
  const [isOllamaAvailable, setIsOllamaAvailable] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('llm-mode');
    if (saved === 'ollama' || saved === 'simulator') {
      setModeState(saved);
    }

    // Check Ollama availability
    checkOllamaHealth();
  }, []);

  const checkOllamaHealth = async () => {
    try {
      const response = await fetch('http://localhost:11434/api/tags');
      setIsOllamaAvailable(response.ok);
    } catch {
      setIsOllamaAvailable(false);
    }
  };

  const setMode = (newMode: LLMMode) => {
    setModeState(newMode);
    localStorage.setItem('llm-mode', newMode);
  };

  return (
    <LLMContext.Provider value={{ mode, setMode, isOllamaAvailable, setIsOllamaAvailable }}>
      {children}
    </LLMContext.Provider>
  );
}

export function useLLM() {
  const context = useContext(LLMContext);
  if (context === undefined) {
    throw new Error('useLLM must be used within an LLMProvider');
  }
  return context;
}
