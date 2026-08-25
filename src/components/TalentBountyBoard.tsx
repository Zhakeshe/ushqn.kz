import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  DollarSign,
  CheckCircle2,
  Send,
} from 'lucide-react'
import { useToast } from '../lib/toast'

interface BountyTask {
  id: string
  company: string
  logo: string
  titleKz: string
  titleEn: string
  domain: string
  rewardKz: string
  deadline: string
  perks: string[]
  descriptionKz: string
  descriptionEn: string
}

const BOUNTIES: BountyTask[] = [
  {
    id: 'bounty-1',
    company: 'Kaspi.kz Lab',
    logo: '🔴',
    titleKz: 'Kaspi Travel: Маршруттарды Микросекундта Оптимизациялау',
    titleEn: 'Kaspi Travel: Sub-millisecond Multi-modal Route Optimization',
    domain: 'Graph Theory & Go',
    rewardKz: '1,500,000 ₸ + Fast-track Interview',
    deadline: '10 Қазан, 2026',
    perks: ['Тікелей гранттық сыйлық', 'Kaspi Pay API Sandbox Access', 'CTO-мен 1-on-1 кездесу'],
    descriptionKz: 'Қазақстанның 20+ қаласы арасындағы пойыз, ұшақ және автобус рейстерін ескере отырып, 100k+ параллель сұранысты <50ms ішінде ең тиімді бағамен құрастыратын алгоритм жасау.',
    descriptionEn: 'Develop a high-throughput routing engine in Go/C++ optimizing multi-modal transport routes in Kazakhstan under 50ms.',
  },
  {
    id: 'bounty-2',
    company: 'Freedom Holding Corp',
    logo: '🟢',
    titleKz: 'Freedom AI: High-Frequency Trading Risk Anomaly Detector',
    titleEn: 'Freedom AI: HFT Risk Anomaly & Fraud Detection Engine',
    domain: 'Machine Learning & Python',
    rewardKz: '2,000,000 ₸ + MacBook Pro M3 Max',
    deadline: '25 Қазан, 2026',
    perks: ['Apple MacBook Pro сыйлық', 'Freedom Telecom зертханасында тағылымдама', 'Patent Co-authoring'],
    descriptionKz: 'Қор биржасындағы миллисекундтық сауда транзакцияларынан манипуляция мен аномалияларды 99.4% дәлдікпен анықтайтын Transformer немесе GNN моделін құрастыру.',
    descriptionEn: 'Train a Transformer or Graph Neural Network detecting market micro-structure anomalies with 99.4%+ precision.',
  },
  {
    id: 'bounty-3',
    company: 'BTS Digital (Aitu & eGov Tech)',
    logo: '🔵',
    titleKz: 'Aitu Messenger: End-to-End Post-Quantum Encryption',
    titleEn: 'Aitu Messenger: Post-Quantum Cryptographic Protocol',
    domain: 'Applied Cryptography',
    rewardKz: '1,200,000 ₸ + Junior Researcher Contract',
    deadline: '15 Қараша, 2026',
    perks: ['BTS Digital зерттеуші келісім-шарты', 'Open-source authorship', 'Aitu Cloud credits'],
    descriptionKz: 'NIST стандартындағы Kyber / Dilithium криптографиялық кілттер алмасуын мобильді қосымшаларда энергияны үнемдей отырып интеграциялау.',
    descriptionEn: 'Implement NIST post-quantum Kyber key exchange protocol optimized for low-latency mobile messaging.',
  },
]

export function TalentBountyBoard() {
  const { i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const { toast } = useToast()

  const [selectedBounty, setSelectedBounty] = useState<BountyTask>(BOUNTIES[0])
  const [submissionUrl, setSubmissionUrl] = useState('')
  const [submittedBounties, setSubmittedBounties] = useState<string[]>([])

  const handleSubmitSolution = () => {
    if (!submissionUrl.trim()) return
    setSubmittedBounties([...submittedBounties, selectedBounty.id])
    setSubmissionUrl('')
    toast(
      isKz
        ? 'Шешіміңіз компанияның инженерлік комиссиясына жіберілді! 🚀'
        : 'Solution submitted to engineering review committee! 🚀',
      'success'
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/50 p-6 dark:border-emerald-900/40 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/30">
        <div>
          <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-100/80 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
            <DollarSign className="h-3.5 w-3.5" />
            <span>Talent Bounty & Engineering Challenges</span>
          </div>
          <h2 className="mt-2 text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            {isKz ? 'Корпоративтік Инженерлік Кейстер мен Сыйлықтар' : 'Corporate Engineering Bounties & Cash Grants'}
          </h2>
          <p className="mt-1 max-w-2xl text-xs text-slate-600 dark:text-slate-300">
            {isKz
              ? 'Kaspi, Freedom, BTS Digital сияқты алпауыт IT компаниялардың нақты өндірістік тапсырмаларын шешіп, 2,000,000 ₸-ге дейін сыйлық және жедел стажировка ұтып алыңыз.'
              : 'Solve production-grade algorithmic problems for top tech enterprises to claim cash bounties and fast-track hiring.'}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Bounty List */}
        <div className="space-y-3 lg:col-span-5">
          {BOUNTIES.map((b) => {
            const isSelected = selectedBounty.id === b.id
            const isDone = submittedBounties.includes(b.id)
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => setSelectedBounty(b)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/70 dark:border-emerald-500 dark:bg-emerald-950/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{b.logo}</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{b.company}</span>
                  </div>
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-black text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                    {b.rewardKz}
                  </span>
                </div>

                <h4 className="mt-2 text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                  {isKz ? b.titleKz : b.titleEn}
                </h4>

                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                  <span>🛠️ {b.domain}</span>
                  {isDone ? (
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">✓ Жіберілді</span>
                  ) : (
                    <span>⏳ {b.deadline}</span>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Selected Bounty Details */}
        <div className="space-y-4 lg:col-span-7">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{selectedBounty.logo}</span>
                  <span className="text-xs font-bold text-slate-500">{selectedBounty.company}</span>
                </div>
                <h3 className="mt-1 text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                  {isKz ? selectedBounty.titleKz : selectedBounty.titleEn}
                </h3>
              </div>

              <div className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-black text-white shadow-sm">
                {selectedBounty.rewardKz}
              </div>
            </div>

            <div className="mt-4 space-y-4 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              <p>{isKz ? selectedBounty.descriptionKz : selectedBounty.descriptionEn}</p>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">
                  {isKz ? '🎁 Ұсынылатын бонустар мен артықшылықтар:' : '🎁 Perks & Direct Offers:'}
                </h4>
                <ul className="mt-2 space-y-1.5">
                  {selectedBounty.perks.map((p, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Submission Area */}
              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                <h4 className="font-bold text-slate-900 dark:text-white">
                  {isKz ? 'Шешімді Жіберу (GitHub Repo / PDF Paper):' : 'Submit Solution (GitHub / PDF):'}
                </h4>
                <div className="mt-2 flex gap-2">
                  <input
                    type="url"
                    placeholder="https://github.com/username/kaspi-bounty-solution"
                    value={submissionUrl}
                    onChange={(e) => setSubmissionUrl(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleSubmitSolution}
                    disabled={!submissionUrl.trim()}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{isKz ? 'Жіберу' : 'Submit'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
