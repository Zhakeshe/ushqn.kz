import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useChatUnreadCount, useNotificationUnreadCount } from '../hooks/useUnreadCounts'

/* ── Nav icons ── */
function IHome() {
  return <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z" clipRule="evenodd" /></svg>
}
function IJobs() {
  return <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d="M6 3.75A2.75 2.75 0 0 1 8.75 1h2.5A2.75 2.75 0 0 1 14 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.54-1.952.599-4.024.921-6.17.921s-4.219-.322-6.17-.921C2.694 12.73 2 11.665 2 10.539V7.07c0-1.32.947-2.489 2.294-2.676A41.047 41.047 0 0 1 6 4.193V3.75Zm6.5 0v.325a41.622 41.622 0 0 0-5 0V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25ZM10 10a1 1 0 0 0-1 1v.01a1 1 0 0 0 1 1h.01a1 1 0 0 0 1-1V11a1 1 0 0 0-1-1H10Z" clipRule="evenodd" /></svg>
}
function IPeople() {
  return <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM14.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 18a9.953 9.953 0 0 1-5.385-1.572Z" /></svg>
}
function IChat() {
  return <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d="M2 9.5A7.5 7.5 0 0 1 9.5 2h1A7.5 7.5 0 0 1 18 9.5v.5a7.5 7.5 0 0 1-7.5 7.5h-.5a7.469 7.469 0 0 1-3.5-.873l-3.44 1.146a.5.5 0 0 1-.622-.622l1.146-3.44A7.469 7.469 0 0 1 2 10v-.5Z" clipRule="evenodd" /></svg>
}
function ICalendar() {
  return <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z" clipRule="evenodd" /></svg>
}
function IProfile() {
  return <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" /></svg>
}
function IAch() {
  return <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d="M10 1a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 1ZM10 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-7 4a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 3 10Zm13.25-.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5h-1.5Z" clipRule="evenodd" /></svg>
}
function IRating() {
  return <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.83-4.401Z" clipRule="evenodd" /></svg>
}
function ISwords() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-amber-500"><polygon points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" /><line x1="13" x2="19" y1="19" y2="13" /><line x1="16" x2="20" y1="16" y2="20" /><line x1="19" x2="21" y1="21" y2="19" /><polygon points="14.5 6.5 18 3 21 3 21 6 17.5 9.5" /></svg>
}
function ICompass() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-blue-500"><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></svg>
}
function IGrad() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-emerald-500"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
}
function IQr() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-purple-500"><rect width="5" height="5" x="3" y="3" rx="1" /><rect width="5" height="5" x="16" y="3" rx="1" /><rect width="5" height="5" x="3" y="16" rx="1" /><path d="M21 16h-3a2 2 0 0 0-2 2v3" /><path d="M21 21v.01" /><path d="M12 7v3a2 2 0 0 1-2 2H7" /><path d="M3 12h.01" /><path d="M12 3h.01" /><path d="M12 16v.01" /><path d="M16 12h1" /><path d="M21 12v.01" /><path d="M12 21v-1" /></svg>
}
function ISettings() {
  return <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d="M7.84 1.804A1 1 0 0 1 8.82 1h2.36a1 1 0 0 1 .98.804l.295 1.473c.497.144.971.342 1.416.587l1.25-.834a1 1 0 0 1 1.262.125l1.67 1.67a1 1 0 0 1 .124 1.262l-.833 1.25c.245.445.443.919.587 1.416l1.473.294a1 1 0 0 1 .804.98v2.361a1 1 0 0 1-.804.98l-1.473.295a6.95 6.95 0 0 1-.587 1.416l.833 1.25a1 1 0 0 1-.124 1.262l-1.67 1.67a1 1 0 0 1-1.262.124l-1.25-.833a6.953 6.953 0 0 1-1.416.587l-.294 1.473a1 1 0 0 1-.98.804H8.82a1 1 0 0 1-.98-.804l-.295-1.473a6.957 6.957 0 0 1-1.416-.587l-1.25.833a1 1 0 0 1-1.262-.124l-1.67-1.67a1 1 0 0 1-.124-1.262l.833-1.25a6.957 6.957 0 0 1-.587-1.416l-1.473-.294A1 1 0 0 1 1 11.18V8.82a1 1 0 0 1 .804-.98l1.473-.295c.144-.497.342-.971.587-1.416l-.833-1.25a1 1 0 0 1 .124-1.262l1.67-1.67a1 1 0 0 1 1.262-.125l1.25.834a6.957 6.957 0 0 1 1.416-.587L7.84 1.804ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" /></svg>
}
function IBell() {
  return <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d="M10 2a6 6 0 0 0-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 0 0 .515 1.076 32.091 32.091 0 0 0 3.256.508 3.5 3.5 0 0 0 6.972 0 32.085 32.085 0 0 0 3.256-.508.75.75 0 0 0 .515-1.076A11.448 11.448 0 0 1 16 8a6 6 0 0 0-6-6ZM8.05 14.943a33.54 33.54 0 0 0 3.9 0 2 2 0 0 1-3.9 0Z" clipRule="evenodd" /></svg>
}
function ILogout() {
  return <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z" clipRule="evenodd" /><path fillRule="evenodd" d="M19 10a.75.75 0 0 0-.75-.75H8.704l1.048-.943a.75.75 0 1 0-1.004-1.114l-2.5 2.25a.75.75 0 0 0 0 1.114l2.5 2.25a.75.75 0 1 0 1.004-1.114L8.705 10.75H18.25A.75.75 0 0 0 19 10Z" clipRule="evenodd" /></svg>
}

/* ── Lang switcher inside sidebar ── */
const LANGS = [
  { code: 'ru', label: 'RU' },
  { code: 'kk', label: 'KZ' },
  { code: 'en', label: 'EN' },
]

function NavItem({
  to,
  icon: Icon,
  label,
  end,
  badge,
  status,
}: {
  to: string
  icon: () => React.ReactElement
  label: string
  end?: boolean
  badge?: number | null
  status?: string
}) {
  return (
    <NavLink
      to={to}
      end={end}
      title={label}
      className={({ isActive }) =>
        `flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-150 ${
          isActive
            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100'
        }`
      }
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="shrink-0">
          <Icon />
        </span>
        <span className="truncate">{label}</span>
      </div>
      {badge ? (
        <span className="rounded-full bg-blue-600 px-1.5 py-0.2 text-[10px] font-bold text-white">
          {badge}
        </span>
      ) : null}
      {status ? (
        <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-amber-800 dark:bg-amber-950 dark:text-amber-300">
          {status}
        </span>
      ) : null}
    </NavLink>
  )
}

export function Sidebar() {
  const { userId } = useAuth()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)

  const { data: unreadCount } = useNotificationUnreadCount(userId)
  const { data: unreadChat } = useChatUnreadCount(userId)

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  async function logout() {
    await supabase.auth.signOut()
    navigate('/login', { replace: true })
  }

  const notifBadge = (unreadCount ?? 0) > 0 ? Math.min(unreadCount ?? 0, 99) : null
  const chatBadge = (unreadChat ?? 0) > 0 ? Math.min(unreadChat ?? 0, 99) : null
  const curLang = LANGS.find((l) => l.code === i18n.language) ?? LANGS[0]

  const isKz = i18n.language === 'kk'
  const isRu = i18n.language === 'ru'

  const coreItems = [
    { to: '/home', icon: IHome, label: t('nav.home'), end: true },
    { to: '/achievements', icon: IAch, label: t('nav.achievements') },
    { to: '/jobs', icon: IJobs, label: t('nav.jobs') },
    { to: '/people', icon: IPeople, label: t('nav.people') },
    { to: '/chat', icon: IChat, label: t('nav.chat'), badge: chatBadge },
    { to: '/calendar', icon: ICalendar, label: t('nav.calendar') },
    { to: '/rating', icon: IRating, label: t('nav.rating') },
  ]

  const demoLabel = isKz ? 'Демо' : isRu ? 'Демо' : 'Demo'
  const labItems = [
    { to: '/roadmap', icon: ICompass, label: isKz ? 'Roadmap & AI' : isRu ? 'Roadmap & AI' : 'Roadmap & AI', status: demoLabel },
    { to: '/gamification', icon: ISwords, label: isKz ? 'Оқу зертханасы' : isRu ? 'Учебная лаборатория' : 'Learning lab', status: demoLabel },
    { to: '/grants', icon: IGrad, label: isKz ? 'Мүмкіндіктер' : isRu ? 'Возможности' : 'Opportunities', status: demoLabel },
    { to: '/passport', icon: IQr, label: isKz ? 'Цифрлық паспорт' : isRu ? 'Цифровой паспорт' : 'Digital passport', status: demoLabel },
  ]

  const bottomItems = [
    { to: '/profile', icon: IProfile, label: t('nav.profile') },
    { to: '/notifications', icon: IBell, label: t('nav.notifications'), badge: notifBadge },
    { to: '/settings', icon: ISettings, label: t('nav.settings') },
  ]

  return (
    <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 w-56 flex-col justify-between border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 z-40">
      <div className="min-h-0 overflow-y-auto pr-1">
        {/* Brand */}
        <div className="mb-6 flex items-center justify-between px-2 pt-1">
          <NavLink to="/home" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-xs font-black text-white dark:bg-white dark:text-slate-900">
              U
            </span>
            <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
              USHQN
            </span>
          </NavLink>

          {/* Lang Selector */}
          <div className="relative" ref={langRef}>
            <button
              type="button"
              onClick={() => setLangOpen((v) => !v)}
              className="rounded-md border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {curLang.label}
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 w-16 rounded-md border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-slate-900 z-50">
                {LANGS.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      void i18n.changeLanguage(l.code)
                      setLangOpen(false)
                    }}
                    className={`block w-full px-2.5 py-1 text-left text-xs ${
                      l.code === i18n.language ? 'font-bold text-blue-600' : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Menu */}
        <div className="space-y-1">
          {coreItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </div>

        <div className="mt-5">
          <p className="mb-1.5 px-3 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
            {isKz ? 'Зертхана' : isRu ? 'Лаборатория' : 'Labs'}
          </p>
          <div className="space-y-1">
            {labItems.map((item) => (
              <NavItem key={item.to} {...item} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Menu */}
      <div className="space-y-1 border-t border-slate-100 pt-3 dark:border-slate-800">
        {bottomItems.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
        >
          <ILogout />
          <span>{t('nav.logout')}</span>
        </button>
      </div>
    </aside>
  )
}
