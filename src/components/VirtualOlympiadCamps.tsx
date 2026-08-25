import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Video,
  Download,
} from 'lucide-react'
import { useToast } from '../lib/toast'

interface CampMasterclass {
  id: string
  titleKz: string
  titleEn: string
  speaker: string
  speakerBio: string
  badge: string
  date: string
  duration: string
  attendees: number
  hasProblemSet: boolean
}

const MASTERCLASSES: CampMasterclass[] = [
  {
    id: 'camp-1',
    titleKz: 'IOI 2025 Алтын Жүлдегерінен Графтар Оптимизациясы Шеберлік Сабағы',
    titleEn: 'Graph Theory & Centroid Decomposition by IOI Gold Medalist',
    speaker: 'Сұлтан Мұратбек',
    speakerBio: 'IOI Gold, Google Software Engineer, USHQN Mentor',
    badge: '🥇 IOI Gold',
    date: 'Бүгін, 18:00 (LIVE)',
    duration: '90 минут',
    attendees: 340,
    hasProblemSet: true,
  },
  {
    id: 'camp-2',
    titleKz: 'IMO Геометрия: Инверсия & Барицентрлік Координаттар',
    titleEn: 'IMO Geometry: Inversion and Barycentric Coordinates',
    speaker: 'Айбек Қайырлы',
    speakerBio: 'IMO Silver, MIT Mathematics Student',
    badge: '🥈 IMO Silver',
    date: '28 Тамыз, 17:00',
    duration: '120 минут',
    attendees: 210,
    hasProblemSet: true,
  },
]

export function VirtualOlympiadCamps() {
  const { i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const { toast } = useToast()

  const [joinedCamps, setJoinedCamps] = useState<string[]>([])

  const handleJoin = (id: string) => {
    if (joinedCamps.includes(id)) {
      setJoinedCamps(joinedCamps.filter((c) => c !== id))
      toast(isKz ? 'Тіркелу қайтарылды' : 'Registration cancelled', 'info')
    } else {
      setJoinedCamps([...joinedCamps, id])
      toast(isKz ? 'Кэмпке тіркелдіңіз! Zoom/Live сілтемесі сақталды 🎥' : 'Joined camp! Stream access granted 🎥', 'success')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50/70 via-white to-orange-50/50 p-6 dark:border-rose-900/40 dark:from-slate-900 dark:via-slate-900 dark:to-rose-950/30">
        <div>
          <div className="inline-flex items-center gap-2 rounded-lg bg-rose-100/80 px-3 py-1 text-xs font-bold text-rose-800 dark:bg-rose-900/50 dark:text-rose-300">
            <Video className="h-3.5 w-3.5" />
            <span>Virtual Olympiad Camps & Medalist Masterclasses</span>
          </div>
          <h2 className="mt-2 text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            {isKz ? 'Виртуалды Оқу-Жаттығу Жиындары & Шеберлік Сабақтар' : 'Virtual Olympiad Training Camps'}
          </h2>
          <p className="mt-1 max-w-2xl text-xs text-slate-600 dark:text-slate-300">
            {isKz
              ? 'Халықаралық IOI, IMO, IPhO алтын медаль иегерлерінен тікелей эфирде есептер талдауы және арнайы есептер жинағы.'
              : 'Direct masterclasses and intensive training sessions conducted by international Olympiad champions.'}
          </p>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {MASTERCLASSES.map((item) => {
          const isJoined = joinedCamps.includes(item.id)
          return (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-black text-amber-900 dark:bg-amber-950/50 dark:text-amber-300">
                    {item.badge}
                  </span>
                  <span className="text-xs text-slate-500">👥 {item.attendees} қатысушы</span>
                </div>

                <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                  {isKz ? item.titleKz : item.titleEn}
                </h3>

                <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-800/60">
                  <div className="font-bold text-slate-900 dark:text-white">{item.speaker}</div>
                  <div className="text-slate-500">{item.speakerBio}</div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>📅 {item.date}</span>
                  <span>⏱️ {item.duration}</span>
                </div>
              </div>

              <div className="mt-6 flex gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => handleJoin(item.id)}
                  className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition ${
                    isJoined
                      ? 'border border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'bg-rose-600 text-white hover:bg-rose-700 shadow-xs'
                  }`}
                >
                  {isJoined ? (isKz ? '✓ Тіркелдіңіз (Live Қосылу)' : '✓ Registered') : (isKz ? 'Кэмпке Қатысу' : 'Join Camp')}
                </button>

                <button
                  type="button"
                  onClick={() => toast(isKz ? 'Есептер жинағы (PDF) жүктелді!' : 'Problem set (PDF) downloaded!', 'info')}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
