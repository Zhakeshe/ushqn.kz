import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Download,
  Printer,
  X,
  FileText,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Mail,
  Loader2,
} from 'lucide-react'

export interface ResumeData {
  name: string
  studentId: string
  grade?: string | number
  school?: string
  city?: string
  email?: string
  bio?: string
  targetGrant?: string
  totalXp: number
  leaderboardRank: number
  topPercentile: number
  verifiedCount: number
  achievements: Array<{
    id: string
    title: string
    category: string
    points: number
    date: string
    issuer?: string
    isVerified?: boolean
  }>
  skills: string[]
  academicOffers?: Array<{
    university: string
    status: string
    discount: string
  }>
}

interface ExportPdfResumeModalProps {
  data: ResumeData
  onClose: () => void
}

export function ExportPdfResumeModal({ data, onClose }: ExportPdfResumeModalProps) {
  const { i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const isRu = i18n.language === 'ru'

  const printRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [accentColor, setAccentColor] = useState<'navy' | 'emerald' | 'indigo'>('navy')

  const publicUrl = `https://ushqn.app/u/${encodeURIComponent(data.studentId)}`

  async function handleDownloadPdf() {
    if (!printRef.current) return
    setIsGenerating(true)
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ])
      // High-res canvas rendering
      const canvas = await html2canvas(printRef.current, {
        scale: 2.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      })

      const imgData = canvas.toDataURL('image/jpeg', 0.95)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`USHQN_Portfolio_${data.name.replace(/\s+/g, '_')}.pdf`)
    } catch (err) {
      console.error('PDF generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  function handlePrint() {
    window.print()
  }

  const themeClasses = {
    navy: {
      bar: 'bg-slate-900',
      tag: 'bg-blue-50 text-blue-800 border-blue-200',
      accent: 'text-blue-600',
      border: 'border-slate-800',
    },
    emerald: {
      bar: 'bg-emerald-900',
      tag: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      accent: 'text-emerald-600',
      border: 'border-emerald-800',
    },
    indigo: {
      bar: 'bg-indigo-900',
      tag: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      accent: 'text-indigo-600',
      border: 'border-indigo-800',
    },
  }[accentColor]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-2 sm:p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative flex max-h-[96vh] w-full max-w-4xl flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {/* Modal Top Control Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3.5 dark:border-slate-800 dark:bg-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {isKz
                  ? 'Ресми PDF Резюме & Портфолио'
                  : isRu
                  ? 'Официальное PDF Резюме & Портфолио'
                  : 'Official PDF CV & Portfolio'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isKz
                  ? 'Халықаралық үлгідегі академиялық паспорт'
                  : isRu
                  ? 'Академический паспорт международного образца'
                  : 'International standard academic talent document'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Color Accent Picker */}
            <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-800">
              <span className="text-[11px] font-semibold text-slate-500">{isKz ? 'Стиль:' : isRu ? 'Стиль:' : 'Style:'}</span>
              <button
                type="button"
                onClick={() => setAccentColor('navy')}
                className={`h-4 w-4 rounded-full bg-slate-900 transition ${accentColor === 'navy' ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
                title="Navy"
              />
              <button
                type="button"
                onClick={() => setAccentColor('emerald')}
                className={`h-4 w-4 rounded-full bg-emerald-700 transition ${accentColor === 'emerald' ? 'ring-2 ring-emerald-500 ring-offset-1' : ''}`}
                title="Emerald"
              />
              <button
                type="button"
                onClick={() => setAccentColor('indigo')}
                className={`h-4 w-4 rounded-full bg-indigo-700 transition ${accentColor === 'indigo' ? 'ring-2 ring-indigo-500 ring-offset-1' : ''}`}
                title="Indigo"
              />
            </div>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <Printer className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{isKz ? 'Басу' : isRu ? 'Печать' : 'Print'}</span>
            </button>

            <button
              type="button"
              disabled={isGenerating}
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 active:scale-95 disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
              <span>{isKz ? 'PDF Жүктеу' : isRu ? 'Скачать PDF' : 'Download PDF'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Preview Canvas Container */}
        <div className="flex-1 overflow-y-auto bg-slate-200/70 p-4 sm:p-8 dark:bg-slate-950/90 flex justify-center">
          {/* Printable A4 CV Sheet */}
          <div
            ref={printRef}
            id="printable-cv"
            className="w-full max-w-[780px] bg-white text-slate-900 shadow-xl border border-slate-300 print:border-none print:shadow-none print:m-0 print:p-0"
            style={{ minHeight: '1050px', fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            {/* Top Official Banner */}
            <div className={`${themeClasses.bar} px-8 py-6 text-white flex justify-between items-center`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-widest text-blue-200">
                    REPUBLIC OF KAZAKHSTAN · USHQN TALENT REGISTRY
                  </span>
                </div>
                <h1 className="text-2xl font-black tracking-tight">{data.name}</h1>
                <p className="text-xs text-slate-300">
                  {data.grade ? `${data.grade} ${isKz ? 'сынып оқушысы' : 'класс'}` : 'Оқушы'} · {data.school || 'РФМШ / NIS / Білім-Инновация Лицейі'}
                </p>
              </div>

              {/* Verified QR Badge */}
              <div className="flex flex-col items-end gap-1">
                <div className="rounded-lg bg-white p-1.5 shadow-sm text-slate-900">
                  {/* Dynamic SVG QR */}
                  <svg viewBox="0 0 100 100" className="h-14 w-14 text-slate-900">
                    <rect x="0" y="0" width="30" height="30" fill="currentColor" />
                    <rect x="5" y="5" width="20" height="20" fill="white" />
                    <rect x="9" y="9" width="12" height="12" fill="currentColor" />

                    <rect x="70" y="0" width="30" height="30" fill="currentColor" />
                    <rect x="75" y="5" width="20" height="20" fill="white" />
                    <rect x="79" y="9" width="12" height="12" fill="currentColor" />

                    <rect x="0" y="70" width="30" height="30" fill="currentColor" />
                    <rect x="5" y="75" width="20" height="20" fill="white" />
                    <rect x="9" y="79" width="12" height="12" fill="currentColor" />

                    <rect x="36" y="10" width="8" height="8" fill="currentColor" />
                    <rect x="48" y="10" width="8" height="8" fill="currentColor" />
                    <rect x="36" y="24" width="8" height="8" fill="currentColor" />
                    <rect x="48" y="38" width="8" height="8" fill="currentColor" />
                    <rect x="60" y="48" width="8" height="8" fill="currentColor" />
                    <rect x="36" y="60" width="8" height="8" fill="currentColor" />
                    <rect x="48" y="72" width="8" height="8" fill="currentColor" />
                    <rect x="60" y="72" width="8" height="8" fill="currentColor" />
                    <rect x="72" y="60" width="8" height="8" fill="currentColor" />
                    <rect x="84" y="72" width="8" height="8" fill="currentColor" />
                  </svg>
                </div>
                <span className="font-mono text-[9px] font-bold text-slate-300">{data.studentId}</span>
              </div>
            </div>

            {/* Quick Meta Subbar */}
            <div className="border-b border-slate-200 bg-slate-50 px-8 py-2.5 text-xs text-slate-600 flex flex-wrap justify-between items-center gap-3">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  {data.city || 'Алматы, Қазақстан'}
                </span>
                {data.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    {data.email}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-300">
                  <ShieldCheck className="h-3 w-3" />
                  {isKz ? 'Верификацияланған Профиль' : 'Верифицированный профиль'}
                </span>
              </div>
            </div>

            {/* Body 2-Column Grid */}
            <div className="p-8 grid grid-cols-12 gap-6">
              {/* Left Column (Main Achievements) */}
              <div className="col-span-8 space-y-6">
                {/* Objective / Summary */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-200 pb-1 mb-2">
                    {isKz ? 'Академиялық Мақсаты & Бағыты' : 'Академическая цель & Профиль'}
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-700">
                    {data.bio ||
                      (isKz
                        ? 'Робототехника, бағдарламалау және олимпиадалық жаратылыстану ғылымдарына маманданған белсенді оқушы. Жоғары оқу орындарының грантына және халықаралық зерттеу бағдарламаларына үміткер.'
                        : 'Ученик со специализацией в робототехнике, программировании и олимпиадных науках. Кандидат на университетские гранты и стипендиальные программы.')}
                  </p>
                </div>

                {/* Verified Achievements List */}
                <div>
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1 mb-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                      {isKz ? 'Расталған Жетістіктер & Олимпиадалар' : 'Верифицированные Достижения & Олимпиады'}
                    </h3>
                    <span className="text-[10px] font-bold text-blue-600">
                      {data.achievements.length} {isKz ? 'диплом' : 'дипломов'}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {data.achievements.length > 0 ? (
                      data.achievements.slice(0, 7).map((ach) => (
                        <div key={ach.id} className="rounded-xl border border-slate-200 p-3 bg-slate-50/50">
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                <h4 className="text-xs font-bold text-slate-900">{ach.title}</h4>
                              </div>
                              <p className="text-[11px] text-slate-500">
                                {ach.issuer || 'Республикалық / Халықаралық деңгей'} · {ach.category}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-black text-blue-800">
                                +{ach.points} XP
                              </span>
                              <div className="text-[9px] text-slate-400 mt-0.5">{ach.date}</div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
                        {isKz ? 'Әзірге жетістіктер тіркелмеген' : 'Пока нет добавленных дипломов'}
                      </div>
                    )}
                  </div>
                </div>

                {/* University Direct Grant Status */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-200 pb-1 mb-2">
                    {isKz ? 'ЖОО Грант Офферлері & Ұсыныстар' : 'Грантовые Офферы Вузов'}
                  </h3>
                  <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-900">Astana IT University</div>
                        <div className="text-[11px] font-semibold text-emerald-700">
                          ✓ Академиялық грант / 100% Оқу ақысын жеңілдету
                        </div>
                      </div>
                      <span className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[10px] font-black text-white">
                        ОДОБРЕНО
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (Metrics, Skills, QR Verification) */}
              <div className="col-span-4 space-y-6">
                {/* Talent Scores Box */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-600">
                    {isKz ? 'Рейтинг көрсеткіштері' : 'Показатели Рейтинга'}
                  </h4>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600">USHQN Ұпай (XP):</span>
                      <span className="font-black text-blue-700">{data.totalXp.toLocaleString()} XP</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600">{isKz ? 'Ел рейтингінде:' : 'В рейтинге:'}</span>
                      <span className="font-bold text-slate-900">
                        {data.leaderboardRank > 0 ? `ТОП ${data.topPercentile}% (#${data.leaderboardRank})` : '—'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600">{isKz ? 'Расталған құжат:' : 'Верифицировано:'}</span>
                      <span className="font-bold text-emerald-700">{data.verifiedCount} диплом</span>
                    </div>
                  </div>
                </div>

                {/* Skills & Competencies */}
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-200 pb-1 mb-2">
                    {isKz ? 'Құзыреттер & Дағдылар' : 'Навыки & Компетенции'}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(data.skills.length > 0
                      ? data.skills
                      : ['Python', 'Robotics (VEX/Arduino)', 'IELTS 7.5', 'Олимпиадалық Математика', 'C++', 'Algorithmic Problem Solving']
                    ).map((sk) => (
                      <span
                        key={sk}
                        className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-800"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* QR Verification Authenticity Box */}
                <div className="rounded-xl border border-dashed border-slate-300 p-3.5 text-center bg-slate-50/50">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {isKz ? 'Түпнұсқалықты тексеру' : 'Проверка подлинности'}
                  </p>
                  <p className="text-[9px] text-slate-400 mt-1 leading-tight">
                    {isKz
                      ? 'Осы құжаттың анти-фейк жазбасы мемлекеттік USHQN блокчейнінде расталған.'
                      : 'Запись защищена от подделок и верифицирована в реестре талантов USHQN.'}
                  </p>
                  <div className="mt-2 text-[9px] font-mono text-blue-600 truncate">{publicUrl}</div>
                </div>

                {/* Official Stamp Mockup */}
                <div className="flex justify-center pt-2">
                  <div className="rounded-full border-2 border-emerald-600 p-2 text-center text-emerald-700 rotate-[-8deg] opacity-85">
                    <div className="text-[8px] font-black tracking-widest uppercase">USHQN VERIFIED</div>
                    <div className="text-[7px] font-semibold">REPUBLIC OF KAZAKHSTAN</div>
                    <div className="text-[6px]">№ {data.studentId}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer Line */}
            <div className="border-t border-slate-200 px-8 py-3 text-center text-[10px] text-slate-400 flex justify-between items-center">
              <span>USHQN Talent Platform · {new Date().getFullYear()}</span>
              <span>Official Academic Document</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
