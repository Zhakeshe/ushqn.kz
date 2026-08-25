import { FlaskConical, ShieldAlert } from 'lucide-react'
import { useTranslation } from 'react-i18next'

type DemoKind = 'general' | 'ai' | 'financial' | 'verification' | 'opportunities'

const descriptions: Record<DemoKind, { kk: string; ru: string; en: string }> = {
  general: {
    kk: 'Бұл бөлім — интерактивті прототип. Нәтижелер серверде расталмайды және ресми шешім ретінде қолданылмауы керек.',
    ru: 'Этот раздел — интерактивный прототип. Результаты не подтверждаются сервером и не должны использоваться как официальное решение.',
    en: 'This section is an interactive prototype. Results are not server-verified and must not be treated as official.',
  },
  ai: {
    kk: 'AI құралдары әзірше демонстрациялық сценарийлермен жұмыс істейді: сыртқы AI моделі қосылмаған және нәтижелер автоматты түрде расталмайды.',
    ru: 'AI-инструменты пока работают по демонстрационным сценариям: внешняя AI-модель не подключена, результаты автоматически не проверяются.',
    en: 'AI tools currently use demonstration flows: no external AI model is connected and results are not automatically verified.',
  },
  financial: {
    kk: 'Төлемдер, токендер, Wallet/NFC және транзакциялар — тек симуляция. Нақты ақша өңделмейді және Apple/Google төлем сервистері қосылмаған.',
    ru: 'Платежи, токены, Wallet/NFC и транзакции — только симуляция. Реальные деньги не обрабатываются, сервисы Apple/Google не подключены.',
    en: 'Payments, tokens, Wallet/NFC and transactions are simulations only. No money is processed and Apple/Google payment services are not connected.',
  },
  verification: {
    kk: 'Құжат пен QR тексеруі демонстрациялық режимде. Нәтижені ресми верификация немесе түпнұсқалық дәлелі ретінде қолданбаңыз.',
    ru: 'Проверка документов и QR работает в демонстрационном режиме. Не используйте результат как официальную верификацию подлинности.',
    en: 'Document and QR checks run in demo mode. Do not use the result as official proof of authenticity.',
  },
  opportunities: {
    kk: 'Ұсыныстар мен бағдарламалардың бір бөлігі үлгі деректерден тұрады. Өтінім бермес бұрын ақпаратты ресми дереккөзден тексеріңіз.',
    ru: 'Часть предложений и программ использует примерные данные. Перед подачей заявки проверьте информацию в официальном источнике.',
    en: 'Some offers and programs use sample data. Verify details with the official source before applying.',
  },
}

export function FeatureStatusNotice({ kind = 'general' }: { kind?: DemoKind }) {
  const { i18n } = useTranslation()
  const language = i18n.language === 'kk' ? 'kk' : i18n.language === 'ru' ? 'ru' : 'en'
  const title = language === 'kk' ? 'Демо режимі' : language === 'ru' ? 'Демо-режим' : 'Demo mode'
  const caution = language === 'kk' ? 'Шектеулерді ескеріңіз' : language === 'ru' ? 'Учитывайте ограничения' : 'Mind the limitations'

  return (
    <aside className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100" role="note">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-200/70 dark:bg-amber-900">
          <FlaskConical className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-bold text-current">{title}</p>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-200/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide dark:bg-amber-900">
              <ShieldAlert className="h-3 w-3" aria-hidden="true" />
              {caution}
            </span>
          </div>
          <p className="mt-1 text-xs leading-5 text-amber-900/85 dark:text-amber-100/80">{descriptions[kind][language]}</p>
        </div>
      </div>
    </aside>
  )
}
