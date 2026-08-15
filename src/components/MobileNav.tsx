import { NavLink } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { Home, Briefcase, Users, MessageSquare, User } from 'lucide-react'

export function MobileNav() {
  const { userId } = useAuth()
  const { t } = useTranslation()
  const qc = useQueryClient()

  const { data: unreadCount } = useQuery({
    queryKey: ['notif-count', userId],
    enabled: Boolean(userId),
    refetchInterval: 30_000,
    queryFn: async () => {
      const { count } = await supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', userId!).eq('is_read', false)
      return count ?? 0
    },
  })

  useEffect(() => {
    if (!userId) return
    const channel = supabase.channel(`notif-live-mobile:${userId}`).on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, () => {
      void qc.invalidateQueries({ queryKey: ['notif-count', userId] })
    }).subscribe()
    return () => { void supabase.removeChannel(channel) }
  }, [userId, qc])

  const navItems = [
    { to: '/home', label: t('nav.home'), icon: Home },
    { to: '/jobs', label: t('nav.jobs'), icon: Briefcase },
    { to: '/people', label: t('nav.people'), icon: Users },
    { to: '/chat', label: t('nav.chat'), icon: MessageSquare },
    { to: '/profile', label: t('nav.profile'), icon: User },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--color-ushqn-border)] bg-[var(--color-ushqn-surface)]/90 backdrop-blur-md sm:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/home'}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center justify-center gap-1 text-[10px] font-bold tracking-tight transition ${
                isActive ? 'text-indigo-600' : 'text-[var(--color-ushqn-muted)]'
              }`
            }
          >
            <div className="relative">
              <item.icon size={20} />
              {item.to === '/chat' && unreadCount && unreadCount > 0 ? (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              ) : null}
            </div>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
