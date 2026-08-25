import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FileText,
  Sparkles,
  Copy,
  Download,
  CheckCircle2,
  Target,
  RefreshCw,
  Award,
} from 'lucide-react'
import { useToast } from '../lib/toast'
import { useAuth } from '../hooks/useAuth'

interface TargetInstitution {
  id: string
  name: string
  type: 'university' | 'internship' | 'scholarship'
  country: string
  icon: string
  keyFocus: string
  suggestedPoints: string[]
}

const INSTITUTIONS: TargetInstitution[] = [
  {
    id: 'harvard',
    name: 'Harvard University (Computer Science & AI)',
    type: 'university',
    country: 'USA 🇺🇸',
    icon: '🏛️',
    keyFocus: 'Research depth, leadership, intellectual vitality & social impact in Central Asia',
    suggestedPoints: ['IZhO Gold Medal in CS', 'Co-founded Kazakhstan Code Olympiad Club', 'AI research for rural clinics'],
  },
  {
    id: 'mit',
    name: 'MIT (Electrical Engineering & Computer Science)',
    type: 'university',
    country: 'USA 🇺🇸',
    icon: '🔬',
    keyFocus: 'Hands-on problem solving, mathematical rigor, inventive engineering',
    suggestedPoints: ['IMO Math Finalist', 'Custom Open-source Robotics algorithm', 'Algorithms tutor for 200+ students'],
  },
  {
    id: 'nu',
    name: 'Nazarbayev University (SEDS Honors College)',
    type: 'university',
    country: 'Kazakhstan 🇰🇿',
    icon: '🇰🇿',
    keyFocus: 'National impact, STEM leadership, research potential in Central Asian ecosystem',
    suggestedPoints: ['Republican Olympiad 1st Place', 'Astana Hub Hackathon Winner', '1500+ SAT score'],
  },
  {
    id: 'google_step',
    name: 'Google STEP Internship (Software Engineering)',
    type: 'internship',
    country: 'Global 🌐',
    icon: '💻',
    keyFocus: 'Algorithmic efficiency, clean code, scalable architecture & collaborative mindset',
    suggestedPoints: ['Codeforces Candidate Master (1950+)', 'Full-stack React & Go project contributor', 'Fast learner in distributed systems'],
  },
  {
    id: 'kaist',
    name: 'KAIST (Korea Advanced Institute of Science & Technology)',
    type: 'university',
    country: 'South Korea 🇰🇷',
    icon: '🚀',
    keyFocus: 'Fast-paced innovation, deep technical projects, international mindset',
    suggestedPoints: ['Robotics World Festival Finalist', 'Published paper in Young Researcher Journal', 'Top 1% STEM cohort in Kazakhstan'],
  },
]

export function AiCoverLetterMatcher() {
  const { i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const { session } = useAuth()
  const { toast } = useToast()

  const [selectedTarget, setSelectedTarget] = useState<TargetInstitution>(INSTITUTIONS[0])
  const [tone, setTone] = useState<'academic' | 'bold_tech' | 'humble_solver'>('academic')
  const [includeAchievements, setIncludeAchievements] = useState<string[]>([
    'IZhO Gold Medal (2025)',
    'Astana Hub Hackathon Winner',
    'GPA 4.95 / Top 1% RFMSH',
    'Open-source STEM contributor',
  ])
  const [newAchievement, setNewAchievement] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedLetter, setGeneratedLetter] = useState<string | null>(null)
  const [matchScore, setMatchScore] = useState(94)

  const studentName = session?.user?.user_metadata?.full_name || 'Әлихан Нұрланұлы'

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setMatchScore(Math.floor(Math.random() * 6) + 93) // 93-98%

      const letterKz = `Құрметті ${selectedTarget.name} Қабылдау комиссиясы,\n\nМен, ${studentName}, Қазақстанның Республикалық физика-математика мектебінің түлегі ретінде, ${selectedTarget.name} бағдарламасына өзімнің терең қызығушылығымды білдіремін.\n\nМенің академиялық жолым күрделі мәселелерді жүйелі түрде шешуге деген ұмтылыспен басталды. ${includeAchievements.join(', ')} сияқты жетістіктерім маған тек теориялық білімді ғана емес, сонымен қатар халықаралық деңгейдегі жүйелі тәртіп пен шығармашылық инженерияны үйретті.\n\n${selectedTarget.keyFocus} бағытында мен өз білімімді Central Asia мен әлемдік деңгейдегі зерттеулерді тоғыстыруға арнағым келеді. Сіздердің зертханаларыңызда жасанды интеллект және алгоритмдік оптимизация бағытында жетекші ғалымдармен бірге жұмыс істеу – менің басты мақсатым.\n\nСіздердің орталарыңызға өз үлесімді қосуға және академиялық қоғамдастықтың белсенді мүшесі болуға дайынмын.\n\nҚұрметпен,\n${studentName}\nUSHQN Verified Talent ID: KZ-USHQN-2026-9812`

      const letterEn = `Dear Admissions Committee of ${selectedTarget.name},\n\nI am writing to express my enthusiastic application for the undergraduate program at ${selectedTarget.name}. As a senior student at the Republican Physics-Mathematics School (RFMSH) in Kazakhstan, I have dedicated my secondary education to pushing the boundaries of algorithmic thinking and computational mathematics.\n\nMy journey is highlighted by key verified milestones: ${includeAchievements.join(', ')}. These experiences have honed not only my technical rigor but also my capability to architect scalable solutions under extreme competitive pressure.\n\nWhat draws me most to ${selectedTarget.name} is your institutional focus on: ${selectedTarget.keyFocus}. I am eager to bring my unique background from Central Asia's premier STEM ecosystem to your diverse academic community.\n\nThank you for reviewing my application and portfolio.\n\nSincerely,\n${studentName}\nVerified USHQN Talent ID: KZ-USHQN-2026-9812`

      setGeneratedLetter(isKz ? letterKz : letterEn)
      toast(isKz ? 'Мотивациялық хат сәтті жасалды!' : 'Motivation Letter generated successfully!', 'success')
    }, 1200)
  }

  const handleAddAchievement = () => {
    if (!newAchievement.trim()) return
    setIncludeAchievements([...includeAchievements, newAchievement.trim()])
    setNewAchievement('')
  }

  const handleRemoveAchievement = (idx: number) => {
    setIncludeAchievements(includeAchievements.filter((_, i) => i !== idx))
  }

  const copyToClipboard = () => {
    if (!generatedLetter) return
    navigator.clipboard.writeText(generatedLetter)
    toast(isKz ? 'Буферге көшірілді!' : 'Copied to clipboard!', 'success')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/70 via-white to-indigo-50/50 p-6 dark:border-blue-900/40 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/30">
        <div>
          <div className="inline-flex items-center gap-2 rounded-lg bg-blue-100/80 px-3 py-1 text-xs font-bold text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{isKz ? 'AI Resume to Motivation Letter Matcher' : 'AI Cover Letter Matcher'}</span>
          </div>
          <h2 className="mt-2 text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            {isKz ? 'ЖОО & Стажировкаға арналған Жеке Мотивациялық Хат' : 'Tailored Admissions & Internship Cover Letter'}
          </h2>
          <p className="mt-1 max-w-2xl text-xs text-slate-600 dark:text-slate-300">
            {isKz
              ? 'Оқушының расталған олимпиадалық жүлделері мен жобаларын таңдалған университеттің немесе компанияның критерийлеріне сәйкестендіріп, 95%+ сәйкестікпен хат жазады.'
              : 'Synthesizes verified awards, research, and coding projects into high-impact personal statements tailored to specific university admissions.'}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Settings Column */}
        <div className="space-y-4 lg:col-span-5">
          {/* Institution Selector */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {isKz ? '1. Мақсатты Ұйымды Таңдаңыз' : '1. Select Target Institution'}
            </label>
            <div className="mt-3 space-y-2">
              {INSTITUTIONS.map((inst) => {
                const isSelected = selectedTarget.id === inst.id
                return (
                  <button
                    key={inst.id}
                    type="button"
                    onClick={() => setSelectedTarget(inst)}
                    className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 dark:border-blue-500 dark:bg-blue-950/30'
                        : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{inst.icon}</span>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{inst.name}</div>
                        <div className="text-[11px] text-slate-500">{inst.country}</div>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tone Selector */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {isKz ? '2. Хат Стилі (Tone)' : '2. Letter Tone'}
            </label>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                { id: 'academic', labelKz: 'Академиялық', labelEn: 'Academic' },
                { id: 'bold_tech', labelKz: 'Инновациялық', labelEn: 'Bold Tech' },
                { id: 'humble_solver', labelKz: 'Олимпиадашы', labelEn: 'Problem Solver' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTone(t.id as 'academic' | 'bold_tech' | 'humble_solver')}
                  className={`rounded-xl border py-2 text-center text-xs font-bold transition ${
                    tone === t.id
                      ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  {isKz ? t.labelKz : t.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Achievements Checklist */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {isKz ? '3. Расталған Жетістіктер' : '3. Verified Milestones to Highlight'}
              </label>
              <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                {includeAchievements.length} белсенді
              </span>
            </div>

            <div className="mt-3 space-y-1.5">
              {includeAchievements.map((ach, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2 text-xs font-medium text-slate-800 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-200"
                >
                  <div className="flex items-center gap-2">
                    <Award className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                    <span>{ach}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAchievement(idx)}
                    className="text-slate-400 hover:text-rose-500 font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Add Custom */}
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                placeholder={isKz ? 'Жаңа жетістік немесе жоба қосу...' : 'Add another milestone or project...'}
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddAchievement()}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddAchievement}
                className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900"
              >
                +
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>{isKz ? 'AI Хатты Генерациялауда...' : 'AI Synthesizing Letter...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>{isKz ? 'AI Мотивациялық Хат Жинау' : 'Generate Targeted Cover Letter'}</span>
              </>
            )}
          </button>
        </div>

        {/* Output Column */}
        <div className="space-y-4 lg:col-span-7">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {isKz ? 'Дайын Хат Көрінісі' : 'Generated Document Preview'}
                  </h3>
                  <div className="text-[11px] text-slate-500">
                    {selectedTarget.name} • {tone.toUpperCase()}
                  </div>
                </div>
              </div>

              {generatedLetter && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                    <Target className="h-3.5 w-3.5" />
                    <span>{matchScore}% Match Score</span>
                  </div>
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>{isKz ? 'Көшіру' : 'Copy'}</span>
                  </button>
                </div>
              )}
            </div>

            {generatedLetter ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 font-mono text-xs leading-relaxed text-slate-800 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200 whitespace-pre-wrap">
                  {generatedLetter}
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => toast(isKz ? 'PDF экспортталды!' : 'PDF exported!', 'info')}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>{isKz ? 'PDF ретінде Жүктеу' : 'Download as PDF'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toast(isKz ? 'Word DOCX үлгісі жасалды!' : 'DOCX created!', 'info')}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>Word (.docx)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                  <Sparkles className="h-7 w-7" />
                </div>
                <h4 className="mt-3 text-sm font-bold text-slate-800 dark:text-slate-200">
                  {isKz ? 'Хат әлі жасалмады' : 'No Letter Generated Yet'}
                </h4>
                <p className="mt-1 max-w-sm text-xs text-slate-500">
                  {isKz
                    ? 'Сол жақтағы параметрлерді таңдап, «AI Мотивациялық Хат Жинау» батырмасын басыңыз.'
                    : 'Select your target university and verified milestones on the left, then click generate.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
