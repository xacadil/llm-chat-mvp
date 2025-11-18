/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable environment variables in client components
  env: {
    NEXT_PUBLIC_USE_LOCAL_LLM: process.env.USE_LOCAL_LLM || 'false',
    NEXT_PUBLIC_OLLAMA_URL: process.env.OLLAMA_URL || 'http://localhost:11434',
    NEXT_PUBLIC_MODEL: process.env.MODEL || 'llama3.2:3b',
  },
}

module.exports = nextConfig
