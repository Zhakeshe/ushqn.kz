import { GamificationBanner } from '../components/GamificationBanner'
import { OlympiadBattleHub } from '../components/OlympiadBattleHub'
import { P2PStudyRoom } from '../components/P2PStudyRoom'
import { AppPageMeta } from '../components/AppPageMeta'
import { MiniProfileSidebar } from '../components/MiniProfileSidebar'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowLeft, Swords, Trophy, Users } from 'lucide-react'
import { useState } from 'react'

export function GamificationPage() {
  const { i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const isRu = i18n.language === 'ru'
  const [activeTab, setActiveTab] = useState<'battles' | 'p2p_study' | 'rpg_progression'>('battles')

  return (
    <div className="grid gap-5 lg:grid-cols-[260px_1fr] lg:gap-6">
      <AppPageMeta
        title={
          isKz
            ? 'Олимпиадалық Баттлдар & P2P Study Rooms'
            : isRu
            ? 'Олимпиадные Баттлы & P2P Коворкинг'
            : 'Olympiad Battles & P2P Study'
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
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab('battles')}
            className={`flex flex-1 min-w-[140px] items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition ${
              activeTab === 'battles'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            <Swords className="h-4 w-4 text-amber-400" />
            <span>{isKz ? '🏆 Олимпиадалық Баттлдар' : '🏆 Олимпиадные Баттлы'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('p2p_study')}
            className={`flex flex-1 min-w-[140px] items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition ${
              activeTab === 'p2p_study'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            <Users className="h-4 w-4 text-emerald-400" />
            <span>{isKz ? '👥 P2P Study & Pomodoro' : '👥 P2P Study & Pomodoro'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rpg_progression')}
            className={`flex flex-1 min-w-[140px] items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition ${
              activeTab === 'rpg_progression'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            <Trophy className="h-4 w-4 text-amber-300" />
            <span>{isKz ? '🎮 RPG Прогресс & Бейдждер' : '🎮 RPG Прогресс & Бейджи'}</span>
          </button>
        </div>

        {activeTab === 'battles' && <OlympiadBattleHub />}
        {activeTab === 'p2p_study' && <P2PStudyRoom />}
        {activeTab === 'rpg_progression' && <GamificationBanner />}
      </div>
    </div>
  )
}
