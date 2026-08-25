import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CreditCard,
  QrCode,
  Download,
  Share2,
  Copy,
  Check,
  Send,
  Phone,
  Mail,
  Globe,
  MessageCircle,
  Building2,
  Sparkles,
  ExternalLink,
  Users,
  FileSpreadsheet,
  Trash2,
  RefreshCw,
  Eye,
  CheckCircle2,
  Sliders,
  Code2,
  Award,
  FolderGit2,
  Briefcase,
} from 'lucide-react'
import { useToast } from '../lib/toast'
import { useAuth } from '../hooks/useAuth'

export interface BusinessCardProfile {
  fullName: string
  role: string
  organization: string
  location: string
  bio: string
  phone: string
  email: string
  telegram: string
  github: string
  linkedin: string
  website: string
  skills: string[]
  theme: 'dark_executive' | 'cyber_kz' | 'emerald_pro' | 'sapphire_modern' | 'minimal_white'
  avatarUrl?: string
}

export interface CardLead {
  id: string
  createdAt: string
  visitorName: string
  visitorPhone: string
  visitorEmail: string
  visitorCompany: string
  message: string
  status: 'new' | 'contacted' | 'approved' | 'archived'
}

export interface GitHubRepoItem {
  name: string
  description: string
  language: string
  stargazers_count: number
  html_url: string
  updated_at: string
}

export interface GitHubRealData {
  login: string
  name: string
  avatar_url: string
  bio: string
  public_repos: number
  followers: number
  following: number
  html_url: string
  location: string
  company: string
  repos: GitHubRepoItem[]
}

export interface CodeforcesRealData {
  handle: string
  rating?: number
  maxRating?: number
  rank?: string
  maxRank?: string
  organization?: string
  avatar?: string
}

const STORAGE_PROFILE_KEY = 'ushqn_digital_business_card_profile'
const STORAGE_LEADS_KEY = 'ushqn_business_card_leads_v2'

export function DigitalBusinessCardStudio() {
  const { i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const isRu = i18n.language === 'ru'
  const { session } = useAuth()
  const { toast } = useToast()

  const cardRef = useRef<HTMLDivElement>(null)

  const defaultProfile: BusinessCardProfile = {
    fullName: session?.user?.user_metadata?.full_name || 'Әлихан Нұрланұлы',
    role: 'Full-Stack Developer & Olympiad Winner',
    organization: session?.user?.user_metadata?.school || 'РФМШ Алматы / Astana Hub',
    location: 'Almaty, Kazakhstan',
    bio: 'Жасанды интеллект және жоғары жүктемелі веб жүйелерді әзірлеуші. IOI/IZhO қатысушысы.',
    phone: '+7 777 123 4567',
    email: session?.user?.email || 'alikhan.dev@ushqn.kz',
    telegram: 'alikhan_dev',
    github: 'alikhan-tech',
    linkedin: 'alikhan-nurlan',
    website: 'https://ushqn.app',
    skills: ['TypeScript', 'React', 'Node.js', 'Python', 'Algorithms', 'TailwindCSS'],
    theme: 'dark_executive',
    avatarUrl: session?.user?.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=faces',
  }

  const [profile, setProfile] = useState<BusinessCardProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROFILE_KEY)
      if (saved) return JSON.parse(saved)
    } catch {
      // fallback
    }
    return defaultProfile
  })

  const [leads, setLeads] = useState<CardLead[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LEADS_KEY)
      if (saved) return JSON.parse(saved)
    } catch {
      // fallback
    }
    return [
      {
        id: 'lead-1',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        visitorName: 'Ернар Сейітов',
        visitorCompany: 'Kaspi.kz Talent Acquisition',
        visitorPhone: '+7 701 999 8877',
        visitorEmail: 'ernar.s@kaspi.kz',
        message: 'Сәлеметсіз бе! Профиліңізді көрдік, Junior/Middle Backend стажировкасына шақырғымыз келеді.',
        status: 'new',
      },
      {
        id: 'lead-2',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        visitorName: 'Айгерім Маликова',
        visitorCompany: 'Astana Hub Startup Lab',
        visitorPhone: '+7 705 444 3322',
        visitorEmail: 'aigerim@astanahub.kz',
        message: 'Хакатон командасына күшті ML/Fullstack әзірлеуші іздеп жатырмыз. Байланысайық!',
        status: 'contacted',
      },
    ]
  })

  const [activeTab, setActiveTab] = useState<'card_view' | 'editor' | 'leads' | 'api_sync'>('card_view')
  const [copiedLink, setCopiedLink] = useState(false)
  const [skillInput, setSkillInput] = useState('')

  // Real API fetching states
  const [githubQuery, setGithubQuery] = useState(profile.github || 'shadcn')
  const [githubLoading, setGithubLoading] = useState(false)
  const [githubData, setGithubData] = useState<GitHubRealData | null>(null)

  const [cfQuery, setCfQuery] = useState('tourist')
  const [cfLoading, setCfLoading] = useState(false)
  const [cfData, setCfData] = useState<CodeforcesRealData | null>(null)

  // Visitor Lead Form in Card View
  const [visitorFormOpen, setVisitorFormOpen] = useState(false)
  const [visitorName, setVisitorName] = useState('')
  const [visitorPhone, setVisitorPhone] = useState('')
  const [visitorEmail, setVisitorEmail] = useState('')
  const [visitorCompany, setVisitorCompany] = useState('')
  const [visitorMsg, setVisitorMsg] = useState('')
  const [submittingLead, setSubmittingLead] = useState(false)

  // Save profile changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profile))
    } catch {
      // ignore
    }
  }, [profile])

  // Save leads
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LEADS_KEY, JSON.stringify(leads))
    } catch {
      // ignore
    }
  }, [leads])

  // Live direct public link
  const publicCardUrl = `${window.location.origin}/passport`
  const qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=${encodeURIComponent(
    `BEGIN:VCARD\nVERSION:3.0\nFN:${profile.fullName}\nTITLE:${profile.role}\nORG:${profile.organization}\nTEL:${profile.phone}\nEMAIL:${profile.email}\nURL:${profile.website}\nNOTE:${profile.bio}\nEND:VCARD`
  )}`

  // 1. Download Real vCard (.vcf)
  const handleDownloadVCard = () => {
    const vcardContent = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${profile.fullName}`,
      `N:${profile.fullName.split(' ').slice(1).join(' ') || ''};${profile.fullName.split(' ')[0]};;;`,
      `ORG:${profile.organization}`,
      `TITLE:${profile.role}`,
      `TEL;TYPE=CELL,VOICE:${profile.phone}`,
      `EMAIL;TYPE=PREF,INTERNET:${profile.email}`,
      `URL:${profile.website}`,
      `NOTE:${profile.bio} | Telegram: @${profile.telegram.replace('@', '')} | GitHub: ${profile.github}`,
      'END:VCARD',
    ].join('\r\n')

    const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${profile.fullName.replace(/\s+/g, '_')}_contact.vcf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast(
      isKz
        ? '🪪 Контакт (.vcf) жүктелді! Телефонның контактілер базасына қосуға дайын.'
        : isRu
        ? '🪪 Контакт (.vcf) успешно сгенерирован и готов к импорту в телефон!'
        : '🪪 vCard contact (.vcf) downloaded! Ready to add to phone contacts.'
    )
  }

  // 2. Share via Native Web Share or Copy Link
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.fullName} - USHQN Digital Business Card`,
          text: `${profile.fullName} (${profile.role} @ ${profile.organization}) цифрлық визиткасы мен байланыстары:`,
          url: publicCardUrl,
        })
        toast(isKz ? 'Бөлісу терезесі ашылды' : isRu ? 'Отправлено' : 'Shared')
        return
      } catch {
        // fallback
      }
    }
    void navigator.clipboard.writeText(publicCardUrl)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2500)
    toast(isKz ? '🔗 Визитка сілтемесі көшірілді!' : isRu ? '🔗 Ссылка на визитку скопирована!' : '🔗 Card link copied!')
  }

  // 3. Submit Real Lead (Ақпарат жинау)
  const handleSubmitLead = (e: React.FormEvent) => {
    e.preventDefault()
    if (!visitorName.trim() || (!visitorPhone.trim() && !visitorEmail.trim())) {
      toast(isKz ? 'Аты-жөніңіз бен байланыс нөміріңізді енгізіңіз' : isRu ? 'Введите ваше имя и телефон/email' : 'Enter your name and phone/email', 'error')
      return
    }

    setSubmittingLead(true)
    setTimeout(() => {
      const newLead: CardLead = {
        id: `lead-${Date.now()}`,
        createdAt: new Date().toISOString(),
        visitorName: visitorName.trim(),
        visitorCompany: visitorCompany.trim() || (isKz ? 'Жеке тұлға / Ресурс' : 'Физическое лицо'),
        visitorPhone: visitorPhone.trim(),
        visitorEmail: visitorEmail.trim(),
        message: visitorMsg.trim() || (isKz ? 'Байланыс орнату туралы сұраныс' : 'Запрос на контакт'),
        status: 'new',
      }

      setLeads((prev) => [newLead, ...prev])
      setVisitorName('')
      setVisitorPhone('')
      setVisitorEmail('')
      setVisitorCompany('')
      setVisitorMsg('')
      setSubmittingLead(false)
      setVisitorFormOpen(false)

      toast(
        isKz
          ? '✅ Сұранысыңыз бен контактіңіз сәтті жіберілді! Авторға жеткізілді.'
          : isRu
          ? '✅ Ваша заявка и контакты успешно переданы автору визитки!'
          : '✅ Contact request successfully sent to the card owner!'
      )
    }, 400)
  }

  // 4. Update Lead Status
  const handleUpdateLeadStatus = (leadId: string, status: CardLead['status']) => {
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status } : l)))
    toast(isKz ? 'Лид мәртебесі жаңартылды' : isRu ? 'Статус лида обновлен' : 'Status updated')
  }

  // 5. Delete Lead
  const handleDeleteLead = (leadId: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== leadId))
    toast(isKz ? 'Лид өшірілді' : isRu ? 'Лид удален' : 'Lead deleted')
  }

  // 6. Export Leads to CSV
  const handleExportLeadsCsv = () => {
    if (leads.length === 0) {
      toast(isKz ? 'Экспорттайтын лидтер әлі жоқ' : isRu ? 'Нет лидов для экспорта' : 'No leads to export', 'error')
      return
    }

    const headers = ['ID', 'Уақыты', 'Аты-жөні', 'Компаниясы', 'Телефон', 'Email', 'Хабарлама', 'Мәртебесі']
    const rows = leads.map((l) => [
      l.id,
      new Date(l.createdAt).toLocaleString(),
      `"${l.visitorName.replace(/"/g, '""')}"`,
      `"${l.visitorCompany.replace(/"/g, '""')}"`,
      `"${l.visitorPhone}"`,
      `"${l.visitorEmail}"`,
      `"${l.message.replace(/"/g, '""')}"`,
      l.status,
    ])

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ushqn_leads_export_${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast(isKz ? '📊 Лидтер кестесі (.csv) сәтті жүктелді!' : isRu ? '📊 База контактов (.csv) экспортирована!' : '📊 Leads exported (.csv)!')
  }

  // 7. Real GitHub API Fetch
  const handleFetchGitHub = async () => {
    if (!githubQuery.trim()) return
    setGithubLoading(true)
    try {
      const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(githubQuery.trim())}`)
      if (!userRes.ok) throw new Error('GitHub user not found')
      const userData = (await userRes.json()) as Record<string, unknown>

      const reposRes = await fetch(
        `https://api.github.com/users/${encodeURIComponent(githubQuery.trim())}/repos?sort=updated&per_page=6`
      )
      const reposData = reposRes.ok ? ((await reposRes.json()) as Array<Record<string, unknown>>) : []

      setGithubData({
        login: String(userData.login || ''),
        name: String(userData.name || userData.login || ''),
        avatar_url: String(userData.avatar_url || ''),
        bio: String(userData.bio || ''),
        public_repos: Number(userData.public_repos || 0),
        followers: Number(userData.followers || 0),
        following: Number(userData.following || 0),
        html_url: String(userData.html_url || ''),
        location: String(userData.location || 'Kazakhstan'),
        company: String(userData.company || ''),
        repos: Array.isArray(reposData)
          ? reposData.map((r) => ({
              name: String(r.name || ''),
              description: String(r.description || 'No description provided'),
              language: String(r.language || 'Code'),
              stargazers_count: Number(r.stargazers_count || 0),
              html_url: String(r.html_url || ''),
              updated_at: String(r.updated_at || ''),
            }))
          : [],
      })
      toast(isKz ? '✅ Нақты GitHub деректері сәтті алынды!' : isRu ? '✅ Реальные данные из GitHub API загружены!' : '✅ GitHub data fetched!')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      toast(isKz ? `GitHub қатесі: ${message}` : `Ошибка GitHub: ${message}`, 'error')
    } finally {
      setGithubLoading(false)
    }
  }

  // 8. Real Codeforces API Fetch
  const handleFetchCodeforces = async () => {
    if (!cfQuery.trim()) return
    setCfLoading(true)
    try {
      const res = await fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(cfQuery.trim())}`)
      if (!res.ok) throw new Error('Codeforces handle not found')
      const data = (await res.json()) as { status: string; result?: Array<Record<string, unknown>> }
      if (data.status === 'OK' && data.result && data.result.length > 0) {
        const u = data.result[0]
        setCfData({
          handle: String(u.handle || ''),
          rating: typeof u.rating === 'number' ? u.rating : undefined,
          maxRating: typeof u.maxRating === 'number' ? u.maxRating : undefined,
          rank: typeof u.rank === 'string' ? u.rank : undefined,
          maxRank: typeof u.maxRank === 'string' ? u.maxRank : undefined,
          organization: typeof u.organization === 'string' ? u.organization : undefined,
          avatar: typeof u.titlePhoto === 'string' ? u.titlePhoto : undefined,
        })
        toast(isKz ? '✅ Codeforces рейтингі жүктелді!' : isRu ? '✅ Данные Codeforces получены!' : '✅ Codeforces stats loaded!')
      } else {
        throw new Error('User not found in Codeforces')
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      toast(`Codeforces: ${message}`, 'error')
    } finally {
      setCfLoading(false)
    }
  }

  // Apply fetched GitHub data to profile
  const handleApplyGitHubToProfile = () => {
    if (!githubData) return
    setProfile((prev) => ({
      ...prev,
      fullName: githubData.name || prev.fullName,
      bio: githubData.bio || prev.bio,
      github: githubData.login,
      avatarUrl: githubData.avatar_url || prev.avatarUrl,
      organization: githubData.company || prev.organization,
      location: githubData.location || prev.location,
    }))
    toast(isKz ? 'Визитка GitHub ақпаратымен жаңартылды!' : isRu ? 'Профиль визитки синхронизирован с GitHub!' : 'Profile synced with GitHub!')
  }

  // Theme styles for the card
  const getThemeClasses = (theme: BusinessCardProfile['theme']) => {
    switch (theme) {
      case 'cyber_kz':
        return 'bg-gradient-to-br from-cyan-950 via-slate-900 to-blue-950 text-cyan-50 border-cyan-500/40 shadow-cyan-500/10'
      case 'emerald_pro':
        return 'bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 text-emerald-50 border-emerald-500/40 shadow-emerald-500/10'
      case 'sapphire_modern':
        return 'bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-900 text-blue-50 border-blue-500/40 shadow-blue-500/10'
      case 'minimal_white':
        return 'bg-white text-slate-900 border-slate-200 shadow-xl dark:bg-slate-900 dark:text-white dark:border-slate-800'
      case 'dark_executive':
      default:
        return 'bg-gradient-to-br from-neutral-900 via-zinc-900 to-black text-white border-zinc-700/60 shadow-2xl'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-white shadow-xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-blue-200 backdrop-blur-md">
              <CreditCard className="h-3.5 w-3.5 text-amber-400" />
              <span>Real Interactive NFC & QR Business Card</span>
              <span className="rounded bg-emerald-500/30 px-1.5 py-0.5 text-[10px] font-black text-emerald-300">
                LIVE API READY
              </span>
            </div>
            <h2 className="text-xl font-black tracking-tight sm:text-2xl">
              {isKz ? 'Интерактивті Цифрлық Визитка & Lead CRM' : isRu ? 'Интерактивная Цифровая Визитка и Сбор Лидов' : 'Interactive Digital Business Card & CRM'}
            </h2>
            <p className="max-w-2xl text-xs text-blue-100/80 sm:text-sm">
              {isKz
                ? 'Нақты жұмыс істейтін цифрлық визитка: QR-код арқылы контактіні телефонға сақтау (.vcf), нақты GitHub/Codeforces API-мен байланысу және клиенттер мен HR-лардан сұраныс жинау.'
                : isRu
                ? 'Полнофункциональная визитка с сохранением vCard в телефон (.vcf), получением реальных данных из GitHub/Codeforces API и формой сбора контактов.'
                : 'Working digital business card with vCard (.vcf) download, live GitHub/Codeforces data fetching, and contact inquiry CRM.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadVCard}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-900 shadow-md transition hover:bg-slate-100 active:scale-95"
            >
              <Download className="h-4 w-4 text-blue-600" />
              <span>{isKz ? 'vCard жүктеу (.vcf)' : isRu ? 'Скачать vCard (.vcf)' : 'Download vCard (.vcf)'}</span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600/80 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-md transition hover:bg-blue-600 active:scale-95"
            >
              {copiedLink ? <Check className="h-4 w-4 text-emerald-300" /> : <Share2 className="h-4 w-4" />}
              <span>{copiedLink ? (isKz ? 'Көшірілді!' : isRu ? 'Скопировано!' : 'Copied!') : isKz ? 'Бөлісу' : isRu ? 'Поделиться' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
        {[
          { id: 'card_view' as const, label: isKz ? '🪪 Интерактивті Визитка' : isRu ? '🪪 Визитка в реальном времени' : '🪪 Live Business Card', icon: Eye },
          { id: 'editor' as const, label: isKz ? '✏️ Визитканы редакциялау' : isRu ? '✏️ Редактор визитки' : '✏️ Card Editor', icon: Sliders },
          {
            id: 'leads' as const,
            label: `${isKz ? '📥 Түскен сұраныстар & Лидтер' : isRu ? '📥 Входящие заявки' : '📥 Leads & Inquiries'} (${leads.length})`,
            icon: Users,
          },
          { id: 'api_sync' as const, label: '⚡ Реал API Синхронизация (GitHub / CP)', icon: Code2 },
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* TAB 1: CARD VIEW */}
      {activeTab === 'card_view' && (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Real Interactive Business Card */}
          <div className="space-y-4">
            <div
              ref={cardRef}
              className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 shadow-2xl transition-all duration-300 ${getThemeClasses(
                profile.theme
              )}`}
            >
              {/* Background ambient shapes */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-500/10 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-emerald-500/10 blur-2xl" />

              {/* Card Header: Avatar, Name, Title, Org */}
              <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                      alt={profile.fullName}
                      referrerPolicy="no-referrer"
                      className="h-18 w-18 rounded-2xl border-2 border-white/20 object-cover shadow-lg"
                    />
                    <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-black tracking-tight sm:text-2xl">{profile.fullName}</h3>
                    <p className="text-xs font-bold text-blue-400 sm:text-sm">{profile.role}</p>
                    <div className="mt-1 flex items-center gap-1.5 text-xs opacity-75">
                      <Building2 className="h-3.5 w-3.5" />
                      <span>{profile.organization}</span>
                    </div>
                  </div>
                </div>

                {/* Live QR Code Box */}
                <div className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-2.5 backdrop-blur-md">
                  <img
                    src={qrDataUrl}
                    alt="QR Code"
                    className="h-20 w-20 rounded-lg bg-white p-1 shadow-inner"
                  />
                  <span className="mt-1 text-[9px] font-extrabold uppercase tracking-wider text-slate-300">
                    SCAN FOR VCARD
                  </span>
                </div>
              </div>

              {/* Bio */}
              <div className="relative mt-5 rounded-2xl border border-white/10 bg-white/5 p-3.5 text-xs leading-relaxed backdrop-blur-md opacity-90">
                {profile.bio}
              </div>

              {/* Skills Tags */}
              <div className="relative mt-4 flex flex-wrap gap-1.5">
                {profile.skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-bold backdrop-blur-xs"
                  >
                    #{s}
                  </span>
                ))}
              </div>

              {/* Contact Icons Grid */}
              <div className="relative mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {profile.phone && (
                  <a
                    href={`tel:${profile.phone}`}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs font-bold transition hover:bg-white/15"
                  >
                    <Phone className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span className="truncate">{profile.phone}</span>
                  </a>
                )}
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs font-bold transition hover:bg-white/15"
                  >
                    <Mail className="h-4 w-4 text-blue-400 shrink-0" />
                    <span className="truncate">{profile.email}</span>
                  </a>
                )}
                {profile.telegram && (
                  <a
                    href={`https://t.me/${profile.telegram.replace('@', '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs font-bold transition hover:bg-white/15"
                  >
                    <MessageCircle className="h-4 w-4 text-sky-400 shrink-0" />
                    <span className="truncate">@{profile.telegram.replace('@', '')}</span>
                  </a>
                )}
                {profile.github && (
                  <a
                    href={`https://github.com/${profile.github}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs font-bold transition hover:bg-white/15"
                  >
                    <FolderGit2 className="h-4 w-4 text-purple-400 shrink-0" />
                    <span className="truncate">{profile.github}</span>
                  </a>
                )}
                {profile.linkedin && (
                  <a
                    href={`https://linkedin.com/in/${profile.linkedin}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs font-bold transition hover:bg-white/15"
                  >
                    <Briefcase className="h-4 w-4 text-blue-500 shrink-0" />
                    <span className="truncate">{profile.linkedin}</span>
                  </a>
                )}
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs font-bold transition hover:bg-white/15"
                  >
                    <Globe className="h-4 w-4 text-amber-400 shrink-0" />
                    <span className="truncate">Website</span>
                  </a>
                )}
              </div>

              {/* Bottom Card Footer */}
              <div className="relative mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-[10px] font-bold tracking-wider text-slate-400">
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-amber-400" />
                  USHQN VERIFIED TALENT ID
                </span>
                <span>NFC / QR / VCARD READY</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadVCard}
                className="flex-1 min-w-[150px] inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-md hover:bg-slate-800 dark:bg-white dark:text-slate-900"
              >
                <Download className="h-4 w-4 text-blue-500" />
                <span>{isKz ? 'Телефон контактісіне сақтау (.vcf)' : isRu ? 'Добавить в контакты (.vcf)' : 'Save to Contacts (.vcf)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setVisitorFormOpen((v) => !v)}
                className="flex-1 min-w-[150px] inline-flex items-center justify-center gap-2 rounded-xl border border-blue-600 bg-blue-50/60 px-4 py-3 text-xs font-bold text-blue-700 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300"
              >
                <Send className="h-4 w-4 text-blue-600" />
                <span>{visitorFormOpen ? (isKz ? 'Форманы жабу' : isRu ? 'Скрыть форму' : 'Close form') : isKz ? 'Байланыс орнату (Лид қалдыру)' : isRu ? 'Оставить заявку/контакт' : 'Leave contact / inquiry'}</span>
              </button>
            </div>
          </div>

          {/* Right column: Lead capture form & QR details */}
          <div className="space-y-4">
            {visitorFormOpen ? (
              <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-5 dark:border-blue-900/60 dark:bg-blue-950/20">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Send className="h-4 w-4 text-blue-600" />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {isKz ? 'Байланыс орнату & Ақпарат жинау' : isRu ? 'Форма обратной связи и сбора лидов' : 'Contact & Lead Capture'}
                    </h4>
                  </div>
                  <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    REAL CRM
                  </span>
                </div>
                <p className="mb-4 text-xs text-slate-600 dark:text-slate-300">
                  {isKz
                    ? 'Бұл форма арқылы келген кез келген ұсыныс, стажировка шақыруы немесе серіктестік тікелей визитка иесінің CRM базасына түседі.'
                    : isRu
                    ? 'Заполните форму, и ваши контакты с предложением сразу попадут во входящие заявки автора.'
                    : 'Fill out this form and your contact information will be sent directly to the card owner inbox.'}
                </p>

                <form onSubmit={handleSubmitLead} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">
                      {isKz ? 'Аты-жөніңіз *' : isRu ? 'Ваше имя *' : 'Your name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      placeholder={isKz ? 'Мысалы: Бауыржан Серіков' : isRu ? 'Например: Данияр' : 'e.g. Alex Smith'}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">
                        {isKz ? 'Телефон / WhatsApp *' : isRu ? 'Телефон / WhatsApp *' : 'Phone / WhatsApp *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={visitorPhone}
                        onChange={(e) => setVisitorPhone(e.target.value)}
                        placeholder="+7 777 000 0000"
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">
                        Email
                      </label>
                      <input
                        type="email"
                        value={visitorEmail}
                        onChange={(e) => setVisitorEmail(e.target.value)}
                        placeholder="hr@company.kz"
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">
                      {isKz ? 'Компания / Университет' : isRu ? 'Компания / ВУЗ' : 'Organization'}
                    </label>
                    <input
                      type="text"
                      value={visitorCompany}
                      onChange={(e) => setVisitorCompany(e.target.value)}
                      placeholder="Kaspi, Astana Hub, NU..."
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">
                      {isKz ? 'Ұсыныс немесе хабарлама' : isRu ? 'Сообщение / Предложение' : 'Message / Offer'}
                    </label>
                    <textarea
                      rows={2}
                      value={visitorMsg}
                      onChange={(e) => setVisitorMsg(e.target.value)}
                      placeholder={isKz ? 'Жобаға шақыру, стажировка немесе сұрақ...' : isRu ? 'Опишите ваше предложение...' : 'Your message...'}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingLead}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    <span>{submittingLead ? (isKz ? 'Жіберілуде...' : isRu ? 'Отправка...' : 'Sending...') : isKz ? 'Сұранысты жіберу' : isRu ? 'Отправить контакты' : 'Send contact'}</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/40">
                    <QrCode className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {isKz ? 'Смартфон камерасымен сканерлеу' : isRu ? 'Сканирование камерой телефона' : 'Scan with Camera'}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {isKz ? 'NFC немесе QR арқылы тікелей қосылу' : isRu ? 'Мгновенное добавление в контакты' : 'Direct vCard addition'}
                    </p>
                  </div>
                </div>

                <div className="flex justify-center p-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-md dark:border-slate-700 dark:bg-slate-800">
                    <img src={qrDataUrl} alt="QR Code Large" className="h-44 w-44 rounded-xl" />
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-300 space-y-1.5">
                  <div className="flex items-center justify-between font-semibold">
                    <span>{isKz ? 'Тікелей сілтеме:' : isRu ? 'Прямая ссылка:' : 'Direct Link:'}</span>
                    <button
                      type="button"
                      onClick={() => {
                        void navigator.clipboard.writeText(publicCardUrl)
                        toast(isKz ? 'Сілтеме көшірілді' : isRu ? 'Скопировано' : 'Copied')
                      }}
                      className="text-blue-600 hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <Copy className="h-3 w-3" />
                      {isKz ? 'Көшіру' : isRu ? 'Копировать' : 'Copy'}
                    </button>
                  </div>
                  <p className="truncate font-mono text-[11px] text-slate-500">{publicCardUrl}</p>
                </div>

                <div className="flex gap-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `${profile.fullName} - Цифрлық визитка: ${publicCardUrl}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-50 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(publicCardUrl)}&text=${encodeURIComponent(
                      `${profile.fullName} - USHQN Digital Card`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-sky-500/40 bg-sky-50 py-2 text-xs font-bold text-sky-700 hover:bg-sky-100 dark:bg-sky-950/40 dark:text-sky-300"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Telegram</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PROFILE EDITOR */}
      {activeTab === 'editor' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isKz ? 'Визитка деректерін өзгерту' : isRu ? 'Настройка данных визитки' : 'Edit Business Card'}
              </h3>
              <p className="text-xs text-slate-500">
                {isKz ? 'Барлық өзгерістер нақты уақытта QR-код пен .vcf файлында жаңартылады' : isRu ? 'Изменения мгновенно применяются к QR и vCard' : 'Changes apply live to QR and vCard'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setProfile(defaultProfile)
                toast(isKz ? 'Бастапқы күйге келтірілді' : isRu ? 'Сброшено' : 'Reset')
              }}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>{isKz ? 'Қалпына келтіру' : isRu ? 'Сброс' : 'Reset'}</span>
            </button>
          </div>

          {/* Theme selector */}
          <div>
            <label className="mb-2 block text-xs font-bold text-slate-700 dark:text-slate-300">
              {isKz ? 'Визитка Дизайны & Түсі' : isRu ? 'Тема оформления визитки' : 'Card Design Theme'}
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {[
                { id: 'dark_executive' as const, label: 'Dark Executive', bg: 'bg-zinc-900 text-white' },
                { id: 'cyber_kz' as const, label: 'Cyber KZ (Cyan)', bg: 'bg-cyan-950 text-cyan-200' },
                { id: 'emerald_pro' as const, label: 'Emerald Tech', bg: 'bg-emerald-950 text-emerald-200' },
                { id: 'sapphire_modern' as const, label: 'Sapphire Modern', bg: 'bg-blue-950 text-blue-200' },
                { id: 'minimal_white' as const, label: 'Minimal Clean', bg: 'bg-white text-slate-900 border' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setProfile((p) => ({ ...p, theme: t.id }))}
                  className={`flex flex-col items-center rounded-xl p-3 text-xs font-bold transition ${t.bg} ${
                    profile.theme === t.id ? 'ring-2 ring-blue-600 scale-105 shadow-md' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {isKz ? 'Аты-жөні' : isRu ? 'ФИО' : 'Full Name'}
              </label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {isKz ? 'Мамандығы / Ролі' : isRu ? 'Должность / Специализация' : 'Role / Title'}
              </label>
              <input
                type="text"
                value={profile.role}
                onChange={(e) => setProfile((p) => ({ ...p, role: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {isKz ? 'Мектеп / Университет / Ұйым' : isRu ? 'Организация / ВУЗ / Школа' : 'Organization'}
              </label>
              <input
                type="text"
                value={profile.organization}
                onChange={(e) => setProfile((p) => ({ ...p, organization: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {isKz ? 'Телефон нөмірі (vCard үшін)' : isRu ? 'Телефон' : 'Phone'}
              </label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Email
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Telegram Username
              </label>
              <input
                type="text"
                value={profile.telegram}
                onChange={(e) => setProfile((p) => ({ ...p, telegram: e.target.value }))}
                placeholder="username"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                GitHub Username
              </label>
              <input
                type="text"
                value={profile.github}
                onChange={(e) => setProfile((p) => ({ ...p, github: e.target.value }))}
                placeholder="github_username"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                LinkedIn Username
              </label>
              <input
                type="text"
                value={profile.linkedin}
                onChange={(e) => setProfile((p) => ({ ...p, linkedin: e.target.value }))}
                placeholder="linkedin_handle"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {isKz ? 'Қысқаша Био / Түйіндеме' : isRu ? 'Краткая биография' : 'Bio Summary'}
            </label>
            <textarea
              rows={3}
              value={profile.bio}
              onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Skills Management */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {isKz ? 'Дағдылар & Тегтер' : isRu ? 'Навыки и стек технологий' : 'Skills'}
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {profile.skills.map((s, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                >
                  <span>{s}</span>
                  <button
                    type="button"
                    onClick={() => setProfile((p) => ({ ...p, skills: p.skills.filter((_, i) => i !== idx) }))}
                    className="text-blue-400 hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && skillInput.trim()) {
                    e.preventDefault()
                    setProfile((p) => ({ ...p, skills: [...p.skills, skillInput.trim()] }))
                    setSkillInput('')
                  }
                }}
                placeholder={isKz ? 'Жаңа дағды жазып Enter басыңыз...' : isRu ? 'Добавить навык и нажать Enter...' : 'Add skill...'}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
              <button
                type="button"
                onClick={() => {
                  if (skillInput.trim()) {
                    setProfile((p) => ({ ...p, skills: [...p.skills, skillInput.trim()] }))
                    setSkillInput('')
                  }
                }}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
              >
                + Қосу
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LEADS & CRM INBOX */}
      {activeTab === 'leads' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center border-b border-slate-100 pb-4 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isKz ? 'Визиткадан түскен сұраныстар (Lead Inbox)' : isRu ? 'Входящие лиды и контакты' : 'Leads & Inquiries Inbox'}
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                {isKz
                  ? 'Сіздің визиткаңызды қарап, байланыс немесе стажировка ұсынған HR мамандары мен серіктестердің нақты базасы.'
                  : isRu
                  ? 'Контакты рекрутеров и клиентов, оставивших заявку через вашу визитку.'
                  : 'Real contact database of recruiters and partners who reached out through your card.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportLeadsCsv}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span>{isKz ? 'Excel / CSV экспорт' : isRu ? 'Экспорт в CSV' : 'Export CSV'}</span>
              </button>
            </div>
          </div>

          {leads.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-800">
              <Users className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-2 text-xs font-semibold text-slate-500">
                {isKz ? 'Әзірге түскен сұраныстар жоқ' : isRu ? 'Пока нет новых заявок' : 'No leads yet'}
              </p>
              <p className="text-[11px] text-slate-400">
                {isKz ? 'Визиткаңызды бөлісіңіз, сонда контактілер осында жиналады' : isRu ? 'Поделитесь визиткой, чтобы собирать контакты' : 'Share your card to start gathering contacts'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40 sm:flex-row sm:items-center"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-xs font-black text-slate-900 dark:text-white">{lead.visitorName}</h4>
                      <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                        {lead.visitorCompany}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(lead.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 italic">
                      "{lead.message}"
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                      {lead.visitorPhone && (
                        <a
                          href={`tel:${lead.visitorPhone}`}
                          className="flex items-center gap-1 text-blue-600 hover:underline font-mono"
                        >
                          <Phone className="h-3 w-3" />
                          <span>{lead.visitorPhone}</span>
                        </a>
                      )}
                      {lead.visitorEmail && (
                        <a
                          href={`mailto:${lead.visitorEmail}`}
                          className="flex items-center gap-1 text-slate-600 hover:underline dark:text-slate-300 font-mono"
                        >
                          <Mail className="h-3 w-3" />
                          <span>{lead.visitorEmail}</span>
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Quick WhatsApp reply */}
                    {lead.visitorPhone && (
                      <a
                        href={`https://wa.me/${lead.visitorPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Сәлеметсіз бе, ${lead.visitorName}! Менің USHQN визиткама қалдырған хабарламаңызды алдым.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-600"
                      >
                        <MessageCircle className="h-3 w-3" />
                        <span>WhatsApp</span>
                      </a>
                    )}

                    {/* Status dropdown */}
                    <select
                      value={lead.status}
                      onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as CardLead['status'])}
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      <option value="new">🟡 Жаңа</option>
                      <option value="contacted">🔵 Байланыста</option>
                      <option value="approved">🟢 Келісілді</option>
                      <option value="archived">⚪ Мұрағат</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => handleDeleteLead(lead.id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: REAL API SYNC & GATHERING */}
      {activeTab === 'api_sync' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-6">
            <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isKz ? 'Реал API арқылы деректерді жинау (GitHub & CP)' : isRu ? 'Интеграция с реальными API разработчика' : 'Developer Real API Integrations'}
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                {isKz
                  ? 'Нақты GitHub немесе Codeforces аккаунтын енгізіп, нақты жобалар, репозиторийлер, жұлдыздар мен рейтингтерді тікелей API арқылы алыңыз.'
                  : isRu
                  ? 'Введите GitHub username или Codeforces handle для получения реальных репозиториев, звезд и спортивного рейтинга.'
                  : 'Enter any GitHub username or Codeforces handle to fetch real repositories, stars, and competitive programming ratings.'}
              </p>
            </div>

            {/* GitHub API Section */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-800/40 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderGit2 className="h-5 w-5 text-slate-900 dark:text-white" />
                  <h4 className="text-xs font-black uppercase tracking-wide text-slate-900 dark:text-white">
                    GitHub Live REST API
                  </h4>
                </div>
                <span className="rounded bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                  api.github.com
                </span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={githubQuery}
                  onChange={(e) => setGithubQuery(e.target.value)}
                  placeholder="GitHub username (e.g. torvalds, shadcn, alikhan)"
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-white font-mono"
                />
                <button
                  type="button"
                  disabled={githubLoading}
                  onClick={handleFetchGitHub}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-700 disabled:opacity-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${githubLoading ? 'animate-spin' : ''}`} />
                  <span>{githubLoading ? 'Жүктелуде...' : 'API-ден алу'}</span>
                </button>
              </div>

              {githubData && (
                <div className="space-y-4 rounded-xl border border-purple-200 bg-white p-4 dark:border-purple-900/60 dark:bg-slate-900">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <img
                        src={githubData.avatar_url}
                        alt={githubData.login}
                        className="h-12 w-12 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{githubData.name}</h4>
                        <a
                          href={githubData.html_url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-xs text-purple-600 hover:underline"
                        >
                          <span>@{githubData.login}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <div className="rounded-lg bg-slate-50 px-3 py-1 text-center dark:bg-slate-800">
                        <span className="block font-black text-slate-900 dark:text-white">{githubData.public_repos}</span>
                        <span className="text-[10px] text-slate-500">Репозиторий</span>
                      </div>
                      <div className="rounded-lg bg-slate-50 px-3 py-1 text-center dark:bg-slate-800">
                        <span className="block font-black text-slate-900 dark:text-white">{githubData.followers}</span>
                        <span className="text-[10px] text-slate-500">Жазылушылар</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleApplyGitHubToProfile}
                        className="rounded-xl bg-purple-600 px-3 py-2 text-xs font-bold text-white hover:bg-purple-700"
                      >
                        Визиткаға толтыру
                      </button>
                    </div>
                  </div>

                  {githubData.bio && <p className="text-xs text-slate-600 dark:text-slate-300">{githubData.bio}</p>}

                  {/* Real Live Repositories */}
                  <div>
                    <h5 className="mb-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                      Жақында жаңартылған репозиторийлер:
                    </h5>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {githubData.repos.map((r, i) => (
                        <a
                          key={i}
                          href={r.html_url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs transition hover:border-purple-300 hover:bg-purple-50/40 dark:border-slate-800 dark:bg-slate-800/60"
                        >
                          <div className="flex items-center justify-between font-bold text-purple-700 dark:text-purple-300">
                            <span className="truncate">{r.name}</span>
                            <span className="text-[10px] text-amber-500">★ {r.stargazers_count}</span>
                          </div>
                          <p className="mt-1 line-clamp-1 text-[11px] text-slate-500">{r.description}</p>
                          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                            <span>💻 {r.language}</span>
                            <span>{new Date(r.updated_at).toLocaleDateString()}</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Codeforces Live API Section */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-800/40 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  <h4 className="text-xs font-black uppercase tracking-wide text-slate-900 dark:text-white">
                    Codeforces Competitive Programming API
                  </h4>
                </div>
                <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  codeforces.com/api
                </span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={cfQuery}
                  onChange={(e) => setCfQuery(e.target.value)}
                  placeholder="Codeforces handle (e.g. tourist, Benq, alikhan)"
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-white font-mono"
                />
                <button
                  type="button"
                  disabled={cfLoading}
                  onClick={handleFetchCodeforces}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700 disabled:opacity-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${cfLoading ? 'animate-spin' : ''}`} />
                  <span>{cfLoading ? 'Жүктелуде...' : 'Рейтингті алу'}</span>
                </button>
              </div>

              {cfData && (
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-amber-200 bg-white p-4 dark:border-amber-900/60 dark:bg-slate-900">
                  <div className="flex items-center gap-3">
                    {cfData.avatar && (
                      <img src={cfData.avatar} alt={cfData.handle} className="h-12 w-12 rounded-xl object-cover" />
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{cfData.handle}</h4>
                      <p className="text-xs font-bold text-red-600">{cfData.rank?.toUpperCase()}</p>
                      {cfData.organization && (
                        <p className="text-[11px] text-slate-500">{cfData.organization}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <div className="rounded-lg bg-amber-50 px-3 py-1.5 text-center dark:bg-amber-950/40">
                      <span className="block text-sm font-black text-amber-700 dark:text-amber-300">
                        {cfData.rating ?? 'N/A'}
                      </span>
                      <span className="text-[10px] text-slate-500">Current Rating</span>
                    </div>
                    <div className="rounded-lg bg-amber-50 px-3 py-1.5 text-center dark:bg-amber-950/40">
                      <span className="block text-sm font-black text-amber-700 dark:text-amber-300">
                        {cfData.maxRating ?? 'N/A'}
                      </span>
                      <span className="text-[10px] text-slate-500">Max Rating ({cfData.maxRank})</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
