import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Sparkles,
  CheckCircle2,
  Send,
  Trophy,
} from 'lucide-react'
import { useToast } from '../lib/toast'

interface HackathonCandidate {
  id: string
  name: string
  school: string
  city: string
  primaryRole: 'frontend' | 'backend' | 'ml_ai' | 'design' | 'pitch'
  skills: string[]
  pastWins: string
  matchSynergy: number
  avatar: string
}

const CANDIDATES: HackathonCandidate[] = [
  {
    id: 'cand-1',
    name: 'Аружан Сейітқали',
    school: 'НИШ ФМН Алматы',
    city: 'Алматы',
    primaryRole: 'design',
    skills: ['Figma Pro', 'UI/UX System', '3D Spline', 'Design Thinking'],
    pastWins: 'Decentrathon 2.0 Best Design Award',
    matchSynergy: 98,
    avatar: '🎨',
  },
  {
    id: 'cand-2',
    name: 'Батырхан Төлеубай',
    school: 'РФМШ Астана',
    city: 'Астана',
    primaryRole: 'backend',
    skills: ['Go', 'PostgreSQL', 'Docker', 'FastAPI', 'gRPC'],
    pastWins: 'Astana Hub Hackathon 1st Place (Backend)',
    matchSynergy: 95,
    avatar: '⚡',
  },
  {
    id: 'cand-3',
    name: 'Дильназ Мұратқызы',
    school: 'БИЛ Қарағанды',
    city: 'Қарағанды',
    primaryRole: 'ml_ai',
    skills: ['PyTorch', 'Gemini API', 'LangChain', 'Computer Vision'],
    pastWins: 'AI for Agriculture Hackathon Winner',
    matchSynergy: 92,
    avatar: '🤖',
  },
  {
    id: 'cand-4',
    name: 'Ернар Жолдас',
    school: 'Дарын Орал',
    city: 'Орал',
    primaryRole: 'pitch',
    skills: ['Public Speaking', 'Pitch Deck', 'Financial Model', 'English C1'],
    pastWins: 'Kazakhstan TechCup Best Pitch Award',
    matchSynergy: 89,
    avatar: '🎤',
  },
]

export function HackathonTeammateMatchmaker() {
  const { i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const { toast } = useToast()

  const [selectedHackathon, setSelectedHackathon] = useState('decentrathon')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [invitedMembers, setInvitedMembers] = useState<string[]>([])

  const HACKATHONS = [
    {
      id: 'decentrathon',
      name: 'Decentrathon 3.0 (Web3 & AI Track)',
      date: '15-17 Қазан, 2026',
      prize: '15,000,000 ₸',
    },
    {
      id: 'astana_ai',
      name: 'Astana Hub AI GovTech Hackathon',
      date: '2-4 Қараша, 2026',
      prize: '10,000,000 ₸',
    },
    {
      id: 'nis_hack',
      name: 'NIS National Youth EdTech Hackathon',
      date: '20-22 Қараша, 2026',
      prize: '5,000,000 ₸',
    },
  ]

  const handleInvite = (cand: HackathonCandidate) => {
    if (invitedMembers.includes(cand.id)) {
      setInvitedMembers(invitedMembers.filter((id) => id !== cand.id))
      toast(isKz ? 'Шақыру қайтарып алынды' : 'Invite cancelled', 'info')
    } else {
      setInvitedMembers([...invitedMembers, cand.id])
      toast(
        isKz
          ? `${cand.name} командаға шақырылды! Жеке хабарлама жіберілді.`
          : `Invited ${cand.name}! Direct message sent.`,
        'success'
      )
    }
  }

  const filteredCandidates = CANDIDATES.filter((c) => {
    if (roleFilter !== 'all' && c.primaryRole !== roleFilter) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/50 p-6 dark:border-indigo-900/40 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30">
        <div>
          <div className="inline-flex items-center gap-2 rounded-lg bg-indigo-100/80 px-3 py-1 text-xs font-bold text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Smart Match Algorithm</span>
          </div>
          <h2 className="mt-2 text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            {isKz ? 'Хакатонға Идеал Команда Жинау (Matchmaker)' : 'Hackathon Teammate Matchmaker'}
          </h2>
          <p className="mt-1 max-w-2xl text-xs text-slate-600 dark:text-slate-300">
            {isKz
              ? 'Сіздің дағдыларыңызға сәйкес (Backend, UI/UX, AI/ML немесе Pitch) жетіспейтін рөлдерді тауып, 95%+ синергиялық команда құрады.'
              : 'Matches students by complementary roles (Frontend, Backend, ML, Pitcher) with synergistic skill scoring.'}
          </p>
        </div>

        {/* Hackathon selection */}
        <div className="grid gap-2 sm:grid-cols-3">
          {HACKATHONS.map((h) => {
            const isSelected = selectedHackathon === h.id
            return (
              <button
                key={h.id}
                type="button"
                onClick={() => setSelectedHackathon(h.id)}
                className={`rounded-xl border p-3 text-left transition ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 dark:border-indigo-500 dark:bg-indigo-950/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                <div className="text-xs font-bold text-slate-900 dark:text-white">{h.name}</div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{h.date}</span>
                  <span className="font-bold text-emerald-600">{h.prize}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Role Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 rounded-xl border border-slate-200 bg-white p-1.5 dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
        {[
          { id: 'all', labelKz: 'Барлық Таланттар', labelEn: 'All Talents' },
          { id: 'design', labelKz: '🎨 UI/UX Дизайнерлер', labelEn: '🎨 UI/UX Designers' },
          { id: 'backend', labelKz: '⚡ Backend & Архитекторлар', labelEn: '⚡ Backend & Cloud' },
          { id: 'ml_ai', labelKz: '🤖 AI & Data Science', labelEn: '🤖 AI & ML Engineers' },
          { id: 'pitch', labelKz: '🎤 Pitch & Business', labelEn: '🎤 Pitch & BizDev' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setRoleFilter(tab.id)}
            className={`flex-1 min-w-[120px] rounded-lg py-2 text-xs font-bold transition ${
              roleFilter === tab.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            {isKz ? tab.labelKz : tab.labelEn}
          </button>
        ))}
      </div>

      {/* Candidate Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filteredCandidates.map((cand) => {
          const isInvited = invitedMembers.includes(cand.id)
          return (
            <div
              key={cand.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-2xl dark:bg-indigo-950/50">
                      {cand.avatar}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{cand.name}</h4>
                      <p className="text-xs text-slate-500">
                        {cand.school} • {cand.city}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <div className="rounded-lg bg-emerald-50 px-2 py-0.5 text-xs font-black text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                      {cand.matchSynergy}% Synergy
                    </div>
                  </div>
                </div>

                {/* Past Wins */}
                <div className="mt-3 flex items-center gap-1.5 rounded-lg border border-amber-100 bg-amber-50/60 px-3 py-1.5 text-xs font-medium text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300">
                  <Trophy className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                  <span className="truncate">{cand.pastWins}</span>
                </div>

                {/* Skills tags */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {cand.skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 border-t border-slate-100 pt-3 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => handleInvite(cand)}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition ${
                    isInvited
                      ? 'border border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'bg-indigo-600 text-white shadow-xs hover:bg-indigo-700'
                  }`}
                >
                  {isInvited ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{isKz ? 'Шақыру Жіберілді' : 'Invite Sent'}</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>{isKz ? 'Командаға Шақыру' : 'Invite to Squad'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
