import { useQuery } from '@tanstack/react-query'
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCopy } from '../product/useCopy'
import { formatSupabaseError } from '../lib/supabaseErrors'
import { useAuth } from '../hooks/useAuth'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

export function ProtectedRoute() {
  const { t } = useTranslation()
  const copy = useCopy()
  const { session, loading } = useAuth()
  const location = useLocation()

  const profileGuardQuery = useQuery({
    queryKey: ['profile-guard', session?.user?.id],
    enabled: Boolean(session?.user?.id && isSupabaseConfigured),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_banned,onboarding_completed_at')
        .eq('id', session!.user.id)
        .single()
      if (error) throw error
      return {
        isBanned: Boolean(data?.is_banned),
        onboardingDone: Boolean(data?.onboarding_completed_at),
      }
    },
  })

  if (!isSupabaseConfigured) {
    return (
      <div className="ushqn-card mx-auto max-w-lg p-8 text-center">
        <h1 className="text-lg font-semibold text-[#172B4D]">
          {t('protectedRoute.configureTitle')}
        </h1>
        <p className="mt-2 text-sm text-[#6B778C]">
          {t('protectedRoute.configureDesc')}
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-[#6B778C]">
        {t('protectedRoute.loading')}
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  if (profileGuardQuery.isPending) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-[#6B778C]">
        {t('protectedRoute.loading')}
      </div>
    )
  }

  if (profileGuardQuery.isError) {
    return (
      <div className="ushqn-card mx-auto mt-12 max-w-md space-y-4 p-7">
        <h1 className="text-xl">
          {copy(
            'Не удалось открыть профиль',
            'Профильді ашу мүмкін болмады',
            'Could not open your profile',
          )}
        </h1>
        <p role="alert" className="text-sm text-[var(--color-ushqn-muted)]">
          {formatSupabaseError(profileGuardQuery.error, t)}
        </p>
        <button
          type="button"
          className="ushqn-btn-primary"
          onClick={() => void profileGuardQuery.refetch()}
        >
          {t('ui.retry')}
        </button>
        <Link to="/" className="ml-4 text-sm">
          {copy('На главную', 'Басты бетке', 'Back to website')}
        </Link>
      </div>
    )
  }

  if (profileGuardQuery.data?.isBanned === true) {
    return (
      <div className="ushqn-card mx-auto mt-10 max-w-md space-y-4 p-8 text-center">
        <h1 className="text-lg font-bold text-[#172B4D]">
          {t('trust.banned.title')}
        </h1>
        <p className="text-sm text-[#6B778C]">{t('trust.banned.body')}</p>
        <button
          type="button"
          className="ushqn-btn-primary w-full py-2.5 text-sm"
          onClick={() => void supabase.auth.signOut()}
        >
          {t('trust.banned.signOut')}
        </button>
      </div>
    )
  }

  const atOnboarding = location.pathname === '/onboarding'
  if (!profileGuardQuery.data?.onboardingDone && !atOnboarding) {
    return <Navigate to="/onboarding" replace />
  }
  if (profileGuardQuery.data?.onboardingDone && atOnboarding) {
    return <Navigate to="/home" replace />
  }

  return <Outlet />
}
