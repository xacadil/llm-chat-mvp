'use client';

import SurveyOrchestrator from '@/components/SurveyOrchestrator';
import healthSurvey from '@/data/health-survey.json';
import { Survey } from '@/types/survey';

export default function Home() {
  return <SurveyOrchestrator survey={healthSurvey as Survey} />;
}
