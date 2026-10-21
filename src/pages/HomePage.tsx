import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Sparkles,
  Plus,
  ShieldCheck,
  Trophy,
  Compass,
  Store,
} from 'lucide-react'
import { AppPageMeta } from '../components/AppPageMeta'
import { QueryState } from '../components/QueryState'
import { useCopy } from '../product/useCopy'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

export function HomePage() {
  const copy = useCopy()
  const { userId } = useAuth()
  const overview = useQuery({
    queryKey: ['journey', userId],
    enabled: !!userId,
    queryFn: async () => {
      const [profile, achievements, scores] = await Promise.all([
        supabase
          .from('profiles')
          .select('display_name,school_or_org,location,avatar_url')
          .eq('id', userId!)
          .single(),
        supabase
          .from('achievements')
          .select('id,title,verification_status,points_awarded')
          .eq('user_id', userId!)
          .order('created_at', { ascending: false }),
        supabase
          .from('user_category_scores')
          .select('points')
          .eq('user_id', userId!),
      ])
      for (const result of [profile, achievements, scores])
        if (result.error) throw result.error
      return {
        profile: profile.data!,
        achievements: achievements.data ?? [],
        points: (scores.data ?? []).reduce((sum, x) => sum + x.points, 0),
      }
    },
  })
  const modules = [
    {
      to: '/olympiads',
      icon: Trophy,
      tag: '01',
      title: copy('Брось себе вызов', 'Өзіңді сынап көр', 'Challenge yourself'),
      body: copy(
        'Онлайн-олимпиады и новые знания.',
        'Онлайн олимпиадалар мен жаңа білім.',
        'Online olympiads and new knowledge.',
      ),
    },
    {
      to: '/roadmap',
      icon: Compass,
      tag: '02',
      title: copy(
        'Найди своё направление',
        'Өз бағытыңды тап',
        'Find your direction',
      ),
      body: copy(
        'Интересы → направления → первые шаги.',
        'Қызығушылық → бағыт → алғашқы қадам.',
        'Interests → directions → first steps.',
      ),
    },
    {
      to: '/marketplace',
      icon: Store,
      tag: '03',
      title: copy(
        'Делись тем, что умеешь',
        'Білгеніңмен бөліс',
        'Share what you know',
      ),
      body: copy(
        'Репетиторство, менторство и консультации.',
        'Репетиторлық, тәлімгерлік және кеңестер.',
        'Tutoring, mentoring and consultations.',
      ),
    },
  ]
  return (
    <div className="space-y-7">
      <AppPageMeta title={copy('Мой путь', 'Менің жолым', 'My journey')} />
      <QueryState query={overview}>
        <section className="relative overflow-hidden rounded-2xl bg-[#211d39] p-7 text-white sm:p-9">
          <Sparkles className="mb-5 text-violet-300" size={25} />
          <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-violet-300">
            From Spark to Success
          </p>
          <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            {copy('Твой путь,', 'Сенің жолың,', 'Your journey,')}{' '}
            {overview.data?.profile.display_name ||
              copy('начинается здесь', 'осында басталады', 'starts here')}
            .
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300">
            {copy(
              'Собери достижения в одном месте. Выбери, чему научиться дальше. Сделай свой потенциал видимым.',
              'Жетістіктеріңді бір жерге жина. Келесі үйренетін нәрсені таңда. Әлеуетіңді көрсет.',
              'Bring your achievements together. Choose what to learn next. Make your potential visible.',
            )}
          </p>
          <Link
            to="/achievements"
            className="mt-6 inline-flex items-center gap-3 rounded-lg bg-white px-5 py-3 text-xs font-bold text-[#211d39]"
          >
            <Plus size={16} />
            {copy('Добавить достижение', 'Жетістік қосу', 'Add an achievement')}
          </Link>
        </section>
        <section className="grid grid-cols-3 gap-3">
          {[
            [
              String(overview.data?.points ?? 0),
              copy('Баллы', 'Ұпайлар', 'Points'),
            ],
            [
              String(
                overview.data?.achievements.filter(
                  (x) => x.verification_status === 'verified',
                ).length ?? 0,
              ),
              copy('Подтверждено', 'Расталған', 'Verified'),
            ],
            [
              String(overview.data?.achievements.length ?? 0),
              copy('В портфолио', 'Портфолиода', 'In portfolio'),
            ],
          ].map(([value, label]) => (
            <div key={label} className="ushqn-card">
              <p className="text-2xl font-bold sm:text-3xl">{value}</p>
              <p className="mt-1 text-[11px] text-[var(--color-ushqn-muted)]">
                {label}
              </p>
            </div>
          ))}
        </section>
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg">
              {copy(
                'Твой следующий шаг',
                'Сенің келесі қадамың',
                'Your next step',
              )}
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {modules.map(({ to, icon: Icon, tag, title, body }) => (
              <Link to={to} key={to} className="ushqn-card group flex flex-col">
                <div className="mb-7 flex items-center justify-between text-violet-500">
                  <Icon size={23} />
                  <span className="text-[10px] text-slate-400">{tag}</span>
                </div>
                <h3 className="text-base">{title}</h3>
                <p className="mb-5 mt-2 flex-1 text-xs leading-6 text-[var(--color-ushqn-muted)]">
                  {body}
                </p>
                <ArrowRight
                  className="text-violet-500 transition group-hover:translate-x-1"
                  size={19}
                />
              </Link>
            ))}
          </div>
        </section>
        <section className="ushqn-card">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-base">
              {copy(
                'Последние достижения',
                'Соңғы жетістіктер',
                'Recent achievements',
              )}
            </h2>
            <Link
              to="/achievements"
              className="text-xs font-semibold text-violet-600"
            >
              {copy('Все', 'Барлығы', 'View all')} →
            </Link>
          </div>
          {!overview.data?.achievements.length ? (
            <div className="py-8 text-center">
              <ShieldCheck className="mx-auto mb-3 text-violet-400" size={30} />
              <p className="text-sm">
                {copy(
                  'Первое достижение — начало истории.',
                  'Алғашқы жетістік — тарихыңның бастауы.',
                  'Your first achievement starts the story.',
                )}
              </p>
              <p className="mt-2 text-xs text-[var(--color-ushqn-muted)]">
                {copy(
                  'Добавь диплом, сертификат или проект и отправь на проверку.',
                  'Диплом, сертификат немесе жоба қосып, тексеруге жібер.',
                  'Add a diploma, certificate or project and submit it for review.',
                )}
              </p>
            </div>
          ) : (
            overview.data.achievements.slice(0, 5).map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between gap-4 border-t border-[var(--color-ushqn-border)] py-4 text-xs"
              >
                <span>{a.title}</span>
                <span
                  className={
                    a.verification_status === 'verified'
                      ? 'text-emerald-600'
                      : 'text-[var(--color-ushqn-muted)]'
                  }
                >
                  {a.verification_status === 'verified'
                    ? `+${a.points_awarded} XP`
                    : a.verification_status === 'rejected'
                      ? copy('Отклонено', 'Қабылданбады', 'Rejected')
                      : copy('На проверке', 'Тексерілуде', 'In review')}
                </span>
              </div>
            ))
          )}
        </section>
      </QueryState>
    </div>
  )
}
