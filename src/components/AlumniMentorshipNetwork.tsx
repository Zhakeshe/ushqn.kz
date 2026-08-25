import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  GraduationCap,
  CheckCircle2,
  Star,
  Search,
  X,
  Clock,
  Video,
} from 'lucide-react'
import { useToast } from '../lib/toast'

interface Mentor {
  id: string
  name: string
  almaMater: string
  degree: string
  currentRole: string
  rating: number
  reviewsCount: number
  specialties: string[]
  bioKz: string
  bioRu: string
  avatarUrl: string
  availableDays: string[]
}

const SAMPLE_MENTORS: Mentor[] = [
  {
    id: 'm-harvard',
    name: 'Аружан Қалиева',
    almaMater: 'Harvard University',
    degree: 'B.A. in Computer Science & Econ (Class of 2025)',
    currentRole: 'Incoming SWE @ Google NYC',
    rating: 4.98,
    reviewsCount: 38,
    specialties: ['Ivy League Admissions', 'Common App Essay Review', 'LeetCode Mentoring'],
    bioKz: 'РФМШ түлегі. Гарвардқа 100% толық грантқа (Financial Aid) түсу және эссе жазу бойынша 40-тан астам оқушыға көмектестім.',
    bioRu: 'Выпускница РФМШ. Помогла более 40 школьникам поступить на 100% гранты в Лигу Плюща и подготовиться к интервью.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    availableDays: ['Сейсенбі 18:00', 'Сенбі 15:00'],
  },
  {
    id: 'm-mit',
    name: 'Бауыржан Серік',
    almaMater: 'MIT (Massachusetts Institute of Tech)',
    degree: 'M.Eng in Artificial Intelligence',
    currentRole: 'AI Researcher @ DeepMind',
    rating: 5.0,
    reviewsCount: 52,
    specialties: ['IOI / ICPC Training', 'Research Pitch', 'Math Olympiad Prep'],
    bioKz: 'IOI Халықаралық Олимпиадасының күміс жүлдегері. Алгоритмдік бағдарламалау мен ғылыми жобаларды халықаралық деңгейге шығару.',
    bioRu: 'Серебряный призер IOI. Подготовка к алгоритмическим олимпиадам и публикациям научных статей.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    availableDays: ['Сәрсенбі 19:00', 'Жексенбі 14:00'],
  },
  {
    id: 'm-kaist',
    name: 'Динара Нұрланқызы',
    almaMater: 'KAIST (South Korea)',
    degree: 'B.S. in Electrical Engineering & Robotics',
    currentRole: 'Robotics Engineer @ Hyundai Robotics',
    rating: 4.95,
    reviewsCount: 29,
    specialties: ['Robotics Portfolio', 'KAIST / Asia Scholarships', 'Hardware Projects'],
    bioKz: 'Оңтүстік Кореяның KAIST университетінің толық стипендиаты. Азия ЖОО-ларына грантқа құжат тапсыру.',
    bioRu: 'Стипендиат KAIST. Консультации по поступлению в топовые азиатские STEM университеты.',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    availableDays: ['Бейсенбі 17:00', 'Жұма 18:30'],
  },
]

export function AlumniMentorshipNetwork() {
  const { i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const { toast } = useToast()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('')

  const filteredMentors = SAMPLE_MENTORS.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.almaMater.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleBookSession = () => {
    if (!selectedMentor) return
    toast(
      isKz
        ? `🎉 «${selectedMentor.name}» менторымен 1-on-1 сессияға жазылдыңыз! Google Meet сілтемесі профиліңізге жіберілді.`
        : `🎉 Сессия с ментором «${selectedMentor.name}» успешно забронирована! Ссылка на Google Meet отправлена.`,
    )
    setSelectedMentor(null)
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-6 text-white shadow-xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-300 backdrop-blur-md">
              <GraduationCap className="h-3.5 w-3.5 text-blue-400" />
              <span>USHQN Alumni Mentorship Network</span>
              <span className="rounded bg-emerald-500/30 px-1.5 py-0.5 text-[10px] font-black text-emerald-300">
                VERIFIED ALUMNI
              </span>
            </div>
            <h2 className="text-xl font-black tracking-tight sm:text-2xl">
              {isKz ? 'Harvard, MIT & KAIST Түлектерінен Жеке Менторлық' : 'Менторство от Выпускников Harvard, MIT и KAIST'}
            </h2>
            <p className="max-w-xl text-xs text-blue-100/80 sm:text-sm">
              {isKz
                ? 'Әлемнің үздік университеттерінде білім алып жатқан отандастарымыздан 1-on-1 жеке кеңес алыңыз, эссеңізді тексертіңіз және грант ұту құпияларын үйреніңіз.'
                : 'Индивидуальные консультации, аудит портфолио и эссе от студентов и выпускников топовых ВУЗов мира.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md">
              <div className="flex items-center justify-center gap-1 text-amber-400">
                <Star className="h-4 w-4 fill-amber-400" />
                <span className="text-lg font-black">4.98</span>
              </div>
              <span className="text-[9px] uppercase tracking-wider text-slate-300">
                {isKz ? 'Орташа Рейтинг' : 'Средний рейтинг'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <Search className="h-4 w-4 text-slate-400 ml-2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            isKz
              ? 'Университет, ментор аты немесе бағыт бойынша іздеу (Harvard, LeetCode, SAT)...'
              : 'Поиск по ВУЗу, имени ментора или направлению (MIT, Essay, IOI)...'
          }
          className="flex-1 bg-transparent px-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none dark:text-white"
        />
      </div>

      {/* Mentors Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredMentors.map((m) => (
          <div
            key={m.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <img
                  src={m.avatarUrl}
                  alt={m.name}
                  className="h-12 w-12 rounded-2xl object-cover ring-2 ring-blue-500/20"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">{m.name}</h3>
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 fill-blue-100" />
                  </div>
                  <div className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    {m.almaMater}
                  </div>
                  <div className="text-[10px] text-slate-400">{m.currentRole}</div>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                {isKz ? m.bioKz : m.bioRu}
              </p>

              {/* Specialties */}
              <div className="flex flex-wrap gap-1.5">
                {m.specialties.map((s, idx) => (
                  <span
                    key={idx}
                    className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                <Star className="h-3.5 w-3.5 fill-amber-400" />
                <span>{m.rating}</span>
                <span className="text-[10px] text-slate-400">({m.reviewsCount})</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedMentor(m)
                  setSelectedTimeSlot(m.availableDays[0])
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 active:scale-95"
              >
                <Video className="h-3.5 w-3.5" />
                <span>{isKz ? 'Сессияға жазылу' : 'Записаться'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900 flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {isKz ? '1-on-1 Менторлық Сессия' : '1-on-1 Менторская Сессия'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMentor(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                <img
                  src={selectedMentor.avatarUrl}
                  alt={selectedMentor.name}
                  className="h-10 w-10 rounded-xl object-cover"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {selectedMentor.name}
                  </div>
                  <div className="text-[11px] text-blue-600">{selectedMentor.almaMater}</div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-white">
                  {isKz ? 'Ыңғайлы уақыт аралығын таңдаңыз:' : 'Выберите удобный слот:'}
                </label>
                <div className="space-y-2">
                  {selectedMentor.availableDays.map((slot, sIdx) => (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`flex w-full items-center justify-between rounded-xl border p-3 text-xs font-bold transition ${
                        selectedTimeSlot === slot
                          ? 'border-blue-600 bg-blue-50/60 text-blue-900 dark:bg-blue-950 dark:text-blue-200'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-blue-600" />
                        <span>{slot}</span>
                      </div>
                      <span className="text-[10px] text-emerald-600 uppercase">Бос орын бар</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleBookSession}
                className="w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-xs hover:bg-blue-700 active:scale-95"
              >
                {isKz ? 'Сессияны Растау (Google Meet)' : 'Подтвердить бронирование'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
