import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Users,
  Download,
  Share2,
  TrendingUp,
  BrainCircuit,
  GraduationCap,
  School,
  Check,
} from 'lucide-react'

export function ParentTalentReport() {
  const { i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const isRu = i18n.language === 'ru'

  const [downloaded, setDownloaded] = useState(false)
  const [shared, setShared] = useState(false)

  function handleDownloadReport() {
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 2500)
  }

  function handleShareReport() {
    setShared(true)
    setTimeout(() => setShared(false), 2500)
  }

  return (
    <section className="ushqn-card border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
            <Users className="h-5 w-5 text-[#0052cc]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {isKz
                  ? '5. 👨‍👩‍👧 Ата-ана мен Мектептерге арналған панель'
                  : isRu
                  ? '5. 👨‍👩‍👧 Панель для Родителей и Школ (Аналитика)'
                  : '5. 👨‍👩‍👧 Parent & School Dashboard'}
              </h3>
              <span className="rounded-full bg-purple-100 px-2 py-0.2 text-[9px] font-black text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                TALENT REPORT
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isKz
                ? 'Баланың нақты қай салада мықты екенін көрсететін қысқа аналитикалық есеп беру (PDF/Dashboard)'
                : isRu
                ? 'Краткий аналитический отчет для родителей с картой талантов и прогрессом'
                : 'Concise analytical talent diagnostic report for parents and educators'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadReport}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            {downloaded ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-600">{isKz ? 'Жүктелді (PDF)' : isRu ? 'Скачано (PDF)' : 'Downloaded'}</span>
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5 text-slate-500" />
                <span>{isKz ? 'PDF Есеп жүктеу' : isRu ? 'Скачать отчет (PDF)' : 'Download PDF'}</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleShareReport}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#162a45] px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#0f1d30]"
          >
            {shared ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>{isKz ? 'Жіберілді!' : isRu ? 'Отправлено!' : 'Shared!'}</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5" />
                <span>{isKz ? 'Ата-анаға жіберу' : isRu ? 'Отправить родителям' : 'Share with Parent'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Talent Diagnostic Summary Card */}
      <div className="mt-4 rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 dark:border-slate-700/80 dark:bg-slate-800/40">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-3 dark:border-slate-700">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {isKz ? 'Оқушының дарындылық қорытындысы' : isRu ? 'Заключение о способностях' : 'Talent Summary'}
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {isKz
                ? 'Инженерлік-техникалық дарындылық деңгейі: ТОП 2%'
                : isRu
                ? 'Инженерно-технические способности: ТОП 2%'
                : 'Engineering & STEM Talent: Top 2%'}
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {isKz ? 'Жоғары дайындық' : isRu ? 'Высокая готовность' : 'High Readiness'}
            </span>
          </div>
        </div>

        {/* 3 Insight Pillars */}
        <div className="mt-3.5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200/80 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <BrainCircuit className="h-4 w-4 text-[#0052cc]" />
              <span>{isKz ? 'Басты күшті тұстары' : isRu ? 'Сильные стороны' : 'Key Strengths'}</span>
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
              {isKz
                ? 'Робототехника сызбаларын жасау, математикалық есептерді алгоритмдеу, күрделі аппараттық жүйелерді жинау.'
                : isRu
                ? 'Проектирование микросхем, олимпиадная математика, сборка автономных модулей.'
                : 'Hardware design, algorithmic math problem solving, autonomous module assembly.'}
            </p>
          </div>

          <div className="rounded-lg border border-slate-200/80 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <GraduationCap className="h-4 w-4 text-emerald-600" />
              <span>{isKz ? 'Ұсынылатын мамандықтар' : isRu ? 'Рекомендуемые сферы' : 'Target Majors'}</span>
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
              {isKz
                ? 'Robotics & Mechatronics, Embedded Systems, AI Engineering (Nazarbayev University, AITU, KBTU).'
                : isRu
                ? 'Robotics & Mechatronics, Embedded Systems, AI Engineering (NU, AITU, КБТУ).'
                : 'Robotics & Mechatronics, Embedded Systems, AI Engineering (NU, AITU, KBTU).'}
            </p>
          </div>

          <div className="rounded-lg border border-slate-200/80 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <span>{isKz ? 'Дамыту қажет салалар' : isRu ? 'Зоны для роста' : 'Growth Focus'}</span>
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
              {isKz
                ? 'IELTS Speaking практикасын күшейту (мақсат 7.5+), ғылыми мақала тезисін жазу дағдылары.'
                : isRu
                ? 'Практика IELTS Speaking (цель 7.5+) и оформление академических тезисов.'
                : 'IELTS Speaking practice (target 7.5+) and academic paper formatting.'}
            </p>
          </div>
        </div>

        {/* School & Mentor Endorsement */}
        <div className="mt-3 flex items-center justify-between rounded-lg bg-white p-2.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <School className="h-4 w-4 text-slate-400" />
            <span>
              {isKz
                ? 'Мектеп кураторының пікірі: «Оқушы жобаларды дер кезінде орындайды, халықаралық олимпиадаларға дайындығы жоғары»'
                : isRu
                ? 'Комментарий куратора: «Высокая мотивация, системный подход к олимпиадным задачам»'
                : 'Educator Note: "High motivation and strong technical capability in Olympiad robotics"'}
            </span>
          </div>
          <span className="shrink-0 font-mono text-[10px] text-slate-400">NIS Astana · 14.08.2026</span>
        </div>
      </div>
    </section>
  )
}
