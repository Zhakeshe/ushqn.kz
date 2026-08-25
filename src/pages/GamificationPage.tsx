import { GamificationBanner } from '../components/GamificationBanner'
import { OlympiadBattleHub } from '../components/OlympiadBattleHub'
import { P2PStudyRoom } from '../components/P2PStudyRoom'
import { DailyMathStreak } from '../components/DailyMathStreak'
import { OlympiadSimulationArena } from '../components/OlympiadSimulationArena'
import { PeerCodeReviewHub } from '../components/PeerCodeReviewHub'
import { StemFlashcardsDecks } from '../components/StemFlashcardsDecks'
import { AppPageMeta } from '../components/AppPageMeta'
import { MiniProfileSidebar } from '../components/MiniProfileSidebar'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'

export function GamificationPage() {
  const { i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const isRu = i18n.language === 'ru'
  const [activeTab, setActiveTab] = useState<
    'daily_math' | 'mock_contest' | 'battles' | 'peer_review' | 'flashcards' | 'p2p_study' | 'rpg_progression'
  >('daily_math')

  return (
    <div className="grid gap-5 lg:grid-cols-[260px_1fr] lg:gap-6">
      <AppPageMeta
        title={
          isKz
            ? 'Олимпиадалық Баттлдар & Ойын Әлемі'
            : isRu
            ? 'Олимпиадные Баттлы & Геймификация'
            : 'Olympiad Battles & Gamification'
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

        {/* Tab Toggle */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1.5 dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
          {[
            { id: 'daily_math', labelKz: '🔥 Күнделікті Стрик', labelRu: '🔥 Дневной Стрик' },
            { id: 'mock_contest', labelKz: '🏆 Олимпиада Симуляторы', labelRu: '🏆 Симулятор IZhO' },
            { id: 'battles', labelKz: '⚔️ Олимпиада Баттлы', labelRu: '⚔️ Олимпиадные Баттлы' },
            { id: 'peer_review', labelKz: '💬 Peer Code Review', labelRu: '💬 Peer Code Review' },
            { id: 'flashcards', labelKz: '🧠 STEM Flashcards', labelRu: '🧠 STEM Флешкарты' },
            { id: 'p2p_study', labelKz: '👥 P2P Study Room', labelRu: '👥 P2P Study Room' },
            { id: 'rpg_progression', labelKz: '🎮 RPG Прогресс', labelRu: '🎮 RPG Прогресс' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() =>
                setActiveTab(
                  tab.id as
                    | 'battles'
                    | 'rpg_progression'
                    | 'p2p_study'
                    | 'daily_math'
                    | 'mock_contest'
                    | 'peer_review'
                    | 'flashcards'
                )
              }
              className={`flex-1 min-w-[120px] rounded-lg py-2 text-xs font-bold transition ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {isKz ? tab.labelKz : tab.labelRu}
            </button>
          ))}
        </div>

        {activeTab === 'daily_math' && <DailyMathStreak />}
        {activeTab === 'mock_contest' && <OlympiadSimulationArena />}
        {activeTab === 'battles' && <OlympiadBattleHub />}
        {activeTab === 'peer_review' && <PeerCodeReviewHub />}
        {activeTab === 'flashcards' && <StemFlashcardsDecks />}
        {activeTab === 'p2p_study' && <P2PStudyRoom />}
        {activeTab === 'rpg_progression' && <GamificationBanner />}
      </div>
    </div>
  )
}
