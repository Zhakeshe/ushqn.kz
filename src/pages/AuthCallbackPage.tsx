import { Link, Navigate, useLocation } from 'react-router-dom'
import { AppPageMeta } from '../components/AppPageMeta'
import { AuthShell } from '../components/AuthShell'
import { useAuth } from '../hooks/useAuth'
import { useCopy } from '../product/useCopy'
import { authCallbackError, safeAuthDestination } from '../lib/authRouting'

export function AuthCallbackPage() {
  const copy = useCopy()
  const location = useLocation()
  const { session, loading, error: sessionError } = useAuth()
  const error =
    authCallbackError(location.search, location.hash) || sessionError
  const target = safeAuthDestination(
    new URLSearchParams(location.search).get('next'),
  )
  if (!error && !loading && session) return <Navigate to={target} replace />
  return (
    <AuthShell>
      <AppPageMeta title={copy('Вход', 'Кіру', 'Signing in')} />
      <h1 className="text-xl">
        {loading && !error
          ? copy('Завершаем вход…', 'Кіру аяқталуда…', 'Finishing sign-in…')
          : copy(
              'Не удалось завершить вход',
              'Кіруді аяқтау мүмкін болмады',
              'Could not complete sign-in',
            )}
      </h1>
      {loading && !error ? (
        <p className="mt-4 text-sm text-slate-500" role="status">
          {copy(
            'Проверяем сессию. Это займёт несколько секунд.',
            'Сессия тексерілуде. Бірнеше секунд күтіңіз.',
            'Checking your session. This takes a few seconds.',
          )}
        </p>
      ) : (
        <>
          <p role="alert" className="mt-4 text-sm leading-6 text-slate-500">
            {error ||
              copy(
                'Ссылка недействительна или истекла. Войдите снова или запросите новое письмо подтверждения.',
                'Сілтеме жарамсыз немесе мерзімі өткен. Қайта кіріңіз немесе жаңа растау хатын сұраңыз.',
                'This link is invalid or expired. Sign in again or request a new confirmation email.',
              )}
          </p>
          <Link to="/login" className="ushqn-btn-primary mt-6">
            {copy('Перейти ко входу', 'Кіруге өту', 'Go to sign in')}
          </Link>
        </>
      )}
    </AuthShell>
  )
}
