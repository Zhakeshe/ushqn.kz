import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AppPageMeta } from '../components/AppPageMeta'
import { MiniProfileSidebar } from '../components/MiniProfileSidebar'
import { DashboardAiAssistantBar } from '../components/DashboardAiAssistantBar'
import { CareerDiagnosticRadar } from '../components/CareerDiagnosticRadar'
import { DigitalPassportCard, DigitalPassportModal } from '../components/DigitalPassportModal'
import { GamificationBanner } from '../components/GamificationBanner'
import { UniversityDirectOffers } from '../components/UniversityDirectOffers'
import { ParentTalentReport } from '../components/ParentTalentReport'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { clearReferralFromStorage } from '../lib/referral'
import {
  Compass,
  ShieldCheck,
  Trophy,
  Building2,
  Users,
  Layers,
} from 'lucide-react'

const CATEGORY_EMOJI: Record<string, string> = {
  robotics: '🤖',
  programming: '💻',
  sports: '⚽',
  debates: '🎤',
  science: '🔬',
  arts: '🎨',
  other: '🏅',
  music: '🎵',
  math: '📐',
}

export function HomePage() {
  const { userId } = useAuth()
  const { t, i18n } = useTranslation()
  const qc = useQueryClient()
  const isKz = i18n.language === 'kk'
  const isRu = i18n.language === 'ru'

  const [activeTab, setActiveTab] = useState<'all' | 'roadmap' | 'passport' | 'gamification' | 'grants' | 'parent'>('all')
  const [isPassportModalOpen, setIsPassportModalOpen] = useState(false)

  const hour = new Date().getHours()
  const greetingKey =
    hour < 12 ? 'home.greetingMorning' : hour < 18 ? 'home.greetingDay' : 'home.greetingEvening'

  useEffect(() => {
    if (!userId) return
    void supabase.auth.getUser().then(({ data }) => {
      const c = data.user?.created_at
      if (!c) return
      if (Date.now() - new Date(c).getTime() < 5 * 60_000) clearReferralFromStorage()
    })
  }, [userId])

  const QUICK_ACTIONS = [
    { to: '/achievements', emoji: '🏆', label: t('home.quickActions.addAchievement'), color: 'bg-[#162a45] text-white hover:bg-[#0f1d30]' },
    { to: '/jobs', emoji: '💼', label: t('home.quickActions.findJob'), color: 'bg-[#0052cc] text-white hover:bg-[#0047b3]' },
    { to: '/people', emoji: '👥', label: t('home.quickActions.findPeople'), color: 'bg-slate-800 text-white hover:bg-slate-900' },
    { to: '/calendar', emoji: '📅', label: t('home.quickActions.events'), color: 'bg-emerald-700 text-white hover:bg-emerald-800' },
    { to: '/communities', emoji: '📍', label: t('home.quickActions.communities'), color: 'bg-purple-700 text-white hover:bg-purple-800' },
  ]

  const recentAchievements = useQuery({
    queryKey: ['achievements-preview', userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const [{ data: rows }, { data: cats }] = await Promise.all([
        supabase
          .from('achievements')
          .select('id,title,points_awarded,created_at,category_id')
          .eq('user_id', userId!)
          .order('created_at', { ascending: false })
          .limit(4),
        supabase.from('achievement_categories').select('id,slug'),
      ])
      const slugMap = new Map((cats ?? []).map((c) => [c.id, c.slug as string]))
      return (rows ?? []).map((a) => ({ ...a, slug: slugMap.get(a.category_id) ?? 'other' }))
    },
  })

  const meQuery = useQuery({
    queryKey: ['home-me', userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('display_name').eq('id', userId!).single()
      if (error) throw error
      return data
    },
  })

  const statsQuery = useQuery({
    queryKey: ['home-stats', userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const [{ count: achCount }, { count: followersCount }] = await Promise.all([
        supabase.from('achievements').select('*', { count: 'exact', head: true }).eq('user_id', userId!),
        supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', userId!),
      ])
      return { achCount: achCount ?? 0, followersCount: followersCount ?? 0 }
    },
  })

  const streakQuery = useQuery({
    queryKey: ['profile-streak', userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('activity_streak_count, activity_streak_last_utc')
        .eq('id', userId!)
        .single()
      if (error) throw error
      return data
    },
  })

  useEffect(() => {
    if (!userId) return
    void supabase.rpc('touch_activity_streak').then(({ error }) => {
      if (!error) void qc.invalidateQueries({ queryKey: ['profile-streak', userId] })
    })
  }, [userId, qc])

  const upcomingEvents = useQuery({
    queryKey: ['upcoming-events', userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data } = await supabase
        .from('events')
        .select('id,title,starts_at,is_online')
        .gte('starts_at', new Date().toISOString())
        .order('starts_at')
        .limit(3)
      return data ?? []
    },
  })

  function handleAiBarAction(actionId: string) {
    if (actionId === 'roadmap') setActiveTab('roadmap')
    else if (actionId === 'passport') setIsPassportModalOpen(true)
    else if (actionId === 'gamification') setActiveTab('gamification')
    else if (actionId === 'grants') setActiveTab('grants')
    else if (actionId === 'parent') setActiveTab('parent')
  }

  const tabs = [
    { id: 'all', label: isKz ? 'Барлық бөлімдер' : isRu ? 'Все модули' : 'All Modules', icon: Layers },
    { id: 'roadmap', label: isKz ? '1. 🤖 AI Roadmap' : isRu ? '1. 🤖 AI Roadmap' : '1. 🤖 AI Roadmap', icon: Compass },
    { id: 'passport', label: isKz ? '2. 🛡️ QR Паспорт' : isRu ? '2. 🛡️ QR Паспорт' : '2. 🛡️ QR Passport', icon: ShieldCheck },
    { id: 'gamification', label: isKz ? '3. 🎮 RPG & XP' : isRu ? '3. 🎮 RPG & XP' : '3. 🎮 RPG & XP', icon: Trophy },
    { id: 'grants', label: isKz ? '4. 🏛️ ЖОО Гранттары' : isRu ? '4. 🏛️ Гранты вузов' : '4. 🏛️ Grants', icon: Building2 },
    { id: 'parent', label: isKz ? '5. 👨‍👩‍👧 Ата-ана' : isRu ? '5. 👨‍👩‍👧 Родителям' : '5. 👨‍👩‍👧 Parent', icon: Users },
  ]

  return (
    <div className="grid gap-5 lg:grid-cols-[260px_1fr] lg:gap-6">
      <AppPageMeta title={t('nav.home')} />

      {/* Left profile sidebar — sticky on scroll */}
      <aside className="hidden lg:block">
        <div className="sticky top-6 space-y-4">
          <MiniProfileSidebar />
        </div>
      </aside>

      <div className="space-y-4">
        {/* Top Clean Greeting Card */}
        <section className="ushqn-card border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {t(greetingKey)} · USHQN Talent Platform
              </p>
              <h1 className="mt-0.5 text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                {meQuery.data?.display_name || t('home.greetingFallbackName')}
              </h1>
            </div>
            <button
              type="button"
              onClick={() => setIsPassportModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#162a45] px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#0f1d30]"
            >
              <ShieldCheck className="h-4 w-4 text-[#38bdf8]" />
              <span>{isKz ? 'Цифрлық QR Паспорт' : isRu ? 'Цифровой QR Паспорт' : 'Digital QR Passport'}</span>
            </button>
          </div>
        </section>

        {/* AI Assistant Command Bar (Synapp-style clean search & prompt bar) */}
        <DashboardAiAssistantBar onSelectAction={handleAiBarAction} />

        {/* Category Tabs for Quick Navigation */}
        <div className="flex overflow-x-auto pb-1 scrollbar-none gap-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isSelected = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as 'all' | 'roadmap' | 'passport' | 'gamification' | 'grants' | 'parent')}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  isSelected
                    ? 'bg-[#162a45] text-white shadow-xs dark:bg-blue-600'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* 1. AI-Driven Career Diagnostic & Roadmap */}
        {(activeTab === 'all' || activeTab === 'roadmap') && (
          <CareerDiagnosticRadar />
        )}

        {/* 2. Verification & Anti-Fake QR Digital Passport Card */}
        {(activeTab === 'all' || activeTab === 'passport') && (
          <DigitalPassportCard onOpenModal={() => setIsPassportModalOpen(true)} />
        )}

        {/* 3. RPG Gamification (Level 1–50 & Streak механикасы) */}
        {(activeTab === 'all' || activeTab === 'gamification') && (
          <GamificationBanner />
        )}

        {/* 4. B2B University Direct Offer System */}
        {(activeTab === 'all' || activeTab === 'grants') && (
          <UniversityDirectOffers />
        )}

        {/* 5. Parent & School Dashboard */}
        {(activeTab === 'all' || activeTab === 'parent') && (
          <ParentTalentReport />
        )}

        {/* Quick stats row */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Link
            to="/achievements"
            className="ushqn-card flex items-center gap-3 p-3.5 transition hover:border-slate-400"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-lg dark:bg-slate-800">
              🏆
            </span>
            <div>
              <p className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                {statsQuery.data?.achCount ?? '8'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{t('home.achievements')}</p>
            </div>
          </Link>
          <Link
            to="/people"
            className="ushqn-card flex items-center gap-3 p-3.5 transition hover:border-slate-400"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-lg dark:bg-slate-800">
              👥
            </span>
            <div>
              <p className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                {statsQuery.data?.followersCount ?? '24'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{t('home.followers')}</p>
            </div>
          </Link>
          <Link
            to="/chat"
            className="ushqn-card flex items-center gap-3 p-3.5 transition hover:border-slate-400"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-lg dark:bg-slate-800">
              💬
            </span>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{t('home.cards.chat.title')}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{t('home.cards.chat.desc')}</p>
            </div>
          </Link>
          <div className="ushqn-card flex items-center gap-3 p-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-lg dark:bg-amber-950/40">
              🔥
            </span>
            <div>
              <p className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                {streakQuery.data?.activity_streak_count ?? 14}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{t('home.streakDays')}</p>
            </div>
          </div>
        </div>

        {/* Quick actions shortcuts */}
        <div>
          <p className="mb-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
            {t('home.quickActionsLabel')}
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {QUICK_ACTIONS.map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className={`flex items-center gap-2 rounded-xl ${a.color} p-2.5 shadow-xs transition hover:scale-[1.01] active:scale-[0.99]`}
              >
                <span className="text-lg">{a.emoji}</span>
                <span className="text-xs font-bold leading-tight">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent achievements + events in 2-col on wider screens */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Recent achievements */}
          {(recentAchievements.data ?? []).length > 0 ? (
            <section className="ushqn-card p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {t('home.recentAchievements')}
                </h2>
                <Link to="/achievements" className="text-xs font-bold text-[#0052cc] hover:underline">
                  {t('common.viewAll')}
                </Link>
              </div>
              <ul className="space-y-2">
                {(recentAchievements.data ?? []).map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/70 p-2.5 dark:border-slate-800 dark:bg-slate-800/40"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-200/80 text-sm dark:bg-slate-700">
                      {CATEGORY_EMOJI[a.slug] ?? '🏅'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-200">{a.title}</p>
                      <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        +{a.points_awarded} {t('common.points')}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* Upcoming events */}
          {(upcomingEvents.data ?? []).length > 0 ? (
            <section className="ushqn-card p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {t('home.upcomingEvents')}
                </h2>
                <Link to="/calendar" className="text-xs font-bold text-[#0052cc] hover:underline">
                  {t('common.viewAll')}
                </Link>
              </div>
              <ul className="space-y-2">
                {(upcomingEvents.data ?? []).map((e) => (
                  <li
                    key={e.id}
                    className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/70 p-2.5 dark:border-slate-800 dark:bg-slate-800/40"
                  >
                    <div className="flex h-8 w-8 shrink-0 flex-col items-center justify-center rounded-lg bg-slate-200/80 dark:bg-slate-700">
                      <span className="text-[11px] font-black text-slate-900 dark:text-white">
                        {new Date(e.starts_at).getDate()}
                      </span>
                      <span className="text-[8px] font-bold uppercase text-slate-500 dark:text-slate-300">
                        {new Date(e.starts_at).toLocaleString(undefined, { month: 'short' })}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-200">{e.title}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {new Date(e.starts_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        {e.is_online ? ` · ${t('calendar.online')}` : ''}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>

      {/* Digital QR Passport Modal */}
      {isPassportModalOpen && (
        <DigitalPassportModal
          userName={meQuery.data?.display_name || 'Әлішер Төлеубаев'}
          onClose={() => setIsPassportModalOpen(false)}
        />
      )}
    </div>
  )
}
