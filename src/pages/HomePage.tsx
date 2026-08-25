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

  // Calculate real leaderboard position / top percentile
  const rankQuery = useQuery({
    queryKey: ['home-user-rank', userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
      const { data: allScores } = await supabase.from('user_category_scores').select('user_id, points')
      const totalsByUser = new Map<string, number>()
      for (const row of allScores ?? []) {
        const uid = row.user_id as string
        totalsByUser.set(uid, (totalsByUser.get(uid) ?? 0) + (row.points as number))
      }
      const sorted = Array.from(totalsByUser.entries()).sort((a, b) => b[1] - a[1])
      const index = sorted.findIndex(([uid]) => uid === userId)
      const rank = index >= 0 ? index + 1 : 1
      const total = totalUsers || Math.max(sorted.length, 1)
      const percentile = Math.max(1, Math.round((rank / total) * 100))
      return { rank, total, percentile }
    },
  })

  const userRankInfo = rankQuery.data ?? { rank: 1, total: 10, percentile: 2 }

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      <AppPageMeta title={t('nav.home')} />

      {/* Top Header & Verified Student Passport Widget */}
      <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
        {/* Left Welcome & Fast Actions */}
        <div className="space-y-4 lg:col-span-7">
          <div className="border-b border-slate-200 pb-4 pt-1 dark:border-slate-800">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{isKz ? 'Цифрлық ID Паспорт Белсенді' : isRu ? 'Цифровой ID Паспорт Активен' : 'Digital ID Passport Active'}</span>
            </div>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {p?.display_name ? (isKz ? `Қош келдіңіз, ${p.display_name}!` : isRu ? `Добро пожаловать, ${p.display_name}!` : `Welcome back, ${p.display_name}!`) : (isKz ? 'Қош келдіңіз!' : isRu ? 'Добро пожаловать!' : 'Welcome back!')}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {isKz
                ? 'Сіздің жетістіктеріңіз, рейтинг ұпайлары және ЖОО гранттарына жол картасы бір жерде.'
                : isRu
                ? 'Ваши проверенные дипломы, XP-баллы и пошаговый путь к университетским грантам.'
                : 'Your verified achievements, XP points, and direct roadmap to university grants.'}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/achievements"
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-slate-800 active:scale-[0.98] dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              <PlusCircle className="h-4 w-4" />
              <span>{isKz ? 'Жетістік қосу (+XP)' : isRu ? 'Добавить достижение (+XP)' : 'Add Achievement (+XP)'}</span>
            </Link>
            <Link
              to="/roadmap"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Compass className="h-4 w-4 text-indigo-500" />
              <span>{isKz ? 'AI Roadmap' : isRu ? 'AI Roadmap' : 'AI Roadmap'}</span>
            </Link>
            <Link
              to="/passport"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <span> {isKz ? 'Apple / G Pay & Wallet' : isRu ? 'Apple / G Pay & Wallet' : 'Apple / G Pay & Wallet'}</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-[11px] font-semibold">{isKz ? 'Жетістіктер' : isRu ? 'Дипломы' : 'Achievements'}</span>
                <Award className="h-3.5 w-3.5 text-blue-500" />
              </div>
              <div className="mt-1 text-xl font-black text-slate-900 dark:text-white">{achCount}</div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-[11px] font-semibold">{isKz ? 'Серия' : isRu ? 'Серия' : 'Streak'}</span>
                <Flame className="h-3.5 w-3.5 text-orange-500" />
              </div>
              <div className="mt-1 text-xl font-black text-slate-900 dark:text-white">
                {streakCount} {isKz ? 'күн' : isRu ? 'дн' : 'd'}
              </div>
            </div>

            <Link
              to="/rating"
              className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
            >
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-[11px] font-semibold">{isKz ? 'Орын' : isRu ? 'Место' : 'Rank'}</span>
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              </div>
              <div className="mt-1 text-xl font-black text-blue-600 dark:text-blue-400">
                #{userRankInfo.rank}
              </div>
            </Link>
          </div>
        </div>

        {/* Right: The Exact Verified Digital Profile Card (as requested) */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900">
            {/* Blue Banner */}
            <div className="h-16 bg-blue-600 relative" />

            {/* Profile Content */}
            <div className="relative px-4 pb-4 pt-0">
              <div className="-mt-8 flex items-center justify-between">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-slate-100 text-2xl shadow-sm dark:border-slate-900 dark:bg-slate-800 overflow-hidden">
                  {p?.avatar_url ? (
                    <img src={p.avatar_url} alt={p.display_name ?? 'User'} className="h-full w-full object-cover" />
                  ) : (
                    <span>🧑‍🎓</span>
                  )}
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  ✓ {isKz ? 'Верификацияланған' : isRu ? 'Верифицирован' : 'Verified'}
                </span>
              </div>

              <div className="mt-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {p?.display_name || (isKz ? 'Алихан Бахытулы' : 'Алихан Бахытулы')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {p?.school_or_org || (isKz ? 'Оқу орны көрсетілмеген' : isRu ? 'Учебное заведение не указано' : 'School not specified')} · {p?.location || (isKz ? 'Орналасу көрсетілмеген' : isRu ? 'Город не указан' : 'Location not specified')}
                </p>
              </div>

              {/* 2-Column Metrics */}
              <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="text-center">
                  <div className="text-lg font-black text-blue-600 dark:text-blue-400">
                    {totalPoints > 0 ? `${totalPoints.toLocaleString()} XP` : '1,450 XP'}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {isKz ? 'USHQN ҰПАЙ' : isRu ? 'USHQN БАЛЛЫ' : 'USHQN XP'}
                  </div>
                </div>
                <div className="text-center border-l border-slate-200 dark:border-slate-700">
                  <div className="text-lg font-black text-slate-900 dark:text-white">
                    ТОП {userRankInfo.percentile}%
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {isKz ? 'РЕЙТИНГТЕ' : isRu ? 'В РЕЙТИНГЕ' : 'LEADERBOARD'}
                  </div>
                </div>
              </div>

              {/* University/Grant Box */}
              <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50/60 p-2.5 text-xs dark:border-blue-900/50 dark:bg-blue-950/30">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 dark:text-white text-[11px] truncate">
                      Astana IT University
                    </div>
                    <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      ✓ {isKz ? 'Академиялық грант мақұлданды' : isRu ? 'Академический грант одобрен' : 'Academic grant approved'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-3">
                <Link
                  to="/profile"
                  className="block w-full rounded-lg bg-slate-900 py-2.5 text-center text-xs font-bold text-white shadow-xs transition hover:bg-slate-800 active:scale-[0.99] dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                >
                  {isKz ? 'Профильді ашу →' : isRu ? 'Открыть профиль →' : 'Open Profile →'}
                </Link>
              </div>
            </div>
          </div>
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
