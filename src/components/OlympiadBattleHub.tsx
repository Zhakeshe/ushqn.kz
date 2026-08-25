import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Swords,
  Trophy,
  Flame,
  Zap,
  CheckCircle2,
  Clock,
  Sparkles,
  Code2,
  Cpu,
  Calculator,
  Play,
  Users,
} from 'lucide-react'
import { useToast } from '../lib/toast'

export interface BattleChallenge {
  id: string
  titleKz: string
  titleRu: string
  titleEn: string
  descriptionKz: string
  descriptionRu: string
  category: 'olympiad_math' | 'algocoding' | 'robotics_iot' | 'kazakh_history' | 'ielts_challenge'
  difficulty: 'easy' | 'medium' | 'hard' | 'olympiad'
  xpReward: number
  badgeReward?: {
    nameKz: string
    nameRu: string
    icon: string
  }
  deadlineDays: number
  participantsCount: number
  tasksCount: number
  tasks: {
    id: string
    questionKz: string
    questionRu: string
    codeSnippet?: string
    options: string[]
    correctIndex: number
    explanationKz: string
    explanationRu: string
  }[]
}

const SAMPLE_BATTLES: BattleChallenge[] = [
  {
    id: 'battle-math-1',
    titleKz: '🏆 Жәутіков Олимпиадасы: Комбинаторика & Сандар теориясы',
    titleRu: '🏆 Жаутыковская Олимпиада: Комбинаторика и Теория чисел',
    titleEn: '🏆 Zhautykov Olympiad: Combinatorics & Number Theory',
    descriptionKz: 'Республикалық және халықаралық олимпиада деңгейіндегі күрделі 3 есеп. Дұрыс шешкенге +450 XP және арнайы «Math Wizard» бейджі.',
    descriptionRu: '3 задачи уровня республиканских и международных олимпиад. Награда: +450 XP и бейдж «Math Wizard».',
    category: 'olympiad_math',
    difficulty: 'olympiad',
    xpReward: 450,
    badgeReward: {
      nameKz: 'Math Wizard 2026',
      nameRu: 'Math Wizard 2026',
      icon: '📐',
    },
    deadlineDays: 3,
    participantsCount: 342,
    tasksCount: 3,
    tasks: [
      {
        id: 'm1',
        questionKz: 'Егер p және 8p² + 1 жай сандар болса, 8p² - 1 саны қандай сан болады?',
        questionRu: 'Если p и 8p² + 1 простые числа, то каким числом является 8p² - 1?',
        options: ['Жай сан (71)', 'Құрама сан (73)', 'Жай сан (47)', 'Кез келген сан бола береді'],
        correctIndex: 0,
        explanationKz: 'p = 3 болғанда 8(9)+1 = 73 (жай сан). Сонда 8(9)-1 = 71 (жай сан). p ≠ 3 үшін модуль 3 бойынша қарама-қайшылық туындайды.',
        explanationRu: 'При p = 3 имеем 8(9)+1 = 73 (простое). Тогда 8(9)-1 = 71 (также простое). Для остальных p mod 3 дает делимость на 3.',
      },
      {
        id: 'm2',
        questionKz: '100 оқушы қатысқан олимпиадада кез келген 4 оқушының кемінде 1-еуі бір-бірін таниды. Бірін-бірі танымайтын ең көп оқушы саны қанша?',
        questionRu: 'В олимпиаде участвовали 100 школьников. Среди любых 4 школьников хотя бы один знает другого. Каково максимальное число попарно незнакомых?',
        options: ['3', '4', '25', '33'],
        correctIndex: 0,
        explanationKz: 'Дирихле қағидасы мен Графтар теориясы бойынша: егер 4 адам болса, олардың арасында байланыс бар, яғни тәуелсіз жиын өлшемі ≤ 3.',
        explanationRu: 'По теореме Турана и принципу Дирихле максимальный размер независимого множества графа равен 3.',
      },
    ],
  },
  {
    id: 'battle-code-1',
    titleKz: '⚡ ICPC & IOI Sprint: Dynamic Programming & Graphs',
    titleRu: '⚡ ICPC & IOI Sprint: Динамическое Программирование',
    titleEn: '⚡ ICPC & IOI Sprint: Dynamic Programming & Graphs',
    descriptionKz: 'Алгоритмдік бағдарламалаудан жылдамдыққа арналған дуэль. Уақыт шектеуі: әр есепке 45 секунд.',
    descriptionRu: 'Дуэль на скорость по алгоритмам и структурам данных. Ограничение: 45 сек на задачу.',
    category: 'algocoding',
    difficulty: 'hard',
    xpReward: 500,
    badgeReward: {
      nameKz: 'Algorithm Titan',
      nameRu: 'Algorithm Titan',
      icon: '💻',
    },
    deadlineDays: 1,
    participantsCount: 518,
    tasksCount: 2,
    tasks: [
      {
        id: 'c1',
        questionKz: 'Берілген C++ алгоритмінің уақытша күрделілігі (Time Complexity) қандай?',
        questionRu: 'Какова временная сложность данного алгоритма на C++?',
        codeSnippet: `int binary_lift(int u, int k) {\n  for (int i = 0; i < 20; i++) {\n    if (k & (1 << i)) u = up[u][i];\n  }\n  return u;\n}`,
        options: ['O(log K)', 'O(K)', 'O(N log N)', 'O(1) немесе O(20)'],
        correctIndex: 3,
        explanationKz: 'Цикл 20 қадамға бекітілген, сондықтан O(log(MAX_DEPTH)) яғни тұрақты O(20) уақыт алады.',
        explanationRu: 'Цикл фиксирован на 20 итерациях, сложность строго O(log MAX) = O(20) константное время запроса.',
      },
    ],
  },
  {
    id: 'battle-iot-1',
    titleKz: '🤖 WorldSkills Robotics & Arduino Circuit Battle',
    titleRu: '🤖 WorldSkills Robotics: Схемотехника и Микроконтроллеры',
    titleEn: '🤖 WorldSkills Robotics: Circuit Battle',
    descriptionKz: 'STM32 және Arduino микроконтроллерлерін программалау, PID-реттегіштер және сенсорлар баптауы.',
    descriptionRu: 'Программирование STM32/ESP32, настройка PID регуляторов для роботов.',
    category: 'robotics_iot',
    difficulty: 'medium',
    xpReward: 300,
    badgeReward: {
      nameKz: 'Robo Engineer',
      nameRu: 'Robo Engineer',
      icon: '⚙️',
    },
    deadlineDays: 5,
    participantsCount: 210,
    tasksCount: 2,
    tasks: [
      {
        id: 'r1',
        questionKz: 'Сызық бойымен жүретін роботта (Line Follower) тербелісті (oscillation) басу үшін PID реттегіштің қай коэффициентін арттыру қажет?',
        questionRu: 'Для подавления колебаний робота на линии, какой коэффициент PID регулятора нужно увеличить?',
        options: ['Kd (Дифференциалдық)', 'Kp (Пропорционалдық)', 'Ki (Интегралдық)', 'V_base (Жылдамдық)'],
        correctIndex: 0,
        explanationKz: 'Kd (D-component) қатенің өзгеру жылдамдығын тежеп, роботтың тербелісі мен жолдан шығып кетуін басады.',
        explanationRu: 'Коэффициент Kd реагирует на скорость изменения ошибки и демпфирует резкие колебания робота.',
      },
    ],
  },
]

export function OlympiadBattleHub() {
  const { i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const isRu = i18n.language === 'ru'
  const { toast } = useToast()

  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [activeBattle, setActiveBattle] = useState<BattleChallenge | null>(null)
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [completedBattles, setCompletedBattles] = useState<string[]>([])
  const [earnedBadges, setEarnedBadges] = useState<string[]>([])

  const filteredBattles = useMemo(() => {
    if (activeCategory === 'all') return SAMPLE_BATTLES
    return SAMPLE_BATTLES.filter((b) => b.category === activeCategory)
  }, [activeCategory])

  const startBattle = (battle: BattleChallenge) => {
    setActiveBattle(battle)
    setCurrentTaskIndex(0)
    setSelectedAnswers({})
    setIsSubmitted(false)
  }

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentTaskIndex]: optionIndex,
    }))
  }

  const submitBattle = () => {
    if (!activeBattle) return
    setIsSubmitted(true)

    // Calculate score
    let correctCount = 0
    activeBattle.tasks.forEach((t, idx) => {
      if (selectedAnswers[idx] === t.correctIndex) {
        correctCount++
      }
    })

    const isAllCorrect = correctCount === activeBattle.tasks.length

    if (isAllCorrect) {
      setCompletedBattles((prev) => [...prev, activeBattle.id])
      if (activeBattle.badgeReward) {
        setEarnedBadges((prev) => [...prev, activeBattle.badgeReward!.nameKz])
      }
      toast(
        isKz
          ? `🔥 Жеңіс! +${activeBattle.xpReward} XP және «${activeBattle.badgeReward?.nameKz}» бейджі берілді!`
          : `🔥 Победа! Начислено +${activeBattle.xpReward} XP и бейдж «${activeBattle.badgeReward?.nameRu}»!`,
      )
    } else {
      toast(
        isKz
          ? `Нәтиже: ${correctCount}/${activeBattle.tasks.length} дұрыс. Тағы бір рет байқап көріңіз!`
          : `Результат: ${correctCount}/${activeBattle.tasks.length} верно. Попробуйте еще раз!`,
        'info',
      )
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Banner: Arena & Leaderboard Callout */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-white shadow-xl">
        <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-300 backdrop-blur-md">
              <Swords className="h-3.5 w-3.5 text-amber-400" />
              <span>{isKz ? 'Апталық Олимпиадалық Арена' : isRu ? 'Еженедельная Олимпиадная Арена' : 'Weekly Olympiad Arena'}</span>
              <span className="rounded bg-amber-500/30 px-1.5 py-0.5 text-[10px] font-black text-amber-300">LIVE</span>
            </div>
            <h2 className="text-xl font-black tracking-tight sm:text-2xl">
              {isKz ? 'Олимпиадалық Баттлдар & Квесттер' : isRu ? 'Олимпиадные Баттлы и Квесты' : 'Olympiad Battles & Quests'}
            </h2>
            <p className="max-w-xl text-xs text-blue-100/80 leading-relaxed sm:text-sm">
              {isKz
                ? 'Республикалық және халықаралық олимпиада есептерін шығарып, нақты уақытта басқа дарынды оқушылармен жарысыңыз. Әрбір жеңіс сіздің ЖОО Грант рейтингіңізді көтереді!'
                : isRu
                ? 'Решайте олимпиадные задачи, соревнуйтесь в реальном времени и получайте официальные XP и бейджи для поступления в топ-ВУЗы.'
                : 'Solve Olympiad challenges, earn XP multipliers and unlock prestigious academic badges.'}
            </p>
          </div>

          {/* Quick Stats in Banner */}
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 text-center backdrop-blur-md">
              <div className="flex items-center justify-center gap-1 text-amber-400">
                <Flame className="h-4 w-4 fill-amber-400" />
                <span className="text-lg font-black">{earnedBadges.length}</span>
              </div>
              <span className="text-[10px] font-bold text-slate-300 uppercase">
                {isKz ? 'Бейдждер' : 'Бейджи'}
              </span>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 text-center backdrop-blur-md">
              <div className="flex items-center justify-center gap-1 text-emerald-400">
                <Trophy className="h-4 w-4" />
                <span className="text-lg font-black">{completedBattles.length}</span>
              </div>
              <span className="text-[10px] font-bold text-slate-300 uppercase">
                {isKz ? 'Жеңістер' : 'Победы'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
        {[
          { id: 'all', labelKz: 'Барлық Баттлдар', labelRu: 'Все Баттлы', icon: Swords },
          { id: 'olympiad_math', labelKz: 'Математика (Жәутіков)', labelRu: 'Олимп. Математика', icon: Calculator },
          { id: 'algocoding', labelKz: 'ICPC / IOI Программалау', labelRu: 'Алгоритмы & Кодинг', icon: Code2 },
          { id: 'robotics_iot', labelKz: 'Робототехника & IoT', labelRu: 'Робототехника & IoT', icon: Cpu },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeCategory === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCategory(tab.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{isKz ? tab.labelKz : tab.labelRu}</span>
            </button>
          )
        })}
      </div>

      {/* Battles Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredBattles.map((battle) => {
          const isDone = completedBattles.includes(battle.id)
          return (
            <div
              key={battle.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="space-y-3">
                {/* Header tags */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-1 text-[11px] font-black text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    <Zap className="h-3 w-3 text-amber-500" />
                    +{battle.xpReward} XP
                  </span>

                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400">
                    <Clock className="h-3 w-3" />
                    {battle.deadlineDays} {isKz ? 'күн қалды' : 'дня'}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                    {isKz ? battle.titleKz : battle.titleRu}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {isKz ? battle.descriptionKz : battle.descriptionRu}
                  </p>
                </div>

                {/* Badge Reward Pill */}
                {battle.badgeReward && (
                  <div className="flex items-center gap-2 rounded-xl border border-amber-200/60 bg-amber-50/50 p-2 text-xs font-bold text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300">
                    <span className="text-base">{battle.badgeReward.icon}</span>
                    <span className="truncate">
                      {isKz ? `Сыйлық: ${battle.badgeReward.nameKz}` : `Награда: ${battle.badgeReward.nameRu}`}
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Card Actions */}
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                  <Users className="h-3.5 w-3.5" />
                  <span>{battle.participantsCount} {isKz ? 'қатысушы' : 'участников'}</span>
                </div>

                {isDone ? (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{isKz ? 'Жеңіс (+XP)' : 'Пройдено'}</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => startBattle(battle)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700 active:scale-95"
                  >
                    <Play className="h-3 w-3 fill-white" />
                    <span>{isKz ? 'Баттлды Бастау' : 'Начать Баттл'}</span>
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Active Battle Interactive Arena Modal */}
      {activeBattle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900 flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  <Swords className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {isKz ? activeBattle.titleKz : activeBattle.titleRu}
                  </h3>
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
                    {currentTaskIndex + 1} / {activeBattle.tasks.length} {isKz ? 'тапсырма' : 'задание'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveBattle(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Task Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {(() => {
                const currentTask = activeBattle.tasks[currentTaskIndex]
                if (!currentTask) return null
                const selectedOpt = selectedAnswers[currentTaskIndex]

                return (
                  <div className="space-y-4">
                    <div className="rounded-xl bg-slate-50 p-4 text-xs font-semibold text-slate-800 dark:bg-slate-800/60 dark:text-slate-200 leading-relaxed sm:text-sm">
                      {isKz ? currentTask.questionKz : currentTask.questionRu}
                    </div>

                    {/* Code Snippet if applicable */}
                    {currentTask.codeSnippet && (
                      <pre className="overflow-x-auto rounded-xl bg-slate-950 p-3.5 font-mono text-xs text-emerald-400">
                        <code>{currentTask.codeSnippet}</code>
                      </pre>
                    )}

                    {/* Options list */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold uppercase text-slate-400">
                        {isKz ? 'Нұсқаны таңдаңыз:' : 'Выберите вариант ответа:'}
                      </span>
                      {currentTask.options.map((opt, oIdx) => {
                        const isChosen = selectedOpt === oIdx
                        let btnClass = 'border-slate-200 hover:border-blue-300 dark:border-slate-800 dark:hover:border-blue-700'

                        if (isChosen) {
                          btnClass = 'border-blue-600 bg-blue-50/50 text-blue-900 dark:bg-blue-950/40 dark:text-blue-200 font-bold'
                        }

                        if (isSubmitted) {
                          if (oIdx === currentTask.correctIndex) {
                            btnClass = 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold dark:bg-emerald-950/50 dark:text-emerald-200'
                          } else if (isChosen) {
                            btnClass = 'border-red-600 bg-red-50 text-red-900 dark:bg-red-950/50 dark:text-red-200'
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() => handleSelectOption(oIdx)}
                            className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-left text-xs transition ${btnClass}`}
                          >
                            <span>{opt}</span>
                            {isSubmitted && oIdx === currentTask.correctIndex && (
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            )}
                          </button>
                        )
                      })}
                    </div>

                    {/* Explanation when submitted */}
                    {isSubmitted && (
                      <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-3.5 text-xs text-blue-900 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
                        <span className="font-bold">{isKz ? '💡 Түсіндірме: ' : '💡 Объяснение: '}</span>
                        {isKz ? currentTask.explanationKz : currentTask.explanationRu}
                      </div>
                    )}
                  </div>
                )
              })()}
            </div>

            {/* Modal Bottom Controls */}
            <div className="flex items-center justify-between border-t border-slate-100 p-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2">
                {currentTaskIndex > 0 && (
                  <button
                    type="button"
                    onClick={() => setCurrentTaskIndex((prev) => prev - 1)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {isKz ? 'Алдыңғы' : 'Назад'}
                  </button>
                )}
                {currentTaskIndex < activeBattle.tasks.length - 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentTaskIndex((prev) => prev + 1)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {isKz ? 'Келесі' : 'Далее'}
                  </button>
                )}
              </div>

              {!isSubmitted ? (
                <button
                  type="button"
                  onClick={submitBattle}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-95"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{isKz ? 'Жауапты тексеру & XP алу' : 'Проверить и забрать XP'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveBattle(null)}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
                >
                  {isKz ? 'Аяқтау' : 'Закрыть'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
