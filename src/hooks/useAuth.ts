import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isSupabaseConfigured) return
    let cancelled = false
    let authChanged = false
    const timer = window.setTimeout(() => {
      if (!cancelled) {
        setLoading(false)
        setError('Session check timed out. Please try signing in again.')
      }
    }, 15000)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, sess) => {
      if (cancelled) return
      authChanged = true
      clearTimeout(timer)
      setSession(sess)
      setError(null)
      setLoading(false)
    })
    void supabase.auth
      .getSession()
      .then(({ data, error: authError }) => {
        if (cancelled || authChanged) return
        clearTimeout(timer)
        setSession(data.session)
        setError(authError?.message ?? null)
        setLoading(false)
      })
      .catch((err: unknown) => {
        if (cancelled || authChanged) return
        clearTimeout(timer)
        setError(err instanceof Error ? err.message : 'Unable to check session')
        setLoading(false)
      })
    return () => {
      cancelled = true
      clearTimeout(timer)
      subscription.unsubscribe()
    }
  }, [])

  return { session, loading, error, userId: session?.user?.id ?? null }
}
