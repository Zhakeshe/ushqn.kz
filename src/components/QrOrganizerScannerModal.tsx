import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Scan,
  ShieldCheck,
  Search,
  School,
  Zap,
  Camera,
  X,
  UserCheck,
} from 'lucide-react'
import { useToast } from '../lib/toast'

interface VerifiedStudentResult {
  passportId: string
  fullName: string
  school: string
  grade: string
  verifiedDiplomasCount: number
  totalXp: number
  status: 'verified' | 'suspicious' | 'not_found'
  topAward: string
}

export function QrOrganizerScannerModal({ onClose }: { onClose: () => void }) {
  const { i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const { toast } = useToast()

  const [inputCode, setInputCode] = useState('KZ-USHQN-2026-9812')
  const [isScanning, setIsScanning] = useState(false)
  const [scannedResult, setScannedResult] = useState<VerifiedStudentResult | null>(null)

  const handleSimulateScan = () => {
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
      setScannedResult({
        passportId: inputCode || 'KZ-USHQN-2026-9812',
        fullName: 'Әлихан Нұрланұлы',
        school: 'РФМШ Алматы (ФМН)',
        grade: '11 "А"',
        verifiedDiplomasCount: 14,
        totalXp: 4850,
        status: 'verified',
        topAward: '🥇 Жәутіков Олимпиадасы 2026 - 1-орын (Алтын)',
      })
      toast(isKz ? '✅ Студенттік QR сәтті сканерленді және расталды!' : '✅ QR-код успешно верифицирован!')
    }, 1200)
  }

  const handleCheckIn = () => {
    toast(
      isKz
        ? '🎟️ Оқушы республикалық олимпиадаға қатысушы ретінде тіркелді!'
        : '🎟️ Участник успешно зарегистрирован на площадке!',
    )
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              <Scan className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {isKz ? 'Ұйымдастырушы Сканері & QR Тексеру' : 'Сканер Организатора и Проверка QR'}
              </h3>
              <span className="text-[10px] text-slate-400">
                {isKz ? 'Олимпиада, Хакатон & ЖОО Қабылдау комиссиясы' : 'Олимпиады, Хакатоны и Приемная комиссия'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Camera Frame Simulation */}
          <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-400/60 bg-blue-50/40 p-6 text-center dark:border-blue-700/50 dark:bg-blue-950/20">
            <div className="relative">
              <Camera className="h-12 w-12 text-blue-600 dark:text-blue-400" />
              {isScanning && (
                <div className="absolute inset-0 animate-ping rounded-full bg-blue-500/20" />
              )}
            </div>
            <div className="mt-3 text-xs font-bold text-slate-800 dark:text-white">
              {isScanning
                ? isKz
                  ? 'Камера арқылы QR оқылуда...'
                  : 'Считывание QR через камеру...'
                : isKz
                ? 'Оқушының QR-кодын камераға көрсетіңіз'
                : 'Наведите камеру на QR-код студента'}
            </div>
            <button
              type="button"
              disabled={isScanning}
              onClick={handleSimulateScan}
              className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
            >
              <Scan className="h-3.5 w-3.5" />
              <span>{isKz ? 'Камерамен Сканерлеу' : 'Сканировать Камерой'}</span>
            </button>
          </div>

          {/* Manual Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase text-slate-400">
              {isKz ? 'Немесе Паспорт кодын жазыңыз:' : 'Или введите код паспорта вручную:'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="KZ-USHQN-2026-XXXX"
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-mono text-slate-800 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <button
                type="button"
                onClick={handleSimulateScan}
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <Search className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Scanned Card Details */}
          {scannedResult && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <span className="text-xs font-black text-emerald-900 dark:text-emerald-200 uppercase tracking-wider">
                    {isKz ? 'Түпнұсқалық Расталды' : 'Подлинность подтверждена'}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400">
                  {scannedResult.passportId}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="text-sm font-black text-slate-900 dark:text-white">
                  {scannedResult.fullName} ({scannedResult.grade})
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <School className="h-3.5 w-3.5 text-blue-600" />
                  <span>{scannedResult.school}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                  <span>{scannedResult.totalXp} XP · {scannedResult.verifiedDiplomasCount} {isKz ? 'ресми диплом' : 'дипломов'}</span>
                </div>
                <div className="rounded-lg bg-white/80 p-2 text-[11px] font-bold text-slate-800 dark:bg-slate-900/80 dark:text-slate-200">
                  {scannedResult.topAward}
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckIn}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-95"
              >
                <UserCheck className="h-4 w-4" />
                <span>{isKz ? 'Іс-шараға Тіркеу (Check-In)' : 'Отметить присутствие (Check-In)'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
