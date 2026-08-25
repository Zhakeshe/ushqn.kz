import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Users,
  Award,
  TrendingUp,
  Download,
  Calendar,
  Sparkles,
  ShieldCheck,
} from 'lucide-react'
import { useToast } from '../lib/toast'

export function ParentTeacherPortal() {
  const { i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const { toast } = useToast()

  const [activeMode, setActiveMode] = useState<'parent' | 'teacher'>('parent')

  const studentInfo = {
    name: 'Әлихан Нұрланұлы',
    school: 'РФМШ Алматы (11 "А")',
    olympiadFocus: 'Информатика & Математика',
    weeklyHours: 18.5,
    streakDays: 14,
    recentScore: '96 / 100 (Жәутіков Симуляциясы)',
    ranking: 'Top 1% in Kazakhstan',
  }

  const handleDownloadReport = () => {
    toast(
      isKz
        ? 'Ата-ана мен мұғалімге арналған ресми айлық есеп (PDF) жүктелді!'
        : 'Official Monthly Progress Report (PDF) downloaded!',
      'success'
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50/70 via-white to-blue-50/50 p-6 dark:border-sky-900/40 dark:from-slate-900 dark:via-slate-900 dark:to-sky-950/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-lg bg-sky-100/80 px-3 py-1 text-xs font-bold text-sky-800 dark:bg-sky-900/50 dark:text-sky-300">
              <Users className="h-3.5 w-3.5" />
              <span>{isKz ? 'Ата-ана & Мұғалім Бақылау Порталы' : 'Parent & Teacher Observation Portal'}</span>
            </div>
            <h2 className="mt-2 text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              {isKz ? 'Оқушының Академиялық Прогресі мен Күнделігі' : 'Student Academic Progress & Insights'}
            </h2>
            <p className="mt-1 max-w-2xl text-xs text-slate-600 dark:text-slate-300">
              {isKz
                ? 'Ата-аналар мен жетекші олимпиада ұстаздарына оқушының нәтижелерін, әлсіз тұстарын және ресми оқу рейтингін мөлдір қадағалауға мүмкіндік береді.'
                : 'Dedicated transparency portal for parents and coaches to track mock contest attendance, weak topics, and verified achievements.'}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveMode('parent')}
              className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                activeMode === 'parent'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              👨‍👩‍👧 {isKz ? 'Ата-ана көрінісі' : 'Parent View'}
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('teacher')}
              className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                activeMode === 'teacher'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              🧑‍🏫 {isKz ? 'Жетекші Ұстаз көрінісі' : 'Coach / Teacher View'}
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            labelKz: 'Оқу Белсенділігі (Апталық)',
            labelEn: 'Weekly Study Time',
            value: `${studentInfo.weeklyHours} сағат`,
            icon: Calendar,
            color: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-50 dark:bg-blue-950/40',
          },
          {
            labelKz: 'Үздіксіз Оқу Стригі',
            labelEn: 'Study Streak',
            value: `${studentInfo.streakDays} күн 🔥`,
            icon: TrendingUp,
            color: 'text-amber-600 dark:text-amber-400',
            bg: 'bg-amber-50 dark:bg-amber-950/40',
          },
          {
            labelKz: 'Соңғы Олимпиадалық Тест',
            labelEn: 'Latest Mock Contest',
            value: studentInfo.recentScore,
            icon: Award,
            color: 'text-emerald-600 dark:text-emerald-400',
            bg: 'bg-emerald-50 dark:bg-emerald-950/40',
          },
          {
            labelKz: 'Ұлттық Рейтингтегі Орыны',
            labelEn: 'National Percentile',
            value: studentInfo.ranking,
            icon: ShieldCheck,
            color: 'text-purple-600 dark:text-purple-400',
            bg: 'bg-purple-50 dark:bg-purple-950/40',
          },
        ].map((m, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
          >
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${m.bg} ${m.color}`}>
              <m.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[11px] font-medium text-slate-500">{isKz ? m.labelKz : m.labelEn}</div>
              <div className="text-sm font-black text-slate-900 dark:text-white">{m.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Deep Insights & AI Teacher Recommendation */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Strengths & Weak Areas */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {isKz ? 'Тақырыптық Талдау & Фокус Аймақтары' : 'Topic Mastery & Focus Areas'}
          </h3>

          <div className="mt-4 space-y-3">
            {[
              { topic: 'Графтар & Dijkstra Алгоритмі', progress: 95, status: 'Күшті жағы (Mastered)' },
              { topic: 'Динамикалық Бағдарламалау (DP)', progress: 88, status: 'Жақсы дамыған' },
              { topic: 'Комбинаторика & Ықтималдық', progress: 62, status: 'Қайталау қажет (Weak)' },
              { topic: '3D Кеңістіктік Геометрия', progress: 74, status: 'Орташа деңгей' },
            ].map((t, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>{t.topic}</span>
                  <span className={t.progress < 70 ? 'text-amber-600' : 'text-emerald-600'}>
                    {t.progress}% ({t.status})
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className={`h-full rounded-full ${
                      t.progress < 70 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${t.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Teacher & Coach Direct Notes */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {isKz ? 'Жетекші Ұстаз бен AI Ментор Қорытындысы' : 'Coach & AI Mentor Evaluation'}
              </h3>
            </div>

            <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs leading-relaxed text-slate-800 dark:border-blue-900/40 dark:bg-blue-950/20 dark:text-slate-200">
              <p className="font-semibold text-blue-900 dark:text-blue-300">
                {isKz
                  ? 'Ұсыныс: Жәутіков олимпиадасына 2 ай қалды. Динамикалық бағдарламалау бойынша нәтижелері өте жоғары. Аптасына 2 күнді тек Комбинаторика есептеріне арнау ұсынылады.'
                  : 'Coach Note: 2 months remaining before IZhO 2026. Algorithmic efficiency is in top percentile. Recommended to dedicate 2 evenings weekly strictly to Combinatorics.'}
              </p>
            </div>
          </div>

          <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
            <button
              type="button"
              onClick={handleDownloadReport}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-bold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900"
            >
              <Download className="h-4 w-4" />
              <span>{isKz ? 'Ресми Айлық Есепті (PDF) Жүктеу' : 'Download Monthly Report (PDF)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
