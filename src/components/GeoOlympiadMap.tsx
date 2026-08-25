import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  MapPin,
  Calendar,
  Building,
  Navigation,
  CheckCircle2,
  Users,
} from 'lucide-react'
import { useToast } from '../lib/toast'

interface OlympiadLocation {
  id: string
  city: string
  venue: string
  eventNameKz: string
  eventNameEn: string
  date: string
  status: 'open' | 'starting_soon' | 'completed'
  attendees: number
  coordinates: { x: number; y: number } // Percentage position on map
  address: string
}

const REGIONAL_EVENTS: OlympiadLocation[] = [
  {
    id: 'loc-almaty',
    city: 'Алматы',
    venue: 'РФМШ & ҚазҰУ Ғылыми Орталығы',
    eventNameKz: 'Жәутіков Халықаралық Олимпиадасы (IZhO 2026)',
    eventNameEn: 'International Zhautykov Olympiad (IZhO 2026)',
    date: '10-16 Қаңтар, 2026',
    status: 'open',
    attendees: 1200,
    coordinates: { x: 74, y: 78 },
    address: 'Бұқар Жырау бульвары, 36/1',
  },
  {
    id: 'loc-astana',
    city: 'Астана',
    venue: 'Назарбаев Университеті & Astana Hub',
    eventNameKz: 'Республикалық STEM Жобалар Финалы',
    eventNameEn: 'National STEM Research Finals',
    date: '18-22 Наурыз, 2026',
    status: 'open',
    attendees: 850,
    coordinates: { x: 55, y: 35 },
    address: 'Қабанбай батыр даңғылы, 53',
  },
  {
    id: 'loc-shymkent',
    city: 'Шымкент',
    venue: 'БИЛ Оңтүстік Олимпиадалық Кешені',
    eventNameKz: 'Оңтүстік Қазақстан Математикалық Жиыны',
    eventNameEn: 'South Kazakhstan Math Training Camp',
    date: '5-12 Қараша, 2026',
    status: 'starting_soon',
    attendees: 420,
    coordinates: { x: 50, y: 84 },
    address: 'Бәйдібек би даңғылы, 128',
  },
  {
    id: 'loc-karaganda',
    city: 'Қарағанды',
    venue: 'Е.А. Бөкетов атындағы ҚарУ IT Хаб',
    eventNameKz: 'Орталық Қазақстан Робототехника Кубогы',
    eventNameEn: 'Central Kazakhstan Robotics Cup',
    date: '1-3 Желтоқсан, 2026',
    status: 'open',
    attendees: 310,
    coordinates: { x: 58, y: 48 },
    address: 'Университетская көшесі, 28',
  },
  {
    id: 'loc-aktobe',
    city: 'Ақтөбе',
    venue: 'Ақтөбе Дарын Орталығы',
    eventNameKz: 'Батыс Қазақстан Информатика Чемпионаты',
    eventNameEn: 'West Kazakhstan CS Championship',
    date: '14-16 Желтоқсан, 2026',
    status: 'open',
    attendees: 290,
    coordinates: { x: 25, y: 40 },
    address: 'Әбілқайыр хан даңғылы, 51',
  },
]

export function GeoOlympiadMap() {
  const { i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const { toast } = useToast()

  const [selectedEvent, setSelectedEvent] = useState<OlympiadLocation>(REGIONAL_EVENTS[0])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/70 via-white to-indigo-50/50 p-6 dark:border-blue-900/40 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/30">
        <div>
          <div className="inline-flex items-center gap-2 rounded-lg bg-blue-100/80 px-3 py-1 text-xs font-bold text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
            <MapPin className="h-3.5 w-3.5" />
            <span>Interactive Kazakhstan Olympiad Map</span>
          </div>
          <h2 className="mt-2 text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            {isKz ? 'Қазақстанның Интерактивті Олимпиадалық Гео-Картасы' : 'Interactive Kazakhstan Olympiad Map'}
          </h2>
          <p className="mt-1 max-w-2xl text-xs text-slate-600 dark:text-slate-300">
            {isKz
              ? 'Алматы, Астана, Шымкент, Қарағанды, Ақтөбе қалаларында өтетін оффлайн олимпиадалар, дайындық лагерлері мен өтетін орындарының картасы.'
              : 'Interactive regional map pinpointing offline olympiad venues, regional hubs, and camp locations across Kazakhstan.'}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Interactive Map Visual Stage */}
        <div className="space-y-3 lg:col-span-8">
          <div className="relative min-h-[380px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white shadow-2xs dark:border-slate-800">
            {/* Map Background Grid & Stylized Canvas */}
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

            {/* Stylized Kazakhstan outline aesthetic container */}
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold tracking-widest text-slate-300">KAZAKHSTAN OLYMPIAD MAP</span>
                <span>Active Regional Hubs: 5</span>
              </div>

              {/* Map Hotspots */}
              <div className="relative my-8 h-64 w-full">
                {REGIONAL_EVENTS.map((loc) => {
                  const isSelected = selectedEvent.id === loc.id
                  return (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => setSelectedEvent(loc)}
                      style={{ left: `${loc.coordinates.x}%`, top: `${loc.coordinates.y}%` }}
                      className={`group absolute -translate-x-1/2 -translate-y-1/2 rounded-full p-1.5 transition-transform hover:scale-125 ${
                        isSelected ? 'z-20 scale-125' : 'z-10'
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black shadow-lg ${
                          isSelected
                            ? 'bg-blue-500 text-white ring-4 ring-blue-500/40 animate-pulse'
                            : 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-blue-600 hover:text-white'
                        }`}
                      >
                        📍
                      </div>
                      <div className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900/90 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
                        {loc.city}
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="text-[11px] text-slate-400">
                Қаланың үстін басып, толық мекен-жайы мен жарыс мәліметтерін көріңіз.
              </div>
            </div>
          </div>
        </div>

        {/* Selected Hub Details Card */}
        <div className="space-y-4 lg:col-span-4">
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 min-h-[380px]">
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-lg bg-blue-100 px-2.5 py-1 text-xs font-black text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                  📍 {selectedEvent.city}
                </span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                  Тіркелу Ашық
                </span>
              </div>

              <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
                {isKz ? selectedEvent.eventNameKz : selectedEvent.eventNameEn}
              </h3>

              <div className="mt-4 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-2">
                  <Building className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">Өтетін ғимарат:</div>
                    <div>{selectedEvent.venue}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Navigation className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">Мекен-жайы:</div>
                    <div>{selectedEvent.address}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">Күні: </span>
                    {selectedEvent.date}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">Қатысушылар: </span>
                    {selectedEvent.attendees} оқушы
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
              <button
                type="button"
                onClick={() => toast(isKz ? 'Олимпиадаға ресми тіркелдіңіз!' : 'Registered for competition venue!', 'success')}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white hover:bg-blue-700 shadow-xs"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{isKz ? 'Олимпиадаға Тіркелу' : 'Register for Venue'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
