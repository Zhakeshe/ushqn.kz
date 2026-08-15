import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Flame,
  Trophy,
  Zap,
  CheckCircle2,
  Sparkles,
  Crown,
} from 'lucide-react'

interface DailyQuest {
  id: string
  titleKz: string
  titleRu: string
  titleEn: string
  xp: number
  progress: number
  total: number
  claimed: boolean
}

export function GamificationBanner() {
  const { i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const isRu = i18n.language === 'ru'

  const [currentXp, setCurrentXp] = useState(3450)
  const targetXp = 4000
  const level = 14
  const streakDays = 14

  const [quests, setQuests] = useState<DailyQuest[]>([
    {
      id: 'q1',
      titleKz: 'Күнделікті 1 олимпиада есебін шығару',
      titleRu: 'Решить 1 олимпиадную задачу сегодня',
      titleEn: 'Solve 1 Olympiad problem today',
      xp: 50,
      progress: 1,
      total: 1,
      claimed: false,
    },
    {
      id: 'q2',
      titleKz: 'Робототехника сызбасын жүктеу (1.5x XP)',
      titleRu: 'Загрузить схему робота (1.5x XP)',
      titleEn: 'Upload robotics schematic (1.5x XP)',
      xp: 120,
      progress: 1,
      total: 1,
      claimed: false,
    },
    {
      id: 'q3',
      titleKz: 'IELTS академиялық сөздік тестінен өту',
      titleRu: 'Пройти тест по академическому IELTS',
      titleEn: 'Complete IELTS academic quiz',
      xp: 40,
      progress: 3,
      total: 5,
      claimed: false,
    },
  ])

  function claimXp(questId: string, xpReward: number) {
    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, claimed: true } : q))
    )
    setCurrentXp((prev) => Math.min(prev + xpReward, targetXp + 500))
  }

  const xpPercent = Math.min(Math.round((currentXp / targetXp) * 100), 100)

  return (
    <section className="ushqn-card border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
            <Trophy className="h-5 w-5 text-[#0052cc]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {isKz
                  ? '3. 🎮 RPG Gamification (Level 1–50 & Streak)'
                  : isRu
                  ? '3. 🎮 RPG Геймификация (Level 1–50 & Streak)'
                  : '3. 🎮 RPG Gamification (Level 1–50 & Streak)'}
              </h3>
              <span className="rounded-full bg-amber-100 px-2 py-0.2 text-[9px] font-black text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                DIAMOND LEAGUE
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isKz
                ? 'Duolingo стиліндегі үздіксіздік, деңгейлер және олимпиадаларға арналған 1.5x XP мультипликаторы'
                : isRu
                ? 'Duolingo-механика непрерывности, уровни 1-50 и множитель 1.5x XP за верификацию'
                : 'Duolingo-style streak, level 1-50 progression, and 1.5x XP multipliers'}
            </p>
          </div>
        </div>

        {/* Streak Flame Counter Badge */}
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/80 px-3.5 py-1.5 dark:border-amber-900/50 dark:bg-amber-950/30">
          <Flame className="h-5 w-5 text-amber-600 animate-bounce dark:text-amber-400" />
          <div>
            <span className="text-xs font-black text-amber-950 dark:text-amber-200">
              {streakDays} {isKz ? 'күн streak' : isRu ? 'дней streak' : 'day streak'}
            </span>
            <p className="text-[9px] font-bold text-amber-700 dark:text-amber-400">
              {isKz ? 'Үздіксіздік қорғалған' : isRu ? 'Защита активна' : 'Streak Freeze Active'}
            </p>
          </div>
        </div>
      </div>

      {/* Progress & League Row */}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {/* Level Progression */}
        <div className="col-span-2 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-6 items-center justify-center rounded-md bg-[#162a45] px-2 text-[11px] font-black text-white dark:bg-blue-600">
                LVL {level}
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {isKz ? 'Жоба Архитекторы' : isRu ? 'Архитектор Проектов' : 'Project Architect'}
              </span>
            </div>
            <span className="font-mono text-xs font-semibold text-slate-600 dark:text-slate-300">
              {currentXp.toLocaleString()} / {targetXp.toLocaleString()} XP
            </span>
          </div>

          {/* XP Bar */}
          <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full rounded-full bg-[#162a45] dark:bg-blue-500 transition-all duration-500"
              style={{ width: `${xpPercent}%` }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
            <span>{isKz ? `Келесі деңгейге: ${targetXp - currentXp} XP қалды` : isRu ? `До Level 15: ${targetXp - currentXp} XP` : `${targetXp - currentXp} XP to Level 15`}</span>
            <span className="flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400">
              <Zap className="h-3 w-3" />
              1.5x Multiplier
            </span>
          </div>
        </div>

        {/* Season League Rank */}
        <div className="flex flex-col justify-center rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Crown className="h-4 w-4 text-amber-500" />
            <span>{isKz ? 'Diamond Лигасы' : isRu ? 'Бриллиантовая Лига' : 'Diamond League'}</span>
          </div>
          <p className="mt-1 text-base font-black text-slate-900 dark:text-slate-100">
            #7 {isKz ? 'Қазақстан бойынша' : isRu ? 'по Казахстану' : 'in Kazakhstan'}
          </p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
            ▲ +2 {isKz ? 'орын осы аптада' : isRu ? 'позиции за неделю' : 'ranks this week'}
          </span>
        </div>
      </div>

      {/* Daily Quests List */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {isKz ? 'Күнделікті Тапсырмалар (Daily Quests):' : isRu ? 'Ежедневные квесты (Daily Quests):' : 'Daily Quests:'}
          </span>
          <span className="text-[10px] text-slate-400">
            {isKz ? 'Жаңаруға дейін: 14 сағ 20 мин' : isRu ? 'Обновление через: 14 ч 20 мин' : 'Resets in: 14h 20m'}
          </span>
        </div>

        <div className="space-y-1.5">
          {quests.map((q) => {
            const isCompleted = q.progress >= q.total
            return (
              <div
                key={q.id}
                className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/60 p-2.5 text-xs transition dark:border-slate-800 dark:bg-slate-800/40"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex h-4.5 w-4.5 items-center justify-center rounded border ${
                      isCompleted
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-700'
                    }`}
                  >
                    {isCompleted && <CheckCircle2 className="h-3.5 w-3.5" />}
                  </div>
                  <div>
                    <p className={`font-medium text-slate-800 dark:text-slate-200 ${q.claimed ? 'line-through opacity-60' : ''}`}>
                      {isKz ? q.titleKz : isRu ? q.titleRu : q.titleEn}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {q.progress}/{q.total} {isKz ? 'аяқталды' : isRu ? 'выполнено' : 'completed'}
                    </p>
                  </div>
                </div>

                <div>
                  {q.claimed ? (
                    <span className="rounded bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                      {isKz ? 'Алынды' : isRu ? 'Получено' : 'Claimed'}
                    </span>
                  ) : isCompleted ? (
                    <button
                      type="button"
                      onClick={() => claimXp(q.id, q.xp)}
                      className="inline-flex items-center gap-1 rounded bg-amber-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-xs transition hover:bg-amber-600 active:scale-95"
                    >
                      <Sparkles className="h-3 w-3" />
                      +{q.xp} XP {isKz ? 'Алу' : isRu ? 'Забрать' : 'Claim'}
                    </button>
                  ) : (
                    <span className="rounded bg-slate-200/80 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                      +{q.xp} XP
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
