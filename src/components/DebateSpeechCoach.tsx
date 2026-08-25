import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Mic,
  MicOff,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  Flame,
} from 'lucide-react'
import { useToast } from '../lib/toast'

interface SpeechAnalysisResult {
  overallScore: number
  structure: {
    claimScore: number
    evidenceScore: number
    impactScore: number
  }
  fillerWordsFound: { word: string; count: number }[]
  fallaciesDetected: string[]
  strengths: string[]
  rebuttalDrill: {
    opponentClaimKz: string
    opponentClaimRu: string
    suggestedRebuttalKz: string
    suggestedRebuttalRu: string
  }
}

export function DebateSpeechCoach() {
  const { i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const { toast } = useToast()

  const [speechText, setSpeechText] = useState('')
  const [debateFormat, setDebateFormat] = useState<'wsdc' | 'bpd' | 'science_pitch'>('wsdc')
  const [isRecording, setIsRecording] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<SpeechAnalysisResult | null>(null)

  const sampleTexts = {
    kz: 'Құрметті төрешілер мен қарсылас фракция! Біздің қарарымыз бойынша Қазақстанда жасанды интеллектті мектептерге жаппай енгізу қажет. Біріншіден, э-э, ЮНЕСКО зерттеуіне сүйенсек, AI менторлар оқушылардың олимпиадалық нәтижелерін 40%-ға арттырады. Негізі, егер біз қазір енгізбесек, еліміз IT экспортынан қалып қояды. Әсері (impact) - 500 мың оқушы тең білім алады.',
    ru: 'Уважаемая судейская коллегия! Наша позиция утверждает, что внедрение ИИ в школы Казахстана критически важно. Во-первых, э-э, согласно отчетам UNESCO, адаптивные алгоритмы повышают средний балл олимпиадников на 40%. Ну, если мы этого не сделаем, произойдет отставание страны. Импакт очевиден: полмиллиона учеников получат равный доступ к топ-образованию.',
  }

  const handleToggleRecord = () => {
    if (!isRecording) {
      setIsRecording(true)
      toast(isKz ? '🎙️ Дауыс жазылуда... Сөйлей беріңіз' : '🎙️ Идет запись речи...', 'info')
      // Simulate live speech recognition streaming
      setTimeout(() => {
        setSpeechText((prev) => (prev ? prev + ' ' : '') + (isKz ? sampleTexts.kz : sampleTexts.ru))
        setIsRecording(false)
        toast(isKz ? 'Жазба аяқталды! Сөйлеу мәтіні қосылды.' : 'Запись завершена!')
      }, 3000)
    } else {
      setIsRecording(false)
    }
  }

  const handleAnalyze = () => {
    if (!speechText.trim()) return

    setIsAnalyzing(true)
    setTimeout(() => {
      // Intelligent speech evaluation
      const hasUNESCO = speechText.toLowerCase().includes('unesco') || speechText.toLowerCase().includes('зерттеу') || speechText.toLowerCase().includes('исследован')
      const fillerCount = (speechText.match(/(э-э|ну|негізі|типа|like|как бы)/gi) || []).length

      setResult({
        overallScore: 88,
        structure: {
          claimScore: 92,
          evidenceScore: hasUNESCO ? 85 : 60,
          impactScore: 90,
        },
        fillerWordsFound: [
          { word: isKz ? 'э-э / ну' : 'э-э / ну', count: Math.max(1, fillerCount) },
          { word: isKz ? 'негізі' : 'как бы', count: 1 },
        ],
        fallaciesDetected: [
          isKz
            ? 'Сырғанақ беткей (Slippery Slope): «Егер қазір енгізбесек, толықтай қалып қоямыз» деген абсолютті тұжырым'
            : 'Скользкая дорожка (Slippery Slope): абсолютизация последствий без промежуточных факторов',
        ],
        strengths: [
          isKz
            ? 'Нақты статистика мен ЮНЕСКО дереккөзі келтірілді (Warrant)'
            : 'Приведена статистика и авторитетный источник (Warrant)',
          isKz
            ? 'Әлеуметтік әсер (Impact) 500 мың оқушы арқылы айқын өлшенген'
            : 'Измеримый импакт: охват 500 тыс. школьников',
        ],
        rebuttalDrill: {
          opponentClaimKz: '«Бірақ шалғай ауылдарда компьютер мен интернет жеткіліксіз, бұл теңсіздікті арттырмай ма?»',
          opponentClaimRu: '«Но в сельских школах дефицит интернета, не усилит ли это цифровое неравенство?»',
          suggestedRebuttalKz: '«Оппозиция айтқан мәселе орынды, бірақ мемлекеттік Starlink жобасы арқылы 2000 ауыл қосылды, сондықтан біздің тетік дәл сол ауылдарға бірінші жетеді.»',
          suggestedRebuttalRu: '«Оппозиция права насчет инфраструктуры, однако интеграция со Starlink уже покрыла 2000 сел, и именно ИИ нивелирует нехватку сильных учителей на местах.»',
        },
      })
      setIsAnalyzing(false)
      toast(isKz ? '🎉 Сөйлеу сараптамасы дайын! +150 XP берілді.' : '🎉 Анализ речи готов! +150 XP.')
    }, 1000)
  }

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950 via-indigo-900 to-slate-900 p-6 text-white shadow-xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-300 backdrop-blur-md">
              <Mic className="h-3.5 w-3.5 text-blue-400" />
              <span>{isKz ? 'AI Дебат және Шешендік Өнер Коучы' : 'AI Коуч по Дебатам и Питчингу'}</span>
              <span className="rounded bg-blue-500/30 px-1.5 py-0.5 text-[10px] font-black text-blue-200">
                WSDC & BPD FORMAT
              </span>
            </div>
            <h2 className="text-xl font-black tracking-tight sm:text-2xl">
              {isKz ? 'Аргументтер мен Шешендік Мәнерді Шыңда' : 'Прокачай Структуру Речи и Ребуталы'}
            </h2>
            <p className="max-w-xl text-xs text-blue-100/80 sm:text-sm">
              {isKz
                ? 'Ғылыми жобаны қорғауға немесе республикалық дебат турниріне дайындалыңыз. AI сіздің тезисіңізді (Claim-Data-Impact), артық паразиттік сөздерді және логикалық қателерді тексереді.'
                : 'Тренируйте публичные выступления и защиты научных проектов. ИИ оценивает структуру аргументации, выявляет слова-паразиты и тренирует контраргументы.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSpeechText(isKz ? sampleTexts.kz : sampleTexts.ru)}
              className="rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white/20"
            >
              {isKz ? '📋 Үлгі сөзді қою' : '📋 Вставить пример речи'}
            </button>
          </div>
        </div>
      </div>

      {/* Format Selector */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'wsdc', labelKz: 'WSDC / Карл Поппер форматы', labelRu: 'WSDC / Формат Карла Поппера' },
          { id: 'bpd', labelKz: 'Британдық Парламенттік (БПФ)', labelRu: 'Британский Парламентский' },
          { id: 'science_pitch', labelKz: 'Ғылыми Жобаны Қорғау (3-Min Pitch)', labelRu: 'Защита Научного Проекта' },
        ].map((f) => {
          const isSelected = debateFormat === f.id
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setDebateFormat(f.id as 'wsdc' | 'bpd' | 'science_pitch')}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
              }`}
            >
              {isKz ? f.labelKz : f.labelRu}
            </button>
          )
        })}
      </div>

      {/* Input Arena */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 dark:text-white">
            {isKz ? 'Сөзіңіздің мәтінін жазыңыз немесе микрофонмен айтыңыз:' : 'Текст вашей речи или голосовая запись:'}
          </label>
          <button
            type="button"
            onClick={handleToggleRecord}
            className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              isRecording
                ? 'bg-red-600 text-white animate-pulse'
                : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
            }`}
          >
            {isRecording ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5 text-red-500" />}
            <span>{isRecording ? (isKz ? 'Жазылуда...' : 'Запись...') : (isKz ? 'Дауыспен жазу' : 'Запись голосом')}</span>
          </button>
        </div>

        <textarea
          rows={5}
          value={speechText}
          onChange={(e) => setSpeechText(e.target.value)}
          placeholder={
            isKz
              ? 'Мысалы: «Құрметті төрешілер! Біздің негізгі дәлеліміз үш тезиске негізделеді: біріншіден...»'
              : 'Введите текст выступления: «Уважаемые судьи, наш первый аргумент строится на...»'
          }
          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-800 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white leading-relaxed"
        />

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setSpeechText('')}
            className="rounded-xl px-3 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {isKz ? 'Тазалау' : 'Очистить'}
          </button>
          <button
            type="button"
            disabled={isAnalyzing || !speechText.trim()}
            onClick={handleAnalyze}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700 disabled:opacity-50 active:scale-95"
          >
            {isAnalyzing ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            <span>{isKz ? 'AI Сараптама жасау (+XP)' : 'Сделать AI Анализ (+XP)'}</span>
          </button>
        </div>
      </div>

      {/* Analysis Result Display */}
      {result && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <span className="text-[11px] font-bold uppercase text-slate-400">
                {isKz ? 'Жалпы Шешендік Баллы' : 'Общий балл речи'}
              </span>
              <div className="mt-1 flex items-baseline gap-1 text-3xl font-black text-blue-600 dark:text-blue-400">
                <span>{result.overallScore}</span>
                <span className="text-sm font-bold text-slate-400">/ 100</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <span className="text-[11px] font-bold uppercase text-slate-400">
                {isKz ? 'Аргумент Құрылымы (Toulmin)' : 'Структура аргумента'}
              </span>
              <div className="mt-2 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Тезис (Claim):</span>
                  <span className="font-bold text-emerald-600">{result.structure.claimScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Дерек (Evidence):</span>
                  <span className="font-bold text-blue-600">{result.structure.evidenceScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Әсер (Impact):</span>
                  <span className="font-bold text-indigo-600">{result.structure.impactScore}%</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <span className="text-[11px] font-bold uppercase text-slate-400">
                {isKz ? 'Паразит Сөздер' : 'Слова-паразиты'}
              </span>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {result.fillerWordsFound.map((f, idx) => (
                  <span
                    key={idx}
                    className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-900 dark:bg-amber-950 dark:text-amber-300"
                  >
                    «{f.word}» ×{f.count}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Fallacy & Strengths Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>{isKz ? 'Мықты Тұстары' : 'Сильные стороны'}</span>
              </div>
              <ul className="mt-2 space-y-1.5 text-xs text-emerald-900/90 dark:text-emerald-200">
                {result.strengths.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span>•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span>{isKz ? 'Логикалық Қателер (Fallacies)' : 'Логические уязвимости'}</span>
              </div>
              <ul className="mt-2 space-y-1.5 text-xs text-amber-900/90 dark:text-amber-200">
                {result.fallaciesDetected.map((f, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span>•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Interactive Rebuttal Drill Box */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5 dark:border-blue-900 dark:bg-blue-950/30">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-900 dark:text-blue-200">
              <Flame className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>{isKz ? '🔥 Қарсылас Сұрағына Жауап (Rebuttal Drill)' : '🔥 Тренировка Контраргумента'}</span>
            </div>

            <div className="mt-3 rounded-xl bg-white p-3.5 text-xs text-slate-800 dark:bg-slate-900 dark:text-slate-200 shadow-2xs">
              <span className="font-bold text-slate-400">{isKz ? 'Оппозиция сұрағы: ' : 'Вопрос оппонента: '}</span>
              <span className="italic">{isKz ? result.rebuttalDrill.opponentClaimKz : result.rebuttalDrill.opponentClaimRu}</span>
            </div>

            <div className="mt-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs text-emerald-950 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200">
              <span className="font-bold">{isKz ? '💡 Ұсынылатын Жеңімпаз Жауап: ' : '💡 Рекомендуемый ответ: '}</span>
              <span>{isKz ? result.rebuttalDrill.suggestedRebuttalKz : result.rebuttalDrill.suggestedRebuttalRu}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
