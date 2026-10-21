import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { useAuth } from './useAuth'

const sdk = vi.hoisted(() => ({
  getSession: vi.fn(),
  unsubscribe: vi.fn(),
  listener: null as
    ((event: string, session: { user: { id: string } } | null) => void) | null,
}))
vi.mock('../lib/supabase', () => ({
  isSupabaseConfigured: true,
  supabase: {
    auth: {
      getSession: sdk.getSession,
      onAuthStateChange: (listener: typeof sdk.listener) => {
        sdk.listener = listener
        return { data: { subscription: { unsubscribe: sdk.unsubscribe } } }
      },
    },
  },
}))
let root: Root
let container: HTMLDivElement
function Probe() {
  const state = useAuth()
  return (
    <p>
      {state.loading ? 'Loading' : state.error || state.userId || 'Signed out'}
    </p>
  )
}
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
  sdk.getSession.mockReset()
  sdk.unsubscribe.mockReset()
  sdk.listener = null
})
afterEach(async () => {
  await act(async () => root.unmount())
  container.remove()
  vi.useRealTimers()
})

it('does not overwrite a new sign-in with a stale initial session response', async () => {
  let resolve!: (value: unknown) => void
  sdk.getSession.mockReturnValue(
    new Promise((r) => {
      resolve = r
    }),
  )
  await act(async () => root.render(<Probe />))
  await act(async () =>
    sdk.listener?.('SIGNED_IN', { user: { id: 'fresh-user' } }),
  )
  expect(container.textContent).toBe('fresh-user')
  await act(async () => resolve({ data: { session: null }, error: null }))
  expect(container.textContent).toBe('fresh-user')
})

it('stops waiting when the auth service never responds', async () => {
  vi.useFakeTimers()
  sdk.getSession.mockReturnValue(new Promise(() => {}))
  await act(async () => root.render(<Probe />))
  expect(container.textContent).toBe('Loading')
  await act(async () => vi.advanceTimersByTime(15000))
  expect(container.textContent).toContain('timed out')
})

it('surfaces a session lookup failure instead of spinning indefinitely', async () => {
  sdk.getSession.mockRejectedValue(new Error('Connection failed'))
  await act(async () => root.render(<Probe />))
  expect(container.textContent).toBe('Connection failed')
})
