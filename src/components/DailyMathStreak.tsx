import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Flame,
  CheckCircle2,
  XCircle,
  Zap,
  HelpCircle,
  RotateCcw,
  Shield,
  Share2,
} from 'lucide-react'
import { useToast } from '../lib/toast'

interface DailyProblem {
  id: string
  date: string
  domain: 'math' | 'informatics' | 'physics'
  difficulty: 'Оңай' | 'Орташа' | 'Олимпиадалық'
  questionKz: string
  questionEn: string
  options: { id: string; textKz: string; textEn: string; isCorrect: boolean }[]
  explanationKz: string
  explanationEn: string
  pointsXp: number
}

const TODAY_PROBLEM: DailyProblem = {
  id: 'daily-2026-08-25',
  date: '25 Тамыз, 2026',
  domain: 'math',
  difficulty: 'Олимпиадалық',
  questionKz: 'Барлық нақты x үшін f(x) + 2f(1 - x) = 3x^2 теңдеуі орындалса, f(2) мәні неге тең?',
  questionEn: 'If f(x) + 2f(1 - x) = 3x^2 holds for all real x, what is the exact value of f(2)?',
  options: [
    { id: 'opt-a', textKz: 'f(2) = 0', textEn: 'f(2) = 0', isCorrect: false },
    { id: 'opt-b', textKz: 'f(2) = -2', textEn: 'f(2) = -2', isCorrect: true },
    { id: 'opt-c', textKz: 'f(2) = 4', textEn: 'f(2) = 4', isCorrect: false },
    { id: 'opt-d', textKz: 'f(2) = 8', textEn: 'f(2) = 8', isCorrect: false },
  ],
  explanationKz: '1) x = 2 қоямыз: f(2) + 2f(-1) = 12.\n2) x = -1 қоямыз: f(-1) + 2f(2) = 3.\n3) Екінші теңдеуді 2-ге көбейтіп, біріншісінен азайтамыз:\n(f(2) + 2f(-1)) - 2(f(-1) + 2f(2)) = 12 - 6\n=> -3f(2) = 6 => f(2) = -2.',
  explanationEn: '1) Substitute x = 2: f(2) + 2f(-1) = 12.\n2) Substitute x = -1: f(-1) + 2f(2) = 3.\n3) Multiply equation (2) by 2 and subtract from (1):\n-3f(2) = 6 => f(2) = -2.',
  pointsXp: 50,
}

export function DailyMathStreak() {
  const { i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const { toast } = useToast()

  const [streakCount, setStreakCount] = useState(14)
  const [freezeShields, setFreezeShields] = useState(2)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  const isCorrect = selectedOption === 'opt-b'

  const handleSubmitAnswer = () => {
    if (!selectedOption) return
    setIsAnswered(true)
    if (selectedOption === 'opt-b') {
      setStreakCount((prev) => prev + 1)
      toast(isKz ? 'Керемет! +50 XP және Стрик ұзартылды! 🔥' : 'Brilliant! +50 XP and Streak extended! 🔥', 'success')
    } else {
      toast(isKz ? 'Қате жауап! Шешімін оқып шығыңыз.' : 'Incorrect! Check the step-by-step solution.', 'error')
    }
  }

  const handleUseFreeze = () => {
    if (freezeShields > 0) {
      setFreezeShields((p) => p - 1)
      toast(isKz ? 'Стрик қорғанысы қосылды 🛡️' : 'Streak Freeze activated 🛡️', 'info')
    }
  }

  return (
    <div className="space-y-6">
      {/* Hero Streak Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 p-6 dark:border-amber-900/50">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/30">
              <Flame className="h-9 w-9 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">
                  {streakCount} {isKz ? 'Күндік Стрик' : 'Day Streak'}
                </span>
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-300">
                  🔥 От болып жанып тұр!
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {isKz
                  ? 'Күн сайын 1 олимпиадалық логика есебін шығарып, интеллектуалдық тонусыңызды сақтаңыз.'
                  : 'Solve 1 Olympiad logic challenge every day to build relentless mental rigor.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleUseFreeze}
              className="inline-flex items-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50 px-3.5 py-2 text-xs font-bold text-sky-800 hover:bg-sky-100 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-300"
            >
              <Shield className="h-4 w-4 text-sky-600" />
              <span>{isKz ? `Қалқан: ${freezeShields}` : `Streak Freeze: ${freezeShields}`}</span>
            </button>
            <button
              type="button"
              onClick={() => toast(isKz ? 'Стрик сілтемесі көшірілді!' : 'Streak link copied!', 'info')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900"
            >
              <Share2 className="h-4 w-4" />
              <span>{isKz ? 'Бөлісу' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* 7-Day History Track */}
        <div className="mt-2 grid grid-cols-7 gap-2 pt-2 border-t border-amber-200/60 dark:border-amber-900/40">
          {['Дс', 'Сс', 'Ср', 'Бс', 'Жм', 'Сн', 'Жс'].map((day, idx) => {
            const isDone = idx < 5
            const isToday = idx === 4
            return (
              <div
                key={day}
                className={`flex flex-col items-center justify-center rounded-xl py-2 text-center transition ${
                  isToday
                    ? 'bg-amber-500 text-white font-black shadow-sm'
                    : isDone
                    ? 'bg-amber-100/80 text-amber-900 font-bold dark:bg-amber-950/50 dark:text-amber-200'
                    : 'bg-slate-100 text-slate-400 dark:bg-slate-800/40'
                }`}
              >
                <span className="text-[11px]">{day}</span>
                <span className="text-xs">{isDone ? '🔥' : '○'}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Today's Problem Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
              📐 {TODAY_PROBLEM.domain.toUpperCase()}
            </span>
            <span className="rounded-lg bg-purple-100 px-2.5 py-1 text-xs font-bold text-purple-800 dark:bg-purple-900/60 dark:text-purple-300">
              ⭐ {TODAY_PROBLEM.difficulty}
            </span>
            <span className="text-xs text-slate-400">• {TODAY_PROBLEM.date}</span>
          </div>

          <div className="flex items-center gap-1 text-xs font-black text-amber-600 dark:text-amber-400">
            <Zap className="h-4 w-4 fill-current" />
            <span>+{TODAY_PROBLEM.pointsXp} XP Reward</span>
          </div>
        </div>

        {/* Question Statement */}
        <div className="my-6 rounded-xl border border-slate-100 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-800/50">
          <h3 className="text-sm font-bold leading-relaxed text-slate-900 dark:text-white sm:text-base">
            {isKz ? TODAY_PROBLEM.questionKz : TODAY_PROBLEM.questionEn}
          </h3>
        </div>

        {/* Options */}
        <div className="grid gap-3 sm:grid-cols-2">
          {TODAY_PROBLEM.options.map((opt) => {
            const isSelected = selectedOption === opt.id
            let btnClass = 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700'

            if (isAnswered) {
              if (opt.isCorrect) {
                btnClass = 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300'
              } else if (isSelected && !opt.isCorrect) {
                btnClass = 'border-rose-500 bg-rose-50 text-rose-900 dark:bg-rose-950/40 dark:text-rose-300'
              }
            } else if (isSelected) {
              btnClass = 'border-blue-600 bg-blue-50/60 text-blue-900 dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-200'
            }

            return (
              <button
                key={opt.id}
                type="button"
                disabled={isAnswered}
                onClick={() => setSelectedOption(opt.id)}
                className={`flex items-center justify-between rounded-xl border p-4 text-left font-mono text-sm font-bold transition ${btnClass}`}
              >
                <span>{isKz ? opt.textKz : opt.textEn}</span>
                {isAnswered && opt.isCorrect && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                {isAnswered && isSelected && !opt.isCorrect && <XCircle className="h-5 w-5 text-rose-600" />}
              </button>
            )
          })}
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setShowExplanation(!showExplanation)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            <HelpCircle className="h-4 w-4" />
            <span>
              {showExplanation
                ? isKz
                  ? 'Түсіндірмені жабу'
                  : 'Hide explanation'
                : isKz
                ? 'Қадамдық шешу жолын көру'
                : 'View step-by-step solution'}
            </span>
          </button>

          {!isAnswered ? (
            <button
              type="button"
              onClick={handleSubmitAnswer}
              disabled={!selectedOption}
              className="rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {isKz ? 'Жауапты Тексеру' : 'Submit & Check'}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">
                {isCorrect ? '✅ Дұрыс шешім!' : '❌ Қайта көріңіз!'}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsAnswered(false)
                  setSelectedOption(null)
                  setShowExplanation(false)
                }}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Қайталау</span>
              </button>
            </div>
          )}
        </div>

        {/* Step-by-step Explanation Box */}
        {showExplanation && (
          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-xs leading-relaxed text-slate-800 dark:border-blue-900/40 dark:bg-blue-950/20 dark:text-slate-200 whitespace-pre-wrap">
            <div className="mb-2 font-bold text-blue-800 dark:text-blue-300">
              💡 {isKz ? 'Олимпиадалық шешім логикасы:' : 'Olympiad Solution Step-by-step:'}
            </div>
            {isKz ? TODAY_PROBLEM.explanationKz : TODAY_PROBLEM.explanationEn}
          </div>
        )}
      </div>
    </div>
  )
}
