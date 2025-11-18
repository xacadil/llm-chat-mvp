'use client';

import ConversationalSurvey from '@/components/ConversationalSurvey';
import healthSurvey from '@/data/health-survey.json';
import { Survey } from '@/types/survey';

export default function Home() {
  return <ConversationalSurvey survey={healthSurvey as Survey} />;
}
