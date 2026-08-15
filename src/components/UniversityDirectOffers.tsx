import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Building2,
  CheckCircle2,
  ChevronRight,
  Calendar,
  X,
} from 'lucide-react'

interface UniversityOffer {
  id: string
  university: string
  logoText: string
  majorKz: string
  majorRu: string
  majorEn: string
  grantTypeKz: string
  grantTypeRu: string
  grantTypeEn: string
  stipend: string
  matchScore: number
  status: 'new_offer' | 'interview_scheduled' | 'accepted'
  deadline: string
  descriptionKz: string
  descriptionRu: string
  descriptionEn: string
}

const INITIAL_OFFERS: UniversityOffer[] = [
  {
    id: 'nu-1',
    university: 'Nazarbayev University (NU)',
    logoText: 'NU',
    majorKz: 'B.Sc. Robotics & Mechatronics (SEDS)',
    majorRu: 'B.Sc. Robotics & Mechatronics (SEDS)',
    majorEn: 'B.Sc. Robotics & Mechatronics (SEDS)',
    grantTypeKz: '100% Мемлекеттік / Университет гранты',
    grantTypeRu: '100% Государственный / Внутренний грант',
    grantTypeEn: '100% Full Tuition Scholarship',
    stipend: '52,500 ₸ / ай сайын',
    matchScore: 96,
    status: 'new_offer',
    deadline: '15.06.2026',
    descriptionKz:
      'Сіздің расталған 8 олимпиадалық дипломыңыз бен FIRST Robotics жобаңыз негізінде SEDS факультетінің қабылдау комиссиясы жеделдетілген (Fast-track) тікелей грант ұсынысын жолдады.',
    descriptionRu:
      'На основе 8 верифицированных олимпиадных дипломов и проекта FIRST Robotics приемная комиссия SEDS направила прямой оффер на 100% грант.',
    descriptionEn:
      'Based on 8 verified Olympiad credentials and your FIRST Robotics project, SEDS Admission board has issued a fast-track full scholarship offer.',
  },
  {
    id: 'aitu-1',
    university: 'Astana IT University (AITU)',
    logoText: 'AITU',
    majorKz: 'Software Engineering & Intelligent Systems',
    majorRu: 'Software Engineering & Intelligent Systems',
    majorEn: 'Software Engineering & Intelligent Systems',
    grantTypeKz: 'Ректорлық Толық Грант + Жатақхана',
    grantTypeRu: 'Ректорский Грант + Общежитие',
    grantTypeEn: 'Rector’s 100% Scholarship + Housing',
    stipend: '47,000 ₸ / ай сайын',
    matchScore: 92,
    status: 'new_offer',
    deadline: '20.06.2026',
    descriptionKz:
      'Astana IT University бағдарламасы бойынша IT саласындағы жетістіктеріңіз ескеріліп, емтихансыз тікелей қабылдау мүмкіндігі беріледі.',
    descriptionRu:
      'Программа прямого зачисления для победителей IT конкурсов с полным покрытием обучения и приоритетным общежитием.',
    descriptionEn:
      'Direct admission program for verified tech champions with 100% tuition coverage and guaranteed dorm placement.',
  },
  {
    id: 'kbtu-1',
    university: 'ҚБТУ (KBTU)',
    logoText: 'KBTU',
    majorKz: 'Ақпараттық технологиялар факультеті (FIT)',
    majorRu: 'Факультет Информационных Технологий (FIT)',
    majorEn: 'Faculty of Information Technology (FIT)',
    grantTypeKz: 'Корпоративтік Демеушілік Гранты (Kaspi/Freedom)',
    grantTypeRu: 'Корпоративный грант от партнеров',
    grantTypeEn: 'Corporate Partner Full Grant',
    stipend: '60,000 ₸ / ай сайын',
    matchScore: 89,
    status: 'new_offer',
    deadline: '30.06.2026',
    descriptionKz:
      'KBTU өндірістік серіктестерінің арнайы гранты: оқу ақысы 100% төленеді және 3-курстан бастап жұмыспен қамту кепілдігі беріледі.',
    descriptionRu:
      'Специальный корпоративный грант с полной оплатой обучения и гарантией трудоустройства с 3 курса.',
    descriptionEn:
      'Special corporate partner scholarship covering 100% tuition with guaranteed 3rd-year junior engineering placement.',
  },
]

export function UniversityDirectOffers() {
  const { i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const isRu = i18n.language === 'ru'

  const [offers, setOffers] = useState<UniversityOffer[]>(INITIAL_OFFERS)
  const [selectedOffer, setSelectedOffer] = useState<UniversityOffer | null>(null)
  const [interviewSuccess, setInterviewSuccess] = useState(false)

  function handleAcceptOffer(offerId: string) {
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: 'accepted' } : o))
    )
    if (selectedOffer?.id === offerId) {
      setSelectedOffer((prev) => (prev ? { ...prev, status: 'accepted' } : null))
    }
  }

  function handleBookInterview(offerId: string) {
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: 'interview_scheduled' } : o))
    )
    if (selectedOffer?.id === offerId) {
      setSelectedOffer((prev) => (prev ? { ...prev, status: 'interview_scheduled' } : null))
    }
    setInterviewSuccess(true)
    setTimeout(() => setInterviewSuccess(false), 3000)
  }

  return (
    <section className="ushqn-card border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
            <Building2 className="h-5 w-5 text-[#0052cc]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {isKz
                  ? '4. 🏛️ B2B University Direct Offer System'
                  : isRu
                  ? '4. 🏛️ B2B Панель Прямых Грантов от Вузов'
                  : '4. 🏛️ B2B University Direct Grant Offers'}
              </h3>
              <span className="rounded-full bg-blue-100 px-2 py-0.2 text-[9px] font-black text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                3 DIRECT OFFERS
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isKz
                ? 'Серіктес ЖОО өкілдері расталған портфолиоңызды қарап, тікелей грант ұсынысын жіберді'
                : isRu
                ? 'Приемные комиссии топ-вузов изучили ваше портфолио и выставили прямые офферы на грант'
                : 'Partner universities reviewed your verified portfolio and issued direct scholarship offers'}
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          ✓ {isKz ? 'Портфолио ATS сүзгісінен өтті' : isRu ? 'Портфолио прошло ATS-фильтр' : 'ATS-verified profile'}
        </span>
      </div>

      {/* Offers Cards */}
      <div className="mt-4 space-y-3">
        {offers.map((offer) => {
          const isAccepted = offer.status === 'accepted'
          const isScheduled = offer.status === 'interview_scheduled'

          return (
            <div
              key={offer.id}
              className="rounded-xl border border-slate-200/90 bg-slate-50/50 p-4 transition-all hover:border-slate-300 dark:border-slate-700/80 dark:bg-slate-800/40"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#162a45] text-xs font-black text-white dark:bg-blue-600">
                    {offer.logoText}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {offer.university}
                      </h4>
                      <span className="rounded-full bg-emerald-100 px-2 py-0.2 text-[9px] font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {offer.matchScore}% MATCH
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-[#0052cc] dark:text-blue-400">
                      {isKz ? offer.majorKz : isRu ? offer.majorRu : offer.majorEn}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                      {isKz ? offer.grantTypeKz : isRu ? offer.grantTypeRu : offer.grantTypeEn} · {offer.stipend}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isAccepted ? (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {isKz ? 'Грант қабылданды' : isRu ? 'Оффер принят' : 'Offer Accepted'}
                    </span>
                  ) : isScheduled ? (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      <Calendar className="h-3.5 w-3.5" />
                      {isKz ? 'Сұхбат белгіленді' : isRu ? 'Интервью назначено' : 'Interview Scheduled'}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSelectedOffer(offer)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#162a45] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#0f1d30]"
                    >
                      <span>{isKz ? 'Ұсынысты қарау' : isRu ? 'Посмотреть оффер' : 'View Offer'}</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Offer Details Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <button
              type="button"
              onClick={() => setSelectedOffer(null)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#162a45] text-sm font-black text-white">
                {selectedOffer.logoText}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {selectedOffer.university}
                </h3>
                <p className="text-xs text-slate-500">
                  {isKz ? selectedOffer.majorKz : isRu ? selectedOffer.majorRu : selectedOffer.majorEn}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-3.5 dark:border-blue-950 dark:bg-blue-950/30">
                <p className="font-semibold text-blue-950 dark:text-blue-200">
                  {isKz
                    ? selectedOffer.descriptionKz
                    : isRu
                    ? selectedOffer.descriptionRu
                    : selectedOffer.descriptionEn}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800">
                  <span className="text-[10px] uppercase text-slate-400">{isKz ? 'Грант түрі:' : isRu ? 'Тип гранта:' : 'Grant Type:'}</span>
                  <p className="font-bold text-slate-900 dark:text-slate-100">
                    {isKz ? selectedOffer.grantTypeKz : isRu ? selectedOffer.grantTypeRu : selectedOffer.grantTypeEn}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800">
                  <span className="text-[10px] uppercase text-slate-400">{isKz ? 'Стипендия:' : isRu ? 'Стипендия:' : 'Monthly Stipend:'}</span>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">{selectedOffer.stipend}</p>
                </div>
              </div>

              {interviewSuccess && (
                <div className="rounded-lg bg-emerald-50 p-3 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  ✓ {isKz ? 'Қабылдау комиссиясының деканымен сұхбат уақыты расталды (Сейсенбі, 15:00)' : isRu ? 'Собеседование с деканом приемной комиссии подтверждено (Вторник, 15:00)' : 'Interview confirmed with Dean of Admissions (Tuesday, 15:00)'}
                </div>
              )}
            </div>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => handleBookInterview(selectedOffer.id)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                {isKz ? 'Сұхбат уақытын белгілеу' : isRu ? 'Записаться на интервью' : 'Schedule Interview'}
              </button>
              <button
                type="button"
                onClick={() => handleAcceptOffer(selectedOffer.id)}
                className="w-full rounded-lg bg-[#0052cc] py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#0047b3]"
              >
                {isKz ? 'Грантты Қабылдау' : isRu ? 'Принять 100% Грант' : 'Accept 100% Grant'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
