import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Trophy,
  Swords,
  Flame,
  Users,
  Zap,
} from 'lucide-react'
import { useToast } from '../lib/toast'

interface SchoolStanding {
  rank: number
  schoolName: string
  region: string
  totalXp: number
  activeStudents: number
  weeklyDelta: number
  mvpStudent: string
  badge: string
  color: string
}

const SAMPLE_SCHOOLS: SchoolStanding[] = [
  {
    rank: 1,
    schoolName: 'РФМШ Алматы (ФМН)',
    region: 'Алматы қ.',
    totalXp: 148200,
    activeStudents: 412,
    weeklyDelta: 12450,
    mvpStudent: 'Әлихан Нұрланұлы (+3,850 XP)',
    badge: '👑 Республика Көшбасшысы',
    color: 'from-blue-600 to-indigo-700',
  },
  {
    rank: 2,
    schoolName: 'НИШ ФМН Талдықорған',
    region: 'Жетісу облысы',
    totalXp: 139400,
    activeStudents: 380,
    weeklyDelta: 9800,
    mvpStudent: 'Данияр Серікбаев (+3,200 XP)',
    badge: '⚡ Ең Белсенді Өсім (+18%)',
    color: 'from-emerald-600 to-teal-700',
  },
  {
    rank: 3,
    schoolName: 'БИЛ (BIL) Астана Ер балалар',
    region: 'Астана қ.',
    totalXp: 131800,
    activeStudents: 345,
    weeklyDelta: 11100,
    mvpStudent: 'Санжар Мұрат (+2,900 XP)',
    badge: '🥈 Үздік Информатиктер',
    color: 'from-amber-600 to-orange-700',
  },
  {
    rank: 4,
    schoolName: '«Дарын» Облыстық Лицейі',
    region: 'Қарағанды облысы',
    totalXp: 98200,
    activeStudents: 220,
    weeklyDelta: 6500,
    mvpStudent: 'Айзере Қасым (+2,400 XP)',
    badge: '🚀 Аймақтық Жұлдыз',
    color: 'from-purple-600 to-pink-700',
  },
]

export function SchoolClashLeaderboard() {
  const { i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const { toast } = useToast()

  const [cheeredSchools, setCheeredSchools] = useState<string[]>([])

  const handleCheer = (schoolName: string) => {
    if (cheeredSchools.includes(schoolName)) return
    setCheeredSchools((prev) => [...prev, schoolName])
    toast(
      isKz
        ? `🔥 Сіз «${schoolName}» командасына +50 Қолдау ұпайын бердіңіз!`
        : `🔥 Вы отдали +50 очков поддержки за команду «${schoolName}»!`,
    )
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-950 via-indigo-950 to-slate-900 p-6 text-white shadow-xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-red-500/20 px-3 py-1 text-xs font-bold text-red-300 backdrop-blur-md">
              <Swords className="h-3.5 w-3.5 text-amber-400" />
              <span>{isKz ? 'Республикалық Мектептер Баттлы (Season 2)' : 'Республиканский Турнир Школ (Сезон 2)'}</span>
              <span className="rounded bg-amber-500/30 px-1.5 py-0.5 text-[10px] font-black text-amber-300">
                LIVE
              </span>
            </div>
            <h2 className="text-xl font-black tracking-tight sm:text-2xl">
              РФМШ vs НИШ vs БИЛ vs Дарын
            </h2>
            <p className="max-w-xl text-xs text-slate-200/80 sm:text-sm">
              {isKz
                ? 'Әрбір оқушының қосқан дипломы мен шығарған олимпиадалық есебі өз мектебінің жалпы ұпайына қосылады. Айдың соңында жеңімпаз мектепке «Республикалық Алтын Кубок» беріледі!'
                : 'Каждое достижение ученика автоматически поднимает рейтинг его школы. В конце сезона победившая школа получает главный кубок и грантовые квоты.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md">
              <Trophy className="mx-auto h-6 w-6 text-amber-400" />
              <div className="mt-1 text-sm font-black text-white">₸5,000,000</div>
              <span className="text-[9px] uppercase tracking-wider text-slate-300">
                {isKz ? 'Лабораториялық Грант' : 'Грант на STEM лабораторию'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Table Cards */}
      <div className="space-y-3">
        {SAMPLE_SCHOOLS.map((s) => {
          const isCheered = cheeredSchools.includes(s.schoolName)
          return (
            <div
              key={s.schoolName}
              className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl font-black text-white text-base shadow-sm ${
                    s.rank === 1
                      ? 'bg-amber-500'
                      : s.rank === 2
                      ? 'bg-slate-400'
                      : s.rank === 3
                      ? 'bg-amber-700'
                      : 'bg-slate-700'
                  }`}
                >
                  #{s.rank}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      {s.schoolName}
                    </h3>
                    <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {s.badge}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span>📍 {s.region}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {s.activeStudents} {isKz ? 'оқушы' : 'учеников'}
                    </span>
                    <span>•</span>
                    <span className="text-emerald-600 font-bold">
                      +{s.weeklyDelta.toLocaleString()} XP {isKz ? 'осы аптада' : 'за неделю'}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                    ⭐ MVP: <span className="text-blue-600 dark:text-blue-400">{s.mvpStudent}</span>
                  </div>
                </div>
              </div>

              {/* Score & Cheer Button */}
              <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-3 dark:border-slate-800 md:border-t-0 md:pt-0">
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 text-lg font-black text-slate-900 dark:text-white">
                    <Zap className="h-4 w-4 fill-amber-400 text-amber-500" />
                    <span>{s.totalXp.toLocaleString()} XP</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    {isKz ? 'Жалпы Ұпай' : 'Общий счет'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCheer(s.schoolName)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                    isCheered
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-red-600 text-white shadow-xs hover:bg-red-700 active:scale-95'
                  }`}
                >
                  <Flame className="h-3.5 w-3.5 fill-current" />
                  <span>{isCheered ? (isKz ? 'Қолдау берілді' : 'Поддержано') : (isKz ? 'Қолдау (+50)' : 'Поддержать')}</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
