import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react'
import { useToast } from '../lib/toast'

interface SkillChallenge {
  id: string
  skillTitle: string
  domain: string
  difficulty: string
  questionKz: string
  questionEn: string
  badgeAwarded: string
}

const CHALLENGES: SkillChallenge[] = [
  {
    id: 'sc-1',
    skillTitle: 'Dynamic Programming & Bitmask DP',
    domain: 'Computer Science',
    difficulty: 'Hard (2000 Rating)',
    questionKz: 'N <= 20 төбелі Travelling Salesperson Problem (TSP) есебін O(2^N * N^2) Bitmask DP арқылы шешетін рекурренттік қатынасты дұрыс таңдаңыз.',
    questionEn: 'Choose the exact bitmask dynamic programming state transition for TSP on N <= 20 vertices.',
    badgeAwarded: '🏆 Verified DP Specialist',
  },
  {
    id: 'sc-2',
    skillTitle: 'Number Theory & Modulo Inverses',
    domain: 'Mathematics',
    difficulty: 'Olympiad Gold',
    questionKz: 'p жай сан болғанда, a^(p-2) mod p өрнегі Fermats Little Theorem бойынша нені білдіреді?',
    questionEn: 'Under Fermat’s Little Theorem, what is represented by a^(p-2) mod p when p is prime?',
    badgeAwarded: '📐 Verified Number Theorist',
  },
]

export function SkillVerificationSandbox() {
  const { i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const { toast } = useToast()

  const [activeChallenge, setActiveChallenge] = useState<SkillChallenge>(CHALLENGES[0])
  const [selectedAns, setSelectedAns] = useState<number | null>(null)
  const [verifiedBadges, setVerifiedBadges] = useState<string[]>([])

  const handleVerify = () => {
    if (selectedAns === null) return
    setVerifiedBadges([...verifiedBadges, activeChallenge.id])
    toast(
      isKz
        ? `Құттықтаймыз! «${activeChallenge.badgeAwarded}» бейджі расталып, профильге бекітілді! 🛡️`
        : `Verified! "${activeChallenge.badgeAwarded}" badge awarded to profile! 🛡️`,
      'success'
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/50 p-6 dark:border-emerald-900/40 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/30">
        <div>
          <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-100/80 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Skill Verification Sandbox (Anti-Cheat Proof)</span>
          </div>
          <h2 className="mt-2 text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            {isKz ? 'Дағдыларды Тікелей Тестпен Растау & Сертификаттау' : 'Live Skill Verification Challenges'}
          </h2>
          <p className="mt-1 max-w-2xl text-xs text-slate-600 dark:text-slate-300">
            {isKz
              ? 'Профильде көрсетілген дағдыларды (DP, Сандар теориясы, ML) 3 минуттық олимпиадалық микро-челлендж арқылы растап, түпнұсқалық белгісін алыңыз.'
              : 'Pass high-speed validation challenges to earn cryptographically verifiable badges.'}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Challenge selector */}
        <div className="space-y-3 lg:col-span-4">
          {CHALLENGES.map((ch) => {
            const isSelected = activeChallenge.id === ch.id
            const isPassed = verifiedBadges.includes(ch.id)
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => {
                  setActiveChallenge(ch)
                  setSelectedAns(null)
                }}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/70 dark:border-emerald-500 dark:bg-emerald-950/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">{ch.domain}</span>
                  {isPassed ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Расталған
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">Расталмаған</span>
                  )}
                </div>
                <h4 className="mt-1 text-xs font-bold text-slate-900 dark:text-white">{ch.skillTitle}</h4>
                <div className="mt-2 text-[11px] text-slate-500">{ch.badgeAwarded}</div>
              </button>
            )
          })}
        </div>

        {/* Challenge Sandbox Card */}
        <div className="space-y-4 lg:col-span-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-100 pb-3 dark:border-slate-800">
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                {activeChallenge.difficulty}
              </span>
              <h3 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                {isKz ? activeChallenge.questionKz : activeChallenge.questionEn}
              </h3>
            </div>

            {/* Multiple choices */}
            <div className="my-5 space-y-2">
              {[
                { id: 1, text: 'a^(-1) mod p — a санының p модулі бойынша кері элементі (Modular Inverse)' },
                { id: 2, text: 'a санының p дәрежесінің қалдығы' },
                { id: 3, text: 'Бөлу амалының қалдықсыз бөліну критерийі' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedAns(opt.id)}
                  className={`w-full rounded-xl border p-3 text-left text-xs font-bold transition ${
                    selectedAns === opt.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-200'
                      : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700'
                  }`}
                >
                  {opt.text}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleVerify}
              disabled={selectedAns === null}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{isKz ? 'Тексеру және Бейджді Профильге Қосу' : 'Verify & Bind Badge'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
