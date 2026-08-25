import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Smartphone,
  ShieldCheck,
  QrCode,
  Download,
  CheckCircle2,
  Lock,
  Radio,
} from 'lucide-react'
import { useToast } from '../lib/toast'
import { useAuth } from '../hooks/useAuth'

export function DigitalWalletAndNftCard() {
  const { i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const { session } = useAuth()
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState<'apple_wallet' | 'google_wallet' | 'nft_blockchain'>('apple_wallet')
  const [isNfcActive, setIsNfcActive] = useState(false)

  const studentName = session?.user?.user_metadata?.full_name || 'Әлихан Нұрланұлы'
  const studentSchool = session?.user?.user_metadata?.school || 'РФМШ Алматы (ФМН)'
  const studentGrade = session?.user?.user_metadata?.grade || '11 "А"'
  const studentXp = 4850
  const passId = 'KZ-USHQN-2026-9812'
  const blockchainTxHash = '0x8f7a912b4e5c89301290bbfa7129038472910cba7620192847192837482910fa'

  const handleSimulateNfc = () => {
    setIsNfcActive(true)
    toast(isKz ? '📡 Apple Wallet / Google Pay NFC сигналы жіберілді...' : '📡 Передача данных по NFC...', 'info')
    setTimeout(() => {
      setIsNfcActive(false)
      toast(isKz ? '✅ Студенттік ID расталды! Турникет ашылды.' : '✅ Студенческий ID подтвержден турникетом!')
    }, 2000)
  }

  const handleDownloadPass = () => {
    toast(isKz ? '📥 .pkpass Apple Wallet файлы дайындалды және жүктелді' : '📥 .pkpass Apple Wallet файл успешно сгенерирован!')
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-zinc-900 to-neutral-900 p-6 text-white shadow-xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-slate-200 backdrop-blur-md">
              <Smartphone className="h-3.5 w-3.5 text-amber-400" />
              <span>Digital Student ID & Wallet Pass</span>
              <span className="rounded bg-emerald-500/30 px-1.5 py-0.5 text-[10px] font-black text-emerald-300">
                OFFICIAL NFC READY
              </span>
            </div>
            <h2 className="text-xl font-black tracking-tight sm:text-2xl">
              {isKz ? 'Apple Wallet & Google Wallet Цифрлық Картасы' : 'Apple Wallet и Google Wallet Студенческий'}
            </h2>
            <p className="max-w-xl text-xs text-slate-300/80 sm:text-sm">
              {isKz
                ? 'Оқушының барлық расталған грамоталары мен мәртебесі телефонның Apple Wallet немесе Google Pay қосымшасына 1-басумен қосылады.'
                : 'Официальный студенческий билет и QR паспорт в нативном формате Apple/Google Wallet с поддержкой бесконтактного NFC.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadPass}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-900 shadow-md transition hover:bg-slate-100 active:scale-95"
            >
              <Download className="h-4 w-4" />
              <span>{isKz ? 'Wallet-ке қосу (.pkpass)' : 'Добавить в Wallet'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
        {[
          { id: 'apple_wallet', label: ' Apple Wallet Pass' },
          { id: 'google_wallet', label: 'Google Wallet Pass' },
          { id: 'nft_blockchain', label: '⛓️ Polygon Blockchain NFT Ledger' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as 'apple_wallet' | 'google_wallet' | 'nft_blockchain')}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Pass Visualization Container */}
      <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
        {/* Pass Card Preview */}
        <div className="flex justify-center">
          {activeTab === 'apple_wallet' || activeTab === 'google_wallet' ? (
            <div className="relative w-full max-w-[340px] overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 p-6 text-white shadow-2xl border border-white/20 flex flex-col justify-between min-h-[460px]">
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 text-xs font-black backdrop-blur-md">
                    U
                  </span>
                  <div>
                    <div className="text-[11px] font-black tracking-wider uppercase text-blue-200">
                      USHQN TALENT PASS
                    </div>
                    <div className="text-[9px] text-slate-300 font-medium">{studentSchool}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Radio className={`h-4 w-4 text-emerald-400 ${isNfcActive ? 'animate-ping' : ''}`} />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-300">NFC</span>
                </div>
              </div>

              {/* Student Identity */}
              <div className="my-6 space-y-4">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-blue-300/80 font-bold">
                    {isKz ? 'Оқушының Аты-жөні' : 'Имя ученика'}
                  </div>
                  <div className="text-lg font-black tracking-tight">{studentName}</div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-[9px] uppercase text-blue-300/80 font-bold">
                      {isKz ? 'Сынып' : 'Класс'}
                    </div>
                    <div className="text-xs font-bold">{studentGrade}</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase text-blue-300/80 font-bold">
                      {isKz ? 'XP Рейтинг' : 'Рейтинг XP'}
                    </div>
                    <div className="text-xs font-bold text-amber-400">⚡ {studentXp} XP (Lvl 24)</div>
                  </div>
                </div>
              </div>

              {/* QR & Barcode Section */}
              <div className="rounded-2xl bg-white p-4 text-center text-slate-900 shadow-inner flex flex-col items-center">
                <QrCode className="h-28 w-28 text-slate-900" />
                <span className="mt-2 font-mono text-[10px] font-black tracking-widest text-slate-500">
                  {passId}
                </span>
                <span className="text-[8px] font-bold text-emerald-600 uppercase mt-0.5">
                  ● {isKz ? 'Тексерілген & Верификацияланған' : 'Верифицирован в реестре'}
                </span>
              </div>
            </div>
          ) : (
            /* NFT Blockchain View */
            <div className="relative w-full max-w-[340px] overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 p-6 text-white shadow-2xl border border-purple-500/30 flex flex-col justify-between min-h-[460px]">
              <div>
                <div className="flex items-center justify-between border-b border-purple-500/30 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-purple-500/20 px-2 py-1 text-[10px] font-bold text-purple-300">
                      POLYGON POS
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">ERC-721 SOULBOUND</span>
                  </div>
                  <Lock className="h-4 w-4 text-purple-400" />
                </div>

                <div className="mt-4 space-y-3">
                  <div className="text-sm font-black text-purple-200">
                    {isKz ? 'Түрлендірілмейтін Диплом NFT' : 'Soulbound Диплом NFT'}
                  </div>
                  <div className="rounded-xl bg-purple-950/60 p-3 text-[10px] font-mono text-purple-300 break-all border border-purple-500/20">
                    <div className="text-slate-400 mb-1">SHA-256 HASH:</div>
                    {blockchainTxHash}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-3.5 text-center">
                <CheckCircle2 className="mx-auto h-6 w-6 text-emerald-400" />
                <div className="mt-1 text-xs font-bold text-emerald-300">
                  {isKz ? 'Блокчейнде Өшпейтін Жазба' : 'Неизменяемая запись в сети'}
                </div>
                <div className="text-[9px] text-slate-400 mt-0.5">
                  Block #54,921,802 · Timestamp: Aug 2026
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Feature Explanations & Actions */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {isKz ? 'Цифрлық ID Артықшылықтары' : 'Возможности Цифрового Паспорта'}
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                <Radio className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {isKz ? 'NFC Контактісіз Тексеру' : 'Бесконтактный NFC доступ'}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                    {isKz
                      ? 'Олимпиадалар мен конференциялардың кіреберісінде телефонды жақындату арқылы тіркелу.'
                      : 'Быстрый проход на олимпиады и хакатоны через турникеты и терминалы.'}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {isKz ? 'Анти-Фейк Қорғаныс' : 'Анти-фейк верификация'}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                    {isKz
                      ? 'Әрбір диплом мен марапаттың динамикалық QR-коды және криптографиялық хэші бар.'
                      : 'Каждая грамота защищена динамическим QR и хэш-подписью МОН РК.'}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="button"
                onClick={handleSimulateNfc}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <Radio className="h-4 w-4 text-blue-600" />
                <span>{isKz ? 'NFC-сигналды сынау' : 'Тест NFC сигнала'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadPass}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 active:scale-95"
              >
                <Download className="h-4 w-4" />
                <span>{isKz ? 'Apple / Google Pass Жүктеу' : 'Скачать Wallet Pass'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
