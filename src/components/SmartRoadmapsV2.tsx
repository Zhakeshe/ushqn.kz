import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Compass,
  CheckCircle2,
  Circle,
  ExternalLink,
  BookOpen,
  TrendingUp,
} from 'lucide-react'
import { useToast } from '../lib/toast'

interface RoadmapGoal {
  id: string
  titleKz: string
  titleRu: string
  category: 'career' | 'olympiad' | 'university' | 'startup'
  targetHorizon: string
  icon: string
  completionPercent: number
  stages: {
    monthKz: string
    monthRu: string
    titleKz: string
    titleRu: string
    tasks: { id: string; textKz: string; textRu: string; done: boolean; xp: number }[]
    resources: { title: string; url: string }[]
  }[]
}

const SAMPLE_ROADMAPS: RoadmapGoal[] = [
  {
    id: 'goal-google',
    titleKz: '🚀 Google / BigTech Software Engineer Тағылымдамасы',
    titleRu: '🚀 Стажировка Software Engineer в Google / BigTech',
    category: 'career',
    targetHorizon: '2026-2027',
    icon: '💻',
    completionPercent: 45,
    stages: [
      {
        monthKz: '1-2 Ай: Алгоритмдер мен LeetCode Базасы',
        monthRu: '1-2 Месяц: Алгоритмическая База и LeetCode',
        titleKz: 'Data Structures & Algorithms (DSA)',
        titleRu: 'Структуры Данных и Алгоритмы (DSA)',
        tasks: [
          { id: 'g1', textKz: 'LeetCode-та 100 Medium есеп шығару (Trees, Graphs, DP)', textRu: 'Решить 100 Medium задач на LeetCode', done: true, xp: 200 },
          { id: 'g2', textKz: 'Time & Space Complexity (Big-O) талдауын терең меңгеру', textRu: 'Освоить анализ сложности Big-O', done: true, xp: 100 },
          { id: 'g3', textKz: 'Codeforces рейтингін 1400+ (Specialist) деңгейіне жеткізу', textRu: 'Поднять рейтинг Codeforces до 1400+', done: false, xp: 300 },
        ],
        resources: [
          { title: 'NeetCode 150 Roadmap', url: 'https://neetcode.io' },
          { title: 'USACO Guide (Silver)', url: 'https://usaco.guide' },
        ],
      },
      {
        monthKz: '3-4 Ай: Ашық бастапқы код & Күрделі жобалар',
        monthRu: '3-4 Месяц: Open-Source и Production Проект',
        titleKz: 'System Architecture & Production Portfolio',
        titleRu: 'Архитектура систем и портфолио',
        tasks: [
          { id: 'g4', textKz: 'TypeScript + Go / Python арқылы микросервистік жоба жасау', textRu: 'Создать микросервисный проект на TS/Go', done: false, xp: 350 },
          { id: 'g5', textKz: 'USHQN резюмесін Harvard CV форматында экспорттау', textRu: 'Экспортировать резюме в Гарвардском формате', done: false, xp: 150 },
        ],
        resources: [
          { title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer' },
        ],
      },
    ],
  },
  {
    id: 'goal-harvard-fullride',
    titleKz: '🎓 Harvard / MIT / KAIST 100% Толық Грант',
    titleRu: '🎓 100% Full-Ride Грант в Harvard / MIT / KAIST',
    category: 'university',
    targetHorizon: '11 Сынып',
    icon: '🏛️',
    completionPercent: 60,
    stages: [
      {
        monthKz: '1-3 Ай: Стандартталған Тесттер (SAT & IELTS)',
        monthRu: '1-3 Месяц: Стандартизированные Тесты (SAT & IELTS)',
        titleKz: 'SAT 1500+ & IELTS 8.0 Target',
        titleRu: 'Цель: SAT 1500+ & IELTS 8.0',
        tasks: [
          { id: 'h1', textKz: 'Digital SAT 1520+ ұпайын ресми тіркеу', textRu: 'Сдать Digital SAT на 1520+', done: true, xp: 400 },
          { id: 'h2', textKz: 'IELTS Academic 8.0 сертификатын USHQN-ға верификациялау', textRu: 'Верифицировать сертификат IELTS 8.0', done: true, xp: 300 },
          { id: 'h3', textKz: 'Common App негізгі эссесінің (Personal Statement) 3 нұсқасын жазу', textRu: 'Написать 3 драфта Personal Statement', done: false, xp: 250 },
        ],
        resources: [
          { title: 'Khan Academy SAT Official', url: 'https://khanacademy.org/sat' },
          { title: 'College Essay Guy Guide', url: 'https://collegeessayguy.com' },
        ],
      },
    ],
  },
  {
    id: 'goal-ioi-gold',
    titleKz: '🥇 IOI / Жәутіков Халықаралық Олимпиада Алтыны',
    titleRu: '🥇 Золотая Медаль IOI / Жаутыковской Олимпиады',
    category: 'olympiad',
    targetHorizon: '2026',
    icon: '🏆',
    completionPercent: 30,
    stages: [
      {
        monthKz: 'Ай 1: Күрделі Графтар & Segment Trees',
        monthRu: 'Месяц 1: Продвинутые Графы и Деревья Отрезков',
        titleKz: 'Advanced Data Structures & DP Optimization',
        titleRu: 'Продвинутые структуры данных и ДП',
        tasks: [
          { id: 'ioi1', textKz: 'Lazy Propagation бар Segment Tree және Fenwick Tree', textRu: 'Segment Tree с Lazy Propagation', done: true, xp: 200 },
          { id: 'ioi2', textKz: 'Convex Hull Trick және Divide & Conquer DP', textRu: 'Оптимизации ДП: Convex Hull Trick', done: false, xp: 400 },
        ],
        resources: [
          { title: 'e-maxx.ru / CP-Algorithms', url: 'https://cp-algorithms.com' },
        ],
      },
    ],
  },
]

export function SmartRoadmapsV2() {
  const { i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const { toast } = useToast()

  const [activeGoalId, setActiveGoalId] = useState<string>('goal-google')
  const [roadmaps, setRoadmaps] = useState<RoadmapGoal[]>(SAMPLE_PROBLEMS_V2)

  const activeGoal = roadmaps.find((g) => g.id === activeGoalId) || roadmaps[0]

  const toggleTask = (taskId: string, xp: number) => {
    setRoadmaps((prev) =>
      prev.map((g) => {
        if (g.id !== activeGoalId) return g

        let updatedTasksCount = 0
        let doneTasksCount = 0

        const newStages = g.stages.map((stage) => {
          const updatedTasks = stage.tasks.map((t) => {
            if (t.id === taskId) {
              const newDone = !t.done
              if (newDone) {
                toast(isKz ? `🎯 Тапсырма орындалды! +${xp} XP` : `🎯 Задача выполнена! +${xp} XP`)
              }
              return { ...t, done: newDone }
            }
            return t
          })
          return { ...stage, tasks: updatedTasks }
        })

        // Recompute percentage
        newStages.forEach((s) => {
          s.tasks.forEach((t) => {
            updatedTasksCount++
            if (t.done) doneTasksCount++
          })
        })

        const newPercent = updatedTasksCount > 0 ? Math.round((doneTasksCount / updatedTasksCount) * 100) : 0

        return { ...g, stages: newStages, completionPercent: newPercent }
      }),
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-6 text-white shadow-xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-300 backdrop-blur-md">
              <Compass className="h-3.5 w-3.5 text-blue-400" />
              <span>Smart Roadmaps 2.0</span>
              <span className="rounded bg-indigo-500/30 px-1.5 py-0.5 text-[10px] font-black text-indigo-200">
                DYNAMIC TRAJECTORIES
              </span>
            </div>
            <h2 className="text-xl font-black tracking-tight sm:text-2xl">
              {isKz ? 'Үлкен Мақсаттарға Арналған Жол Картасы' : 'Индивидуальные Траектории и Роадмапы'}
            </h2>
            <p className="max-w-xl text-xs text-blue-100/80 sm:text-sm">
              {isKz
                ? 'Google-дағы тағылымдама, Harvard толық гранты немесе Халықаралық Олимпиада алтынына ай сайынғы нақты қадамдар мен прогресс-трекер.'
                : 'Пошаговый трекер к ключевым целям: стажировка в BigTech, 100% гранты топ-ВУЗов или золото на международных олимпиадах.'}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md">
            <span className="text-[10px] font-bold uppercase text-slate-300">
              {isKz ? 'Жалпы Прогресс' : 'Прогресс цели'}
            </span>
            <div className="mt-1 flex items-center justify-center gap-1.5 text-emerald-400">
              <TrendingUp className="h-5 w-5" />
              <span className="text-2xl font-black">{activeGoal.completionPercent}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Goal Selector Cards */}
      <div className="grid gap-3 sm:grid-cols-3">
        {roadmaps.map((g) => {
          const isSel = g.id === activeGoalId
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => setActiveGoalId(g.id)}
              className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition ${
                isSel
                  ? 'border-blue-600 bg-blue-50/60 dark:border-blue-700 dark:bg-blue-950/40 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xl">{g.icon}</span>
                  <span className="text-[10px] font-bold text-slate-400">{g.targetHorizon}</span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                  {isKz ? g.titleKz : g.titleRu}
                </h3>
              </div>

              <div className="mt-3">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                  <span>{isKz ? 'Орындалуы' : 'Выполнено'}</span>
                  <span className="text-blue-600 dark:text-blue-400">{g.completionPercent}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${g.completionPercent}%` }}
                  />
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Timeline Stages */}
      <div className="space-y-6">
        {activeGoal.stages.map((stage, sIdx) => (
          <div
            key={sIdx}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4"
          >
            <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center border-b border-slate-100 pb-3 dark:border-slate-800">
              <div>
                <span className="text-[11px] font-black uppercase text-blue-600 dark:text-blue-400">
                  {isKz ? stage.monthKz : stage.monthRu}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {isKz ? stage.titleKz : stage.titleRu}
                </h3>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {stage.tasks.filter((t) => t.done).length}/{stage.tasks.length} {isKz ? 'аяқталды' : 'готово'}
              </span>
            </div>

            {/* Tasks list */}
            <div className="space-y-2">
              {stage.tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id, task.xp)}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 text-xs transition ${
                    task.done
                      ? 'border-emerald-200 bg-emerald-50/50 text-emerald-950 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200'
                      : 'border-slate-200 bg-slate-50/50 text-slate-800 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {task.done ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                    ) : (
                      <Circle className="h-4 w-4 shrink-0 text-slate-400" />
                    )}
                    <span className={task.done ? 'line-through opacity-80' : 'font-medium'}>
                      {isKz ? task.textKz : task.textRu}
                    </span>
                  </div>

                  <span className="shrink-0 rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    +{task.xp} XP
                  </span>
                </div>
              ))}
            </div>

            {/* Curated Resources */}
            {stage.resources.length > 0 && (
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                <span className="text-[11px] font-bold uppercase text-slate-400">
                  {isKz ? 'Ұсынылатын материалдар мен сілтемелер:' : 'Рекомендованные ресурсы:'}
                </span>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {stage.resources.map((res, rIdx) => (
                    <a
                      key={rIdx}
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-blue-600 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-blue-400"
                    >
                      <BookOpen className="h-3 w-3" />
                      <span>{res.title}</span>
                      <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const SAMPLE_PROBLEMS_V2 = SAMPLE_ROADMAPS
