import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Compass,
  CheckCircle2,
  Circle,
  ExternalLink,
  BookOpen,
  TrendingUp,
  Code2,
  Check,
  Sliders,
  Lightbulb,
} from 'lucide-react'
import { useToast } from '../lib/toast'

interface PracticalTask {
  id: string
  titleKz: string
  titleRu: string
  problemTextKz: string
  problemTextRu: string
  starterCodeOrHint: string
  solutionExample: string
  xpReward: number
}

interface RoadmapGoal {
  id: string
  titleKz: string
  titleRu: string
  category: 'career' | 'olympiad' | 'university' | 'startup'
  targetHorizon: string
  icon: string
  completionPercent: number
  targetDifficulty: 'Junior / 7-8 Сынып' | 'Middle / 9-10 Сынып' | 'Advanced / 11-12 & University'
  stages: {
    monthKz: string
    monthRu: string
    titleKz: string
    titleRu: string
    tasks: {
      id: string
      textKz: string
      textRu: string
      done: boolean
      xp: number
      practicalChallenge?: PracticalTask
    }[]
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
    targetDifficulty: 'Advanced / 11-12 & University',
    stages: [
      {
        monthKz: '1-2 Ай: Алгоритмдер мен LeetCode Базасы',
        monthRu: '1-2 Месяц: Алгоритмическая База и LeetCode',
        titleKz: 'Data Structures & Algorithms (DSA)',
        titleRu: 'Структуры Данных и Алгоритмы (DSA)',
        tasks: [
          {
            id: 'g1',
            textKz: 'LeetCode-та 100 Medium есеп шығару (Two Pointers, Graphs, DP)',
            textRu: 'Решить 100 Medium задач на LeetCode',
            done: true,
            xp: 200,
            practicalChallenge: {
              id: 'prac-g1',
              titleKz: 'Интерактивті практикум: Two Sum Optimal O(N)',
              titleRu: 'Интерактивный практикум: Two Sum Optimal O(N)',
              problemTextKz:
                'Берілген сандар жиынынан қосындысы target-қа тең екі санның индексін Hash Map арқылы O(N) уақытта табыңыз.',
              problemTextRu:
                'Найдите индексы двух чисел, сумма которых равна target за O(N) с использованием Hash Map.',
              starterCodeOrHint: `// C++ unordered_map implementation
vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> mp;
    for(int i=0; i<nums.size(); ++i) {
        int comp = target - nums[i];
        if(mp.count(comp)) return {mp[comp], i};
        mp[nums[i]] = i;
    }
    return {};
}`,
              solutionExample: `Hash Map (хэш-кесте) арқылы іздеу әр қадамда O(1) уақыт алады. Екі қабатты циклді (O(N^2)) бір ғана өтуге (O(N)) айналдырады.`,
              xpReward: 150,
            },
          },
          {
            id: 'g2',
            textKz: 'Time & Space Complexity (Big-O) талдауын терең меңгеру',
            textRu: 'Освоить анализ сложности Big-O',
            done: true,
            xp: 100,
            practicalChallenge: {
              id: 'prac-g2',
              titleKz: 'Big-O Интерактивті Талдау: Master Theorem',
              titleRu: 'Интерактивный разбор Big-O: Master Theorem',
              problemTextKz:
                'T(N) = 2T(N/2) + O(N) рекурренттік қатынасының уақытша күрделілігі қандай және Merge Sort-та ол қалай жұмыс істейді?',
              problemTextRu:
                'Какова сложность рекуррентного соотношения T(N) = 2T(N/2) + O(N) по Master Theorem?',
              starterCodeOrHint: 'T(N) = aT(N/b) + f(N), мұнда a=2, b=2, c=1 (f(N)=O(N^1)). log_b(a) = log_2(2) = 1 = c. Сондықтан жауап: O(N log N).',
              solutionExample: 'Master Theorem 2-жағдайы бойынша: a = b^c болғанда күрделілік O(N^c log N) болады.',
              xpReward: 100,
            },
          },
          {
            id: 'g3',
            textKz: 'Codeforces рейтингін 1400+ (Specialist) деңгейіне жеткізу',
            textRu: 'Поднять рейтинг Codeforces до 1400+',
            done: false,
            xp: 300,
          },
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
          {
            id: 'g4',
            textKz: 'TypeScript + Go / Python арқылы микросервистік жоба жасау',
            textRu: 'Создать микросервисный проект на TS/Go',
            done: false,
            xp: 350,
          },
          {
            id: 'g5',
            textKz: 'USHQN резюмесін Harvard CV форматында экспорттау',
            textRu: 'Экспортировать резюме в Гарвардском формате',
            done: false,
            xp: 150,
          },
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
    targetDifficulty: 'Advanced / 11-12 & University',
    stages: [
      {
        monthKz: '1-3 Ай: Стандартталған Тесттер (SAT & IELTS)',
        monthRu: '1-3 Месяц: Стандартизированные Тесты (SAT & IELTS)',
        titleKz: 'SAT 1500+ & IELTS 8.0 Target',
        titleRu: 'Цель: SAT 1500+ & IELTS 8.0',
        tasks: [
          {
            id: 'h1',
            textKz: 'Digital SAT 1520+ ұпайын ресми тіркеу (Math 800/800)',
            textRu: 'Сдать Digital SAT на 1520+',
            done: true,
            xp: 400,
            practicalChallenge: {
              id: 'prac-sat',
              titleKz: 'Digital SAT Math: Desmos Tricks & Quadratics',
              titleRu: 'Практикум Digital SAT Math: Лайфхаки Desmos',
              problemTextKz:
                'y = -2(x - 3)^2 + 18 функциясының төбесі (vertex) мен x-осімен қиылысу нүктелерін лезде анықтаңыз.',
              problemTextRu:
                'Найдите вершину параболы y = -2(x - 3)^2 + 18 и точки пересечения с осью X.',
              starterCodeOrHint: 'Vertex: (h, k) = (3, 18). Түбірлері: -2(x-3)^2 + 18 = 0 => (x-3)^2 = 9 => x = 0 немесе x = 6.',
              solutionExample: 'Парабола тармақтары төмен қараған, максимум мәні 18. Түбірлері: (0, 0) және (6, 0).',
              xpReward: 120,
            },
          },
          {
            id: 'h2',
            textKz: 'IELTS Academic 8.0 сертификатын USHQN-ға верификациялау',
            textRu: 'Верифицировать сертификат IELTS 8.0',
            done: true,
            xp: 300,
          },
          {
            id: 'h3',
            textKz: 'Common App негізгі эссесінің (Personal Statement) 3 нұсқасын жазу',
            textRu: 'Написать 3 драфта Personal Statement',
            done: false,
            xp: 250,
          },
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
    targetDifficulty: 'Advanced / 11-12 & University',
    stages: [
      {
        monthKz: 'Ай 1: Күрделі Графтар & Segment Trees',
        monthRu: 'Месяц 1: Продвинутые Графы и Деревья Отрезков',
        titleKz: 'Advanced Data Structures & DP Optimization',
        titleRu: 'Продвинутые структуры данных и ДП',
        tasks: [
          {
            id: 'ioi1',
            textKz: 'Lazy Propagation бар Segment Tree және Fenwick Tree',
            textRu: 'Segment Tree с Lazy Propagation',
            done: true,
            xp: 200,
            practicalChallenge: {
              id: 'prac-segtree',
              titleKz: 'Segment Tree Range Update O(log N)',
              titleRu: 'Segment Tree Range Update O(log N)',
              problemTextKz:
                'N=10^5 массивте аралықты (range [L, R]) жаңарту және қосындыны сұрау Lazy Propagation арқылы қалай жүзеге асырылады?',
              problemTextRu:
                'Реализация Lazy Propagation в дереве отрезков для массового обновления диапазона [L, R] за O(log N).',
              starterCodeOrHint: `void push(int v, int tl, int tr) {
    if (lazy[v] != 0) {
        int tm = (tl + tr) / 2;
        tree[v*2] += lazy[v] * (tm - tl + 1);
        lazy[v*2] += lazy[v];
        tree[v*2+1] += lazy[v] * (tr - tm);
        lazy[v*2+1] += lazy[v];
        lazy[v] = 0;
    }
}`,
              solutionExample: 'Lazy Propagation операцияны қажет болғанға дейін кейінге қалдырып, күрделілікті O(N)-нен O(log N)-ге түсіреді.',
              xpReward: 250,
            },
          },
          {
            id: 'ioi2',
            textKz: 'Convex Hull Trick және Divide & Conquer DP',
            textRu: 'Оптимизации ДП: Convex Hull Trick',
            done: false,
            xp: 400,
          },
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
  const [roadmaps, setRoadmaps] = useState<RoadmapGoal[]>(SAMPLE_ROADMAPS)
  const [activeAdaptiveLevel, setActiveAdaptiveLevel] = useState<
    'Junior / 7-8 Сынып' | 'Middle / 9-10 Сынып' | 'Advanced / 11-12 & University'
  >('Advanced / 11-12 & University')

  const [selectedPractice, setSelectedPractice] = useState<PracticalTask | null>(null)
  const [completedPractices, setCompletedPractices] = useState<string[]>([])

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
                toast(isKz ? `🎯 Тапсырма орындалды! +${xp} XP` : `🎯 Задача выполнена! +${xp} XP`, 'success')
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

  const handleCompletePractice = (practice: PracticalTask) => {
    if (!completedPractices.includes(practice.id)) {
      setCompletedPractices((p) => [...p, practice.id])
      toast(
        isKz
          ? `🎉 Практикум аяқталды! +${practice.xpReward} XP берілді!`
          : `🎉 Практикум сдан! Начислено +${practice.xpReward} XP!`,
        'success',
      )
    }
    setSelectedPractice(null)
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3.5 py-1 text-xs font-bold text-blue-300 backdrop-blur-md border border-blue-400/20">
              <Compass className="h-3.5 w-3.5 text-blue-400" />
              <span>Smart Roadmaps 2.0</span>
              <span className="rounded bg-indigo-500/30 px-1.5 py-0.5 text-[10px] font-black text-indigo-200">
                ADAPTIVE LEARNING
              </span>
            </div>
            <h2 className="text-xl font-black tracking-tight sm:text-2xl">
              {isKz ? 'Үлкен Мақсаттарға Арналған Жол Картасы & Тәжірибелік Лаборатория' : 'Индивидуальные Траектории и Практикумы'}
            </h2>
            <p className="max-w-xl text-xs text-blue-100/80 sm:text-sm leading-relaxed">
              {isKz
                ? 'Google-дағы тағылымдама, Harvard 100% гранты немесе Халықаралық Олимпиада алтынына арналған ай сайынғы нақты қадамдар, интерактивті код мысалдары мен тәжірибелік тапсырмалар.'
                : 'Пошаговый трекер к ключевым целям: стажировка в BigTech, 100% гранты топ-ВУЗов или олимпиадное золото с интерактивными код-практикумами.'}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 text-center backdrop-blur-md shrink-0">
            <span className="text-[10px] font-bold uppercase text-slate-300">
              {isKz ? 'Жалпы Прогресс' : 'Прогресс цели'}
            </span>
            <div className="mt-1 flex items-center justify-center gap-1.5 text-emerald-400">
              <TrendingUp className="h-5 w-5" />
              <span className="text-3xl font-black">{activeGoal.completionPercent}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Adaptive Level Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          <Sliders className="h-4 w-4 text-blue-600" />
          <span>{isKz ? 'Оқушы деңгейіне бейімделу (Adaptive Level):' : 'Адаптивный уровень сложности:'}</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(
            [
              'Junior / 7-8 Сынып',
              'Middle / 9-10 Сынып',
              'Advanced / 11-12 & University',
            ] as const
          ).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => {
                setActiveAdaptiveLevel(lvl)
                toast(
                  isKz
                    ? `🎯 Деңгей өзгертілді: ${lvl}. Жол картасы бейімделді.`
                    : `🎯 Уровень изменен: ${lvl}.`,
                )
              }}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                activeAdaptiveLevel === lvl
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              {lvl}
            </button>
          ))}
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
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4"
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
            <div className="space-y-2.5">
              {stage.tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-2xl border p-4 text-xs transition ${
                    task.done
                      ? 'border-emerald-200 bg-emerald-50/50 text-emerald-950 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200'
                      : 'border-slate-200 bg-slate-50/50 text-slate-800 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-200'
                  }`}
                >
                  <div
                    onClick={() => toggleTask(task.id, task.xp)}
                    className="flex cursor-pointer items-center gap-3 flex-1"
                  >
                    {task.done ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                    ) : (
                      <Circle className="h-5 w-5 shrink-0 text-slate-400" />
                    )}
                    <span className={task.done ? 'line-through opacity-80' : 'font-semibold'}>
                      {isKz ? task.textKz : task.textRu}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {task.practicalChallenge && (
                      <button
                        type="button"
                        onClick={() => setSelectedPractice(task.practicalChallenge!)}
                        className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-1.5 text-[11px] font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-95"
                      >
                        <Code2 className="h-3.5 w-3.5" />
                        <span>{isKz ? 'Интерактивті Мысал' : 'Интерактивный разбор'}</span>
                      </button>
                    )}

                    <span className="shrink-0 rounded-lg bg-blue-100 px-2.5 py-1 text-[10px] font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      +{task.xp} XP
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Curated Resources */}
            {stage.resources.length > 0 && (
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50">
                <span className="text-[11px] font-bold uppercase text-slate-400">
                  {isKz ? 'Ұсынылатын материалдар мен ресми платформалар:' : 'Рекомендованные ресурсы:'}
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {stage.resources.map((res, rIdx) => (
                    <a
                      key={rIdx}
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-blue-400"
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>{res.title}</span>
                      <ExternalLink className="h-3 w-3 opacity-60" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Practical Task & Code Modal */}
      {selectedPractice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                  <Lightbulb className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {isKz ? selectedPractice.titleKz : selectedPractice.titleRu}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPractice(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              <div className="rounded-2xl bg-indigo-50/60 p-4 dark:bg-indigo-950/30 text-indigo-950 dark:text-indigo-200">
                <span className="font-bold">Тапсырма шарты: </span>
                {isKz ? selectedPractice.problemTextKz : selectedPractice.problemTextRu}
              </div>

              <div>
                <div className="font-bold text-slate-900 dark:text-white text-[11px] uppercase tracking-wider mb-1">
                  Оңтайлы Кодтық Шешім немесе Алгоритм:
                </div>
                <pre className="rounded-2xl bg-slate-950 p-4 font-mono text-xs text-emerald-400 overflow-x-auto">
                  <code>{selectedPractice.starterCodeOrHint}</code>
                </pre>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40 text-[11px] text-slate-600 dark:text-slate-400">
                <span className="font-bold text-slate-900 dark:text-white">Түсініктеме мен Complexity: </span>
                {selectedPractice.solutionExample}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                Сыйлық: +{selectedPractice.xpReward} XP
              </span>
              <button
                type="button"
                onClick={() => handleCompletePractice(selectedPractice)}
                className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 active:scale-95"
              >
                <Check className="h-4 w-4" />
                <span>{isKz ? 'Түсіндім & XP алу' : 'Понятно & Получить XP'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

