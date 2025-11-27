'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import ParticleBackground from '@/components/animations/ParticleBackground';

export default function Home() {
  const styles = [
    {
      title: '📋 Classic Survey',
      description: 'Traditional split-panel design with form on left and chat on right',
      href: '/survey-classic',
      gradient: 'from-blue-500 to-cyan-500',
      icon: '📋'
    },
    {
      title: '💬 Chat Interface',
      description: 'Modern conversational WhatsApp-style chat experience',
      href: '/survey-chat',
      gradient: 'from-purple-500 to-pink-500',
      icon: '💬'
    },
    {
      title: '🎨 Anime Avatar',
      description: 'Engaging design with animated anime-style avatar assistant',
      href: '/survey-avatar',
      gradient: 'from-orange-500 to-red-500',
      icon: '🎨'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      <ParticleBackground />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            LLM Survey Assistant
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience three different UI styles for natural language survey interactions
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl w-full">
          {styles.map((style, index) => (
            <motion.div
              key={style.href}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={style.href}>
                <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer h-full">
                  <div className={`bg-gradient-to-br ${style.gradient} p-8 text-white`}>
                    <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      {style.icon}
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{style.title}</h2>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {style.description}
                    </p>
                    <div className="mt-6 flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      Try it out
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-500 text-sm">
            Built with Next.js, TypeScript, Framer Motion, and Three.js
          </p>
        </motion.div>
      </div>
    </div>
  );
}
