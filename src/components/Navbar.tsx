import type { ReactNode } from 'react'
import { useState, useRef, useEffect, useMemo } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import type { LucideIcon } from 'lucide-react'
import {
  Home,
  User,
  Briefcase,
  MessageSquare,
  Calendar,
  Layers,
  Bell,
  LogOut,
  ChevronDown,
  Globe,
  MoreHorizontal,
  Trophy,
  Users,
  Settings,
  ShieldCheck,
  Link as LinkIcon
} from 'lucide-react'

const LANGS = [
  { code: 'ru', label: 'RU' },
  { code: 'kk', label: 'KZ' },
  { code: 'en', label: 'EN' },
]

function LangSwitcher() {
  const { i18n, t } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = LANGS.find((l) => l.code === i18n.language) ?? LANGS[0]

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t('lang.label')}
        className="flex h-9 items-center gap-2 rounded-lg border border-[var(--color-ushqn-border)] bg-[var(--color-ushqn-surface-muted)] px-3 text-[11px] font-bold uppercase tracking-widest text-[var(--color-ushqn-muted)] hover:border-indigo-200 hover:text-indigo-600 transition-all dark:hover:border-indigo-900"
      >
        <Globe size={14} />
        <span>{current.label}</span>
        <ChevronDown size={12} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open ? (
        <div className="absolute right-0 top-full z-[60] mt-2 min-w-[8rem] overflow-hidden rounded-xl border border-[var(--color-ushqn-border)] bg-[var(--color-ushqn-surface)] py-1 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
          {LANGS.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => {
                void i18n.changeLanguage(lang.code)
                setOpen(false)
              }}
              className={`flex w-full items-center px-4 py-2 text-sm font-medium transition ${
                i18n.language === lang.code
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20'
                  : 'text-[var(--color-ushqn-muted)] hover:bg-[var(--color-ushqn-surface-muted)] hover:text-[var(--color-ushqn-text)]'
              }`}
            >
              {lang.label === 'RU' ? 'Русский' : lang.label === 'KZ' ? 'Қазақша' : 'English'}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function NavPill({ to, end, children, icon: Icon }: { to: string; end?: boolean; children: ReactNode; icon: LucideIcon }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
          isActive
            ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 shadow-sm'
            : 'text-[var(--color-ushqn-muted)] hover:bg-[var(--color-ushqn-surface-muted)] hover:text-indigo-600'
        }`
      }
    >
      <Icon size={18} />
      <span className="hidden xl:inline">{children}</span>
    </NavLink>
  )
}

export function Navbar() {
  const { userId } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const [moreOpen, setMoreOpen] = useState(false)
  const moreRef = useRef<HTMLDivElement>(null)

  const { data: staff } = useQuery({
    queryKey: ['profile-staff-flags', userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('is_admin,is_moderator,role').eq('id', userId!).single()
      return {
        isAdmin: Boolean(data?.is_admin),
        isModerator: Boolean(data?.is_moderator),
        role: (data?.role as string) ?? '',
      }
    },
  })

  const { data: unreadCount } = useQuery({
    queryKey: ['notif-count', userId],
    enabled: Boolean(userId),
    refetchInterval: 30_000,
    queryFn: async () => {
      const { count } = await supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', userId!).eq('is_read', false)
      return count ?? 0
    },
  })

  const moreItems = useMemo(() => {
    const base = [
      { to: '/achievements', label: t('nav.achievements'), icon: Trophy },
      { to: '/rating', label: t('nav.rating'), icon: Users },
      { to: '/people', label: t('nav.people'), icon: Users },
    ]
    if (['parent', 'teacher', 'student', 'pupil'].includes(staff?.role ?? '')) base.push({ to: '/connections', label: t('nav.connections'), icon: LinkIcon })
    base.push({ to: '/communities', label: t('nav.communities'), icon: Layers }, { to: '/settings', label: t('nav.settings'), icon: Settings })
    if (staff?.isAdmin || staff?.isModerator) base.push({ to: '/admin', label: t('nav.admin'), icon: ShieldCheck })
    return base
  }, [t, staff])

  useEffect(() => {
    const h = (e: MouseEvent) => { if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  useEffect(() => { setMoreOpen(false) }, [pathname])

  const badgeCount = unreadCount && unreadCount > 0 ? Math.min(unreadCount, 99) : null

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-ushqn-border)] bg-[var(--color-ushqn-surface)]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link to="/home" className="flex items-center gap-2 text-xl font-black tracking-tighter text-indigo-600">
            <span>{t('brand.wordmark')}</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            <NavPill to="/home" end icon={Home}>{t('nav.home')}</NavPill>
            <NavPill to="/profile" icon={User}>{t('nav.profile')}</NavPill>
            <NavPill to="/jobs" icon={Briefcase}>{t('nav.jobs')}</NavPill>
            <NavPill to="/chat" icon={MessageSquare}>{t('nav.chat')}</NavPill>
            <NavPill to="/calendar" icon={Calendar}>{t('nav.calendar')}</NavPill>

            <div className="relative ml-2" ref={moreRef}>
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                aria-label={t('nav.discover')}
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all ${moreOpen ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20' : 'text-[var(--color-ushqn-muted)] hover:bg-[var(--color-ushqn-surface-muted)] hover:text-indigo-600'}`}
              >
                <MoreHorizontal size={20} />
              </button>
              {moreOpen && (
                <div className="absolute left-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-[var(--color-ushqn-border)] bg-[var(--color-ushqn-surface)] py-1 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
                  {moreItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-[var(--color-ushqn-muted)] hover:bg-[var(--color-ushqn-surface-muted)] hover:text-indigo-600 transition-colors"
                    >
                      <item.icon size={16} />
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <LangSwitcher />
          <div className="h-4 w-[1px] bg-[var(--color-ushqn-border)] mx-1 hidden sm:block" />

          <Link
            to="/notifications"
            aria-label={t('nav.notifications')}
            className="group relative flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-ushqn-border)] bg-[var(--color-ushqn-surface-muted)] text-[var(--color-ushqn-muted)] hover:border-indigo-200 hover:text-indigo-600 transition-all dark:hover:border-indigo-900"
          >
            <Bell size={18} className="group-hover:animate-bounce" />
            {badgeCount ? (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
                {badgeCount > 9 ? '9+' : badgeCount}
              </span>
            ) : null}
          </Link>

          <button
            onClick={() => { void supabase.auth.signOut().then(() => navigate('/login', { replace: true })) }}
            className="flex h-9 items-center gap-2 rounded-lg border border-transparent px-3 text-sm font-bold text-rose-500 hover:bg-rose-50 transition-colors dark:hover:bg-rose-950/30"
          >
            <LogOut size={16} />
            <span className="hidden md:inline">{t('nav.logout')}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
