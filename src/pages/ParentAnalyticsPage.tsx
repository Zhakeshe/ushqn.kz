import { ParentTalentReport } from '../components/ParentTalentReport'
import { AppPageMeta } from '../components/AppPageMeta'
import { MiniProfileSidebar } from '../components/MiniProfileSidebar'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { FeatureStatusNotice } from '../components/FeatureStatusNotice'

export function ParentAnalyticsPage() {
  const { i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const isRu = i18n.language === 'ru'

  return (
    <div className="grid gap-5 lg:grid-cols-[260px_1fr] lg:gap-6">
      <AppPageMeta title={isKz ? 'Ата-ана мен Мектептерге Аналитика' : isRu ? 'Панель для Родителей и Школ' : 'Parent & School Talent Report'} />

      <aside className="hidden lg:block">
        <div className="sticky top-6 space-y-4">
          <MiniProfileSidebar />
        </div>
      </aside>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Link
            to="/home"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{isKz ? 'Дэшбордқа қайту' : isRu ? 'Назад в дэшборд' : 'Back to Dashboard'}</span>
          </Link>
        </div>

        <FeatureStatusNotice />

        <ParentTalentReport />
      </div>
    </div>
  )
}
