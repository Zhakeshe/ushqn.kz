import { useState } from 'react'
import { UniversityDirectOffers } from '../components/UniversityDirectOffers'
import { AlumniMentorshipNetwork } from '../components/AlumniMentorshipNetwork'
import { OlympiadCrowdfundingHub } from '../components/OlympiadCrowdfundingHub'
import { B2BSchoolAnalyticsDashboard } from '../components/B2BSchoolAnalyticsDashboard'
import { CorporateScholarshipScouting } from '../components/CorporateScholarshipScouting'
import { TalentBountyBoard } from '../components/TalentBountyBoard'
import { VisaDocumentPackGenerator } from '../components/VisaDocumentPackGenerator'
import { AppPageMeta } from '../components/AppPageMeta'
import { MiniProfileSidebar } from '../components/MiniProfileSidebar'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { FeatureStatusNotice } from '../components/FeatureStatusNotice'

export function GrantsPage() {
  const { i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const isRu = i18n.language === 'ru'
  const [activeTab, setActiveTab] = useState<
    'grants' | 'corporate_scholarships' | 'bounties' | 'visa_pack' | 'alumni' | 'crowdfund' | 'school_b2b'
  >('grants')

  return (
    <div className="grid gap-5 lg:grid-cols-[260px_1fr] lg:gap-6">
      <AppPageMeta
        title={
          isKz
            ? 'Гранттар, Шәкіртақылар & Bounties'
            : isRu
            ? 'Гранты, Стипендии и Баунти'
            : 'Grants, Scholarships & Bounties'
        }
      />

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

        <FeatureStatusNotice kind="opportunities" />

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-1.5 rounded-xl border border-slate-200 bg-white p-1.5 dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
          {[
            {
              id: 'grants',
              labelKz: '🏛️ ЖОО Гранттары',
              labelRu: '🏛️ Гранты ВУЗов',
            },
            {
              id: 'corporate_scholarships',
              labelKz: '🏢 Корпоративтік Шәкіртақы (Kaspi/Freedom)',
              labelRu: '🏢 Корпоративные Стипендии',
            },
            {
              id: 'bounties',
              labelKz: '💰 Talent Bounties',
              labelRu: '💰 Инженерные Баунти',
            },
            {
              id: 'visa_pack',
              labelKz: '📦 Виза & Досье Пакет',
              labelRu: '📦 Досье для Виз и ВУЗов',
            },
            {
              id: 'alumni',
              labelKz: '🎓 Alumni Менторлық',
              labelRu: '🎓 Alumni Менторство',
            },
            {
              id: 'crowdfund',
              labelKz: '💖 Демеушілік Қор',
              labelRu: '💖 Краудфандинг',
            },
            {
              id: 'school_b2b',
              labelKz: '🏫 B2B Мектеп Аналитикасы',
              labelRu: '🏫 B2B Аналитика Школ',
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() =>
                setActiveTab(
                  tab.id as
                    | 'grants'
                    | 'corporate_scholarships'
                    | 'bounties'
                    | 'visa_pack'
                    | 'crowdfund'
                    | 'school_b2b'
                )
              }
              className={`flex-1 min-w-[130px] rounded-lg py-2 text-xs font-bold transition ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {isKz ? tab.labelKz : tab.labelRu}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        {activeTab === 'grants' && <UniversityDirectOffers />}
        {activeTab === 'corporate_scholarships' && <CorporateScholarshipScouting />}
        {activeTab === 'bounties' && <TalentBountyBoard />}
        {activeTab === 'visa_pack' && <VisaDocumentPackGenerator />}
        {activeTab === 'alumni' && <AlumniMentorshipNetwork />}
        {activeTab === 'crowdfund' && <OlympiadCrowdfundingHub />}
        {activeTab === 'school_b2b' && <B2BSchoolAnalyticsDashboard />}
      </div>
    </div>
  )
}
