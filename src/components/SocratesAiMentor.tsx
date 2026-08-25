import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Brain,
  Send,
  HelpCircle,
  Lightbulb,
  Zap,
  RotateCcw,
  Bot,
  User,
  GraduationCap,
} from 'lucide-react'
import { useToast } from '../lib/toast'

interface ProblemCase {
  id: string
  titleKz: string
  titleRu: string
  subject: 'math' | 'physics' | 'informatics'
  level: string
  statementKz: string
  statementRu: string
  hints: string[]
  socraticSteps: {
    promptKz: string
    promptRu: string
    goodKeywords: string[]
    feedbackKz: string
    feedbackRu: string
  }[]
  finalAnswerKz: string
  finalAnswerRu: string
  xpReward: number
}

const SAMPLE_PROBLEMS: ProblemCase[] = [
  {
    id: 'socr-math-1',
    titleKz: 'Диофант теңдеуі және Модульдік арифметика',
    titleRu: 'Диофантово уравнение и Модульная арифметика',
    subject: 'math',
    level: 'Республикалық олимпиада',
    statementKz: 'x³ + y³ = 2026 теңдеуінің бүтін сандардағы шешімдерін табыңыз немесе шешімі жоқ екенін дәлелдеңіз.',
    statementRu: 'Найдите все решения уравнения x³ + y³ = 2026 в целых числах или докажите, что решений нет.',
    hints: [
      'Кубтардың белгілі бір модуль бойынша қалдықтарын қарастырып көрдіңіз бе?',
      'Модуль 9 немесе модуль 7 бойынша кубтар қандай қалдық береді?',
    ],
    socraticSteps: [
      {
        promptKz: 'Кез келген бүтін санның кубын 9-ға бөлгенде қандай қалдықтар қалуы мүмкін? (Тексеріп көр: 0³, 1³, 2³, 3³... mod 9)',
        promptRu: 'Какие остатки может давать куб любого целого числа при делении на 9? (Проверьте: 0³, 1³, 2³, 3³... mod 9)',
        goodKeywords: ['0', '1', '-1', '8', '0, 1, 8', '0, 1, -1'],
        feedbackKz: 'Өте дұрыс! n³ ≡ 0, 1 немесе 8 (яғни -1) (mod 9). Енді осы екі кубтың қосындысын қарастырайық.',
        feedbackRu: 'Верно! n³ ≡ 0, 1 или 8 (т.е. -1) (mod 9). Теперь посмотрим на сумму двух кубов.',
      },
      {
        promptKz: 'Олай болса, x³ + y³ қосындысы 9-ға бөлгенде қандай қалдықтар бере алады? Және 2026 санының 9-ға бөлгендегі қалдығы қанша?',
        promptRu: 'Тогда какие остатки может давать x³ + y³ по модулю 9? И какой остаток дает само число 2026 при делении на 9?',
        goodKeywords: ['1', '2026', 'цифр', '10', 'қалдық 1', 'остаток 1', 'қосындысы 10'],
        feedbackKz: 'Керемет! 2 + 0 + 2 + 6 = 10 ≡ 1 (mod 9). Бірақ екі куб қосындысынан 1 шығу үшін біреуі 0, біреуі 1 болуы керек.',
        feedbackRu: 'Отлично! Сумма цифр 2026 равна 10 ≡ 1 (mod 9). Значит, один из кубов делится на 9 (т.е. на 3).',
      },
    ],
    finalAnswerKz: 'Модуль 9 және 7 бойынша зерттегенде, x пен y сандары бүтін шешім бермейтіні дәлелденді.',
    finalAnswerRu: 'Доказано отсутствие целых решений методом сравнений по модулю 9 и 7.',
    xpReward: 350,
  },
  {
    id: 'socr-algo-2',
    titleKz: 'Екі көрсеткіш (Two Pointers) & Субмассив қосындысы',
    titleRu: 'Два указателя (Two Pointers) и сумма подмассива',
    subject: 'informatics',
    level: 'ICPC / IOI Sprint',
    statementKz: 'Оң сандардан тұратын массивте қосындысы дәл K-ға тең болатын ең қысқа субмассивті O(N) уақытта қалай табамыз?',
    statementRu: 'Как найти кратчайший непрерывный подмассив с суммой равной K за время O(N) в массиве положительных чисел?',
    hints: [
      'Массив тек оң сандардан тұрғандықтан, терезе өлшемін ұлғайтқанда қосынды қалай өзгереді?',
      'Жылжымалы терезе (Sliding Window) немесе Two Pointers әдісін есіңе түсір.',
    ],
    socraticSteps: [
      {
        promptKz: 'Егер ағымдағы терезе қосындысы (current_sum) K-дан асып кетсе, қандай әрекет жасаймыз?',
        promptRu: 'Если текущая сумма окна превышает K, какое действие нужно предпринять?',
        goodKeywords: ['сол', 'left', 'азайту', 'шегеру', 'сдвиг', 'left++', 'арттыру'],
        feedbackKz: 'Дәл солай! Сол жақ көрсеткішті (left++) жылжытып, терезе қосындысы K-дан кем немесе тең болғанша элементтерді шегереміз.',
        feedbackRu: 'Именно! Сдвигаем левый указатель (left++) вправо, пока сумма не станет меньше либо равной K.',
      },
    ],
    finalAnswerKz: 'Two Pointers әдісімен әр элемент терезеге ең көп дегенде бір рет кіріп, бір рет шығады. Күрделілігі: O(N).',
    finalAnswerRu: 'Алгоритм скользящего окна решает задачу строго за O(N) по времени и O(1) по памяти.',
    xpReward: 300,
  },
]

export function SocratesAiMentor() {
  const { i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const { toast } = useToast()

  const [selectedProblem, setSelectedProblem] = useState<ProblemCase>(SAMPLE_PROBLEMS[0])
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [userReply, setUserReply] = useState('')
  const [messages, setMessages] = useState<
    { sender: 'mentor' | 'student'; text: string; time: string }[]
  >([
    {
      sender: 'mentor',
      text: isKz
        ? `Сәлем, жас ғалым! 🦉 Мен сенің Сократтық AI Менторыңмын. Мен саған дайын жауапты айтпаймын, бірақ жетекші сұрақтар арқылы шешімді өзің табуыңа көмектесемін.\n\nТапсырма: "${SAMPLE_PROBLEMS[0].statementKz}"\n\nАлғашқы қадам: ${SAMPLE_PROBLEMS[0].socraticSteps[0].promptKz}`
        : `Привет! 🦉 Я твой Сократический AI Ментор. Я не даю готовых ответов, а помогаю дойти до сути самостоятельно через логические наводящие вопросы.\n\nЗадача: "${SAMPLE_PROBLEMS[0].statementRu}"\n\nПервый шаг: ${SAMPLE_PROBLEMS[0].socraticSteps[0].promptRu}`,
      time: '12:00',
    },
  ])
  const [isCompleted, setIsCompleted] = useState(false)
  const [showHintIndex, setShowHintIndex] = useState(0)

  const handleSelectProblem = (prob: ProblemCase) => {
    setSelectedProblem(prob)
    setCurrentStepIndex(0)
    setIsCompleted(false)
    setShowHintIndex(0)
    setMessages([
      {
        sender: 'mentor',
        text: isKz
          ? `Жаңа тапсырма таңдалды: "${prob.titleKz}".\n\nШарт: ${prob.statementKz}\n\nСұрақ: ${prob.socraticSteps[0].promptKz}`
          : `Выбрана новая задача: "${prob.titleRu}".\n\nУсловие: ${prob.statementRu}\n\nВопрос: ${prob.socraticSteps[0].promptRu}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ])
  }

  const handleSendMessage = () => {
    if (!userReply.trim()) return

    const studentText = userReply.trim()
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    const newMessages = [
      ...messages,
      { sender: 'student' as const, text: studentText, time: nowTime },
    ]
    setMessages(newMessages)
    setUserReply('')

    const step = selectedProblem.socraticSteps[currentStepIndex]
    const isStepPassed = step.goodKeywords.some((kw) =>
      studentText.toLowerCase().includes(kw.toLowerCase()),
    ) || studentText.length > 10

    setTimeout(() => {
      if (isStepPassed) {
        const feedback = isKz ? step.feedbackKz : step.feedbackRu
        if (currentStepIndex + 1 < selectedProblem.socraticSteps.length) {
          const nextStep = selectedProblem.socraticSteps[currentStepIndex + 1]
          const nextPrompt = isKz ? nextStep.promptKz : nextStep.promptRu
          setMessages((prev) => [
            ...prev,
            {
              sender: 'mentor',
              text: `${feedback}\n\nКелесі сұрақ: ${nextPrompt}`,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ])
          setCurrentStepIndex((prev) => prev + 1)
        } else {
          setIsCompleted(true)
          const finalAns = isKz ? selectedProblem.finalAnswerKz : selectedProblem.finalAnswerRu
          setMessages((prev) => [
            ...prev,
            {
              sender: 'mentor',
              text: `🎉 Керемет! Сен есептің шешімін толықтай өз бетіңмен таптың!\n\n💡 Түйін: ${finalAns}\n\n+${selectedProblem.xpReward} XP саған берілді!`,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ])
          toast(
            isKz
              ? `🔥 Жеңіс! Сократ менторымен есеп шығарылды: +${selectedProblem.xpReward} XP`
              : `🔥 Задача решена в Сократическом диалоге: +${selectedProblem.xpReward} XP!`,
          )
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'mentor',
            text: isKz
              ? 'Жақсы ой, бірақ тағы да тереңірек қарап көрейік. Мысалы, кішігірім сандармен сынап көрдің бе?'
              : 'Интересная мысль, но попробуй посмотреть глубже. Попробуй проверить на малых числах!',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ])
      }
    }, 600)
  }

  return (
    <div className="space-y-5">
      {/* Header Info */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 p-6 text-white shadow-xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 backdrop-blur-md">
              <Brain className="h-3.5 w-3.5 text-emerald-400" />
              <span>{isKz ? 'Сократтық AI Ментор (Socrates Mode)' : 'Сократический AI Ментор'}</span>
              <span className="rounded bg-emerald-500/30 px-1.5 py-0.5 text-[10px] font-black text-emerald-200">
                NO SPOILERS
              </span>
            </div>
            <h2 className="text-xl font-black tracking-tight sm:text-2xl">
              {isKz ? 'Олимпиадалық Есептерді Өз Бетіңмен Шеш' : 'Решение Олимпиадных Задач без Подсказок'}
            </h2>
            <p className="max-w-xl text-xs text-emerald-100/80 sm:text-sm">
              {isKz
                ? 'AI сізге дайын жауап бермейді. Ол эвристикалық сұрақтар мен логикалық қадамдар арқылы олимпиадалық есептердің шешімін өзіңіз табуға жетелейді.'
                : 'ИИ не спойлерит готовые решения, а тренирует критическое и олимпиадное мышление через сократический диалог.'}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md">
            <div className="flex items-center justify-center gap-1.5 text-emerald-400">
              <Zap className="h-5 w-5 fill-emerald-400" />
              <span className="text-xl font-black">+{selectedProblem.xpReward} XP</span>
            </div>
            <span className="text-[10px] font-bold uppercase text-slate-300">
              {isKz ? 'Әр есепке сыйлық' : 'Награда за решение'}
            </span>
          </div>
        </div>
      </div>

      {/* Problem Selector Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-500">{isKz ? 'Есептер банкі:' : 'Банк задач:'}</span>
        {SAMPLE_PROBLEMS.map((p) => {
          const isSelected = selectedProblem.id === p.id
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => handleSelectProblem(p)}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
              }`}
            >
              {isKz ? p.titleKz : p.titleRu}
            </button>
          )
        })}
      </div>

      {/* Socratic Dialogue Card */}
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        {/* Chat Stream */}
        <div className="flex flex-col h-[520px] rounded-2xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                🦉
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {isKz ? 'Сократ Ұстаз (AI Coach)' : 'Сократ Учитель (AI)'}
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  {isKz ? 'Диалог үстінде · Белсенді' : 'В диалоге · Онлайн'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSelectProblem(selectedProblem)}
              className="inline-flex items-center gap-1 rounded-lg p-1.5 text-xs text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
              title={isKz ? 'Қайта бастау' : 'Начать заново'}
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, idx) => {
              const isMe = m.sender === 'student'
              return (
                <div
                  key={idx}
                  className={`flex gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  {!isMe && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      isMe
                        ? 'bg-emerald-600 text-white shadow-2xs font-medium'
                        : 'border border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-200 whitespace-pre-line'
                    }`}
                  >
                    {m.text}
                    <div
                      className={`mt-1 text-[9px] ${
                        isMe ? 'text-emerald-200 text-right' : 'text-slate-400'
                      }`}
                    >
                      {m.time}
                    </div>
                  </div>

                  {isMe && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      <User className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Input Bar */}
          <div className="border-t border-slate-100 p-3 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={userReply}
                disabled={isCompleted}
                onChange={(e) => setUserReply(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage()
                }}
                placeholder={
                  isCompleted
                    ? isKz
                      ? 'Есеп сәтті шешілді!'
                      : 'Задача успешно решена!'
                    : isKz
                    ? 'Ойыңызды немесе жауап қадамыңызды жазыңыз...'
                    : 'Напишите свой логический шаг или гипотезу...'
                }
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <button
                type="button"
                disabled={isCompleted || !userReply.trim()}
                onClick={handleSendMessage}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs transition hover:bg-emerald-700 disabled:opacity-50 active:scale-95"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar: Hints & Problem Specs */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
              <GraduationCap className="h-4 w-4 text-emerald-600" />
              <span>{isKz ? 'Есептің төлқұжаты' : 'Паспорт задачи'}</span>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-1.5 dark:border-slate-800">
                <span className="text-slate-400">{isKz ? 'Деңгей:' : 'Уровень:'}</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {selectedProblem.level}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5 dark:border-slate-800">
                <span className="text-slate-400">{isKz ? 'Санат:' : 'Предмет:'}</span>
                <span className="font-bold text-emerald-600 uppercase">
                  {selectedProblem.subject}
                </span>
              </div>
            </div>
          </div>

          {/* Hint Cards */}
          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
            <div className="flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-300">
              <div className="flex items-center gap-1.5">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                <span>{isKz ? 'Эвристикалық Көмек' : 'Эвристические подсказки'}</span>
              </div>
              <span className="text-[10px] text-amber-700 dark:text-amber-400">
                {showHintIndex}/{selectedProblem.hints.length}
              </span>
            </div>

            <p className="mt-2 text-xs text-amber-900/80 dark:text-amber-200 leading-relaxed">
              {showHintIndex === 0
                ? isKz
                  ? 'Егер тұйыққа тірелсеңіз, қосымша жетекші көмек ашыңыз.'
                  : 'Если зашли в тупик, откройте промежуточную подсказку.'
                : selectedProblem.hints[showHintIndex - 1]}
            </p>

            {showHintIndex < selectedProblem.hints.length && (
              <button
                type="button"
                onClick={() => setShowHintIndex((prev) => prev + 1)}
                className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-amber-300 bg-white py-2 text-xs font-bold text-amber-900 shadow-2xs hover:bg-amber-50 dark:border-amber-800 dark:bg-slate-900 dark:text-amber-300"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                <span>{isKz ? 'Келесі көмекті ашу' : 'Открыть подсказку'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
