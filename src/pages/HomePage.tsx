import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AppPageMeta } from '../components/AppPageMeta'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { clearReferralFromStorage } from '../lib/referral'
import {
  Trophy,
  Calendar,
  Award,
  ArrowRight,
  TrendingUp,
  Briefcase,
  Flame,
  PlusCircle,
  ShieldCheck,
  Compass,
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

  useEffect(() => {
    if (!userId) return
    void supabase.auth.getUser().then(({ data }) => {
      const c = data.user?.created_at
      if (!c) return
      if (Date.now() - new Date(c).getTime() < 5 * 60_000) clearReferralFromStorage()
    })
  }, [userId])

  const profileQuery = useQuery({
    queryKey: ['home-profile', userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId!).single()
      if (error) throw error
      return data
    },
  })

  const statsQuery = useQuery({
    queryKey: ['home-stats', userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const [{ count: achCount }, { count: followersCount }, { data: scores }] = await Promise.all([
        supabase.from('achievements').select('*', { count: 'exact', head: true }).eq('user_id', userId!),
        supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', userId!),
        supabase.from('user_category_scores').select('points').eq('user_id', userId!),
      ])
      const totalPoints = (scores ?? []).reduce((s, r) => s + (r.points as number), 0)
      return { achCount: achCount ?? 0, followersCount: followersCount ?? 0, totalPoints }
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
          .limit(5),
        supabase.from('achievement_categories').select('id,slug'),
      ])
      const slugMap = new Map((cats ?? []).map((c) => [c.id, c.slug as string]))
      return (rows ?? []).map((a) => ({ ...a, slug: slugMap.get(a.category_id) ?? 'other' }))
    },
  })

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

  const p = profileQuery.data
  const totalPoints = statsQuery.data?.totalPoints ?? 0
  const achCount = statsQuery.data?.achCount ?? 0
  const streakCount = streakQuery.data?.activity_streak_count ?? 1

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      <AppPageMeta title={t('nav.home')} />

      {/* Top Minimal Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 pt-2 sm:flex-row sm:items-center dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {p?.display_name || 'Платформа'}
          </h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {isKz ? 'USHQN цифрлық портфолио және оқушылар қауымдастығы' : isRu ? 'Цифровое портфолио и сообщество талантов USHQN' : 'USHQN Talent Platform & Digital Portfolio'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/achievements"
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          >
            <PlusCircle className="h-4 w-4" />
            <span>{isKz ? 'Жетістік қосу' : isRu ? 'Добавить достижение' : 'Add Achievement'}</span>
          </Link>
          <Link
            to="/profile"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <span>{isKz ? 'Профиль' : isRu ? 'Профиль' : 'Profile'}</span>
          </Link>
        </div>
      </div>

      {/* Real Metric Stat Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">{isKz ? 'Ұпайлар' : isRu ? 'Баллы' : 'Total Points'}</span>
            <Trophy className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {totalPoints}
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {isKz ? 'Категориялар бойынша' : isRu ? 'По категориям' : 'Across categories'}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">{isKz ? 'Жетістіктер' : isRu ? 'Достижения' : 'Achievements'}</span>
            <Award className="h-4 w-4 text-blue-500" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {achCount}
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {isKz ? 'Портфолиодағы дипломдар' : isRu ? 'В вашем портфолио' : 'In your portfolio'}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">{isKz ? 'Белсенділік' : isRu ? 'Активность' : 'Streak'}</span>
            <Flame className="h-4 w-4 text-orange-500" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {streakCount} {isKz ? 'күн' : isRu ? 'дней' : 'days'}
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {isKz ? 'Үздіксіз кіру' : isRu ? 'Серия посещений' : 'Daily streak'}
          </p>
        </div>

        <Link
          to="/rating"
          className="group rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">{isKz ? 'Рейтинг' : isRu ? 'Рейтинг' : 'Leaderboard'}</span>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600">
            {isKz ? 'Тізімді ашу' : isRu ? 'Открыть топ' : 'View Top'}
          </div>
          <p className="mt-1 text-[11px] text-blue-600 dark:text-blue-400">
            {isKz ? 'Барлық оқушылар арасында' : isRu ? 'Среди всех участников' : 'Among all members'} &rarr;
          </p>
        </Link>
      </div>

      {/* Main Grid Sections */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Achievements Section */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-slate-700 dark:text-slate-300" />
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                {t('home.recentAchievements')}
              </h2>
            </div>
            <Link
              to="/achievements"
              className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              {t('common.viewAll')}
            </Link>
          </div>

          {(recentAchievements.data ?? []).length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {(recentAchievements.data ?? []).map((a) => (
                <div key={a.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-lg">{CATEGORY_EMOJI[a.slug] ?? '🏅'}</span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-slate-800 dark:text-slate-200">
                        {a.title}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {new Date(a.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                    +{a.points_awarded} {t('common.points')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isKz ? 'Әзірге жетістіктер жоқ' : isRu ? 'Пока нет добавленных достижений' : 'No achievements added yet'}
              </p>
              <Link
                to="/achievements"
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                <span>{isKz ? 'Біріншісін қосу' : isRu ? 'Добавить первое' : 'Add your first'}</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>

        {/* Upcoming Events Section */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-700 dark:text-slate-300" />
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                {t('home.upcomingEvents')}
              </h2>
            </div>
            <Link
              to="/calendar"
              className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              {t('common.viewAll')}
            </Link>
          </div>

          {(upcomingEvents.data ?? []).length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {(upcomingEvents.data ?? []).map((e) => (
                <div key={e.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {new Date(e.starts_at).getDate()}
                      </span>
                      <span className="text-[9px] uppercase text-slate-500 dark:text-slate-400">
                        {new Date(e.starts_at).toLocaleString(undefined, { month: 'short' })}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-slate-800 dark:text-slate-200">
                        {e.title}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {new Date(e.starts_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        {e.is_online ? ` · ${t('calendar.online')}` : ''}
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/calendar"
                    className="shrink-0 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  >
                    &rarr;
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isKz ? 'Жақын арада іс-шаралар жоқ' : isRu ? 'Нет предстоящих мероприятий' : 'No upcoming events'}
              </p>
              <Link
                to="/calendar"
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                <span>{isKz ? 'Күнтізбені қарау' : isRu ? 'Открыть календарь' : 'View Calendar'}</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Link
          to="/jobs"
          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
            <Briefcase className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-semibold text-slate-900 dark:text-white">
              {isKz ? 'Мүмкіндіктер & Вакансиялар' : isRu ? 'Возможности & Вакансии' : 'Opportunities & Jobs'}
            </h3>
            <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
              {isKz ? 'Стажировкалар мен жобалар' : isRu ? 'Стажировки и проекты' : 'Internships & projects'}
            </p>
          </div>
        </Link>

        <Link
          to="/roadmap"
          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
            <Compass className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-semibold text-slate-900 dark:text-white">
              {isKz ? 'Бағыт & Roadmap' : isRu ? 'Профориентация & Roadmap' : 'Career & Roadmap'}
            </h3>
            <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
              {isKz ? 'Дағдылар картасы' : isRu ? 'Карта навыков' : 'Skills & path'}
            </p>
          </div>
        </Link>

        <Link
          to="/passport"
          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-semibold text-slate-900 dark:text-white">
              {isKz ? 'Цифрлық ID Паспорт' : isRu ? 'Цифровой ID Паспорт' : 'Digital ID Passport'}
            </h3>
            <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
              {isKz ? 'QR код және верификация' : isRu ? 'QR код и верификация' : 'QR & credentials'}
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
