import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useNotificationUnreadCount(userId: string | null, realtime = false) {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: ['notif-count', userId],
    enabled: Boolean(userId),
    refetchInterval: 30_000,
    queryFn: async () => {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId!)
        .eq('is_read', false)
      if (error) throw error
      return count ?? 0
    },
  })

  useEffect(() => {
    if (!userId || !realtime) return
    const channel = supabase
      .channel(`notification-count:${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        () => void queryClient.invalidateQueries({ queryKey: ['notif-count', userId] }),
      )
      .subscribe()
    return () => {
      void supabase.removeChannel(channel)
    }
  }, [queryClient, realtime, userId])

  return query
}

export function useChatUnreadCount(userId: string | null) {
  return useQuery({
    queryKey: ['chat-unread-total', userId],
    enabled: Boolean(userId),
    refetchInterval: 15_000,
    queryFn: async () => {
      const { data, error } = await supabase.rpc('my_chat_sidebar')
      if (error) throw error
      const conversations = (data ?? []) as Array<{ unread_count: number | null }>
      return conversations.reduce(
        (total, conversation) => total + Math.max(0, Number(conversation.unread_count ?? 0)),
        0,
      )
    },
  })
}
