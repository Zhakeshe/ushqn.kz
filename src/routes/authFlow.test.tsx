import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ProtectedRoute } from './ProtectedRoute'
import { GuestRoute } from './GuestRoute'
import { AuthCallbackPage } from '../pages/AuthCallbackPage'
import { syncOnboardingState } from '../lib/onboarding'

const state = vi.hoisted(() => ({
  signedIn: true,
  done: false,
  error: false,
  banned: false,
}))
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    session: state.signedIn ? { user: { id: 'student' } } : null,
    userId: state.signedIn ? 'student' : null,
    loading: false,
    error: null,
  }),
}))
vi.mock('../lib/supabase', () => ({
  isSupabaseConfigured: true,
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () =>
            state.error
              ? { data: null, error: new Error('Profile unavailable') }
              : {
                  data: {
                    is_banned: state.banned,
                    onboarding_completed_at: state.done
                      ? '2026-10-21T00:00:00Z'
                      : null,
                  },
                  error: null,
                },
        }),
      }),
    }),
    auth: { signOut: vi.fn() },
  },
}))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}))
vi.mock('../components/AppPageMeta', () => ({ AppPageMeta: () => null }))

let container: HTMLDivElement
let root: Root
let client: QueryClient
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  state.signedIn = true
  state.done = false
  state.error = false
  state.banned = false
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
  client = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: 60_000 } },
  })
})
afterEach(async () => {
  await act(async () => root.unmount())
  client.clear()
  container.remove()
})
async function render(path: string) {
  await act(async () => {
    root.render(
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path="/" element={<p>Website</p>} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<p>Login form</p>} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<p>Student dashboard</p>} />
              <Route
                path="/onboarding"
                element={<p>Complete your profile</p>}
              />
            </Route>
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    )
    await new Promise((resolve) => setTimeout(resolve, 25))
  })
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 25))
  })
}

describe('sign-in and onboarding routing', () => {
  it('sends a new student to onboarding, then immediately opens the dashboard after completion', async () => {
    await render('/home')
    expect(container.textContent).toContain('Complete your profile')
    state.done = true
    await act(async () => {
      await syncOnboardingState(client, 'student', true)
      await new Promise((resolve) => setTimeout(resolve, 25))
    })
    expect(container.textContent).toContain('Student dashboard')
    expect(container.textContent).not.toContain('Complete your profile')
  })
  it('redirects an already signed-in user away from login', async () => {
    state.done = true
    await render('/login')
    expect(container.textContent).toContain('Student dashboard')
  })
  it('shows a retry screen for a missing/broken profile instead of opening onboarding', async () => {
    state.error = true
    await render('/home')
    expect(container.textContent).toContain('Could not open your profile')
    expect(container.textContent).toContain('Profile unavailable')
    expect(container.textContent).not.toContain('Complete your profile')
  })
  it('handles an OAuth callback by opening the signed-in dashboard', async () => {
    state.done = true
    await render('/auth/callback')
    expect(container.textContent).toContain('Student dashboard')
  })
  it('shows an expired-link error instead of a loading screen', async () => {
    state.signedIn = false
    await render('/auth/callback?error_description=Link+expired')
    expect(container.textContent).toContain('Link expired')
    expect(container.textContent).toContain('Go to sign in')
  })
  it('does not let a banned account enter the dashboard', async () => {
    state.done = true
    state.banned = true
    await render('/home')
    expect(container.textContent).toContain('trust.banned.title')
    expect(container.textContent).not.toContain('Student dashboard')
  })
})
