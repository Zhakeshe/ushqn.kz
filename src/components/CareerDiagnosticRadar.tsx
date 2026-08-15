import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Compass,
  CheckCircle2,
  Circle,
  Sparkles,
  Check,
} from 'lucide-react'

interface SkillItem {
  name: string
  nameKz: string
  nameRu: string
  score: number // 0-100
}

interface Milestone {
  id: string
  quarter: string
  quarterKz: string
  quarterRu: string
  title: string
  titleKz: string
  titleRu: string
  desc: string
  descKz: string
  descRu: string
  status: 'completed' | 'in_progress' | 'upcoming'
  quests: { id: string; title: string; titleKz: string; titleRu: string; done: boolean; xp: number }[]
}

const DEFAULT_SKILLS: SkillItem[] = [
  { name: 'Mechatronics & Hardware', nameKz: 'Мехатроника & Робототехника', nameRu: 'Мехатроника и Робототехника', score: 88 },
  { name: 'Algorithms & Coding', nameKz: 'Алгоритмдер & Бағдарламалау', nameRu: 'Алгоритмы и Программирование', score: 82 },
  { name: 'Math & Logic', nameKz: 'Математика & Логика', nameRu: 'Математика и Логика', score: 90 },
  { name: 'Critical Thinking', nameKz: 'Сыни ойлау & Ғылыми зерттеу', nameRu: 'Критическое мышление и Наука', score: 76 },
  { name: 'English (IELTS/SAT)', nameKz: 'Ағылшын тілі (IELTS 7.5)', nameRu: 'Английский язык (IELTS 7.5)', score: 78 },
  { name: 'Leadership & Teamwork', nameKz: 'Көшбасшылық & Жобалар', nameRu: 'Лидерство и Проекты', score: 85 },
]

const DEFAULT_ROADMAP: Milestone[] = [
  {
    id: 'm1',
    quarter: 'Q1: Foundation & Olympiads',
    quarterKz: '1-тоқсан: Олимпиадалық база',
    quarterRu: 'Q1: Олимпиадная база и старт',
    title: 'Daryn & Республиканская Олимпиада',
    titleKz: 'Дарын & Республикалық олимпиадаға қатысу',
    titleRu: 'Участие в Дарын и Республиканской Олимпиаде',
    desc: 'Solve 120+ Olympiad level coding & math problems. Get verified certificate.',
    descKz: '120-дан астам олимпиадалық есеп шығару. Ресми сертификатты растау.',
    descRu: 'Решить более 120 олимпиадных задач. Получить верифицированный сертификат.',
    status: 'completed',
    quests: [
      { id: 'q1', title: 'Pass Regional Informatics Round', titleKz: 'Информатика бойынша облыстық кезең', titleRu: 'Областной этап по информатике', done: true, xp: 150 },
      { id: 'q2', title: 'Upload official Daryn diploma', titleKz: 'Дарын дипломын жүктеп растау', titleRu: 'Загрузить верифицированный диплом', done: true, xp: 100 },
    ],
  },
  {
    id: 'm2',
    quarter: 'Q2: Advanced Projects',
    quarterKz: '2-тоқсан: Практикалық Жобалар',
    quarterRu: 'Q2: Продвинутые Проекты',
    title: 'FIRST Robotics / AI Prototype Build',
    titleKz: 'FIRST Robotics және AI Автономды Жобасы',
    titleRu: 'FIRST Robotics и AI Прототип',
    desc: 'Build functional micro-controller code, publish GitHub repository, submit to showcase.',
    descKz: 'Микроконтроллер кодын жазу, GitHub репозиторийін жариялау және Шоукейс портфолиосына қосу.',
    descRu: 'Собрать микроконтроллер, выложить открытый GitHub репозиторий и добавить в портфолио.',
    status: 'in_progress',
    quests: [
      { id: 'q3', title: 'Complete CAD & Circuit schematic', titleKz: 'Роботтың 3D CAD сызбасын аяқтау', titleRu: 'Завершить 3D CAD схему робота', done: true, xp: 80 },
      { id: 'q4', title: 'Deploy telemetry sensor dashboard', titleKz: 'Телеметриялық датчиктерді қосу', titleRu: 'Подключить телеметрические датчики', done: false, xp: 120 },
      { id: 'q5', title: 'Peer review from 2 mentor engineers', titleKz: '2 инженер ментордан рецензия алу', titleRu: 'Получить ревью от 2 инженеров', done: false, xp: 150 },
    ],
  },
  {
    id: 'm3',
    quarter: 'Q3: Academic & Language Mastery',
    quarterKz: '3-тоқсан: Тілдік және Ғылыми деңгей',
    quarterRu: 'Q3: Языковой и Научный уровень',
    title: 'IELTS 7.5+ & Research Abstract',
    titleKz: 'IELTS 7.5+ және Ғылыми мақала жазу',
    titleRu: 'IELTS 7.5+ и Научный тезис',
    desc: 'Pass mock tests, publish 1 junior research paper, verify standardized test credentials.',
    descKz: 'IELTS сынама тесттерінен 7.5+ жинау, 1 ғылыми жоба тезисін дайындау.',
    descRu: 'Сдать пробный IELTS 7.5+, подготовить научную публикацию.',
    status: 'upcoming',
    quests: [
      { id: 'q6', title: 'Daily academic vocabulary quiz', titleKz: 'Күнделікті академиялық сөздік', titleRu: 'Ежедневный вокабуляр IELTS', done: false, xp: 50 },
      { id: 'q7', title: 'Upload IELTS official test score', titleKz: 'IELTS ресми сертификатын жүктеу', titleRu: 'Загрузить результат IELTS', done: false, xp: 200 },
    ],
  },
  {
    id: 'm4',
    quarter: 'Q4: Direct University Grant Offers',
    quarterKz: '4-тоқсан: ЖОО Тікелей Грант Ұсыныстары',
    quarterRu: 'Q4: Прямые предложения грантов от вузов',
    title: 'Direct University Admissions & Scholarships',
    titleKz: 'ЖОО Тікелей қабылдауы және Толық Грант',
    titleRu: 'Прямой оффер и 100% Грант от топ-вузов',
    desc: 'Submit verified digital passport to NU, AITU, KBTU direct scholarship fast-track.',
    descKz: 'Расталған цифрлық паспортты Назарбаев Университеті, Astana IT және ҚБТУ комиссиясына жіберу.',
    descRu: 'Отправить верифицированный паспорт в приемные комиссии NU, AITU, КБТУ.',
    status: 'upcoming',
    quests: [
      { id: 'q8', title: 'Generate Anti-Fake QR Passport', titleKz: 'QR Цифрлық Паспортты генерациялау', titleRu: 'Сгенерировать QR Паспорт', done: false, xp: 100 },
      { id: 'q9', title: 'Accept University Direct Offer', titleKz: 'Университет грантын қабылдау', titleRu: 'Принять оффер университета', done: false, xp: 300 },
    ],
  },
]

export function CareerDiagnosticRadar() {
  const { i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const isRu = i18n.language === 'ru'

  const [skills, setSkills] = useState<SkillItem[]>(DEFAULT_SKILLS)
  const [roadmap, setRoadmap] = useState<Milestone[]>(DEFAULT_ROADMAP)
  const [selectedMilestone, setSelectedMilestone] = useState<string>('m2')
  const [isDiagnosing, setIsDiagnosing] = useState(false)
  const [diagnosticResult, setDiagnosticResult] = useState<string | null>(null)

  function runAiDiagnostic() {
    setIsDiagnosing(true)
    setDiagnosticResult(null)

    setTimeout(() => {
      setIsDiagnosing(false)
      setSkills((prev) =>
        prev.map((s) => ({
          ...s,
          score: Math.min(100, s.score + (s.name.includes('Robotics') || s.name.includes('Olympiad') ? 4 : 2)),
        }))
      )
      if (isKz) {
        setDiagnosticResult(
          '🎯 ЖИ Диагностикасы нәтижесі: Сіздің басты бағытыңыз — «Robotics & Intelligent Systems (Мехатроника)». 11 расталған сертификат негізінде дайындық деңгейі 85% құрайды. Ұсынылған мақсатты ЖОО: Nazarbayev University (School of Engineering & Digital Sciences) және Astana IT University (Robotics & Mechatronics).'
        )
      } else if (isRu) {
        setDiagnosticResult(
          '🎯 Результат AI Диагностики: Ваша ключевая траектория — «Robotics & Intelligent Systems». На базе 11 верифицированных сертификатов готовность составляет 85%. Рекомендуемые вузы: Nazarbayev University (SEDS) и Astana IT University (Robotics & Mechatronics).'
        )
      } else {
        setDiagnosticResult(
          '🎯 AI Diagnostic Result: Your key trajectory is "Robotics & Intelligent Systems". Based on 11 verified credentials, your readiness score is 85%. Recommended universities: Nazarbayev University (SEDS) and Astana IT University.'
        )
      }
    }, 800)
  }

  function toggleQuest(milestoneId: string, questId: string) {
    setRoadmap((prev) =>
      prev.map((m) => {
        if (m.id !== milestoneId) return m
        return {
          ...m,
          quests: m.quests.map((q) => (q.id === questId ? { ...q, done: !q.done } : q)),
        }
      })
    )
  }

  const activeM = roadmap.find((m) => m.id === selectedMilestone) || roadmap[1]

  // Calculate SVG radar polygon
  const numAxes = skills.length
  const center = 110
  const radius = 80
  const angleStep = (Math.PI * 2) / numAxes

  const polygonPoints = skills
    .map((skill, index) => {
      const angle = index * angleStep - Math.PI / 2
      const r = (skill.score / 100) * radius
      const x = center + r * Math.cos(angle)
      const y = center + r * Math.sin(angle)
      return `${x},${y}`
    })
    .join(' ')

  const gridCircles = [0.25, 0.5, 0.75, 1.0]

  return (
    <section className="ushqn-card border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
            <Compass className="h-5 w-5 text-[#0052cc]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {isKz
                  ? '1. 🤖 AI Профориентация & 1 жылдық Roadmap'
                  : isRu
                  ? '1. 🤖 AI Профориентация & Roadmap на 1 год'
                  : '1. 🤖 AI-Driven Career Diagnostic & Roadmap'}
              </h2>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                {isKz ? 'Динамикалық ЖИ' : isRu ? 'Динамический AI' : 'Dynamic AI'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isKz
                ? 'Сертификаттар мен белсенділікті талдап, Skill Radar және қадамдық жоспар құрады'
                : isRu
                ? 'Анализирует все сертификаты и строит интерактивный Skill Radar с квестами'
                : 'Analyzes verified certificates and builds dynamic skill radar with step-by-step quests'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={runAiDiagnostic}
          disabled={isDiagnosing}
          className="inline-flex items-center gap-2 rounded-lg bg-[#162a45] px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#0f1d30] disabled:opacity-50"
        >
          <Sparkles className="h-3.5 w-3.5 text-blue-300" />
          <span>
            {isDiagnosing
              ? isKz
                ? 'Талдау жасалуда...'
                : isRu
                ? 'Анализируем...'
                : 'Diagnosing...'
              : isKz
              ? 'ЖИ Диагностикасын жаңарту'
              : isRu
              ? 'Обновить AI Диагностику'
              : 'Run AI Diagnostic'}
          </span>
        </button>
      </div>

      {diagnosticResult && (
        <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50/70 p-3.5 text-xs text-slate-800 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-200">
          <p className="leading-relaxed">{diagnosticResult}</p>
        </div>
      )}

      {/* Grid: Skill Radar (Left) + 1-Year Roadmap (Right) */}
      <div className="mt-5 grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Left: Dynamic Skill Radar */}
        <div className="flex flex-col items-center rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="mb-2 flex w-full items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {isKz ? 'Skill Radar' : isRu ? 'Радар Навыков' : 'Skill Radar'}
            </span>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {isKz ? 'Орташа: 83.5%' : isRu ? 'Средний: 83.5%' : 'Avg: 83.5%'}
            </span>
          </div>

          {/* SVG Radar Chart */}
          <div className="relative flex h-[220px] w-[220px] items-center justify-center">
            <svg width="220" height="220" className="overflow-visible">
              {/* Concentric grid circles */}
              {gridCircles.map((lvl) => (
                <circle
                  key={lvl}
                  cx={center}
                  cy={center}
                  r={radius * lvl}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-slate-200 dark:text-slate-700"
                />
              ))}

              {/* Axis lines */}
              {skills.map((_, index) => {
                const angle = index * angleStep - Math.PI / 2
                const x = center + radius * Math.cos(angle)
                const y = center + radius * Math.sin(angle)
                return (
                  <line
                    key={index}
                    x1={center}
                    y1={center}
                    x2={x}
                    y2={y}
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-slate-200 dark:text-slate-700"
                  />
                )
              })}

              {/* Skill Area Polygon */}
              <polygon
                points={polygonPoints}
                fill="rgba(0, 82, 204, 0.15)"
                stroke="#0052cc"
                strokeWidth="2"
              />

              {/* Points */}
              {skills.map((skill, index) => {
                const angle = index * angleStep - Math.PI / 2
                const r = (skill.score / 100) * radius
                const x = center + r * Math.cos(angle)
                const y = center + r * Math.sin(angle)
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="3.5"
                    fill="#162a45"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                )
              })}
            </svg>
          </div>

          {/* Skill List with progress */}
          <div className="mt-3 w-full space-y-2">
            {skills.map((skill, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  <span className="truncate">{isKz ? skill.nameKz : isRu ? skill.nameRu : skill.name}</span>
                  <span className="font-mono text-slate-900 dark:text-slate-100">{skill.score}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className="h-full rounded-full bg-[#162a45] dark:bg-blue-500 transition-all duration-500"
                    style={{ width: `${skill.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: 1-Year Milestone Roadmap with Interactive Quests */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {isKz ? '1 Жылдық Интерактивті Roadmap' : isRu ? 'Интерактивная Дорожная Карта на 1 год' : '1-Year Interactive Roadmap'}
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {isKz ? '4 тоқсан · 9 негізгі тапсырма' : isRu ? '4 этапа · 9 ключевых квестов' : '4 quarters · 9 key milestones'}
            </span>
          </div>

          {/* Quarter Timeline Navigator Tabs */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {roadmap.map((m) => {
              const isSelected = m.id === selectedMilestone
              const isCompleted = m.status === 'completed'
              const isInProgress = m.status === 'in_progress'

              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMilestone(m.id)}
                  className={`flex flex-col rounded-xl border p-2.5 text-left transition-all ${
                    isSelected
                      ? 'border-[#162a45] bg-[#162a45] text-white shadow-xs dark:border-blue-500 dark:bg-blue-600'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                    <span>{isKz ? m.quarterKz.slice(0, 8) : isRu ? m.quarterRu.slice(0, 8) : m.quarter.slice(0, 8)}</span>
                    {isCompleted ? (
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    ) : isInProgress ? (
                      <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                    ) : (
                      <Circle className="h-2.5 w-2.5 opacity-40" />
                    )}
                  </div>
                  <p className="mt-1 truncate text-xs font-bold">
                    {isKz ? m.titleKz : isRu ? m.titleRu : m.title}
                  </p>
                </button>
              )
            })}
          </div>

          {/* Active Milestone Card */}
          {activeM && (
            <div className="rounded-xl border border-slate-200 bg-white p-4.5 shadow-xs dark:border-slate-700 dark:bg-slate-800/80">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-700">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0052cc] dark:text-blue-400">
                    {isKz ? activeM.quarterKz : isRu ? activeM.quarterRu : activeM.quarter}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {isKz ? activeM.titleKz : isRu ? activeM.titleRu : activeM.title}
                  </h4>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    activeM.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : activeM.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                  }`}
                >
                  {activeM.status === 'completed'
                    ? isKz
                      ? 'Орындалды'
                      : isRu
                      ? 'Завершено'
                      : 'Completed'
                    : activeM.status === 'in_progress'
                    ? isKz
                      ? 'Қазіргі кезең'
                      : isRu
                      ? 'В процессе'
                      : 'In Progress'
                    : isKz
                    ? 'Жоспарланған'
                    : isRu
                    ? 'Запланировано'
                    : 'Upcoming'}
                </span>
              </div>

              <p className="mt-2.5 text-xs text-slate-600 dark:text-slate-300">
                {isKz ? activeM.descKz : isRu ? activeM.descRu : activeM.desc}
              </p>

              {/* Connected Daily Quests */}
              <div className="mt-4 space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {isKz ? 'Байланысты квесттер & тапсырмалар:' : isRu ? 'Связанные квесты этапа:' : 'Connected Stage Quests:'}
                </p>
                <div className="space-y-1.5">
                  {activeM.quests.map((quest) => (
                    <div
                      key={quest.id}
                      onClick={() => toggleQuest(activeM.id, quest.id)}
                      className={`flex cursor-pointer items-center justify-between rounded-lg border p-2.5 text-xs transition hover:border-slate-400 ${
                        quest.done
                          ? 'border-emerald-200 bg-emerald-50/60 text-slate-800 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-slate-200'
                          : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`flex h-4.5 w-4.5 items-center justify-center rounded border transition ${
                            quest.done
                              ? 'border-emerald-600 bg-emerald-600 text-white'
                              : 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-700'
                          }`}
                        >
                          {quest.done && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <span className={quest.done ? 'line-through opacity-70' : 'font-medium'}>
                          {isKz ? quest.titleKz : isRu ? quest.titleRu : quest.title}
                        </span>
                      </div>
                      <span className="rounded bg-slate-200/80 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                        +{quest.xp} XP
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
