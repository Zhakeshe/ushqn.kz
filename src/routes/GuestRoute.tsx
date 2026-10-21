import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function GuestRoute() {
  const { session, loading } = useAuth()
  if (loading)
    return (
      <div
        role="status"
        aria-label="Loading session"
        className="mx-auto mt-20 h-32 max-w-md animate-pulse rounded-xl bg-slate-100"
      />
    )
  return session ? <Navigate to="/home" replace /> : <Outlet />
}
