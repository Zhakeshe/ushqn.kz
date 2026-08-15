import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/**
 * Full-screen auth layout: minimalist & focused.
 */
export function AuthShell({ children, maxWidthClass = 'max-w-[460px]' }: { children: ReactNode; maxWidthClass?: string }) {
  const { t } = useTranslation()

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-slate-50 dark:bg-slate-950">
      <a href="#main-auth-content" className="ushqn-skip-link">{t('ui.skipToContent')}</a>
      <header className="relative z-20 flex shrink-0 items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <span aria-hidden className="text-sm opacity-80">
            ←
          </span>
          {t('auth.backToLanding')}
        </Link>
        <span className="hidden text-sm font-black tracking-tight text-slate-400 sm:inline">{t('brand.wordmark')}</span>
      </header>

      <main
        id="main-auth-content"
        className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-10 pt-0 sm:px-6"
        tabIndex={-1}
      >
        <div className={`w-full ${maxWidthClass}`}>
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
