import { useState } from 'react'
import { DigitalPassportCard, DigitalPassportModal } from '../components/DigitalPassportModal'
import { DigitalWalletAndNftCard } from '../components/DigitalWalletAndNftCard'
import { AppleAndGooglePayStudio } from '../components/AppleAndGooglePayStudio'
import { QrOrganizerScannerModal } from '../components/QrOrganizerScannerModal'
import { AppPageMeta } from '../components/AppPageMeta'
import { MiniProfileSidebar } from '../components/MiniProfileSidebar'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowLeft, Scan } from 'lucide-react'
import { FeatureStatusNotice } from '../components/FeatureStatusNotice'

export function PassportPage() {
  const { i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const isRu = i18n.language === 'ru'
  const [modalOpen, setModalOpen] = useState(false)
  const [scannerOpen, setScannerOpen] = useState(false)
  const [activeView, setActiveView] = useState<'apple_google_pay' | 'wallet_nft' | 'standard'>('standard')

  return (
    <div className="grid gap-5 lg:grid-cols-[260px_1fr] lg:gap-6">
      <AppPageMeta title={isKz ? 'Цифрлық паспорт зертханасы' : isRu ? 'Лаборатория цифрового паспорта' : 'Digital passport lab'} />

      <aside className="hidden lg:block">
        <div className="sticky top-6 space-y-4">
          <MiniProfileSidebar />
        </div>
      </aside>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/home"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{isKz ? 'Дэшбордқа қайту' : isRu ? 'Назад в дэшборд' : 'Back to Dashboard'}</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setScannerOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <Scan className="h-3.5 w-3.5 text-blue-600" />
              <span>{isKz ? 'Ұйымдастырушы Сканері' : 'Сканер Организатора'}</span>
            </button>
          </div>
        </div>

        <FeatureStatusNotice kind={activeView === 'standard' ? 'verification' : 'financial'} />

        {/* View Switcher */}
        <div className="flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
          <button
            type="button"
            onClick={() => setActiveView('apple_google_pay')}
            className={`flex-1 min-w-[140px] rounded-lg py-2 text-xs font-bold transition ${
              activeView === 'apple_google_pay'
                ? 'bg-slate-950 text-white shadow-xs dark:bg-white dark:text-slate-950'
                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
             Pay & G Pay Hub
          </button>
          <button
            type="button"
            onClick={() => setActiveView('wallet_nft')}
            className={`flex-1 min-w-[140px] rounded-lg py-2 text-xs font-bold transition ${
              activeView === 'wallet_nft'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            📱 Apple / Google Wallet & NFC
          </button>
          <button
            type="button"
            onClick={() => setActiveView('standard')}
            className={`flex-1 min-w-[140px] rounded-lg py-2 text-xs font-bold transition ${
              activeView === 'standard'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            🛡️ {isKz ? 'Ресми QR Паспорт' : 'Официальный QR Паспорт'}
          </button>
        </div>

        {activeView === 'apple_google_pay' && <AppleAndGooglePayStudio />}
        {activeView === 'wallet_nft' && <DigitalWalletAndNftCard />}
        {activeView === 'standard' && <DigitalPassportCard onOpenModal={() => setModalOpen(true)} />}

        {modalOpen && <DigitalPassportModal onClose={() => setModalOpen(false)} />}
        {scannerOpen && <QrOrganizerScannerModal onClose={() => setScannerOpen(false)} />}
      </div>
    </div>
  )
}
