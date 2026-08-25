import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Building2,
  CheckCircle2,
  Send,
} from 'lucide-react'
import { useToast } from '../lib/toast'

interface ScholarshipProgram {
  id: string
  company: string
  logo: string
  titleKz: string
  titleEn: string
  monthlyStipend: string
  duration: string
  targetDomains: string[]
  criteriaKz: string
  criteriaEn: string
  equipmentProvided: string
}

const SCHOLARSHIPS: ScholarshipProgram[] = [
  {
    id: 'kaspi-fellow',
    company: 'Kaspi.kz High-Talent Fellowship',
    logo: '🔴',
    titleKz: 'Kaspi Future Leaders 2026 Шәкіртақысы',
    titleEn: 'Kaspi Future Leaders Fellowship',
    monthlyStipend: '250,000 ₸ / ай сайын',
    duration: '12 айлық гранттық қолдау',
    targetDomains: ['Алгоритмдер & Олимпиадалық Информатика', 'AI / ML'],
    criteriaKz: 'Республикалық/Жәутіков жүлдегерлері (9-11 сынып оқушылары).',
    criteriaEn: 'National/International Olympiad Medalists (Grades 9-11).',
    equipmentProvided: 'Apple MacBook Pro M3 + Mentor Support',
  },
  {
    id: 'freedom-stem',
    company: 'Freedom Holding Corp Talent Fund',
    logo: '🟢',
    titleKz: 'Freedom FinTech & Quantum Math Scholarship',
    titleEn: 'Freedom Quantum Math Fellowship',
    monthlyStipend: '300,000 ₸ / ай сайын',
    duration: '10 ай (Оқу жылы бойы)',
    targetDomains: ['Жоғары Математика', 'Қаржылық Модельдеу'],
    criteriaKz: 'IMO / Жаутыков математика финалистері.',
    criteriaEn: 'IMO and IZhO Math Finalists.',
    equipmentProvided: 'Bloomberg Terminal Lab Access + Research Stipend',
  },
]

export function CorporateScholarshipScouting() {
  const { i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const { toast } = useToast()

  const [appliedPrograms, setAppliedPrograms] = useState<string[]>([])

  const handleApply = (id: string) => {
    if (appliedPrograms.includes(id)) {
      setAppliedPrograms(appliedPrograms.filter((p) => p !== id))
      toast(isKz ? 'Өтінім қайтарылды' : 'Application withdrawn', 'info')
    } else {
      setAppliedPrograms([...appliedPrograms, id])
      toast(
        isKz
          ? 'Өтініміңіз компанияның Talent Scouting кеңесіне жолданды! 🎓'
          : 'Application submitted to corporate talent committee! 🎓',
        'success'
      )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/70 via-white to-cyan-50/50 p-6 dark:border-blue-900/40 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/30">
        <div>
          <div className="inline-flex items-center gap-2 rounded-lg bg-blue-100/80 px-3 py-1 text-xs font-bold text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
            <Building2 className="h-3.5 w-3.5" />
            <span>Corporate Talent Scouting & Monthly Stipends</span>
          </div>
          <h2 className="mt-2 text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            {isKz ? 'Корпоративтік Айлық Шәкіртақылар мен Scouting' : 'Corporate High-School Scholarships'}
          </h2>
          <p className="mt-1 max-w-2xl text-xs text-slate-600 dark:text-slate-300">
            {isKz
              ? 'Қазақстанның ірі компаниялары дарынды мектеп оқушыларына мектеп кезінен бастап айлық 250,000–300,000 ₸ шәкіртақы мен MacBook береді.'
              : 'Leading enterprises scouting and sponsoring high school prodigies with monthly stipends and tech equipment.'}
          </p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {SCHOLARSHIPS.map((item) => {
          const isApplied = appliedPrograms.includes(item.id)
          return (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{item.logo}</span>
                    <span className="text-xs font-bold text-slate-500">{item.company}</span>
                  </div>
                  <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-black text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                    {item.monthlyStipend}
                  </span>
                </div>

                <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                  {isKz ? item.titleKz : item.titleEn}
                </h3>

                <div className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">🎯 Бағыттар: </span>
                    {item.targetDomains.join(', ')}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">🎁 Жабдықтар: </span>
                    {item.equipmentProvided}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">📋 Талаптар: </span>
                    {isKz ? item.criteriaKz : item.criteriaEn}
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => handleApply(item.id)}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition ${
                    isApplied
                      ? 'border border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{isKz ? 'Өтінім Жіберілді (Қаралуда)' : 'Application Under Review'}</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>{isKz ? 'Шәкіртақыға Өтінім Беріп Бақ' : 'Apply for Fellowship'}</span>
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
