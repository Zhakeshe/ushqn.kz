import { useEffect, useMemo, useRef, useState } from 'react'
import { captureReferralFromHref } from '../lib/referral'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import type { Variants } from 'framer-motion'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Bot,
  Building2,
  CheckCircle2,
  ChevronDown,
  FileCheck,
  Globe,
  GraduationCap,
  HeartHandshake,
  Layers,
  QrCode,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Zap,
  Sun,
  Moon,
  Send,
  BookOpen,
  X,
} from 'lucide-react'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const LANGS = [
  { code: 'kk', label: 'Қаз', full: 'Қазақша' },
  { code: 'ru', label: 'Рус', full: 'Русский' },
  { code: 'en', label: 'Eng', full: 'English' },
]

function StatCounter({ n, suffix, label }: { n: number; suffix: string; label: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const end = n
    const duration = 1200
    const stepTime = 16
    const totalSteps = duration / stepTime
    const increment = Math.ceil(end / totalSteps)

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, stepTime)
    return () => clearInterval(timer)
  }, [n])

  return (
    <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
      <div className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
        {count > 999 ? `${(count / 1000).toFixed(1)}k` : count}
        <span className="text-indigo-600 dark:text-indigo-400">{suffix}</span>
      </div>
      <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </div>
    </div>
  )
}

export function LandingPage() {
  const { t, i18n } = useTranslation()
  const { session, loading: authLoading } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const [selectedTrajectory, setSelectedTrajectory] = useState<'it' | 'robotics' | 'med' | 'business'>('robotics')
  const [searchQuery, setSearchQuery] = useState('')
  const [aiAssistantModal, setAiAssistantModal] = useState(false)
  const [aiResponseText, setAiResponseText] = useState('')
  const [isAiGenerating, setIsAiGenerating] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof document !== 'undefined') {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
  }, [])

  function toggleDark() {
    const next = !isDark
    setIsDark(next)
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', next)
    }
  }

  function handleAiSearchSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault()
    if (!searchQuery.trim()) {
      setSearchQuery(i18n.language === 'kk' ? 'Робототехника және IT бойынша 1 жылдық Roadmap' : 'Робототехника и IT роадмап на грант')
    }
    setAiAssistantModal(true)
    setIsAiGenerating(true)
    setTimeout(() => {
      setIsAiGenerating(false)
      if (i18n.language === 'kk') {
        setAiResponseText(
          '✨ USHQN AI Карьералық Ментор ұсынысы:\n\n1. Бағыт: «Robotics & Mechatronics Engineering (Академиялық грант)»\n2. Ұсынылатын қадамдар:\n   • C++ және Arduino базасын растау (+450 XP)\n   • NIS/Daryn облыстық олимпиадасына қатысу\n   • Astana IT University & Nazarbayev University direct grant квотасын алу\n\n🎯 Толық картаны өз профиліңізде сақтау үшін платформаға өтіңіз.'
        )
      } else {
        setAiResponseText(
          '✨ Рекомендация USHQN AI Карьерного Ментора:\n\n1. Направление: «Robotics & Mechatronics Engineering (Грант)»\n2. Ключевые шаги:\n   • Верификация навыков C++ и схемотехники (+450 XP)\n   • Участие в олимпиаде Daryn/WRO\n   • Получение прямого гранта от Astana IT University / NU\n\n🎯 Перейдите в профиль, чтобы закрепить персональный план.'
        )
      }
    }, 600)
  }

  useEffect(() => {
    captureReferralFromHref(window.location.href)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ushqn.vercel.app'
  const canonicalUrl = useMemo(() => `${origin}/`, [origin])
  const currentLang = LANGS.find((l) => l.code === i18n.language) ?? LANGS[1]

  // 4 Core Startup Pillars based on USHQN Business Concept
  const corePillars = [
    {
      icon: QrCode,
      tag: 'Pillar 1 · Verification',
      title: i18n.language === 'kk' ? 'Расталған Цифрлық Портфолио' : i18n.language === 'en' ? 'Verified Digital Portfolio' : 'Верифицированное Цифровое Портфолио',
      desc: i18n.language === 'kk'
        ? 'Барлық дипломдар, жобалар мен сертификаттар anti-fake тексеруден өтіп, QR-кодты ресми Цифрлық Паспортқа жиналады.'
        : i18n.language === 'en'
        ? 'All diplomas, projects and certificates pass anti-fake verification and consolidate into a QR-code Digital Passport.'
        : 'Все дипломы, проекты и сертификаты проходят верификацию и формируют единый QR-паспорт таланта.',
      badge: 'Anti-Fake & ATS Ready',
      color: 'from-blue-600 to-indigo-600',
    },
    {
      icon: Bot,
      tag: 'Pillar 2 · AI Mentor',
      title: i18n.language === 'kk' ? 'AI-Driven Карьералық Ментор' : i18n.language === 'en' ? 'AI-Driven Career Mentor' : 'AI-Карьерный Ментор и Роадмап',
      desc: i18n.language === 'kk'
        ? 'ЖИ-модель дағдыларды (88% Mechatronics/IT) талдап, ЖОО грантына жетудің қадамдық жеке Roadmap-ін (IELTS, SAT, хакатондар) сызады.'
        : i18n.language === 'en'
        ? 'AI analyzes skill profiles and creates personalized step-by-step roadmaps toward university grants and career trajectories.'
        : 'ИИ диагностирует навыки и строит персональный пошаговый роадмап поступления на грант (IELTS, ҰБТ, хакатоны).',
      badge: 'Smart Direction Engine',
      color: 'from-indigo-600 to-violet-600',
    },
    {
      icon: Trophy,
      tag: 'Pillar 3 · Gamification',
      title: i18n.language === 'kk' ? 'RPG Геймификация & XP' : i18n.language === 'en' ? 'RPG Gamification & XP' : 'RPG-Геймификация и XP Рейтинг',
      desc: i18n.language === 'kk'
        ? 'Білім алу мен өсу ойынға айналады: Level 1-ден Level 50-ге дейін өсіп, мектеп, қала және республикалық көшбасшылар тақтасында жарысыңыз.'
        : i18n.language === 'en'
        ? 'Learning turns into an RPG journey: advance from Level 1 to 50 and compete on school, city, and national leaderboards.'
        : 'Развитие как игра: прокачивайте уровень от Level 1 до 50, выполняйте квесты и поднимайтесь в республиканском рейтинге.',
      badge: 'Levels 1–50 & Quests',
      color: 'from-amber-500 to-orange-600',
    },
    {
      icon: Building2,
      tag: 'Pillar 4 · B2B & Grants',
      title: i18n.language === 'kk' ? 'ЖОО мен Демеушілер Биржасы' : i18n.language === 'en' ? 'Universities & Grant Marketplace' : 'Биржа Университетов и Грантов',
      desc: i18n.language === 'kk'
        ? 'Университеттер мен қорлар тестілеу нәтижесін күтпей-ақ, талантты практиктерге тікелей ішкі гранттар (Direct Offer) ұсынады.'
        : i18n.language === 'en'
        ? 'Universities and scholarship funds scout verified talent and send Direct Grant Offers before standard graduation exams.'
        : 'Вузы и грантовые фонды находят таланты по фильтрам навыков и отправляют прямые офферы на гранты и стипендии.',
      badge: 'Direct Grant Offers',
      color: 'from-emerald-600 to-teal-600',
    },
  ]

  // Value proposition by persona (B2C, B2B, B2G)
  const personas = [
    {
      role: i18n.language === 'kk' ? 'Оқушыларға (7–11 сынып)' : i18n.language === 'en' ? 'Students (Grades 7–11)' : 'Школьникам (7–11 классы)',
      icon: GraduationCap,
      color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:bg-indigo-950/40 dark:text-indigo-400',
      bullets: [
        i18n.language === 'kk' ? '11 жылдық еңбек пен жобалар 1 QR-паспортта' : 'Все дипломы и проекты в одном QR-паспорте',
        i18n.language === 'kk' ? 'ЖИ-бағыттау және грантқа қадамдық Roadmap' : 'Персональный AI-роадмап для грантов и олимпиад',
        i18n.language === 'kk' ? 'XP жинау, RPG деңгейлер және ұлттық рейтинг' : 'RPG-уровни (1-50 Lvl), миссии и республиканский рейтинг',
      ],
    },
    {
      role: i18n.language === 'kk' ? 'Ата-аналарға' : i18n.language === 'en' ? 'Parents' : 'Родителям',
      icon: HeartHandshake,
      color: 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-950/40 dark:text-blue-400',
      bullets: [
        i18n.language === 'kk' ? 'Баланың нақты дағдысы мен бейіміне сенімділік' : 'Четкое понимание способностей и интересов ребенка',
        i18n.language === 'kk' ? 'Бос курстар мен репетиторларға ақша шығындамау' : 'Экономия на неэффективных курсах за счет точной аналитики',
        i18n.language === 'kk' ? 'Академиялық және карьералық өсуді тікелей бақылау' : 'Прозрачный трекинг прогресса и подготовки к ЖОО/вузам',
      ],
    },
    {
      role: i18n.language === 'kk' ? 'ЖОО және Мектептерге (B2B)' : i18n.language === 'en' ? 'Universities & Schools (B2B)' : 'Вузам и Школам (B2B)',
      icon: Building2,
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-400',
      bullets: [
        i18n.language === 'kk' ? 'Дарынды практик оқушыларды алдын-ала тарту' : 'Рекрутинг сильных абитуриентов до сдачи ЕНТ/экзаменов',
        i18n.language === 'kk' ? 'Тікелей гранттар мен стипендия ұсыну (Direct Offer)' : 'Прямая выдача образовательных грантов и стажировок',
        i18n.language === 'kk' ? 'Мектептік желілерге арналған бірыңғай дашборд' : 'Школьный дашборд аналитики успеваемости и талантов',
      ],
    },
    {
      role: i18n.language === 'kk' ? 'Қорлар мен Мемлекетке (B2G)' : i18n.language === 'en' ? 'Funds & Sponsors (B2G)' : 'Фондам и Государству (B2G)',
      icon: Sparkles,
      color: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-950/40 dark:text-amber-400',
      bullets: [
        i18n.language === 'kk' ? 'Өңірлік таланттар мен STEM дағдылар Big Data-сы' : 'Big Data аналитика кадрового потенциала регионов',
        i18n.language === 'kk' ? 'Ашық және әділ корпоративтік гранттар операторы' : 'Прозрачный оператор корпоративных грантов и стипендий',
        i18n.language === 'kk' ? 'Елдегі адами капитал сапасын ерте жастан арттыру' : 'Системное развитие человеческого капитала со школы',
      ],
    },
  ]

  const trajectoryData = {
    robotics: {
      title: i18n.language === 'kk' ? 'Робототехника және Mechatronics' : 'Робототехника и Mechatronics',
      score: '94% Match',
      steps: [
        { grade: '8-9 сынып', task: 'C++, Arduino & облыстық робототехника жарысы (+450 XP)' },
        { grade: '10 сынып', task: 'IELTS 6.5+ дайындық және халықаралық WRO хакатоны (+800 XP)' },
        { grade: '11 сынып', task: 'Расталған портфолиомен шетелдік және жергілікті ЖОО грантына Direct Offer' },
      ],
    },
    it: {
      title: i18n.language === 'kk' ? 'Бағдарламалау & AI Engineering' : 'IT & AI Engineering',
      score: '91% Match',
      steps: [
        { grade: '8-9 сынып', task: 'Python, веб-әзірлеу және GitHub-қа 2 дербес жоба жүктеу (+400 XP)' },
        { grade: '10 сынып', task: 'Республикалық олимпиада, алгоритмдер және IT стажировка (+900 XP)' },
        { grade: '11 сынып', task: 'ТОП IT-университеттер мен Astana Hub серіктестерінен грант' },
      ],
    },
    med: {
      title: i18n.language === 'kk' ? 'Биомедицина & BioTech' : 'Биомедицина и Биотехнологии',
      score: '88% Match',
      steps: [
        { grade: '8-9 сынып', task: 'Биология-химия олимпиадалары және ғылыми зерттеу жобасы (+500 XP)' },
        { grade: '10 сынып', task: 'Ғылыми жетекшімен мақала дайындау және SAT Subject / ҰБТ (+750 XP)' },
        { grade: '11 сынып', task: 'Медициналық университеттерден атаулы грант және зертханалық практика' },
      ],
    },
    business: {
      title: i18n.language === 'kk' ? 'FinTech & Кәсіпкерлік' : 'Экономика, FinTech и Бизнес',
      score: '86% Match',
      steps: [
        { grade: '8-9 сынып', task: 'Дебат турнирлері, көшбасшылық жобалар және кейс-чемпионаттар (+350 XP)' },
        { grade: '10 сынып', task: 'Startup MVP жасап, мектеп инкубаторынан алғашқы инвестиция тарту (+850 XP)' },
        { grade: '11 сынып', task: 'Бизнес-мектептерге портфолио арқылы толық грант ұсынысы' },
      ],
    },
  }

  const NAV_LINKS = [
    { href: '#pillars', label: i18n.language === 'kk' ? 'Экожүйе' : i18n.language === 'en' ? 'Pillars' : 'Экосистема' },
    { href: '#roadmap-demo', label: i18n.language === 'kk' ? 'AI Ментор' : i18n.language === 'en' ? 'AI Mentor' : 'AI Ментор' },
    { href: '#personas', label: i18n.language === 'kk' ? 'Кімге арналған' : i18n.language === 'en' ? 'For Whom' : 'Для кого' },
    { href: '#how', label: t('landing.navHow', 'Как начать') },
    { href: '#stories', label: t('landing.navVoices', 'Отзывы') },
  ]

  const CTA_CHECKS = [
    i18n.language === 'kk' ? 'Анти-фейк тексеру және QR Цифрлық Паспорт' : 'Верификация дипломов и QR-паспорт таланта',
    i18n.language === 'kk' ? 'AI Ментор және жекелендірілген грант картасы' : 'AI-ментор и персональный роадмап к гранту',
    i18n.language === 'kk' ? 'RPG деңгейлер (Level 1–50) және XP рейтинг' : 'RPG-геймификация, XP и открытый рейтинг',
    i18n.language === 'kk' ? 'ЖОО мен қорлардан тікелей грант ұсыныстары' : 'Прямые офферы на гранты от топ-вузов и фондов',
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-indigo-500/20 selection:text-indigo-900 dark:bg-slate-950 dark:text-slate-100 dark:selection:bg-indigo-500/30 dark:selection:text-white">
      <Helmet>
        <title>USHQN (ҰШҚЫН) — EdTech & AI Talent Ecosystem · Цифрлық Паспорт & Карьералық Ментор</title>
        <meta
          name="description"
          content="USHQN — мектеп оқушылары мен жастарға арналған EdTech экожүйесі: расталған цифрлық портфолио, AI-ментор, RPG геймификация және ЖОО гранттары."
        />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      {/* Top Navbar */}
      <nav
        id="landing-navbar"
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/95'
            : 'border-b border-transparent bg-white/80 backdrop-blur-sm dark:bg-slate-950/80'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#162a45] text-white shadow-xs transition-transform group-hover:scale-105">
              <Zap className="h-4 w-4 fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                USHQN
              </span>
              <span className="text-[10px] font-bold text-[#0052cc] dark:text-blue-400 tracking-wider">
                ҰШҚЫН EDTECH
              </span>
            </div>
          </Link>

          {/* Desktop Nav Anchors */}
          <div className="hidden items-center gap-7 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 lg:flex">
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-[#162a45] dark:hover:text-blue-400"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right Actions: Theme Toggle + Language Switcher + Auth CTA */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleDark}
              aria-label="Toggle theme"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition"
            >
              {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
            </button>

            {/* Language Switcher */}
            <div ref={langRef} className="relative">
              <button
                type="button"
                id="landing-lang-btn"
                onClick={() => setLangMenuOpen((v) => !v)}
                className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 shadow-xs hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700 transition"
              >
                <Globe className="h-3.5 w-3.5 text-slate-500" />
                <span>{currentLang.label}</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 origin-top-right rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50">
                  {LANGS.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        i18n.changeLanguage(lang.code)
                        setLangMenuOpen(false)
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                        i18n.language === lang.code
                          ? 'bg-slate-100 font-bold text-[#162a45] dark:bg-slate-800 dark:text-blue-400'
                          : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{lang.full}</span>
                      {i18n.language === lang.code && <CheckCircle2 className="h-3.5 w-3.5 text-[#162a45] dark:text-blue-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            {!authLoading && session ? (
              <Link
                to="/home"
                id="landing-to-app-btn"
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#162a45] px-4 text-xs font-bold text-white shadow-xs transition hover:bg-[#0f1d30] active:scale-[0.98]"
              >
                <span>{t('landing.toApp', 'В приложение')}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  id="landing-register-btn"
                  className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-xs transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700"
                >
                  {i18n.language === 'kk' ? 'Тіркелу' : 'Регистрация'}
                </Link>
                <Link
                  to="/login"
                  id="landing-login-btn"
                  className="inline-flex h-9 items-center justify-center rounded-lg bg-[#162a45] px-3.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#0f1d30] active:scale-[0.98]"
                >
                  {i18n.language === 'kk' ? 'Кіру' : 'Войти'}
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-12 sm:pt-32 sm:pb-16 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-10 lg:grid-cols-12 lg:items-center"
            >
              {/* Left Column */}
              <div className="lg:col-span-7 flex flex-col items-center text-center lg:items-start lg:text-left">
                <motion.h1
                  variants={itemVariants}
                  className="text-5xl font-black tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl"
                >
                  USHQN
                </motion.h1>

                <motion.p
                  variants={itemVariants}
                  className="mt-4 text-xl font-bold text-[#162a45] dark:text-blue-300 sm:text-2xl"
                >
                  {i18n.language === 'kk'
                    ? '1 минутта Цифрлық Паспорт & AI Карьералық Roadmap құрастыр'
                    : 'Цифровой Паспорт школьника и AI Карьерный Роадмап за 1 минуту'}
                </motion.p>

                <motion.p
                  variants={itemVariants}
                  className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base"
                >
                  {i18n.language === 'kk'
                    ? '7–11 сынып оқушыларының талантын анықтап, дипломдарды растап, ТОП ЖОО-лардан тікелей грант офферлерін алуға арналған экожүйе.'
                    : 'Экосистема для раскрытия потенциала учащихся 7–11 классов: анти-фейк портфолио, AI-ментор и прямые гранты от вузов.'}
                </motion.p>

                {/* Hero CTAs */}
                <motion.div
                  variants={itemVariants}
                  className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center"
                >
                  {session ? (
                    <Link
                      to="/home"
                      id="hero-primary-app-btn"
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#162a45] px-6 text-sm font-bold text-white shadow-md transition hover:bg-[#0f1d30] active:scale-[0.98]"
                    >
                      <span>{t('landing.toApp', 'В приложение')}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <Link
                      to="/register"
                      id="hero-primary-register-btn"
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#162a45] px-7 text-sm font-bold text-white shadow-md transition hover:bg-[#0f1d30] active:scale-[0.98]"
                    >
                      <span>{i18n.language === 'kk' ? 'Бастау' : 'Начать'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}

                  <a
                    href="#roadmap-demo"
                    id="hero-secondary-features-btn"
                    className="inline-flex h-12 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700 shadow-xs transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600"
                  >
                    {i18n.language === 'kk' ? 'AI Менторды көру' : 'Попробовать AI-роадмап'}
                  </a>
                </motion.div>

                {/* Subtext info */}
                <motion.p
                  variants={itemVariants}
                  className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400"
                >
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>
                    {i18n.language === 'kk'
                      ? 'Anti-Fake растау · Тегін старт · Ресми QR Цифрлық Паспорт'
                      : 'Верификация документов · Бесплатный старт · Официальный QR-паспорт'}
                  </span>
                </motion.p>
              </div>

              {/* Right Column: Dashboard MiniProfile Card (Replicating exact dashboard card from screenshots) */}
              <motion.div variants={itemVariants} className="lg:col-span-5">
                <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
                  {/* Banner */}
                  <div className="relative h-20 bg-gradient-to-br from-[#0052cc] via-[#2066dd] to-[#64a0f0]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_-20%,rgba(255,255,255,0.4),transparent_55%)] mix-blend-overlay" />
                  </div>

                  {/* Avatar + name */}
                  <div className="relative flex flex-col items-center px-4 pb-2 pt-0">
                    <div className="-mt-10 flex h-20 w-20 items-center justify-center rounded-full border-[4px] border-white bg-[#eef1f4] text-3xl shadow-md ring-1 ring-black/[0.06] dark:border-slate-900 dark:bg-slate-800">
                      🧑‍🎓
                    </div>
                    <h2 className="mt-2.5 text-center text-lg font-black text-slate-900 dark:text-white leading-tight">
                      zhorik.
                    </h2>
                    <p className="mt-0.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                      {i18n.language === 'kk' ? 'Студент' : 'Студент'}
                    </p>
                    <p className="mt-1 text-center text-xs text-slate-400 dark:text-slate-500 line-clamp-2 px-2">
                      Full-stack dev.
                    </p>
                  </div>

                  {/* Stats Block */}
                  <div className="mx-3.5 mb-3.5 overflow-hidden rounded-xl bg-[#fafbfc] ring-1 ring-slate-200/80 dark:bg-slate-800/60 dark:ring-slate-700/60">
                    <div className="grid grid-cols-2 divide-x divide-slate-200 dark:divide-slate-700">
                      <div className="flex flex-col items-center py-3">
                        <span className="text-2xl font-black text-[#0052cc] dark:text-blue-400">15</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {i18n.language === 'kk' ? 'USHQN балл' : 'USHQN баллы'}
                        </span>
                      </div>
                      <div className="flex flex-col items-center py-3">
                        <span className="text-2xl font-black text-slate-900 dark:text-white">ТОП 2%</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {i18n.language === 'kk' ? 'Место в топе' : 'Место в топе'}
                        </span>
                      </div>
                    </div>

                    {/* Profile completion bar */}
                    <div className="border-t border-slate-200 px-3.5 py-3 dark:border-slate-700">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-700 dark:text-slate-300">
                          {i18n.language === 'kk' ? 'Профиль толтырылуы' : 'Заполненность профиля'}
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400">100%</span>
                      </div>
                      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                        <div className="h-full w-full rounded-full bg-emerald-500 transition-all duration-500" />
                      </div>
                      <p className="mt-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        ✓ {i18n.language === 'kk' ? 'Профиль толтырылды!' : 'Профиль полностью заполнен!'}
                      </p>
                    </div>

                    {/* Grant Offer & AI snippet */}
                    <div className="border-t border-slate-200 bg-blue-50/50 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800/40">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-[#0052cc] dark:text-blue-400 shrink-0" />
                        <div>
                          <div className="font-bold text-[#162a45] dark:text-blue-200 text-[11px]">
                            Direct Grant Offer · Astana IT Univ.
                          </div>
                          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                            100% Академиялық грант мақұлданды
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Open Profile CTA */}
                  <div className="px-3.5 pb-4">
                    <Link
                      to={session ? '/profile' : '/login'}
                      className="block w-full rounded-lg bg-[#0052cc] py-2.5 text-center text-xs font-bold text-white shadow-sm transition hover:bg-[#0747a6]"
                    >
                      {i18n.language === 'kk' ? 'Профильді ашу →' : 'Открыть профиль →'}
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* AI Assistant Command Bar underneath hero (like Image 3) */}
          <div className="mx-auto mt-10 max-w-4xl px-4 sm:px-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-800 dark:bg-slate-900">
              <form onSubmit={handleAiSearchSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Bot className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      i18n.language === 'kk'
                        ? 'Көмекшіге сұрақ қойыңыз... (мысалы: "Робототехника бойынша грант жоспары")'
                        : 'Задайте вопрос AI-помощнику (например: "Робототехника и грант в AITU")...'
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#0052cc] focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#162a45] px-6 text-xs font-bold text-white shadow-sm transition hover:bg-[#0f1d30] shrink-0"
                >
                  <span>{i18n.language === 'kk' ? 'Жіберу' : 'Отправить'}</span>
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>

              {/* Quick Action bar below input */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery(i18n.language === 'kk' ? '1 жылдық Карьералық Roadmap алу' : 'Получить 1-летний роадмап к гранту')
                    handleAiSearchSubmit()
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#162a45] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#0f1d30]"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>
                    {i18n.language === 'kk'
                      ? 'Сабақ көмекшісі — AI Карьералық Ментор & 1 жылдық Roadmap алу →'
                      : 'Помощник в учебе — AI Карьерный Ментор & Роадмап на грант →'}
                  </span>
                </button>

                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span>Gemini 2.5 Pro Powered</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Assistant Dialog Modal */}
        {aiAssistantModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-[#0052cc]" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    USHQN AI Карьералық Ментор
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setAiAssistantModal(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="my-4 min-h-[140px] rounded-xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-700 dark:bg-slate-800 dark:text-slate-200 whitespace-pre-line">
                {isAiGenerating ? (
                  <div className="flex flex-col items-center justify-center py-6 gap-2">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#0052cc] border-t-transparent" />
                    <span className="text-slate-500 font-medium">Талдау жүріп жатыр...</span>
                  </div>
                ) : (
                  aiResponseText
                )}
              </div>

              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setAiAssistantModal(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Жабу
                </button>
                <Link
                  to="/register"
                  onClick={() => setAiAssistantModal(false)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#162a45] px-4 py-2 text-xs font-bold text-white hover:bg-[#0f1d30]"
                >
                  <span>Толық картаны ашу</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Key Stats Counter Bar */}
        <section className="border-y border-slate-200 bg-white py-10 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <StatCounter
                n={12400}
                suffix="+"
                label={i18n.language === 'kk' ? 'Белсенді оқушылар' : 'Активных школьников'}
              />
              <StatCounter
                n={850}
                suffix="+"
                label={i18n.language === 'kk' ? 'Расталған жобалар' : 'Верифицированных проектов'}
              />
              <StatCounter
                n={42}
                suffix=""
                label={i18n.language === 'kk' ? 'Серіктес ЖОО & Қорлар' : 'Партнерских вузов и фондов'}
              />
              <StatCounter
                n={100}
                suffix="%"
                label={i18n.language === 'kk' ? 'Тегін бастапқы пакет' : 'Бесплатный старт'}
              />
            </div>
          </div>
        </section>

        {/* 4 Core Pillars of USHQN Startup Ecosystem */}
        <section id="pillars" className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                <Layers className="h-3.5 w-3.5" />
                <span>{i18n.language === 'kk' ? 'USHQN Экожүйесінің 4 Бағаны' : '4 Технологических Блока USHQN'}</span>
              </div>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                {i18n.language === 'kk'
                  ? 'Білім мен гранттар нарығындағы мәселелерді түбегейлі шешу'
                  : 'Революция в профориентации и поступлении на гранты'}
              </h2>
              <p className="mt-4 text-base text-slate-600 dark:text-slate-300">
                {i18n.language === 'kk'
                  ? 'Шашыраңқы қағаз сертификаттар мен кездейсоқ тесттердің орнына — расталған цифрлық із, AI бағыттау және ЖОО-лармен тікелей байланыс.'
                  : 'Вместо утерянных бумажных грамот и хаотичной профориентации — оцифрованный треккинг, ИИ-ментор и прямые офферы.'}
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {corePillars.map((pillar, i) => {
                const Icon = pillar.icon
                return (
                  <motion.div
                    key={pillar.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.1 }}
                    className="relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:border-indigo-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {pillar.badge}
                        </span>
                      </div>

                      <div className="mt-5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        {pillar.tag}
                      </div>
                      <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{pillar.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{pillar.desc}</p>
                    </div>

                    <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      <span>{i18n.language === 'kk' ? 'Толығырақ білу' : 'Узнать больше'}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Interactive AI Career Roadmap Simulator */}
        <section
          id="roadmap-demo"
          className="border-t border-slate-200 bg-slate-100/60 py-20 dark:border-slate-800 dark:bg-slate-900/40 sm:py-28"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                <Bot className="h-3.5 w-3.5" />
                <span>AI Career Mentor Simulator</span>
              </div>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                {i18n.language === 'kk'
                  ? 'Жасанды Интеллект сіздің жеке Роадмапыңызды қалай құрады?'
                  : 'Как AI-Ментор строит персональный роадмап к гранту'}
              </h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                {i18n.language === 'kk'
                  ? 'Бағытты таңдаңыз және 7-11 сынып оқушысының қадамдық грант жоспарын көріңіз.'
                  : 'Выберите направление и посмотрите персональный план поступления на грант.'}
              </p>
            </div>

            {/* Trajectory Switcher */}
            <div className="mt-8 flex flex-wrap justify-center gap-2.5">
              {(
                [
                  { id: 'robotics', label: '🤖 Робототехника & Mechatronics' },
                  { id: 'it', label: '💻 IT & AI Engineering' },
                  { id: 'med', label: '🧬 BioTech & Медицина' },
                  { id: 'business', label: '📊 FinTech & Бизнес' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedTrajectory(tab.id)}
                  className={`rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                    selectedTrajectory === tab.id
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Interactive Roadmap Flow Card */}
            <div className="mt-8 mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-5 dark:border-slate-800 gap-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    AI Direction Engine · Verified Track
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {trajectoryData[selectedTrajectory].title}
                  </h3>
                </div>
                <div className="rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                  🎯 {trajectoryData[selectedTrajectory].score}
                </div>
              </div>

              {/* Step Sequence */}
              <div className="mt-8 space-y-6">
                {trajectoryData[selectedTrajectory].steps.map((st, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 font-black text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                      0{idx + 1}
                    </div>
                    <div className="flex-1 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                      <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        {st.grade}
                      </span>
                      <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">{st.task}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-indigo-600/25 transition hover:bg-indigo-700"
                >
                  <span>
                    {i18n.language === 'kk'
                      ? 'Өз жеке Roadmap-іңізді тегін құрыңыз'
                      : 'Создать свой персональный роадмап бесплатно'}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Value by Persona (B2C, B2B, B2G) */}
        <section id="personas" className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {i18n.language === 'kk' ? 'Әр тарапқа пайдасы' : 'Ценность для участников'}
              </div>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                {i18n.language === 'kk' ? 'USHQN барлық тарапқа не береді?' : 'Почему USHQN выгоден каждому?'}
              </h2>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {personas.map((p, idx) => {
                const PIcon = p.icon
                return (
                  <motion.div
                    key={p.role}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: idx * 0.08 }}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div>
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${p.color}`}>
                        <PIcon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-5 text-base font-bold text-slate-900 dark:text-white">{p.role}</h3>
                      <ul className="mt-4 space-y-2.5">
                        {p.bullets.map((b, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* 3-Step Process: How it works */}
        <section id="how" className="border-t border-slate-200 bg-slate-100/60 py-20 dark:border-slate-800 dark:bg-slate-900/40 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center">
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {t('landing.howKicker', 'Простой старт')}
              </div>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                {i18n.language === 'kk'
                  ? 'Оқушының қарапайым 3 қадамы'
                  : 'Три простых шага к результату'}
              </h2>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {[
                {
                  num: '01',
                  title: i18n.language === 'kk' ? '1. Тіркелу & Скрининг' : '1. Регистрация и скрининг',
                  desc: i18n.language === 'kk'
                    ? 'Платформаға тіркеліп, өзіңіздің негізгі қызығушылықтарыңызды (IT, Робототехника, Дизайн) таңдаңыз.'
                    : 'Зарегистрируйтесь и выберите свои ключевые сферы интересов и школьные предметы.',
                  icon: GraduationCap,
                },
                {
                  num: '02',
                  title: i18n.language === 'kk' ? '2. Портфолио & AI Roadmap' : '2. Портфолио и AI-роадмап',
                  desc: i18n.language === 'kk'
                    ? 'Сертификаттар мен жобаларды жүктеңіз, ЖИ оларды тексеріп, XP беріп, грантқа жеке жоспар құрады.'
                    : 'Загружайте дипломы и проекты — ИИ начислит XP и построит персональную траекторию.',
                  icon: FileCheck,
                },
                {
                  num: '03',
                  title: i18n.language === 'kk' ? '3. Деңгей өсіру & Грант алу' : '3. Рост уровня и офферы',
                  desc: i18n.language === 'kk'
                    ? 'Рейтингте көтеріліп, серіктес ЖОО мен қорлардан тікелей грант және стипендия ұсыныстарын алыңыз.'
                    : 'Прокачивайте профиль в рейтинге и получайте прямые офферы на гранты от партнерских вузов.',
                  icon: Rocket,
                },
              ].map((step, idx) => {
                const StepIcon = step.icon
                return (
                  <motion.div
                    key={step.num}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.12 }}
                    className="relative flex flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                        <StepIcon className="h-6 w-6" />
                      </div>
                      <span className="text-2xl font-black text-slate-300 dark:text-slate-700">{step.num}</span>
                    </div>

                    <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{step.desc}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Voices / Reviews */}
        <section id="stories" className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {t('landing.voicesKicker', 'Отзывы сообщества')}
              </div>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                {i18n.language === 'kk' ? 'Оқушылар мен ұстаздар пікірі' : 'Опыт участников USHQN'}
              </h2>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: 'Алия Н.',
                  role: i18n.language === 'kk' ? '11-сынып, Алматы (Astana IT грант иегері)' : '11 класс, Алматы',
                  text: i18n.language === 'kk'
                    ? 'USHQN-дағы расталған портфолио менің барлық хакатондарымды көрсетіп, грант алуыма тікелей көмектесті!'
                    : 'QR-паспорт заменил кипу бумажных дипломов, а вуз сам связался со мной благодаря рейтингу.',
                  score: 'Lvl 18 · 4,840 XP',
                },
                {
                  name: 'Данияр С.',
                  role: i18n.language === 'kk' ? '10-сынып, Шымкент (WRO қатысушысы)' : '10 класс, Шымкент',
                  text: i18n.language === 'kk'
                    ? 'AI Ментор маған робототехника бойынша қандай олимпиадаларға қатысу керектігін нақты көрсетті.'
                    : 'AI Ментор точно рассчитал мой роадмап: какие хакатоны пройти и как поднять IELTS.',
                  score: 'Lvl 14 · 3,120 XP',
                },
                {
                  name: 'Марина К.',
                  role: i18n.language === 'kk' ? 'Информатика пәні мұғалімі, ментор' : 'Учитель информатики, ментор',
                  text: i18n.language === 'kk'
                    ? 'Оқушылардың барлық жетістігін бір жерде көру және оларды ынталандыру өте ыңғайлы.'
                    : 'Очень удобно отслеживать успеваемость и практические проекты своих учеников в одном месте.',
                  score: 'Verified Mentor',
                },
              ].map((story, i) => (
                <motion.div
                  key={story.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div>
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, idx) => (
                        <Star key={idx} className="h-4 w-4 fill-amber-400" />
                      ))}
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300 italic">
                      «{story.text}»
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{story.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{story.role}</div>
                    </div>
                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                      {story.score}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final Conversion CTA Banner */}
        <section className="pb-20 sm:pb-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-indigo-950 via-indigo-900 to-slate-950 p-8 text-white shadow-2xl sm:p-12 lg:p-16">
              <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
              <div className="pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

              <div className="relative grid gap-10 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-7">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-200">
                    <Zap className="h-3.5 w-3.5 fill-indigo-300" />
                    <span>{i18n.language === 'kk' ? 'Болашаққа қадам жаса' : 'Старт в карьеру'}</span>
                  </div>
                  <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                    {i18n.language === 'kk'
                      ? 'USHQN (ҰШҚЫН) экожүйесіне қосылыңыз'
                      : 'Готовы подключиться к USHQN?'}
                  </h2>
                  <p className="mt-4 max-w-lg text-base text-indigo-100 sm:text-lg">
                    {i18n.language === 'kk'
                      ? 'Өз цифрлық паспортыңызды бүгін ашыңыз, AI ментормен мақсат қойыңыз және ЖОО гранттарын жақындатыңыз.'
                      : 'Создайте свой цифровой паспорт, прокачивайте уровень и получайте предложения от лучших вузов.'}
                  </p>

                  {/* Trust Bullet Items */}
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {CTA_CHECKS.map((item) => (
                      <div key={item} className="flex items-center gap-2 text-xs font-medium text-indigo-100">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col gap-3.5 sm:flex-row lg:flex-col lg:items-end">
                  {session ? (
                    <Link
                      to="/home"
                      id="cta-band-to-app-btn"
                      className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-white px-8 text-sm font-bold text-slate-900 shadow-xl transition hover:bg-slate-100 active:scale-[0.98] sm:w-auto"
                    >
                      <span>{t('landing.toApp', 'В приложение')}</span>
                      <ArrowRight className="h-4 w-4 text-indigo-600" />
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/register"
                        id="cta-band-register-btn"
                        className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-white px-8 text-sm font-bold text-slate-900 shadow-xl transition hover:bg-slate-100 active:scale-[0.98] sm:w-auto"
                      >
                        <span>{i18n.language === 'kk' ? 'Тегін тіркелу' : 'Создать аккаунт'}</span>
                        <ArrowRight className="h-4 w-4 text-indigo-600" />
                      </Link>
                      <Link
                        to="/login"
                        id="cta-band-login-btn"
                        className="inline-flex h-14 w-full items-center justify-center rounded-xl border border-white/25 bg-white/10 px-8 text-sm font-bold text-white transition hover:bg-white/20 active:scale-[0.98] sm:w-auto"
                      >
                        {t('landing.login', 'Войти')}
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modern Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">
              <Zap className="h-4 w-4 fill-white" />
            </div>
            <span className="font-extrabold tracking-tight text-slate-900 dark:text-white">
              USHQN (ҰШҚЫН) EdTech
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
            © {new Date().getFullYear()} USHQN Ecosystem. {i18n.language === 'kk' ? 'Барлық құқықтар қорғалған.' : 'Все права защищены.'}
          </p>

          <div className="flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            <a href="#pillars" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              {i18n.language === 'kk' ? 'Экожүйе' : 'Экосистема'}
            </a>
            <a href="#roadmap-demo" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              AI Roadmap
            </a>
            <a href="#personas" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              {i18n.language === 'kk' ? 'Пайдасы' : 'Ценность'}
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
