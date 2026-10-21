const envUrl = import.meta.env.VITE_APP_URL as string | undefined

export function appBaseUrl(
  configured: string | undefined,
  origin: string,
): string {
  const fallback = origin.replace(/\/+$/, '')
  if (!configured?.trim()) return fallback
  try {
    const url = new URL(configured.trim())
    if (!['http:', 'https:'].includes(url.protocol)) return fallback
    const local = (host: string) =>
      ['localhost', '127.0.0.1', '[::1]'].includes(host)
    // A copied development .env must not send production email links to localhost.
    if (local(url.hostname) && origin && !local(new URL(origin).hostname))
      return fallback
    return url.origin
  } catch {
    return fallback
  }
}

export function getAppBaseUrl() {
  return appBaseUrl(
    envUrl,
    typeof window !== 'undefined' ? window.location.origin : '',
  )
}
