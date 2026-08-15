import { createClient } from '@supabase/supabase-js'

const rawUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim()
const rawAnon = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim()

export const isSupabaseConfigured = Boolean(
  rawUrl &&
    rawAnon &&
    rawUrl.startsWith('http') &&
    !rawUrl.includes('placeholder')
)

// Ensure valid URL and JWT structure even if env vars are undefined or empty strings ("")
const fallbackUrl = 'https://mock-project-ref.supabase.co'
const fallbackAnon =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MTkwMDAwMDAwMH0.mock-signature'

const targetUrl = rawUrl && rawUrl.length > 8 && rawUrl.startsWith('http') ? rawUrl : fallbackUrl
const targetAnon = rawAnon && rawAnon.length > 10 ? rawAnon : fallbackAnon

export const supabase = createClient(targetUrl, targetAnon, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

