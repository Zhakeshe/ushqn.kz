import { useState } from 'react'
import { CareerDiagnosticRadar } from '../components/CareerDiagnosticRadar'
import { SmartRoadmapsV2 } from '../components/SmartRoadmapsV2'
import { SocratesAiMentor } from '../components/SocratesAiMentor'
import { DebateSpeechCoach } from '../components/DebateSpeechCoach'
import { AiCoverLetterMatcher } from '../components/AiCoverLetterMatcher'
import { ScientificPaperLatexStudio } from '../components/ScientificPaperLatexStudio'
import { SkillVerificationSandbox } from '../components/SkillVerificationSandbox'
import { AppPageMeta } from '../components/AppPageMeta'
import { MiniProfileSidebar } from '../components/MiniProfileSidebar'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { FeatureStatusNotice } from '../components/FeatureStatusNotice'

export function RoadmapPage() {
  const { i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const isRu = i18n.language === 'ru'
  const [activeTab, setActiveTab] = useState<
    'roadmaps_v2' | 'socrates_ai' | 'debate_coach' | 'cover_letter' | 'latex_studio' | 'radar' | 'skill_sandbox'
  >('roadmaps_v2')

  return (
    <div className="grid gap-5 lg:grid-cols-[260px_1fr] lg:gap-6">
      <AppPageMeta
        title={
          isKz
            ? 'Smart Roadmaps 2.0 & AI Менторлар'
            : isRu
            ? 'Smart Roadmaps 2.0 и AI Менторы'
            : 'Smart Roadmaps 2.0 & AI Mentors'
        }
      />

      <aside className="hidden lg:block">
        <div className="sticky top-6 space-y-4">
          <MiniProfileSidebar />
        </div>
      </aside>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Link
            to="/home"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{isKz ? 'Дэшбордқа қайту' : isRu ? 'Назад в дэшборд' : 'Back to Dashboard'}</span>
          </Link>
        </div>

        <FeatureStatusNotice kind="ai" />

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-1.5 rounded-xl border border-slate-200 bg-white p-1.5 dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
          {[
            {
              id: 'roadmaps_v2',
              labelKz: '🧭 Smart Roadmaps 2.0',
              labelRu: '🧭 Smart Roadmaps 2.0',
            },
            {
              id: 'socrates_ai',
              labelKz: '🤖 AI Socrates Ментор',
              labelRu: '🤖 AI Ментор Сократ',
            },
            {
              id: 'debate_coach',
              labelKz: '🎙️ AI Дебат & Шешендік',
              labelRu: '🎙️ AI Коуч по Дебатам',
            },
            {
              id: 'cover_letter',
              labelKz: '📝 AI Motivation Letter',
              labelRu: '📝 AI Motivation Letter',
            },
            {
              id: 'latex_studio',
              labelKz: '📄 LaTeX Редактор',
              labelRu: '📄 LaTeX Редактор',
            },
            {
              id: 'skill_sandbox',
              labelKz: '⚡ Skill Песочницасы',
              labelRu: '⚡ Skill Песочница',
            },
            {
              id: 'radar',
              labelKz: '🎯 Профориентация Радары',
              labelRu: '🎯 Радар Профориентации',
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() =>
                setActiveTab(
                  tab.id as
                    | 'roadmaps_v2'
                    | 'socrates_ai'
                    | 'debate_coach'
                    | 'cover_letter'
                    | 'latex_studio'
                    | 'radar'
                    | 'skill_sandbox'
                )
              }
              className={`flex-1 min-w-[120px] rounded-lg py-2 text-xs font-bold transition ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {isKz ? tab.labelKz : tab.labelRu}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        {activeTab === 'roadmaps_v2' && <SmartRoadmapsV2 />}
        {activeTab === 'socrates_ai' && <SocratesAiMentor />}
        {activeTab === 'debate_coach' && <DebateSpeechCoach />}
        {activeTab === 'cover_letter' && <AiCoverLetterMatcher />}
        {activeTab === 'latex_studio' && <ScientificPaperLatexStudio />}
        {activeTab === 'skill_sandbox' && <SkillVerificationSandbox />}
        {activeTab === 'radar' && <CareerDiagnosticRadar />}
      </div>
    </div>
  )
}
