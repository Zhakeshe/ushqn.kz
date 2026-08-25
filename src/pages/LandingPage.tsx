import { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { captureReferralFromHref } from '../lib/referral'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { fetchLeaderboardTotals } from '../lib/leaderboard'
import { FeatureStatusNotice } from '../components/FeatureStatusNotice'
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
  Trophy,
  Zap,
  Sun,
  Moon,
  Send,
  BookOpen,
  X,
  Activity,
} from 'lucide-react'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const LANGS = [
  { code: 'kk', label: 'Қаз', full: 'Қазақша' },
  { code: 'ru', label: 'Рус', full: 'Русский' },
  { code: 'en', label: 'Eng', full: 'English' },
]

function StatCounter({ n, suffix = '', label }: { n: number; suffix?: string; label: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const end = n
    const duration = 1000
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
      <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl lg:text-4xl">
        {count > 999 ? `${(count / 1000).toFixed(1)}k` : count}
        <span className="text-blue-600 dark:text-blue-400">{suffix}</span>
      </div>
      <div className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 sm:text-xs">
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
  const [selectedTrajectory, setSelectedTrajectory] = useState<'robotics' | 'it' | 'med' | 'business'>('robotics')
  const [searchQuery, setSearchQuery] = useState('')
  const [aiAssistantModal, setAiAssistantModal] = useState(false)
  const [aiResponseText, setAiResponseText] = useState('')
  const [isAiGenerating, setIsAiGenerating] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)

  const isKz = i18n.language === 'kk'
  const isRu = i18n.language === 'ru'
  const isEn = i18n.language === 'en'

  // Real-time live platform statistics from Supabase
  const liveStatsQuery = useQuery({
    queryKey: ['landing-realtime-stats'],
    queryFn: async () => {
      const [pRes, aRes] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('achievements').select('*', { count: 'exact', head: true }).eq('verification_status', 'verified'),
      ])
      const totalStudents = pRes.count ?? 0
      const totalAch = aRes.count ?? 0
      return {
        students: totalStudents,
        achievements: totalAch,
      }
    },
    refetchInterval: 30000,
  })

  // Real-time top student / talent showcase
  const topTalentQuery = useQuery({
    queryKey: ['landing-top-talent'],
    queryFn: async () => {
      const rows = await fetchLeaderboardTotals(supabase)
      return rows[0] || null
    },
  })

  // Real-time live verified stream
  const liveFeedQuery = useQuery({
    queryKey: ['landing-live-feed'],
    queryFn: async () => {
      const { data } = await supabase
        .from('achievements')
        .select('id, title, points_awarded, created_at, user_id')
        .eq('verification_status', 'verified')
        .order('created_at', { ascending: false })
        .limit(4)
      return data ?? []
    },
    refetchInterval: 15000,
  })

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
      setSearchQuery(
        isKz
          ? 'Робототехника және IT бойынша грантқа жету жоспары'
          : isEn
          ? 'Robotics and IT grant preparation roadmap'
          : 'План поступления на грант по робототехнике и IT'
      )
    }
    setAiAssistantModal(true)
    setIsAiGenerating(true)
    setTimeout(() => {
      setIsAiGenerating(false)
      if (isKz) {
        setAiResponseText(
          '✨ USHQN AI Карьералық Ментор ұсынысы:\n\n1. Бағыт: «Робототехника және Инженерия (Академиялық грант)»\n2. Ұсынылатын қадамдар:\n   • C++ және Arduino базалық жобаларын растау (+450 XP)\n   • NIS / Daryn облыстық олимпиадаларына қатысу\n   • WRO немесе KazRobotics жарыстарына жоба дайындау\n   • Расталған цифрлық портфолио арқылы Astana IT University & Nazarbayev University гранттарына тапсыру\n\n🎯 Өз профиліңізде жеке оқу картасын бекіту үшін платформаға тіркеліңіз.'
        )
      } else if (isEn) {
        setAiResponseText(
          '✨ USHQN AI Career Mentor Recommendation:\n\n1. Direction: "Robotics & Mechatronics Engineering (Academic Grant)"\n2. Recommended Steps:\n   • Verify foundational C++ & Arduino projects (+450 XP)\n   • Participate in regional STEM / Robotics Olympiads\n   • Prepare tournament showcase for WRO competitions\n   • Submit verified digital portfolio for direct university grant offers\n\n🎯 Register on the platform to save your personal roadmap.'
        )
      } else {
        setAiResponseText(
          '✨ Рекомендация USHQN AI Карьерного Ментора:\n\n1. Направление: «Робототехника и Инженерия (Академический грант)»\n2. Ключевые шаги:\n   • Верификация базовых проектов на C++ и Arduino (+450 XP)\n   • Участие в областных олимпиадах Daryn / NIS\n   • Подготовка проекта к чемпионатам WRO и KazRobotics\n   • Подача подтвержденного цифрового портфолио на гранты в Astana IT University и NU\n\n🎯 Зарегистрируйтесь на платформе, чтобы сохранить свой персональный роадмап.'
        )
      }
    }, 500)
  }

  useEffect(() => {
    captureReferralFromHref(window.location.href)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15)
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

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ushqn.kz'
  const canonicalUrl = useMemo(() => `${origin}/`, [origin])
  const currentLang = LANGS.find((l) => l.code === i18n.language) ?? LANGS[0]

  // 4 Core Startup Pillars
  const corePillars = [
    {
      icon: QrCode,
      tag: isKz ? '1-бөлім · Растау' : isEn ? 'Pillar 1 · Verification' : '1 блок · Верификация',
      title: isKz
        ? 'Расталған Цифрлық Портфолио'
        : isEn
        ? 'Verified Digital Portfolio'
        : 'Верифицированное Цифровое Портфолио',
      desc: isKz
        ? 'Қағаз грамоталар мен сертификаттар жоғалмайды. Барлық жетістіктер тексеруден өтіп, жеке QR-паспортқа жиналады.'
        : isEn
        ? 'Diplomas and certificates will never be lost. All achievements are verified and gathered in a single QR-code passport.'
        : 'Бумажные грамоты не потеряются. Все дипломы и проекты проходят проверку и формируют единый QR-паспорт таланта.',
      badge: 'QR Digital ID',
    },
    {
      icon: Bot,
      tag: isKz ? '2-бөлім · AI Ментор' : isEn ? 'Pillar 2 · AI Mentor' : '2 блок · AI Ментор',
      title: isKz
        ? 'AI Карьералық Навигатор'
        : isEn
        ? 'AI Career Navigator'
        : 'AI Карьерный Навигатор',
      desc: isKz
        ? 'Жасанды интеллект қызығушылықтарыңызды талдап, ЖОО гранттары мен олимпиадаларға жетудің қадамдық жоспарын (Roadmap) құрады.'
        : isEn
        ? 'AI analyzes your skills and builds a tailored step-by-step roadmap toward university grants and competitions.'
        : 'Искусственный интеллект анализирует сильные стороны и строит пошаговый план поступления на грант (IELTS, ҰБТ, хакатоны).',
      badge: 'Smart Roadmap',
    },
    {
      icon: Trophy,
      tag: isKz ? '3-бөлім · Геймификация' : isEn ? 'Pillar 3 · Gamification' : '3 блок · Геймификация',
      title: isKz
        ? 'XP Ұпайлары және Рейтинг'
        : isEn
        ? 'XP Points & Leaderboard'
        : 'XP Баллы и Рейтинг',
      desc: isKz
        ? 'Даму үдерісі ойынға айналады: әрбір расталған жетістік үшін ұпай жинап, мектеп және ел бойынша рейтингте көтеріліңіз.'
        : isEn
        ? 'Growth turns into an engaging journey: earn XP for verified achievements and level up on school and national leaderboards.'
        : 'Развитие как игра: прокачивайте свой уровень, выполняйте цели и поднимайтесь в республиканском рейтинге школьников.',
      badge: 'Level 1–50',
    },
    {
      icon: Building2,
      tag: isKz ? '4-бөлім · Гранттар' : isEn ? 'Pillar 4 · Opportunities' : '4 блок · Гранты',
      title: isKz
        ? 'ЖОО мен Қорлар Биржасы'
        : isEn
        ? 'Universities & Scholarships'
        : 'Биржа Вузов и Грантов',
      desc: isKz
        ? 'Университеттер мен демеушілер дарынды оқушыларды алдын-ала көріп, тікелей ішкі гранттар мен стипендиялар ұсынады.'
        : isEn
        ? 'Universities and sponsors scout verified talent and offer direct grants and scholarship opportunities.'
        : 'Ведущие вузы и фонды видят сильных кандидатов заранее и отправляют прямые офферы на гранты и стажировки.',
      badge: 'Direct Offers',
    },
  ]

  // Value by Persona
  const personas = [
    {
      role: isKz ? 'Оқушыларға (7–11 сынып)' : isEn ? 'Students (Grades 7–11)' : 'Школьникам (7–11 классы)',
      icon: GraduationCap,
      color: 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-950/40 dark:text-blue-400',
      bullets: [
        isKz ? 'Барлық дипломдар 1 ресми QR-паспортта' : isEn ? 'All diplomas in 1 verified QR passport' : 'Все дипломы и проекты в одном QR-паспорте',
        isKz ? 'AI көмегімен грантқа қадамдық Roadmap' : isEn ? 'AI-powered step-by-step roadmap to grants' : 'Персональный AI-роадмап для грантов и олимпиад',
        isKz ? 'XP ұпайлары және ашық рейтинг' : isEn ? 'XP points and transparent leaderboard' : 'XP-рейтинг, уровни и республиканский топ',
      ],
    },
    {
      role: isKz ? 'Ата-аналарға' : isEn ? 'Parents' : 'Родителям',
      icon: HeartHandshake,
      color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:bg-indigo-950/40 dark:text-indigo-400',
      bullets: [
        isKz ? 'Баланың нақты қабілеті мен бейімін көру' : isEn ? 'Clear view of child talents and interests' : 'Четкое понимание способностей ребенка',
        isKz ? 'Қажетті үйірмелерді таңдап, артық шығынды азайту' : isEn ? 'Focus on effective courses without extra costs' : 'Точный фокус на нужных предметах и секциях',
        isKz ? 'ЖОО-ға түсу дайындығын ашық бақылау' : isEn ? 'Transparent tracking of university readiness' : 'Прозрачный контроль подготовки к поступлению',
      ],
    },
    {
      role: isKz ? 'Мектептер мен Ұстаздарға' : isEn ? 'Schools & Mentors' : 'Школам и Педагогам',
      icon: Building2,
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-400',
      bullets: [
        isKz ? 'Оқушылар жетістіктерінің бірыңғай цифрлық базасы' : isEn ? 'Single digital hub for student accomplishments' : 'Единая база портфолио и побед учеников',
        isKz ? 'Мектептің олимпиадалық және ғылыми көрсеткіші' : isEn ? 'Analytics on olympiad and science projects' : 'Аналитика олимпиадных и научных проектов',
        isKz ? 'Дарынды балаларды ерте анықтап, бағыттау' : isEn ? 'Early talent identification and guidance' : 'Быстрое выявление и развитие талантов',
      ],
    },
    {
      role: isKz ? 'ЖОО және Қорларға' : isEn ? 'Universities & Funds' : 'Вузам и Фондам',
      icon: Sparkles,
      color: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-950/40 dark:text-amber-400',
      bullets: [
        isKz ? 'Ең үздік оқушыларды алдын-ала тарту' : isEn ? 'Early recruitment of top verified talents' : 'Рекрутинг сильных абитуриентов заранее',
        isKz ? 'Тікелей гранттар мен стипендиялар ұсыну' : isEn ? 'Direct grants and scholarship offerings' : 'Прямая выдача образовательных грантов',
        isKz ? 'Ашық және әділ таланттар мониторингі' : isEn ? 'Transparent talent analytics and scouting' : 'Прозрачный отбор мотивированных студентов',
      ],
    },
  ]

  const trajectoryData = {
    robotics: {
      title: isKz ? 'Робототехника және Инженерия' : isEn ? 'Robotics & Engineering' : 'Робототехника и Инженерия',
      score: isKz ? '94% Сәйкестік' : isEn ? '94% Match' : '94% Совпадение',
      steps: [
        {
          grade: isKz ? '8–9 сынып' : isEn ? 'Grades 8–9' : '8–9 классы',
          task: isKz
            ? 'C++, Arduino базасы және облыстық жарыстар (+450 XP)'
            : isEn
            ? 'C++, Arduino basics & regional tournaments (+450 XP)'
            : 'C++, Arduino и участие в областных соревнованиях (+450 XP)',
        },
        {
          grade: isKz ? '10 сынып' : isEn ? 'Grade 10' : '10 класс',
          task: isKz
            ? 'Халықаралық WRO хакатоны және IELTS дайындығы (+800 XP)'
            : isEn
            ? 'WRO tournament showcase and IELTS prep (+800 XP)'
            : 'Международный турнир WRO и подготовка к IELTS (+800 XP)',
        },
        {
          grade: isKz ? '11 сынып' : isEn ? 'Grade 11' : '11 класс',
          task: isKz
            ? 'Расталған портфолиомен жетекші ЖОО грантына тікелей ұсыныс алу'
            : isEn
            ? 'Direct university grant offers via verified digital portfolio'
            : 'Прямые офферы на гранты от топ-вузов по цифровому портфолио',
        },
      ],
    },
    it: {
      title: isKz ? 'Бағдарламалау & AI Engineering' : isEn ? 'Software & AI Engineering' : 'IT и AI Разработка',
      score: isKz ? '92% Сәйкестік' : isEn ? '92% Match' : '92% Совпадение',
      steps: [
        {
          grade: isKz ? '8–9 сынып' : isEn ? 'Grades 8–9' : '8–9 классы',
          task: isKz
            ? 'Python, веб-негіздері және GitHub-қа 2 дербес жоба (+400 XP)'
            : isEn
            ? 'Python, web basics & 2 GitHub showcase projects (+400 XP)'
            : 'Python, веб-разработка и 2 проекта на GitHub (+400 XP)',
        },
        {
          grade: isKz ? '10 сынып' : isEn ? 'Grade 10' : '10 класс',
          task: isKz
            ? 'Республикалық олимпиадалар, алгоритмдер және IT стажировка (+900 XP)'
            : isEn
            ? 'National Olympiads, algorithms and junior internship (+900 XP)'
            : 'Республиканские олимпиады, алгоритмы и стажировки (+900 XP)',
        },
        {
          grade: isKz ? '11 сынып' : isEn ? 'Grade 11' : '11 класс',
          task: isKz
            ? 'ТОП IT-университеттер мен Astana Hub серіктестерінен грант'
            : isEn
            ? 'Grants from top IT universities and tech partners'
            : 'Гранты от ведущих IT-вузов и партнеров экосистемы',
        },
      ],
    },
    med: {
      title: isKz ? 'Биомедицина & Биотехнология' : isEn ? 'Biomedicine & Biotech' : 'Биомедицина и Биотехнологии',
      score: isKz ? '89% Сәйкестік' : isEn ? '89% Match' : '89% Совпадение',
      steps: [
        {
          grade: isKz ? '8–9 сынып' : isEn ? 'Grades 8–9' : '8–9 классы',
          task: isKz
            ? 'Биология-химия олимпиадалары және ғылыми жоба (+500 XP)'
            : isEn
            ? 'Biology & chemistry competitions and science project (+500 XP)'
            : 'Олимпиады по биологии и химии, школьный научный проект (+500 XP)',
        },
        {
          grade: isKz ? '10 сынып' : isEn ? 'Grade 10' : '10 класс',
          task: isKz
            ? 'Ғылыми мақала, SAT Subject / ҰБТ тереңдетілген дайындық (+750 XP)'
            : isEn
            ? 'Research publication prep and targeted subject tests (+750 XP)'
            : 'Публикация статьи и профильная подготовка к тестам (+750 XP)',
        },
        {
          grade: isKz ? '11 сынып' : isEn ? 'Grade 11' : '11 класс',
          task: isKz
            ? 'Медициналық ЖОО-лардан атаулы грант және зертханалық практика'
            : isEn
            ? 'University medical grants and lab practice admissions'
            : 'Именные гранты от медицинских университетов и лабораторий',
        },
      ],
    },
    business: {
      title: isKz ? 'FinTech & Кәсіпкерлік' : isEn ? 'FinTech & Business' : 'FinTech и Предпринимательство',
      score: isKz ? '87% Сәйкестік' : isEn ? '87% Match' : '87% Совпадение',
      steps: [
        {
          grade: isKz ? '8–9 сынып' : isEn ? 'Grades 8–9' : '8–9 классы',
          task: isKz
            ? 'Дебат турнирлері, көшбасшылық және кейс-чемпионаттар (+350 XP)'
            : isEn
            ? 'Debates, leadership initiatives and case championships (+350 XP)'
            : 'Дебаты, лидерские проекты и кейс-чемпионаты (+350 XP)',
        },
        {
          grade: isKz ? '10 сынып' : isEn ? 'Grade 10' : '10 класс',
          task: isKz
            ? 'Стартап MVP жасау және мектеп инкубаторында қорғау (+850 XP)'
            : isEn
            ? 'Startup MVP launch and incubator showcase (+850 XP)'
            : 'Создание MVP стартапа и защита в инкубаторе (+850 XP)',
        },
        {
          grade: isKz ? '11 сынып' : isEn ? 'Grade 11' : '11 класс',
          task: isKz
            ? 'Бизнес-мектептерге портфолио арқылы толық грант ұсынысы'
            : isEn
            ? 'Full scholarships to business schools via portfolio merit'
            : 'Полные гранты в бизнес-школы на основе портфолио проектов',
        },
      ],
    },
  }

  const NAV_LINKS = [
    { href: '#pillars', label: isKz ? 'Экожүйе' : isEn ? 'Pillars' : 'Экосистема' },
    { href: '#roadmap-demo', label: isKz ? 'AI Ментор' : isEn ? 'AI Mentor' : 'AI Ментор' },
    { href: '#personas', label: isKz ? 'Кімге арналған' : isEn ? 'For Whom' : 'Для кого' },
    { href: '#how', label: isKz ? 'Қалай бастау' : isEn ? 'How It Works' : 'Как начать' },
  ]

  const CTA_CHECKS = [
    isKz ? 'QR цифрлық паспорт демосы' : isEn ? 'QR digital passport demo' : 'Демо цифрового QR-паспорта',
    isKz ? 'AI Ментор және қадамдық грант жоспары' : isEn ? 'AI Mentor and step-by-step grant plan' : 'AI-ментор и план поступления на грант',
    isKz ? 'XP ұпайлары және республикалық рейтинг' : isEn ? 'XP points and nationwide leaderboard' : 'XP-геймификация и открытый рейтинг',
    isKz ? 'Жетекші ЖОО мен қорлардан тікелей ұсыныстар' : isEn ? 'Direct grant offers from top universities' : 'Прямые офферы на гранты от топ-вузов',
  ]

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50 text-slate-900 antialiased selection:bg-blue-500/20 selection:text-blue-900 dark:bg-slate-950 dark:text-slate-100 dark:selection:bg-blue-500/30 dark:selection:text-white">
      <Helmet>
        <title>USHQN (ҰШҚЫН) — Оқушылардың Цифрлық Портфолиосы және Даму Экожүйесі</title>
        <meta
          name="description"
          content="USHQN — 7-11 сынып оқушыларына арналған цифрлық портфолио, AI-ментор және ЖОО гранттарына жол ашатын платформа."
        />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      {/* Top Navbar */}
      <header
        id="landing-navbar"
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-200 ${
          scrolled
            ? 'border-b border-slate-200/80 bg-white/95 shadow-xs backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/95'
            : 'border-b border-transparent bg-white/85 backdrop-blur-sm dark:bg-slate-950/85'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3.5 py-2.5 sm:px-6 sm:py-3.5">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white shadow-xs transition-transform group-hover:scale-105 dark:bg-white dark:text-slate-900 sm:h-9 sm:w-9">
              <Zap className="h-4 w-4 fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black tracking-tight text-slate-900 dark:text-white leading-none sm:text-lg">
                USHQN
              </span>
              <span className="text-[9px] font-bold tracking-wider text-blue-600 dark:text-blue-400 sm:text-[10px]">
                ҰШҚЫН EDTECH
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 lg:flex">
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="transition hover:text-blue-600 dark:hover:text-blue-400"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right Controls: Theme + Lang + Auth */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleDark}
              aria-label="Toggle theme"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:h-9 sm:w-9"
            >
              {isDark ? <Sun className="h-3.5 w-3.5 text-amber-400" /> : <Moon className="h-3.5 w-3.5 text-slate-600" />}
            </button>

            {/* Language Switcher */}
            <div ref={langRef} className="relative">
              <button
                type="button"
                id="landing-lang-btn"
                onClick={() => setLangMenuOpen((v) => !v)}
                className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:h-9 sm:px-2.5"
              >
                <Globe className="h-3 w-3 text-slate-500 sm:h-3.5 sm:w-3.5" />
                <span>{currentLang.label}</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-32 origin-top-right rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-800 dark:bg-slate-900 z-50">
                  {LANGS.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        void i18n.changeLanguage(lang.code)
                        setLangMenuOpen(false)
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                        i18n.language === lang.code
                          ? 'bg-slate-100 font-bold text-blue-600 dark:bg-slate-800 dark:text-blue-400'
                          : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{lang.full}</span>
                      {i18n.language === lang.code && <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Actions */}
            {!authLoading && session ? (
              <Link
                to="/home"
                id="landing-to-app-btn"
                className="inline-flex h-8 items-center justify-center gap-1 rounded-lg bg-slate-900 px-3 text-xs font-bold text-white shadow-xs transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 sm:h-9 sm:px-3.5"
              >
                <span>{t('landing.toApp', 'В приложение')}</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  to="/login"
                  id="landing-login-btn"
                  className="inline-flex h-8 items-center justify-center rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-bold text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:h-9 sm:px-3"
                >
                  {isKz ? 'Кіру' : isEn ? 'Log in' : 'Войти'}
                </Link>
                <Link
                  to="/register"
                  id="landing-register-btn"
                  className="inline-flex h-8 items-center justify-center rounded-lg bg-slate-900 px-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 sm:h-9 sm:px-3"
                >
                  {isKz ? 'Тіркелу' : isEn ? 'Sign up' : 'Регистрация'}
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-10 sm:pt-28 sm:pb-16 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-8">
              <FeatureStatusNotice />
            </div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-8 lg:grid-cols-12 lg:items-center"
            >
              {/* Left Column Text */}
              <div className="lg:col-span-7 flex flex-col items-center text-center lg:items-start lg:text-left">
                <motion.div
                  variants={itemVariants}
                  className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300"
                >
                  <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  <span>
                    {isKz
                      ? 'Оқушылар мен жастардың цифрлық портфолиосы'
                      : isEn
                      ? 'Talent Portfolio & Career Roadmap'
                      : 'Цифровое портфолио и карьерный роадмап'}
                  </span>
                </motion.div>

                <motion.h1
                  variants={itemVariants}
                  className="mt-3 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl leading-[1.15]"
                >
                  {isKz ? (
                    <>
                      Жетістіктеріңді растап, <span className="text-blue-600 dark:text-blue-400">грантқа жол аш</span>
                    </>
                  ) : isEn ? (
                    <>
                      Verify achievements, <span className="text-blue-600 dark:text-blue-400">unlock your future</span>
                    </>
                  ) : (
                    <>
                      Подтверждай успехи, <span className="text-blue-600 dark:text-blue-400">поступай на грант</span>
                    </>
                  )}
                </motion.h1>

                <motion.p
                  variants={itemVariants}
                  className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base"
                >
                  {isKz
                    ? '7–11 сынып оқушыларына арналған цифрлық QR-паспорт: дипломдарды сақтау, AI көмегімен даму жоспарын құру және ЖОО-лардан тікелей гранттар алу.'
                    : isEn
                    ? 'Official digital QR passport for students: store verified diplomas, build AI-guided roadmaps, and receive direct scholarship offers.'
                    : 'Официальный цифровой QR-паспорт для учащихся 7–11 классов: сохранение дипломов, персональный AI-роадмап и предложения грантов от ведущих вузов.'}
                </motion.p>

                {/* Hero CTAs */}
                <motion.div
                  variants={itemVariants}
                  className="mt-6 flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:items-center"
                >
                  {session ? (
                    <Link
                      to="/home"
                      id="hero-primary-app-btn"
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 text-sm font-bold text-white shadow-md transition hover:bg-slate-800 active:scale-[0.98] dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                    >
                      <span>{t('landing.toApp', 'В приложение')}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <Link
                      to="/register"
                      id="hero-primary-register-btn"
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 text-sm font-bold text-white shadow-md transition hover:bg-slate-800 active:scale-[0.98] dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                    >
                      <span>{isKz ? 'Тегін бастау' : isEn ? 'Get Started' : 'Начать бесплатно'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}

                  <a
                    href="#roadmap-demo"
                    id="hero-secondary-features-btn"
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    {isKz ? 'AI Менторды көру' : isEn ? 'View AI Roadmap' : 'Попробовать AI-роадмап'}
                  </a>
                </motion.div>

                {/* Subtext info */}
                <motion.div
                  variants={itemVariants}
                  className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400"
                >
                  <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>
                    {isKz
                      ? 'Тексерілген сертификаттар · Тегін тіркелу · Ресми QR-паспорт'
                      : isEn
                      ? 'Verified Credentials · Free Registration · QR Passport'
                      : 'Верификация документов · Бесплатный старт · Официальный QR-паспорт'}
                  </span>
                </motion.div>
              </div>

              {/* Right Column: Clean Interactive Profile Card */}
              <motion.div variants={itemVariants} className="lg:col-span-5 w-full flex justify-center">
                <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
                  {/* Header Banner */}
                  <div className="h-16 bg-blue-600 relative" />

                  {/* Profile avatar & details */}
                  <div className="relative px-4 pb-4 pt-0">
                    <div className="-mt-8 flex items-center justify-between">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-slate-100 text-2xl shadow-sm dark:border-slate-900 dark:bg-slate-800 overflow-hidden">
                        {topTalentQuery.data?.avatar_url ? (
                          <img
                            src={topTalentQuery.data.avatar_url}
                            alt={topTalentQuery.data.display_name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span>🧑‍🎓</span>
                        )}
                      </div>
                      <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        {isKz ? 'Рейтинг көшбасшысы' : isEn ? 'Leaderboard' : 'Лидер рейтинга'}
                      </span>
                    </div>

                    <div className="mt-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {topTalentQuery.data?.display_name || (isKz ? 'Әзірге рейтинг бос' : isEn ? 'No ranking data yet' : 'Рейтинг пока пуст')}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {isKz ? 'Тек расталған ұпайлар есептеледі' : isEn ? 'Only verified points are counted' : 'Учитываются только проверенные баллы'}
                      </p>
                    </div>

                    {/* Stats metrics */}
                    <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <div className="text-center">
                        <div className="text-lg font-black text-blue-600 dark:text-blue-400">
                          {topTalentQuery.data?.points
                            ? `${topTalentQuery.data.points.toLocaleString()} XP`
                            : '0 XP'}
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {isKz ? 'USHQN ҰПАЙ' : isEn ? 'USHQN XP' : 'USHQN БАЛЛЫ'}
                        </div>
                      </div>
                      <div className="text-center border-l border-slate-200 dark:border-slate-700">
                        <div className="text-lg font-black text-slate-900 dark:text-white">—</div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {isKz ? 'РЕЙТИНГТЕ' : isEn ? 'LEADERBOARD' : 'В РЕЙТИНГЕ'}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <Link
                        to={session ? '/home' : '/register'}
                        className="block w-full rounded-lg bg-slate-900 py-2.5 text-center text-xs font-bold text-white shadow-xs transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                      >
                        {isKz ? 'Профильді ашу →' : isEn ? 'Open Profile →' : 'Открыть профиль →'}
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* AI Search & Mentor Command Bar */}
          <div className="mx-auto mt-8 max-w-4xl px-4 sm:px-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-4">
              <form onSubmit={handleAiSearchSubmit} className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Bot className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      isKz
                        ? 'Сұрақ қойыңыз: "Робототехника бойынша грант жоспары"...'
                        : isEn
                        ? 'Ask mentor: "Robotics scholarship roadmap in top university"...'
                        : 'Задайте вопрос: "План поступления на грант по робототехнике"...'
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-5 text-xs font-bold text-white shadow-xs transition hover:bg-slate-800 active:scale-[0.98] shrink-0 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                >
                  <span>{isKz ? 'Сұрау' : isEn ? 'Ask' : 'Спросить'}</span>
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>

              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2.5 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery(
                      isKz
                        ? '1 жылдық Карьералық Roadmap алу'
                        : isEn
                        ? 'Generate 1-year career roadmap'
                        : 'Получить 1-летний роадмап к гранту'
                    )
                    handleAiSearchSubmit()
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>
                    {isKz
                      ? 'AI Ментордан 1 жылдық жеке оқу жоспарын алу →'
                      : isEn
                      ? 'Get a 1-year personal study roadmap from AI Mentor →'
                      : 'Получить 1-летний учебный роадмап от AI Ментора →'}
                  </span>
                </button>

                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  <span>AI Powered</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Assistant Modal Dialog */}
        {aiAssistantModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    {isKz ? 'USHQN AI Карьералық Ментор' : isEn ? 'USHQN AI Career Mentor' : 'USHQN AI Карьерный Ментор'}
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
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                    <span className="text-slate-500 font-medium">
                      {isKz ? 'Талдау жүріп жатыр...' : isEn ? 'Analyzing...' : 'Идет анализ...'}
                    </span>
                  </div>
                ) : (
                  aiResponseText
                )}
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAiAssistantModal(false)}
                  className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  {isKz ? 'Жабу' : isEn ? 'Close' : 'Закрыть'}
                </button>
                <Link
                  to="/register"
                  onClick={() => setAiAssistantModal(false)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                >
                  <span>{isKz ? 'Толық картаны ашу' : isEn ? 'Open Full Roadmap' : 'Открыть роадмап'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Key Stats Counter */}
        <section className="border-y border-slate-200 bg-white py-8 dark:border-slate-800 dark:bg-slate-900/60 sm:py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid grid-cols-2 gap-6 sm:gap-8">
              <StatCounter
                n={liveStatsQuery.data?.students ?? 0}
                label={isKz ? 'Тіркелген профильдер' : isEn ? 'Registered profiles' : 'Зарегистрированные профили'}
              />
              <StatCounter
                n={liveStatsQuery.data?.achievements ?? 0}
                label={isKz ? 'Расталған жетістіктер' : isEn ? 'Verified achievements' : 'Проверенные достижения'}
              />
            </div>

            {/* Real-time pulse indicator & recent achievements stream */}
            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/50 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {isKz ? 'Соңғы расталған жетістіктер' : isRu ? 'Последние проверенные достижения' : 'Recently verified achievements'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <Activity className="h-3.5 w-3.5" />
                  <span>{isKz ? 'Дерекқордан' : isRu ? 'Из базы данных' : 'From the database'}</span>
                </div>
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {(liveFeedQuery.data ?? []).slice(0, 4).map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-white p-2.5 shadow-2xs dark:border-slate-800 dark:bg-slate-800/80"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-200">
                          {item.title}
                        </p>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {item.created_at ? new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Бүгін'} · {isKz ? 'Расталды' : 'Верифицирован'}
                      </span>
                    </div>
                    <span className="shrink-0 rounded-lg bg-blue-50 px-2 py-0.5 text-[11px] font-black text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                      +{item.points_awarded} XP
                    </span>
                  </div>
                ))}
                {!liveFeedQuery.isLoading && (liveFeedQuery.data?.length ?? 0) === 0 ? (
                  <p className="col-span-full py-4 text-center text-xs text-slate-500 dark:text-slate-400">
                    {isKz ? 'Әзірге расталған жетістіктер жоқ.' : isRu ? 'Проверенных достижений пока нет.' : 'No verified achievements yet.'}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        {/* 4 Core Pillars */}
        <section id="pillars" className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                <Layers className="h-3.5 w-3.5" />
                <span>{isKz ? 'Экожүйенің 4 негізгі бағаны' : isEn ? '4 Core Ecosystem Pillars' : '4 технологических блока'}</span>
              </div>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl lg:text-4xl">
                {isKz
                  ? 'Оқушы мен ЖОО арасындағы сенімді көпір'
                  : isEn
                  ? 'The trusted bridge from school to university'
                  : 'Надежный мост от школы к университету'}
              </h2>
              <p className="mt-2.5 text-sm text-slate-600 dark:text-slate-300 sm:text-base">
                {isKz
                  ? 'Шашыраңқы қағаз құжаттар мен кездейсоқ таңдаудың орнына — бірыңғай цифрлық із, AI бағыттау және нақты нәтиже.'
                  : isEn
                  ? 'Instead of lost paper certificates and guesswork — verified tracking, AI guidance, and direct admission offers.'
                  : 'Вместо утерянных бумажных дипломов и случайного выбора — оцифрованный треккинг, AI-навигатор и прямые офферы.'}
              </p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:gap-6">
              {corePillars.map((pillar, i) => {
                const Icon = pillar.icon
                return (
                  <motion.div
                    key={pillar.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.08 }}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {pillar.badge}
                        </span>
                      </div>

                      <div className="mt-4 text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        {pillar.tag}
                      </div>
                      <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">{pillar.title}</h3>
                      <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">{pillar.desc}</p>
                    </div>

                    <div className="mt-5 border-t border-slate-100 pt-3 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                      <span>{isKz ? 'Толығырақ білу' : isEn ? 'Learn more' : 'Узнать больше'}</span>
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
          className="border-t border-slate-200 bg-slate-100/60 py-16 dark:border-slate-800 dark:bg-slate-900/40 sm:py-24"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                <Bot className="h-3.5 w-3.5" />
                <span>{isKz ? 'AI Карьералық Навигатор' : isEn ? 'AI Career Navigator' : 'AI Карьерный Навигатор'}</span>
              </div>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl lg:text-4xl">
                {isKz
                  ? 'Грантқа жетудің жеке жоспары қалай құрылады?'
                  : isEn
                  ? 'How does the AI Navigator build your path?'
                  : 'Как AI-Навигатор строит персональный путь к гранту?'}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {isKz
                  ? 'Бағытты таңдап, 7–11 сынып оқушысының қадамдық дайындық жоспарын көріңіз.'
                  : isEn
                  ? 'Select a track to see the step-by-step preparation plan.'
                  : 'Выберите направление и посмотрите пошаговый план подготовки.'}
              </p>
            </div>

            {/* Trajectory Tab Switcher */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {(
                [
                  { id: 'robotics', label: isKz ? '🤖 Робототехника' : isEn ? '🤖 Robotics' : '🤖 Робототехника' },
                  { id: 'it', label: isKz ? '💻 IT & Бағдарламалау' : isEn ? '💻 IT & Software' : '💻 IT & Разработка' },
                  { id: 'med', label: isKz ? '🧬 Биомедицина' : isEn ? '🧬 Biomedicine' : '🧬 Биомедицина' },
                  { id: 'business', label: isKz ? '📊 FinTech & Бизнес' : isEn ? '📊 FinTech & Business' : '📊 FinTech & Бизнес' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedTrajectory(tab.id)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                    selectedTrajectory === tab.id
                      ? 'bg-slate-900 text-white shadow-xs dark:bg-white dark:text-slate-900'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Trajectory Card Display */}
            <div className="mt-6 mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-5 shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-7">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800 gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Verified Trajectory
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {trajectoryData[selectedTrajectory].title}
                  </h3>
                </div>
                <div className="rounded-xl bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                  🎯 {trajectoryData[selectedTrajectory].score}
                </div>
              </div>

              {/* Steps Sequence */}
              <div className="mt-6 space-y-4">
                {trajectoryData[selectedTrajectory].steps.map((st, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 font-black text-xs text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                      0{idx + 1}
                    </div>
                    <div className="flex-1 rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        {st.grade}
                      </span>
                      <p className="mt-0.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">{st.task}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-center">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                >
                  <span>
                    {isKz
                      ? 'Өз жеке Roadmap-іңізді құрыңыз'
                      : isEn
                      ? 'Create your personalized roadmap'
                      : 'Создать персональный роадмап'}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Value by Persona */}
        <section id="personas" className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {isKz ? 'Барлық тарапқа арналған' : isEn ? 'Value for Everyone' : 'Для всех участников'}
              </div>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl lg:text-4xl">
                {isKz ? 'USHQN экожүйесінің пайдасы' : isEn ? 'Benefits of USHQN Ecosystem' : 'Преимущества экосистемы USHQN'}
              </h2>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {personas.map((p, idx) => {
                const PIcon = p.icon
                return (
                  <motion.div
                    key={p.role}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: idx * 0.06 }}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div>
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${p.color}`}>
                        <PIcon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 text-sm sm:text-base font-bold text-slate-900 dark:text-white">{p.role}</h3>
                      <ul className="mt-3 space-y-2">
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

        {/* 3-Step Process */}
        <section id="how" className="border-t border-slate-200 bg-slate-100/60 py-16 dark:border-slate-800 dark:bg-slate-900/40 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {isKz ? 'Оңай бастау' : isEn ? 'Quick Start' : 'Простой старт'}
              </div>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl lg:text-4xl">
                {isKz ? 'Нәтижеге жетудің 3 қадамы' : isEn ? '3 Steps to Success' : 'Три шага к результату'}
              </h2>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                {
                  num: '01',
                  title: isKz ? '1. Тіркелу және бағыт таңдау' : isEn ? '1. Sign up & choose track' : '1. Регистрация и выбор сферы',
                  desc: isKz
                    ? 'Платформаға тіркеліп, өзіңіздің негізгі қызығушылықтарыңызды (IT, Робототехника, Медицина) белгілеңіз.'
                    : isEn
                    ? 'Create your account and select your main areas of interest (IT, Robotics, Biotech).'
                    : 'Зарегистрируйтесь и выберите ключевые сферы интересов и школьные предметы.',
                  icon: GraduationCap,
                },
                {
                  num: '02',
                  title: isKz ? '2. Портфолио және Roadmap' : isEn ? '2. Portfolio & Roadmap' : '2. Портфолио и AI-роадмап',
                  desc: isKz
                    ? 'Дипломдар мен жобаларды жүктеңіз. AI оларды тексеріп, XP ұпайын беріп, қадамдық дайындық жоспарын сызады.'
                    : isEn
                    ? 'Upload diplomas and projects. AI verifies them, awards XP, and builds a customized growth path.'
                    : 'Загружайте дипломы и проекты. AI проверит их, начислит XP и построит персональный роадмап.',
                  icon: FileCheck,
                },
                {
                  num: '03',
                  title: isKz ? '3. Деңгей өсіру және Грант алу' : isEn ? '3. Level up & Get Grants' : '3. Рост уровня и офферы',
                  desc: isKz
                    ? 'Рейтингте көтеріліп, серіктес ЖОО мен қорлардан тікелей грант және стипендия ұсыныстарын алыңыз.'
                    : isEn
                    ? 'Level up on the leaderboard and receive direct grant offers from partner universities.'
                    : 'Прокачивайте профиль в рейтинге и получайте прямые предложения грантов от ведущих вузов.',
                  icon: Rocket,
                },
              ].map((step, idx) => {
                const StepIcon = step.icon
                return (
                  <motion.div
                    key={step.num}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: idx * 0.08 }}
                    className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                        <StepIcon className="h-5 w-5" />
                      </div>
                      <span className="text-xl font-black text-slate-300 dark:text-slate-700">{step.num}</span>
                    </div>

                    <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">{step.title}</h3>
                    <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">{step.desc}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Final Conversion CTA Banner */}
        <section className="pb-16 sm:pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-xl sm:p-10 lg:p-14 dark:bg-slate-900 border border-slate-800">
              <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-7">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-300">
                    <Zap className="h-3.5 w-3.5 fill-blue-300" />
                    <span>{isKz ? 'Болашаққа қадам жасаңыз' : isEn ? 'Take the Next Step' : 'Старт в будущее'}</span>
                  </div>
                  <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
                    {isKz
                      ? 'USHQN экожүйесіне бүгін қосылыңыз'
                      : isEn
                      ? 'Join the USHQN Ecosystem today'
                      : 'Подключайтесь к экосистеме USHQN'}
                  </h2>
                  <p className="mt-2.5 max-w-lg text-xs sm:text-sm leading-relaxed text-slate-300">
                    {isKz
                      ? 'Жеке цифрлық паспортыңызды ашып, AI ментормен мақсаттарыңызға жетіңіз және жетекші ЖОО гранттарына қол жеткізіңіз.'
                      : isEn
                      ? 'Create your digital passport, set goals with AI Mentor, and unlock direct university grants.'
                      : 'Создайте свой цифровой паспорт, выстраивайте траекторию с AI-ментором и получайте прямые гранты.'}
                  </p>

                  <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
                    {CTA_CHECKS.map((item) => (
                      <div key={item} className="flex items-center gap-2 text-xs text-slate-200">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col gap-2.5 sm:flex-row lg:flex-col lg:items-end">
                  {session ? (
                    <Link
                      to="/home"
                      id="cta-band-to-app-btn"
                      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-6 text-xs font-bold text-slate-900 shadow-md transition hover:bg-slate-100 active:scale-[0.98] sm:w-auto"
                    >
                      <span>{t('landing.toApp', 'В приложение')}</span>
                      <ArrowRight className="h-4 w-4 text-blue-600" />
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/register"
                        id="cta-band-register-btn"
                        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-6 text-xs font-bold text-slate-900 shadow-md transition hover:bg-slate-100 active:scale-[0.98] sm:w-auto"
                      >
                        <span>{isKz ? 'Тегін тіркелу' : isEn ? 'Create Account' : 'Создать аккаунт'}</span>
                        <ArrowRight className="h-4 w-4 text-blue-600" />
                      </Link>
                      <Link
                        to="/login"
                        id="cta-band-login-btn"
                        className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-white/20 bg-white/10 px-6 text-xs font-bold text-white transition hover:bg-white/15 active:scale-[0.98] sm:w-auto"
                      >
                        {isKz ? 'Кіру' : isEn ? 'Log in' : 'Войти'}
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white font-bold dark:bg-white dark:text-slate-900">
              <Zap className="h-3.5 w-3.5 fill-current" />
            </div>
            <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-sm">
              USHQN (ҰШҚЫН) EdTech
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
            © {new Date().getFullYear()} USHQN Ecosystem. {isKz ? 'Барлық құқықтар қорғалған.' : isEn ? 'All rights reserved.' : 'Все права защищены.'}
          </p>

          <div className="flex items-center gap-5 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <a href="#pillars" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
              {isKz ? 'Экожүйе' : isEn ? 'Pillars' : 'Экосистема'}
            </a>
            <a href="#roadmap-demo" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
              Roadmap
            </a>
            <a href="#personas" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
              {isKz ? 'Пайдасы' : isEn ? 'For Whom' : 'Ценность'}
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
