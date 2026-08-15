import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ShieldCheck,
  QrCode,
  Copy,
  Check,
  ExternalLink,
  Award,
  Building2,
  FileCheck,
  X,
} from 'lucide-react'

interface DigitalPassportProps {
  userName?: string
  studentId?: string
  verifiedCount?: number
  onClose?: () => void
}

export function DigitalPassportModal({
  userName = 'Әлішер Төлеубаев',
  studentId = 'USH-KZ-2026-8941',
  verifiedCount = 8,
  onClose,
}: DigitalPassportProps) {
  const { i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const isRu = i18n.language === 'ru'

  const [copied, setCopied] = useState(false)
  const passportUrl = `https://ushqn.app/u/alisher-t`

  function handleCopy() {
    void navigator.clipboard.writeText(passportUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Close Button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-[#162a45] dark:bg-slate-800 dark:text-blue-400">
            <ShieldCheck className="h-6 w-6 text-[#0052cc]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {isKz ? '🛡️ Ресми Цифрлық QR Паспорт' : isRu ? '🛡️ Официальный Цифровой QR Паспорт' : '🛡️ Official Digital QR Passport'}
              </h3>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                VERIFIED
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isKz
                ? 'ЖОО қабылдау комиссиялары мен демеушілер үшін анти-фейк жүйесі'
                : isRu
                ? 'Анти-фейк система верификации для приемных комиссий вузов'
                : 'Anti-fake verification system for university admissions'}
            </p>
          </div>
        </div>

        {/* Passport Card Preview */}
        <div className="mt-5 rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-5 dark:border-slate-700 dark:from-slate-800/80 dark:to-slate-900">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                REPUBLIC OF KAZAKHSTAN · TALENT REGISTRY
              </p>
              <h4 className="mt-1 text-lg font-black text-slate-900 dark:text-slate-100">
                {userName}
              </h4>
              <p className="font-mono text-xs text-slate-500 dark:text-slate-400">ID: {studentId}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-1.5 shadow-xs dark:border-slate-700 dark:bg-slate-800">
              {/* Dynamic QR SVG */}
              <svg viewBox="0 0 100 100" className="h-16 w-16 text-slate-900 dark:text-white">
                <rect x="0" y="0" width="30" height="30" fill="currentColor" />
                <rect x="5" y="5" width="20" height="20" fill="var(--color-ushqn-surface, white)" />
                <rect x="9" y="9" width="12" height="12" fill="currentColor" />

                <rect x="70" y="0" width="30" height="30" fill="currentColor" />
                <rect x="75" y="5" width="20" height="20" fill="var(--color-ushqn-surface, white)" />
                <rect x="79" y="9" width="12" height="12" fill="currentColor" />

                <rect x="0" y="70" width="30" height="30" fill="currentColor" />
                <rect x="5" y="75" width="20" height="20" fill="var(--color-ushqn-surface, white)" />
                <rect x="9" y="79" width="12" height="12" fill="currentColor" />

                <rect x="36" y="10" width="8" height="8" fill="currentColor" />
                <rect x="48" y="10" width="14" height="8" fill="currentColor" />
                <rect x="36" y="24" width="26" height="8" fill="currentColor" />
                <rect x="36" y="38" width="12" height="14" fill="currentColor" />
                <rect x="54" y="38" width="8" height="26" fill="currentColor" />
                <rect x="10" y="36" width="18" height="10" fill="currentColor" />
                <rect x="10" y="52" width="12" height="12" fill="currentColor" />
                <rect x="70" y="36" width="24" height="10" fill="currentColor" />
                <rect x="70" y="52" width="12" height="12" fill="currentColor" />
                <rect x="88" y="52" width="12" height="24" fill="currentColor" />
                <rect x="36" y="70" width="26" height="10" fill="currentColor" />
                <rect x="36" y="86" width="14" height="14" fill="currentColor" />
                <rect x="56" y="86" width="40" height="14" fill="currentColor" />
              </svg>
            </div>
          </div>

          {/* Verification Grid */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg border border-slate-200/80 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-800">
              <span className="text-[10px] font-bold uppercase text-slate-400">
                {isKz ? 'Расталған жетістіктер' : isRu ? 'Верифицировано' : 'Verified Badges'}
              </span>
              <p className="mt-0.5 font-bold text-emerald-600 dark:text-emerald-400">
                ✓ {verifiedCount} {isKz ? 'диплом мен жоба' : isRu ? 'дипломов и проектов' : 'diplomas & projects'}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200/80 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-800">
              <span className="text-[10px] font-bold uppercase text-slate-400">
                {isKz ? 'Хеш-верификация' : isRu ? 'Хеш подлинности' : 'Crypto Hash'}
              </span>
              <p className="mt-0.5 truncate font-mono text-[11px] text-slate-700 dark:text-slate-300">
                SHA256: 8f4a...e12d
              </p>
            </div>
          </div>

          {/* Institutional Partners */}
          <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <Building2 className="h-3.5 w-3.5" />
            <span>
              {isKz
                ? 'Ресми серіктестер: Daryn.kz, FIRST Kazakhstan, Nazarbayev University'
                : isRu
                ? 'Официальные партнеры: Дарын, FIRST Kazakhstan, NU'
                : 'Partners: Daryn.kz, FIRST Kazakhstan, NU'}
            </span>
          </div>
        </div>

        {/* ATS-Ready Share Link */}
        <div className="mt-4 space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {isKz ? 'ATS-дайын қысқа сілтеме:' : isRu ? 'ATS-ready ссылка для резюме:' : 'ATS-Ready Public Link:'}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={passportUrl}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#162a45] px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#0f1d30]"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>{isKz ? 'Көшірілді!' : isRu ? 'Скопировано!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>{isKz ? 'Көшіру' : isRu ? 'Копировать' : 'Copy'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            {isKz ? 'Жабу' : isRu ? 'Закрыть' : 'Close'}
          </button>
          <a
            href={passportUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#0052cc] py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#0047b3]"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>{isKz ? 'Профильді ашу' : isRu ? 'Открыть в браузере' : 'Open Public Profile'}</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export function DigitalPassportCard({ onOpenModal }: { onOpenModal: () => void }) {
  const { i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const isRu = i18n.language === 'ru'

  return (
    <section className="ushqn-card border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
            <ShieldCheck className="h-5 w-5 text-[#0052cc]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {isKz
                  ? '2. 🛡️ Verification & Anti-Fake QR Digital Passport'
                  : isRu
                  ? '2. 🛡️ Верификация & Anti-Fake QR Паспорт'
                  : '2. 🛡️ Verification & Anti-Fake QR Passport'}
              </h3>
              <span className="rounded-full bg-emerald-100 px-2 py-0.2 text-[9px] font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                ATS READY
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isKz
                ? 'Қағаз сертификаттарсыз, мектеп пен олимпиада базасымен расталған цифрлық ID'
                : isRu
                ? 'Верифицированные сертификаты и динамический QR ID для приемных комиссий'
                : 'Verified student credentials and dynamic anti-fake QR ID for admissions'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenModal}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-800 shadow-xs transition hover:border-slate-400 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <QrCode className="h-3.5 w-3.5 text-[#0052cc]" />
          <span>{isKz ? 'QR Паспортты көру' : isRu ? 'Показать QR Паспорт' : 'View QR Passport'}</span>
        </button>
      </div>

      {/* Verified badges row */}
      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <Award className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-200">
              {isKz ? 'Дарын Олимпиадасы' : isRu ? 'Олимпиада Дарын' : 'Daryn Olympiad'}
            </p>
            <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
              ✓ {isKz ? 'Базада расталған' : isRu ? 'Верифицировано' : 'Verified in DB'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            <FileCheck className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-200">
              FIRST Robotics KZ
            </p>
            <p className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">
              ✓ {isKz ? 'Сертификатталған' : isRu ? 'Сертифицировано' : 'Certified'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
            <Building2 className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-200">
              {isKz ? 'Мектеп базасы (NIS/BIL)' : isRu ? 'Школьная база' : 'School Registry'}
            </p>
            <p className="text-[10px] font-semibold text-purple-600 dark:text-purple-400">
              ✓ {isKz ? 'GPA 4.98 расталды' : isRu ? 'GPA 4.98 подтвержден' : 'GPA 4.98 confirmed'}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
