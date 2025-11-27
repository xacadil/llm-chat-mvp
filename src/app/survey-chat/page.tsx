'use client';

import ConversationalSurvey from '@/components/ConversationalSurvey';
import healthSurvey from '@/data/health-survey.json';
import { Survey } from '@/types/survey';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ChatSurveyPage() {
  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-4 z-50"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow text-gray-700 font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </motion.div>
      <ConversationalSurvey survey={healthSurvey as Survey} />
    </div>
  );
}
