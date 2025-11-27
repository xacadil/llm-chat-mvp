'use client';

import { LLMProvider } from '@/contexts/LLMContext';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return <LLMProvider>{children}</LLMProvider>;
}
