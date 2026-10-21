import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import {
  Bell,
  MessageSquare,
  Settings,
  LogOut,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { productNavigation } from '../product/navigation'
import { useCopy } from '../product/useCopy'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

export function Sidebar() {
  const copy = useCopy()
  const { i18n } = useTranslation()
  const { userId } = useAuth()
  const navigate = useNavigate()
  const profile = useQuery({
    queryKey: ['sidebar-profile', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('display_name,is_admin,is_moderator')
        .eq('id', userId!)
        .single()
      if (error) throw error
      return data
    },
  })
  const tools = [
    {
      to: '/chat',
      icon: MessageSquare,
      label: copy('Сообщения', 'Хабарламалар', 'Messages'),
    },
    {
      to: '/notifications',
      icon: Bell,
      label: copy('Уведомления', 'Ескертулер', 'Notifications'),
    },
    {
      to: '/settings',
      icon: Settings,
      label: copy('Настройки', 'Баптаулар', 'Settings'),
    },
    ...(profile.data?.is_admin || profile.data?.is_moderator
      ? [
          {
            to: '/admin',
            icon: ShieldCheck,
            label: copy('Модерация', 'Модерация', 'Moderation'),
          },
        ]
      : []),
  ]
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-56 flex-col border-r border-[var(--color-ushqn-border)] bg-[var(--color-ushqn-surface)] p-4 lg:flex">
      <NavLink
        to="/home"
        className="mb-8 mt-3 flex items-center gap-2 px-3 text-xl font-black tracking-tight"
      >
        <Sparkles size={24} className="text-violet-600" /> USHQN
      </NavLink>
      <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">
        From Spark to Success
      </p>
      <nav
        aria-label={copy(
          'Основные разделы',
          'Негізгі бөлімдер',
          'Main navigation',
        )}
        className="flex-1 space-y-1 overflow-y-auto"
      >
        {productNavigation.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold ${isActive ? 'bg-violet-600 text-white' : 'text-[var(--color-ushqn-muted)] hover:bg-[var(--color-ushqn-surface-muted)]'}`
            }
          >
            <Icon size={17} />
            {copy(label[0], label[1], label[2])}
          </NavLink>
        ))}
        <div className="my-5 border-t border-[var(--color-ushqn-border)]" />
        {tools.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-[var(--color-ushqn-muted)] hover:bg-[var(--color-ushqn-surface-muted)]"
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-4 border-t border-[var(--color-ushqn-border)] pt-4">
        <label className="flex items-center justify-between gap-2 text-xs text-[var(--color-ushqn-muted)]">
          {copy('Язык', 'Тіл', 'Language')}
          <select
            aria-label={copy('Язык', 'Тіл', 'Language')}
            value={i18n.language.split('-')[0]}
            onChange={(e) => void i18n.changeLanguage(e.target.value)}
            className="rounded-lg bg-[var(--color-ushqn-surface-muted)] p-2"
          >
            <option value="ru">RU</option>
            <option value="kk">KZ</option>
            <option value="en">EN</option>
          </select>
        </label>
        <p className="mt-4 truncate px-1 text-xs font-semibold">
          {profile.data?.display_name}
        </p>
        <button
          type="button"
          onClick={() =>
            void supabase.auth.signOut().then(() => navigate('/login'))
          }
          className="mt-2 flex items-center gap-2 px-1 py-2 text-xs text-[var(--color-ushqn-muted)]"
        >
          <LogOut size={15} />
          {copy('Выйти', 'Шығу', 'Sign out')}
        </button>
      </div>
    </aside>
  )
}
