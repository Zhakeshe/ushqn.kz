import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Heart,
  Plane,
  ShieldCheck,
} from 'lucide-react'
import { useToast } from '../lib/toast'

interface Campaign {
  id: string
  studentName: string
  region: string
  destination: string
  olympiadName: string
  goalAmount: number
  raisedAmount: number
  donorsCount: number
  storyKz: string
  storyRu: string
  verifiedLetterBy: string
}

const SAMPLE_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-1',
    studentName: 'Бағдат Ержанұлы (10-сынып)',
    region: 'Ақтөбе облысы, Шалқар ауданы',
    destination: 'Жапония, Токио',
    olympiadName: 'Халықаралық Физика Олимпиадасы (IPhO 2026)',
    goalAmount: 1400000,
    raisedAmount: 1050000,
    donorsCount: 64,
    storyKz: 'Ауыл мектебінен шығып, Республикалық олимпиадада 1-орын алды. Жапонияға ұшу билеті мен тұру шығындарына демеушілік қажет.',
    storyRu: 'Победитель Республиканской олимпиады по физике из сельского района. Необходимы средства на авиаперелет и проживание в Токио.',
    verifiedLetterBy: 'Ақтөбе облыстық Білім басқармасы және Мектеп директоры',
  },
  {
    id: 'camp-2',
    studentName: 'Меруерт Сағатқызы (11-сынып)',
    region: 'Шығыс Қазақстан, Зайсан ауданы',
    destination: 'АҚШ, Лос-Анджелес',
    olympiadName: 'Regeneron ISEF 2026 (Халықаралық Ғылыми Жәрмеңке)',
    goalAmount: 1800000,
    raisedAmount: 1420000,
    donorsCount: 92,
    storyKz: '«Экологиялық су сүзгісі» биотехнологиялық өнертабысы NASA және Regeneron ISEF финалына жолдама алды.',
    storyRu: 'Изобретение по очистке воды вышло в мировой финал Regeneron ISEF в США. Требуется покрытие логистических расходов.',
    verifiedLetterBy: 'ҚР Ғылым және Жоғары білім министрлігі',
  },
]

export function OlympiadCrowdfundingHub() {
  const { i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const { toast } = useToast()

  const [campaigns, setCampaigns] = useState<Campaign[]>(SAMPLE_CAMPAIGNS)
  const [selectedCamp, setSelectedCamp] = useState<Campaign | null>(null)
  const [donateAmount, setDonateAmount] = useState('5000')

  const handleDonate = () => {
    if (!selectedCamp) return
    const addVal = parseInt(donateAmount) || 5000

    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === selectedCamp.id
          ? {
              ...c,
              raisedAmount: c.raisedAmount + addVal,
              donorsCount: c.donorsCount + 1,
            }
          : c,
      ),
    )

    toast(
      isKz
        ? `💖 Рахмет! «${selectedCamp.studentName}» қорына ₸${addVal.toLocaleString()} көмек көрсетілді және демеуші сертификаты берілді!`
        : `💖 Спасибо! Пожертвование ₸${addVal.toLocaleString()} успешно отправлено!`,
    )
    setSelectedCamp(null)
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 p-6 text-white shadow-xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 backdrop-blur-md">
              <Heart className="h-3.5 w-3.5 text-rose-400 fill-rose-400" />
              <span>USHQN Talent Sponsorship Fund</span>
              <span className="rounded bg-emerald-500/30 px-1.5 py-0.5 text-[10px] font-black text-emerald-200">
                100% VERIFIED
              </span>
            </div>
            <h2 className="text-xl font-black tracking-tight sm:text-2xl">
              {isKz ? 'Ауыл Дарындарына Әлемдік Олимпиадаға Жол' : 'Краудфандинг на Поездки на Олимпиады'}
            </h2>
            <p className="max-w-xl text-xs text-emerald-100/80 sm:text-sm">
              {isKz
                ? 'Қазақстанның шалғай ауылдарынан шыққан дарынды балалардың АҚШ пен Жапониядағы халықаралық олимпиадаларға баруына қолдау білдіріңіз.'
                : 'Помогите талантливым школьникам из регионов Казахстана поехать на международные олимпиады в Токио и США.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md">
              <div className="text-base font-black text-emerald-300">₸2,470,000</div>
              <span className="text-[9px] uppercase tracking-wider text-slate-300">
                {isKz ? 'Жинақталған Сома' : 'Собрано в фонде'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {campaigns.map((camp) => {
          const percent = Math.min(100, Math.round((camp.raisedAmount / camp.goalAmount) * 100))
          return (
            <div
              key={camp.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      {camp.studentName}
                    </h3>
                    <div className="text-xs text-slate-500 dark:text-slate-400">📍 {camp.region}</div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    <Plane className="h-3 w-3" />
                    <span>{camp.destination}</span>
                  </span>
                </div>

                <div className="rounded-xl bg-blue-50/60 p-3 text-xs font-bold text-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
                  🏆 {camp.olympiadName}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isKz ? camp.storyKz : camp.storyRu}
                </p>

                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{camp.verifiedLetterBy}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                <div className="flex items-baseline justify-between text-xs font-bold">
                  <span className="text-slate-900 dark:text-white">
                    ₸{camp.raisedAmount.toLocaleString()}{' '}
                    <span className="text-slate-400 font-normal">/ ₸{camp.goalAmount.toLocaleString()}</span>
                  </span>
                  <span className="text-emerald-600">{percent}%</span>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-500 font-medium">
                    👥 {camp.donorsCount} {isKz ? 'демеуші қолдады' : 'спонсоров'}
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedCamp(camp)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-95"
                  >
                    <Heart className="h-3.5 w-3.5 fill-white" />
                    <span>{isKz ? 'Қолдау көрсету' : 'Поддержать'}</span>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Donation Modal */}
      {selectedCamp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {isKz ? 'Оқушыға Демеушілік Көмек' : 'Спонсорская Поддержка'}
            </h3>
            <p className="text-xs text-slate-500">
              {isKz ? `«${selectedCamp.studentName}» қорына соманы таңдаңыз:` : `Выберите сумму помощи:`}
            </p>

            <div className="grid grid-cols-3 gap-2">
              {['2000', '5000', '15000'].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setDonateAmount(amt)}
                  className={`rounded-xl border p-2.5 text-xs font-bold transition ${
                    donateAmount === amt
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200'
                      : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300'
                  }`}
                >
                  ₸{parseInt(amt).toLocaleString()}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedCamp(null)}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
              >
                {isKz ? 'Бас тарту' : 'Отмена'}
              </button>
              <button
                type="button"
                onClick={handleDonate}
                className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-95"
              >
                {isKz ? 'Аудару (Kaspi / Card)' : 'Оплатить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
