import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Sparkles, Send, Compass, ShieldCheck, Trophy, Building2, FileText, CheckCircle2 } from 'lucide-react'

interface DashboardAiAssistantBarProps {
  onSelectAction?: (actionId: string) => void
}

export function DashboardAiAssistantBar({ onSelectAction }: DashboardAiAssistantBarProps) {
  const { i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const isRu = i18n.language === 'ru'

  const [prompt, setPrompt] = useState('')
  const [aiReply, setAiReply] = useState<string | null>(null)
  const [isThinking, setIsThinking] = useState(false)

  const quickPrompts = [
    {
      id: 'roadmap',
      icon: Compass,
      label: isKz ? '1 жылдық ЖИ Roadmap құру' : isRu ? 'Построить AI Roadmap на 1 год' : 'Build 1-Year AI Roadmap',
    },
    {
      id: 'passport',
      icon: ShieldCheck,
      label: isKz ? 'Цифрлық QR Паспортты ашу' : isRu ? 'Открыть Цифровой QR Паспорт' : 'Open Digital QR Passport',
    },
    {
      id: 'gamification',
      icon: Trophy,
      label: isKz ? 'Күнделікті квесттер & XP' : isRu ? 'Ежедневные квесты & XP' : 'Daily Quests & XP',
    },
    {
      id: 'grants',
      icon: Building2,
      label: isKz ? 'ЖОО тікелей гранттары' : isRu ? 'Прямые гранты от вузов' : 'University Direct Grants',
    },
    {
      id: 'parent',
      icon: FileText,
      label: isKz ? 'Ата-анаға дарындылық есебі' : isRu ? 'Отчет для родителей (PDF)' : 'Parent Talent Report',
    },
  ]

  function handleSend(e?: React.FormEvent) {
    if (e) e.preventDefault()
    if (!prompt.trim()) return

    setIsThinking(true)
    setAiReply(null)

    setTimeout(() => {
      setIsThinking(false)
      if (isKz) {
        setAiReply(
          `🤖 **USHQN AI Ментор:** Сіздің жетістіктеріңіз бен портфолиоңызды талдадым! Робототехника және Алгоритмдер бойынша көрсеткіштеріңіз 88% деңгейінде. Сізге Назарбаев Университетінің және Astana IT университетінің автоматтандырылған Direct Grant бағдарламаларына 1 жылдық Roadmap ұсынылады.`
        )
      } else if (isRu) {
        setAiReply(
          `🤖 **USHQN AI Ментор:** Анализ портфолио завершен! Ваши навыки в Робототехнике и Алгоритмах достигают 88%. Под ваши результаты автоматически подобрана дорожная карта для получения прямого гранта в NU и Astana IT University.`
        )
      } else {
        setAiReply(
          `🤖 **USHQN AI Mentor:** Portfolio analysis complete! Your skills in Robotics and Algorithms are at 88%. An automated 1-year roadmap has been generated for direct grant opportunities at leading universities.`
        )
      }
    }, 600)
  }

  function handleChipClick(id: string, label: string) {
    setPrompt(label)
    if (onSelectAction) {
      onSelectAction(id)
    }
  }

  return (
    <section className="ushqn-card border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/90 p-5 shadow-xs">
      <div className="flex flex-col gap-3">
        {/* Main Clean Input Bar */}
        <form onSubmit={handleSend} className="relative flex items-center">
          <div className="pointer-events-none absolute left-3.5 flex items-center text-slate-400">
            <Sparkles className="h-5 w-5 text-[#0052cc]" />
          </div>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              isKz
                ? 'Көмекшіге сұрақ қойыңыз немесе бағыт таңдаңыз...'
                : isRu
                ? 'Задайте вопрос AI ментору или выберите действие...'
                : 'Ask AI Mentor a question or select a goal...'
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-24 text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400 focus:border-[#162a45] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#162a45]/15 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
          <div className="absolute right-2 flex items-center">
            <button
              type="submit"
              disabled={!prompt.trim() || isThinking}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#162a45] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#0f1d30] disabled:opacity-40"
            >
              {isThinking ? (
                <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>{isKz ? 'Сұрау' : isRu ? 'Спросить' : 'Ask'}</span>
                  <Send className="h-3 w-3" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick action chips - clean slate styling, no neon */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {isKz ? 'Жедел әрекеттер:' : isRu ? 'Быстрые действия:' : 'Quick Actions:'}
          </span>
          {quickPrompts.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleChipClick(item.id, item.label)}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 transition hover:border-[#162a45] hover:bg-slate-50 hover:text-[#162a45] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-500"
              >
                <Icon className="h-3.5 w-3.5 text-slate-500" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>

        {/* AI Answer Banner */}
        {aiReply && (
          <div className="mt-2 rounded-xl border border-blue-200 bg-blue-50/70 p-3.5 text-xs leading-relaxed text-slate-800 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-200">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
              <div className="space-y-1">
                <p>{aiReply}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
