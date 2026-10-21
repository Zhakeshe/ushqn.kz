/** Keep login redirects within this application. */
export function safeAuthDestination(
  candidate: string | null | undefined,
): string {
  if (
    !candidate ||
    !candidate.startsWith('/') ||
    candidate.startsWith('//') ||
    /[\\\r\n]/.test(candidate)
  )
    return '/home'
  const pathname = candidate.split(/[?#]/)[0]
  if (
    ['/', '/login', '/register', '/auth/callback', '/reset-password'].includes(
      pathname,
    )
  )
    return '/home'
  return candidate
}

export function authCallbackError(search: string, hash: string): string | null {
  for (const part of [search.replace(/^\?/, ''), hash.replace(/^#/, '')]) {
    const params = new URLSearchParams(part)
    const error = params.get('error_description') || params.get('error')
    if (error) return error.slice(0, 300)
  }
  return null
}

export function hasAuthCallback(search: string, hash: string): boolean {
  const query = new URLSearchParams(search)
  const fragment = new URLSearchParams(hash.replace(/^#/, ''))
  return (
    query.has('code') ||
    query.has('error') ||
    fragment.has('access_token') ||
    fragment.has('error')
  )
}
