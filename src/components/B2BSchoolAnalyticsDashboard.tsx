import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FileSpreadsheet,
  Building,
} from 'lucide-react'
import { useToast } from '../lib/toast'

export function B2BSchoolAnalyticsDashboard() {
  const { i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const { toast } = useToast()

  const [selectedCohort, setSelectedCohort] = useState<'all' | '11_grade' | '10_grade' | '9_grade'>('all')

  const handleExportCsv = () => {
    toast(
      isKz
        ? '📊 Мектептің ресми аккредитациялық есебі (Excel / CSV) жүктелді!'
        : '📊 Официальный отчет для аккредитации (Excel / CSV) успешно экспортирован!',
    )
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-6 text-white shadow-xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-300 backdrop-blur-md">
              <Building className="h-3.5 w-3.5 text-amber-400" />
              <span>B2B Institutional School SaaS</span>
              <span className="rounded bg-blue-500/30 px-1.5 py-0.5 text-[10px] font-black text-blue-200">
                ADMIN ACCESS
              </span>
            </div>
            <h2 className="text-xl font-black tracking-tight sm:text-2xl">
              {isKz ? 'Мектептер мен Лицейлердің Аналитикалық Панелі' : 'Панель Аналитики для Школ и Лицеев'}
            </h2>
            <p className="max-w-xl text-xs text-blue-100/80 sm:text-sm">
              {isKz
                ? 'Мектеп әкімшілігі мен директорлар үшін оқушылардың олимпиадалық нәтижелерін, грант конверсиясын және сыныптар динамикасын нақты уақытта бақылау.'
                : 'Аналитика олимпиадной результативности, готовности к поступлению в топ-ВУЗы и экспорт аккредитационных отчетов для РОНО / МОН РК.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-blue-700 active:scale-95"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>{isKz ? 'РОНО Есебін Жүктеу (CSV)' : 'Экспорт Отчета (CSV)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[10px] font-bold uppercase text-slate-400">
            {isKz ? 'Белсенді Оқушылар' : 'Активные ученики'}
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">412</span>
            <span className="text-xs font-bold text-emerald-600">+14%</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[10px] font-bold uppercase text-slate-400">
            {isKz ? 'Верификацияланған Дипломдар' : 'Подтвержденные дипломы'}
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400">894</span>
            <span className="text-xs font-bold text-blue-600">100% Legit</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[10px] font-bold uppercase text-slate-400">
            {isKz ? 'Грантқа Болжамды Түсу' : 'Прогноз поступления на грант'}
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">94.8%</span>
            <span className="text-xs font-bold text-slate-400">AITU, KBTU, NU</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[10px] font-bold uppercase text-slate-400">
            {isKz ? 'Апталық Орташа XP' : 'Средний XP ученика'}
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-500">2,850</span>
            <span className="text-xs font-bold text-amber-600">⚡ Lvl 18+</span>
          </div>
        </div>
      </div>

      {/* Cohort Breakdown Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center border-b border-slate-100 pb-3 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {isKz ? 'Сыныптар мен Параллельдер бойынша нәтижелер' : 'Результаты по параллелям и классам'}
          </h3>

          <div className="flex gap-1.5">
            {(['all', '11_grade', '10_grade', '9_grade'] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCohort(c)}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                  selectedCohort === c
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {c === 'all' ? (isKz ? 'Барлығы' : 'Все') : `${c.split('_')[0]}-сынып`}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {[
            { grade: '11 "А" (ФМН)', teacher: 'Құрмашев Д.Б.', olympiadWinners: 18, grantChance: 98, totalXp: 48500 },
            { grade: '11 "Б" (Информатика)', teacher: 'Ахметова А.Е.', olympiadWinners: 15, grantChance: 95, totalXp: 42100 },
            { grade: '10 "А" (Олимпиада тобы)', teacher: 'Смағұлов М.С.', olympiadWinners: 22, grantChance: 92, totalXp: 39400 },
            { grade: '9 "В" (Робототехника)', teacher: 'Омаров Т.К.', olympiadWinners: 12, grantChance: 88, totalXp: 28900 },
          ].map((row, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 text-xs dark:border-slate-800 dark:bg-slate-800/40 sm:flex-row sm:items-center"
            >
              <div>
                <div className="font-black text-slate-900 dark:text-white">{row.grade}</div>
                <div className="text-[11px] text-slate-400">Жетекші: {row.teacher}</div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 block">{isKz ? 'Олимпиадашылар:' : 'Олимпиадников:'}</span>
                  <span className="font-bold text-blue-600">{row.olympiadWinners} оқушы</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block">{isKz ? 'Грант ықтималдығы:' : 'Шанс на грант:'}</span>
                  <span className="font-bold text-emerald-600">{row.grantChance}%</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block">{isKz ? 'Жалпы XP:' : 'Общий XP:'}</span>
                  <span className="font-bold text-amber-500">⚡ {row.totalXp.toLocaleString()} XP</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
