import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

/** Wordmark for login / register — minimalist & clean. */
export function AuthBrand({ slogan, extra }: { slogan?: ReactNode; extra?: ReactNode }) {
  const { t } = useTranslation()
  return (
    <div className="mb-8 text-center">
      <div className="relative mx-auto mb-2">
        <h1 className="relative text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          {t('brand.wordmark')}
        </h1>
      </div>
      {t('brand.legalName') !== t('brand.wordmark') ? (
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{t('brand.legalName')}</p>
      ) : null}
      {slogan ? <div className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">{slogan}</div> : null}
      {extra}
    </div>
  )
}
