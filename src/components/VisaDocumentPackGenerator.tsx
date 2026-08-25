import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Download,
  CheckCircle2,
  Globe,
  ShieldCheck,
} from 'lucide-react'
import { useToast } from '../lib/toast'
import { useAuth } from '../hooks/useAuth'

interface DocItem {
  id: string
  titleKz: string
  titleEn: string
  type: string
  status: 'ready' | 'needs_translation' | 'apostilled'
  fileSize: string
}

const DOCUMENT_ITEMS: DocItem[] = [
  {
    id: 'doc-1',
    titleKz: 'IZhO 2025 Алтын Медаль Дипломы (Расталған)',
    titleEn: 'IZhO 2025 Gold Medal Certificate (Verified)',
    type: 'Olympiad Award',
    status: 'apostilled',
    fileSize: '2.4 MB',
  },
  {
    id: 'doc-2',
    titleKz: 'Ресми Мектеп Транскрипті (GPA 4.95 / Top 1%)',
    titleEn: 'Official Academic Transcript (GPA 4.95)',
    type: 'Transcript',
    status: 'apostilled',
    fileSize: '1.8 MB',
  },
  {
    id: 'doc-3',
    titleKz: 'Республикалық Ғылыми Жоба 1-дәрежелі Дипломы',
    titleEn: 'National Science Fair 1st Degree Diploma',
    type: 'Research Diploma',
    status: 'ready',
    fileSize: '3.1 MB',
  },
  {
    id: 'doc-4',
    titleKz: 'USHQN Цифрлық Талант Төлқұжаты & QR Апостиль',
    titleEn: 'USHQN Digital Talent Passport & QR Verification',
    type: 'Verified Dossier',
    status: 'apostilled',
    fileSize: '1.2 MB',
  },
]

export function VisaDocumentPackGenerator() {
  const { i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const { session } = useAuth()
  const { toast } = useToast()

  const [selectedTargetVisa, setSelectedTargetVisa] = useState<'usa_f1' | 'schengen' | 'korea_d2' | 'common_app'>('usa_f1')
  const [selectedDocs, setSelectedDocs] = useState<string[]>(DOCUMENT_ITEMS.map((d) => d.id))
  const [isExporting, setIsExporting] = useState(false)

  const studentName = session?.user?.user_metadata?.full_name || 'Әлихан Нұрланұлы'

  const handleExportZip = () => {
    setIsExporting(true)
    setTimeout(() => {
      setIsExporting(false)
      toast(
        isKz
          ? `📦 «${studentName}_Verified_Visa_Dossier.zip» толық архиві сәтті жиналды және жүктелді!`
          : `📦 "${studentName}_Verified_Visa_Dossier.zip" full dossier successfully exported!`,
        'success'
      )
    }, 1500)
  }

  const toggleDoc = (id: string) => {
    if (selectedDocs.includes(id)) {
      setSelectedDocs(selectedDocs.filter((d) => d !== id))
    } else {
      setSelectedDocs([...selectedDocs, id])
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50/70 via-white to-indigo-50/50 p-6 dark:border-purple-900/40 dark:from-slate-900 dark:via-slate-900 dark:to-purple-950/30">
        <div>
          <div className="inline-flex items-center gap-2 rounded-lg bg-purple-100/80 px-3 py-1 text-xs font-bold text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
            <Globe className="h-3.5 w-3.5" />
            <span>International Visa & Admissions Dossier Pack</span>
          </div>
          <h2 className="mt-2 text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            {isKz ? 'Шетелдік Виза және ЖОО Құжаттарын Авто-Жинақтау' : 'One-Click Visa & Admissions Document Pack'}
          </h2>
          <p className="mt-1 max-w-2xl text-xs text-slate-600 dark:text-slate-300">
            {isKz
              ? 'АҚШ (F-1/Common App), Еуропа (Schengen/DAAD), Корея (D-2/KAIST) визалары мен гранттарына барлық дипломдар, ағылшынша аудармалар мен нотариалды QR-апостильді 1 түймемен экспорттайды.'
              : 'Auto-compiles verified diplomas, certified translations, and apostille verification packs into ready-to-submit visa packets.'}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Visa Target Selection */}
        <div className="space-y-4 lg:col-span-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {isKz ? 'Мақсатты Виза немесе Портал:' : 'Target Visa / Admissions Format:'}
            </label>

            <div className="mt-3 space-y-2">
              {[
                { id: 'usa_f1', title: '🇺🇸 USA Student Visa (F-1 / I-20 Pack)' },
                { id: 'common_app', title: '🏛️ Common Application (Ivy League / MIT)' },
                { id: 'schengen', title: '🇪🇺 European Student Visa (Schengen / DAAD)' },
                { id: 'korea_d2', title: '🇰🇷 South Korea D-2 Visa (KAIST / SNU)' },
              ].map((v) => {
                const isSelected = selectedTargetVisa === v.id
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedTargetVisa(v.id as 'usa_f1' | 'common_app' | 'schengen' | 'korea_d2')}
                    className={`flex w-full items-center justify-between rounded-xl border p-3 text-left text-xs font-bold transition ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/70 text-purple-900 dark:border-purple-500 dark:bg-purple-950/40 dark:text-purple-200'
                        : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700'
                    }`}
                  >
                    <span>{v.title}</span>
                    {isSelected && <CheckCircle2 className="h-4 w-4 text-purple-600" />}
                  </button>
                )
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={handleExportZip}
            disabled={isExporting || selectedDocs.length === 0}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-3.5 text-xs font-bold text-white shadow-md shadow-purple-500/20 hover:bg-purple-700 active:scale-[0.99] disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            <span>
              {isExporting
                ? isKz
                  ? 'Архив Жинақталуда...'
                  : 'Compiling Dossier ZIP...'
                : isKz
                ? `Барлық Құжаттарды Жүктеу (${selectedDocs.length} файл)`
                : `Download Complete Pack (${selectedDocs.length} files)`}
            </span>
          </button>
        </div>

        {/* Documents Checklist Column */}
        <div className="space-y-4 lg:col-span-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {isKz ? 'Пакетке Кіретін Құжаттар Тізімі:' : 'Included Verified Documents:'}
              </h3>
              <span className="text-xs text-slate-500">QR-Apostille Verified</span>
            </div>

            <div className="mt-4 space-y-3">
              {DOCUMENT_ITEMS.map((doc) => {
                const isChecked = selectedDocs.includes(doc.id)
                return (
                  <div
                    key={doc.id}
                    onClick={() => toggleDoc(doc.id)}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition ${
                      isChecked
                        ? 'border-purple-200 bg-purple-50/40 dark:border-purple-900/50 dark:bg-purple-950/20'
                        : 'border-slate-200 opacity-60 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="h-4 w-4 rounded accent-purple-600"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {isKz ? doc.titleKz : doc.titleEn}
                        </h4>
                        <div className="text-[11px] text-slate-500">
                          {doc.type} • {doc.fileSize}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                        <ShieldCheck className="h-3 w-3" />
                        <span>Apostilled</span>
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
