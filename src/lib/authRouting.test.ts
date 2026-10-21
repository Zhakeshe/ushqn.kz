import { describe, expect, it } from 'vitest'
import {
  authCallbackError,
  hasAuthCallback,
  safeAuthDestination,
} from './authRouting'
import { appBaseUrl } from './siteUrl'

describe('auth redirect safety and callback errors', () => {
  it('allows application destinations and prevents external/recursive redirects', () => {
    expect(safeAuthDestination('/olympiads?q=math')).toBe('/olympiads?q=math')
    for (const path of [
      'https://other.example',
      '//other.example',
      '/\\other.example',
      '/login',
      '/register?next=/login',
      '/',
      '/auth/callback',
      undefined,
    ])
      expect(safeAuthDestination(path)).toBe('/home')
  })
  it('recognizes OAuth, email-confirmation and failure callback formats', () => {
    expect(hasAuthCallback('?code=example', '')).toBe(true)
    expect(hasAuthCallback('', '#access_token=example&type=signup')).toBe(true)
    expect(hasAuthCallback('', '#error=access_denied')).toBe(true)
    expect(hasAuthCallback('?q=robotics', '#platform')).toBe(false)
    expect(authCallbackError('?error_description=Link+expired', '')).toBe(
      'Link expired',
    )
    expect(authCallbackError('', '#error=access_denied')).toBe('access_denied')
    expect(authCallbackError('', '')).toBeNull()
  })
  it('ignores a copied localhost URL on a deployed site', () => {
    expect(appBaseUrl('http://localhost:3000', 'https://ushqn.kz')).toBe(
      'https://ushqn.kz',
    )
    expect(appBaseUrl('', 'https://preview.example/')).toBe(
      'https://preview.example',
    )
    expect(appBaseUrl('https://ushqn.kz/', 'https://preview.example')).toBe(
      'https://ushqn.kz',
    )
    expect(appBaseUrl('javascript:alert(1)', 'https://ushqn.kz')).toBe(
      'https://ushqn.kz',
    )
    expect(appBaseUrl('http://localhost:3000', 'http://localhost:4173')).toBe(
      'http://localhost:3000',
    )
  })
})
