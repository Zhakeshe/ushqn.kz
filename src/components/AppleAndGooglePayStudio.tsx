import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Smartphone,
  CreditCard,
  Download,
  CheckCircle2,
  Lock,
  Radio,
  Sparkles,
  QrCode,
  ShieldCheck,
  Zap,
  RefreshCw,
  Copy,
  Check,
  Receipt,
  Sliders,
  Wallet,
  CheckCheck,
} from 'lucide-react'
import { useToast } from '../lib/toast'
import { useAuth } from '../hooks/useAuth'

export interface PaymentTransaction {
  id: string
  method: 'apple_pay' | 'google_pay'
  amount: number
  currency: string
  title: string
  merchant: string
  date: string
  status: 'completed' | 'pending' | 'refunded'
  cardLast4: string
  cardBrand: 'Visa' | 'Mastercard' | 'Apple Card' | 'Kaspi'
  token: string
}

export interface WalletPassConfig {
  passType: 'student_id' | 'olympiad_ticket' | 'vip_member' | 'hackathon_pass'
  holderName: string
  organization: string
  gradeOrRole: string
  studentId: string
  xpPoints: number
  accentColor: string
  secondaryColor: string
  barcodeType: 'QR' | 'PDF417' | 'CODE128'
}

const STORAGE_TX_KEY = 'ushqn_wallet_pay_transactions_v1'

export function AppleAndGooglePayStudio() {
  const { i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const { session } = useAuth()
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState<'checkout' | 'apple_pass' | 'google_pass' | 'terminal' | 'ledger'>(
    'checkout'
  )

  // Sound generator for Apple/Google Pay chime
  const playPaymentSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      // Apple Pay iconic chime: 1318.51 Hz (E6) -> 1760 Hz (A6)
      osc.frequency.setValueAtTime(1318.51, ctx.currentTime)
      osc.frequency.setValueAtTime(1760, ctx.currentTime + 0.1)

      gain.gain.setValueAtTime(0, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.45)
    } catch {
      // ignore audio context issues
    }
  }

  // Transactions State
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_TX_KEY)
      if (saved) return JSON.parse(saved)
    } catch {
      // fallback
    }
    return [
      {
        id: 'TX-AP-8921',
        method: 'apple_pay',
        amount: 2500,
        currency: 'KZT',
        title: 'Республикалық Информатика Олимпиадасына қатысу билеты',
        merchant: 'USHQN Education Kazakhstan',
        date: new Date(Date.now() - 3600000 * 5).toISOString(),
        status: 'completed',
        cardLast4: '4821',
        cardBrand: 'Kaspi',
        token: 'com.apple.pkpaymenttoken.99824a7bc',
      },
      {
        id: 'TX-GP-4310',
        method: 'google_pay',
        amount: 4900,
        currency: 'KZT',
        title: 'AI Mentor Pro + Roadmap Premium жазылымы',
        merchant: 'USHQN Hub Tech',
        date: new Date(Date.now() - 3600000 * 28).toISOString(),
        status: 'completed',
        cardLast4: '1024',
        cardBrand: 'Mastercard',
        token: 'gpay_token_ecqv9082348a',
      },
    ]
  })

  // Save transactions
  const saveTransactions = (newList: PaymentTransaction[]) => {
    setTransactions(newList)
    try {
      localStorage.setItem(STORAGE_TX_KEY, JSON.stringify(newList))
    } catch {
      // ignore
    }
  }

  // Wallet Pass Customizer State
  const [passConfig, setPassConfig] = useState<WalletPassConfig>({
    passType: 'student_id',
    holderName: session?.user?.user_metadata?.full_name || 'Әлихан Нұрланұлы',
    organization: session?.user?.user_metadata?.school || 'РФМШ Алматы / ФМН',
    gradeOrRole: '11 "А" Сынып · Оқушы',
    studentId: 'KZ-USHQN-2026-9812',
    xpPoints: 4850,
    accentColor: '#1e3a8a', // Deep Blue
    secondaryColor: '#0f172a', // Slate Dark
    barcodeType: 'QR',
  })

  // Checkout State
  const [selectedProduct, setSelectedProduct] = useState<{ id: string; name: string; price: number; desc: string }>({
    id: 'olympiad_pass',
    name: isKz ? 'Олимпиада қатысушысының ресми лицензиясы' : 'Официальный билет участника олимпиады',
    price: 2500,
    desc: 'IOI/IZhO дайындық баттлдарына шексіз қатынау және сертификат алу мүмкіндігі.',
  })

  // Apple Pay Modal State
  const [applePayModalOpen, setApplePayModalOpen] = useState(false)
  const [applePayStep, setApplePayStep] = useState<'sheet' | 'authenticating' | 'success'>('sheet')
  const [selectedAppleCard, setSelectedAppleCard] = useState<'kaspi' | 'apple_card' | 'halyk'>('kaspi')

  // Google Pay Modal State
  const [gpayModalOpen, setGpayModalOpen] = useState(false)
  const [gpayStep, setGpayStep] = useState<'sheet' | 'processing' | 'success'>('sheet')
  const [selectedGpayCard, setSelectedGpayCard] = useState<'visa_gpay' | 'mastercard_gpay'>('visa_gpay')

  // NFC Terminal Simulator State
  const [nfcScanning, setNfcScanning] = useState(false)
  const [terminalSuccess, setTerminalSuccess] = useState(false)
  const [terminalPayMethod, setTerminalPayMethod] = useState<'apple_pay' | 'google_pay'>('apple_pay')

  // Receipt Modal State
  const [selectedReceiptTx, setSelectedReceiptTx] = useState<PaymentTransaction | null>(null)

  const handleDownloadReceipt = (tx: PaymentTransaction) => {
    const receiptContent = `====================================
      USHQN KAZAKHSTAN FISCAL RECEIPT
====================================
Transaction ID : ${tx.id}
Payment Method : ${tx.method === 'apple_pay' ? 'Apple Pay ( Contactless)' : 'Google Pay (G Pay)'}
Merchant       : ${tx.merchant}
Date           : ${new Date(tx.date).toLocaleString()}
Status         : ${tx.status.toUpperCase()} (APPROVED)
Card Details   : ${tx.cardBrand} •••• ${tx.cardLast4}
Auth Token     : ${tx.token}
------------------------------------
Items:
1. ${tx.title}
------------------------------------
TOTAL AMOUNT   : ₸${tx.amount.toLocaleString()} ${tx.currency}
Tax (0%)       : ₸0
Bank Auth Code : AUTH-KZT-${Math.floor(100000 + Math.random() * 900000)}
Terminal ID    : KZ-POS-NFC-8802
====================================
Thank you for choosing USHQN Education!
`
    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `USHQN_Receipt_${tx.id}.txt`
    link.click()
    URL.revokeObjectURL(url)
    toast(isKz ? '📄 Фискалды чек сәтті жүктелді!' : '📄 Чек успешно выгружен!', 'success')
  }

  // Copy helper
  const [copiedToken, setCopiedToken] = useState<string | null>(null)
  const handleCopy = (text: string, id: string) => {
    void navigator.clipboard.writeText(text)
    setCopiedToken(id)
    setTimeout(() => setCopiedToken(null), 2000)
    toast(isKz ? 'Токен көшірілді!' : 'Токен скопирован!')
  }

  // --- Apple Pay Trigger ---
  const handleOpenApplePay = () => {
    setApplePayStep('sheet')
    setApplePayModalOpen(true)
  }

  const handleConfirmApplePay = () => {
    setApplePayStep('authenticating')
    // Simulate Face ID / Double Click power button authentication
    setTimeout(() => {
      playPaymentSound()
      setApplePayStep('success')

      const newTx: PaymentTransaction = {
        id: `TX-AP-${Math.floor(1000 + Math.random() * 9000)}`,
        method: 'apple_pay',
        amount: selectedProduct.price,
        currency: 'KZT',
        title: selectedProduct.name,
        merchant: 'USHQN Apple Pay Merchant Gateway',
        date: new Date().toISOString(),
        status: 'completed',
        cardLast4: selectedAppleCard === 'kaspi' ? '4821' : selectedAppleCard === 'apple_card' ? '1024' : '9902',
        cardBrand: selectedAppleCard === 'kaspi' ? 'Kaspi' : selectedAppleCard === 'apple_card' ? 'Apple Card' : 'Visa',
        token: `com.apple.pkpaymenttoken.${Math.random().toString(36).substring(2, 12)}`,
      }

      saveTransactions([newTx, ...transactions])
      toast(
        isKz
          ? ' Apple Pay төлемі сәтті өтті! Чек пен рұқсат поштаңызға жолданды.'
          : ' Оплата через Apple Pay успешно завершена!'
      )
    }, 1800)
  }

  // --- Google Pay Trigger ---
  const handleOpenGooglePay = () => {
    setGpayStep('sheet')
    setGpayModalOpen(true)
  }

  const handleConfirmGooglePay = () => {
    setGpayStep('processing')
    setTimeout(() => {
      playPaymentSound()
      setGpayStep('success')

      const newTx: PaymentTransaction = {
        id: `TX-GP-${Math.floor(1000 + Math.random() * 9000)}`,
        method: 'google_pay',
        amount: selectedProduct.price,
        currency: 'KZT',
        title: selectedProduct.name,
        merchant: 'USHQN Google Pay Merchant API',
        date: new Date().toISOString(),
        status: 'completed',
        cardLast4: selectedGpayCard === 'visa_gpay' ? '8832' : '5519',
        cardBrand: selectedGpayCard === 'visa_gpay' ? 'Visa' : 'Mastercard',
        token: `gpay_token_${Math.random().toString(36).substring(2, 12)}`,
      }

      saveTransactions([newTx, ...transactions])
      toast(
        isKz
          ? ' Google Pay төлемі сәтті орындалды! Транзакция расталды.'
          : ' Google Pay транзакция успешно подтверждена!'
      )
    }, 1500)
  }

  // --- NFC Terminal Simulation ---
  const handleRunNfcTerminal = () => {
    setNfcScanning(true)
    setTerminalSuccess(false)

    setTimeout(() => {
      playPaymentSound()
      setNfcScanning(false)
      setTerminalSuccess(true)

      const newTx: PaymentTransaction = {
        id: `TX-POS-${Math.floor(1000 + Math.random() * 9000)}`,
        method: terminalPayMethod,
        amount: 1500,
        currency: 'KZT',
        title: 'NFC Контактісіз Төлем (Astana Hub / RFMSH Turnstile)',
        merchant: 'USHQN POS Terminal 0042',
        date: new Date().toISOString(),
        status: 'completed',
        cardLast4: '7721',
        cardBrand: 'Kaspi',
        token: `nfc_pos_cryptogram_${Math.random().toString(36).substring(2, 10)}`,
      }
      saveTransactions([newTx, ...transactions])

      toast(
        isKz
          ? '📡 NFC Сигналы сәтті өңделді! Турникет ашылып, төлем қабылданды.'
          : '📡 Бесконтактная оплата прошла успешно! Доступ разрешен.'
      )
    }, 2200)
  }

  // --- Download Apple Pass (.pkpass) ---
  const handleDownloadApplePass = () => {
    const passJson = {
      formatVersion: 1,
      passTypeIdentifier: 'pass.kz.ushqn.talent',
      serialNumber: passConfig.studentId,
      teamIdentifier: 'USHQN992KL',
      organizationName: passConfig.organization,
      description: 'USHQN Digital Student Pass & Apple Pay Credential',
      logoText: 'USHQN TALENT',
      foregroundColor: 'rgb(255, 255, 255)',
      backgroundColor: passConfig.accentColor,
      labelColor: 'rgb(200, 225, 255)',
      generic: {
        primaryFields: [
          {
            key: 'name',
            label: isKz ? 'ОҚУШЫ / СТУДЕНТ' : 'СТУДЕНТ',
            value: passConfig.holderName,
          },
        ],
        secondaryFields: [
          {
            key: 'org',
            label: isKz ? 'МЕКТЕП / ҰЙЫМ' : 'ОРГАНИЗАЦИЯ',
            value: passConfig.organization,
          },
          {
            key: 'role',
            label: isKz ? 'МӘРТЕБЕСІ' : 'СТАТУС',
            value: passConfig.gradeOrRole,
          },
        ],
        auxiliaryFields: [
          {
            key: 'xp',
            label: 'USHQN RATING',
            value: `${passConfig.xpPoints} XP (Diamond Tier)`,
          },
          {
            key: 'security',
            label: 'NFC SECURE',
            value: 'ENABLED ● APPLE PAY COMPLIANT',
          },
        ],
      },
      barcode: {
        format: passConfig.barcodeType === 'QR' ? 'PKBarcodeFormatQR' : 'PKBarcodeFormatPDF417',
        message: `https://ushqn.app/pass?id=${encodeURIComponent(passConfig.studentId)}&sig=sha256`,
        messageEncoding: 'iso-8859-1',
        altText: passConfig.studentId,
      },
      nfc: {
        message: `USHQN_NFC_${passConfig.studentId}`,
        encryptionPublicKey: '048f7a912b4e5c89301290bbfa7129038472910cba7620192847192837482910fa',
      },
    }

    const jsonString = JSON.stringify(passJson, null, 2)
    const blob = new Blob([jsonString], { type: 'application/vnd.apple.pkpass' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ushqn_${passConfig.studentId}.pkpass`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast(
      isKz
        ? ' .pkpass Apple Wallet файлы сәтті генерацияланды және жүктелді!'
        : ' .pkpass Apple Wallet файл успешно сгенерирован и загружен!'
    )
  }

  // --- Download Google Wallet Object ---
  const handleDownloadGoogleWalletJson = () => {
    const gwalletPayload = {
      iss: 'ushqn-google-wallet@ushqn-kz.iam.gserviceaccount.com',
      aud: 'google',
      typ: 'savetowallet',
      iat: Math.floor(Date.now() / 1000),
      payload: {
        genericObjects: [
          {
            id: `3388000000022312.${passConfig.studentId}`,
            classId: '3388000000022312.USHQN_STUDENT_PASS_CLASS',
            genericType: 'GENERIC_TYPE_UNSPECIFIED',
            hexBackgroundColor: passConfig.accentColor,
            logo: {
              sourceUri: {
                uri: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100',
              },
              contentDescription: {
                defaultValue: {
                  language: 'kk',
                  value: 'USHQN Logo',
                },
              },
            },
            cardTitle: {
              defaultValue: {
                language: 'kk',
                value: 'USHQN DIGITAL TALENT PASS',
              },
            },
            header: {
              defaultValue: {
                language: 'kk',
                value: passConfig.holderName,
              },
            },
            subheader: {
              defaultValue: {
                language: 'kk',
                value: passConfig.organization,
              },
            },
            barcode: {
              type: 'QR_CODE',
              value: `https://ushqn.app/pass?id=${passConfig.studentId}`,
              alternateText: passConfig.studentId,
            },
          },
        ],
      },
    }

    const blob = new Blob([JSON.stringify(gwalletPayload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ushqn_google_wallet_${passConfig.studentId}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast(
      isKz
        ? ' Google Wallet Pass JWT деректері жүктелді! Google Pay қосымшасына қосылуға дайын.'
        : ' Google Wallet Pass JSON успешно сохранен!'
    )
  }

  // Available catalog products for 1-click Pay
  const catalogProducts = [
    {
      id: 'olympiad_pass',
      name: isKz ? 'Олимпиада қатысушысының ресми лицензиясы' : 'Официальный билет участника олимпиады',
      price: 2500,
      desc: isKz
        ? 'IOI/IZhO дайындық баттлдарына қатысу және ресми сертификат алу мүмкіндігі.'
        : 'Участие в рейтинговых олимпиадах и получение верифицированного сертификата.',
    },
    {
      id: 'grant_fasttrack',
      name: isKz ? 'Grant & Mentor Fast-Track пакеті' : 'Пакет Fast-Track Грантов и Менторства',
      price: 4900,
      desc: isKz
        ? 'NU, СДУ және шетелдік университеттердің олимпиадашыларынан жеке 1-on-1 кеңес.'
        : 'Персональная 1-on-1 консультация от менторов NU и призеров межнаров.',
    },
    {
      id: 'astana_hub_badge',
      name: isKz ? 'Astana Hub Hackathon Pro Pass' : 'Astana Hub Hackathon Pro Pass',
      price: 3000,
      desc: isKz
        ? 'Astana Hub коворкингіне және хакатондарға NFC арқылы кедергісіз өту құқығы.'
        : 'Беспрепятственный проход в коворкинг Astana Hub по NFC и доступ к API.',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-black via-zinc-950 to-neutral-900 p-6 sm:p-8 text-white shadow-2xl border border-zinc-800">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-600/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold text-slate-200 backdrop-blur-md border border-white/10">
              <span className="font-black text-white"> Pay</span>
              <span className="text-slate-400">|</span>
              <span className="font-black text-emerald-400">G Pay</span>
              <span className="rounded bg-emerald-500/30 px-1.5 py-0.5 text-[10px] font-black text-emerald-300">
                NFC & WALLET READY
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
              {isKz ? 'Apple Pay & Google Pay Төлемдері және Цифрлық Wallet' : 'Apple Pay & Google Pay Оплата и Цифровой Wallet'}
            </h2>
            <p className="max-w-2xl text-xs text-slate-300 sm:text-sm leading-relaxed">
              {isKz
                ? 'Apple Pay (Face ID / Pay Sheet) және Google Pay арқылы 1-басумен қауіпсіз төлем жасаңыз, ресми .pkpass билеттерін Apple Wallet-ке жүктеңіз немесе контактісіз NFC турникеті арқылы өтіңіз.'
                : 'Оплачивайте в 1 клик через Apple Pay (Face ID) и Google Pay, экспортируйте официальные пропуска в Apple Wallet (.pkpass) и используйте бесконтактный NFC.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleOpenApplePay}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-black text-black shadow-lg transition hover:bg-slate-100 active:scale-95"
            >
              <span> Pay</span>
              <span className="text-slate-400 font-normal">|</span>
              <span>{isKz ? 'Apple Pay сынау' : 'Тест Apple Pay'}</span>
            </button>

            <button
              type="button"
              onClick={handleOpenGooglePay}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-xs font-black text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95"
            >
              <span className="text-emerald-400">G Pay</span>
              <span className="text-slate-400 font-normal">|</span>
              <span>{isKz ? 'Google Pay сынау' : 'Тест Google Pay'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
        {[
          { id: 'checkout' as const, label: ' Pay & G Pay 1-Click Төлемдер', icon: Zap },
          { id: 'apple_pass' as const, label: ' Apple Wallet Pass (.pkpass)', icon: Smartphone },
          { id: 'google_pass' as const, label: 'Google Wallet Pass (.json)', icon: Wallet },
          { id: 'terminal' as const, label: '📡 NFC POS & Терминал симуляторы', icon: Radio },
          {
            id: 'ledger' as const,
            label: `${isKz ? 'Чектер мен Төлемдер тарихы' : 'История транзакций'} (${transactions.length})`,
            icon: Receipt,
          },
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                activeTab === tab.id
                  ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* TAB 1: FAST CHECKOUT WITH APPLE PAY & GOOGLE PAY */}
      {activeTab === 'checkout' && (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Products & Checkout Card */}
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isKz ? '1. Төленетін қызметті немесе билетті таңдаңыз' : '1. Выберите услугу или билет'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isKz ? 'Apple Pay немесе Google Pay арқылы комиссиясыз лезде төлеу' : 'Мгновенная оплата через Apple Pay или Google Pay без комиссии'}
                </p>
              </div>

              <div className="space-y-2.5">
                {catalogProducts.map((p) => {
                  const isSelected = selectedProduct.id === p.id
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedProduct(p)}
                      className={`cursor-pointer rounded-2xl border p-4 transition ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-950/20 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">{p.name}</span>
                            {isSelected && (
                              <span className="rounded-full bg-blue-600 p-0.5 text-white">
                                <Check className="h-3 w-3" />
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">{p.desc}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-black text-slate-900 dark:text-white">
                            ₸{p.price.toLocaleString()}
                          </div>
                          <div className="text-[10px] font-bold text-emerald-600">0% комиссия</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Payment Summary */}
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>{isKz ? 'Қызмет құны:' : 'Сумма:'}</span>
                  <span className="font-bold text-slate-900 dark:text-white">₸{selectedProduct.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>{isKz ? 'Қауіпсіздік хаттамасы:' : 'Протокол безопасности:'}</span>
                  <span className="font-bold text-emerald-600">3-D Secure 2.0 & EMV Tokenized</span>
                </div>
                <div className="border-t border-slate-200 pt-2 dark:border-slate-700 flex justify-between font-bold text-sm text-slate-900 dark:text-white">
                  <span>{isKz ? 'Барлығы төлеуге:' : 'Итого к оплате:'}</span>
                  <span className="text-blue-600">₸{selectedProduct.price.toLocaleString()} KZT</span>
                </div>
              </div>

              {/* Apple Pay & Google Pay Official Styled Buttons */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Official Apple Pay Button */}
                <button
                  type="button"
                  onClick={handleOpenApplePay}
                  className="flex h-13 items-center justify-center gap-2 rounded-2xl bg-black px-6 text-sm font-bold text-white shadow-xl transition hover:bg-zinc-900 active:scale-[0.98] dark:bg-white dark:text-black dark:hover:bg-slate-100"
                >
                  <span className="text-base font-black"> Pay</span>
                  <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-600">арқылы төлеу</span>
                </button>

                {/* Official Google Pay Button */}
                <button
                  type="button"
                  onClick={handleOpenGooglePay}
                  className="flex h-13 items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 text-sm font-bold text-slate-900 shadow-md transition hover:bg-slate-50 active:scale-[0.98] dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                >
                  <span className="text-base font-black tracking-tight text-slate-900 dark:text-white">
                    <span className="text-blue-500">G</span>
                    <span className="text-red-500">o</span>
                    <span className="text-amber-500">o</span>
                    <span className="text-blue-500">g</span>
                    <span className="text-emerald-500">l</span>
                    <span className="text-red-500">e</span> Pay
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Info: Security & Bank Support in KZ */}
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    {isKz ? 'Қазақстан банктерімен 100% үйлесімділік' : 'Совместимость с банками Казахстана'}
                  </h4>
                  <p className="text-[11px] text-slate-500">Apple Pay & Google Pay сертификатталған</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                {[
                  { name: 'Kaspi.kz Gold/Red', supported: ' Pay + G Pay', color: 'text-red-600' },
                  { name: 'Halyk Bank Black', supported: ' Pay + G Pay', color: 'text-emerald-600' },
                  { name: 'ForteBank Elite', supported: ' Pay + G Pay', color: 'text-purple-600' },
                  { name: 'Freedom Bank Invest', supported: ' Pay + G Pay', color: 'text-blue-600' },
                ].map((b, i) => (
                  <div key={i} className="rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 dark:border-slate-800 dark:bg-slate-800/40">
                    <div className={`text-[11px] ${b.color}`}>{b.name}</div>
                    <div className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      <span>{b.supported}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 text-xs text-blue-900 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-200 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold">
                  <Lock className="h-3.5 w-3.5 text-blue-600" />
                  <span>Device Account Number (DAN) Tokenization</span>
                </div>
                <p className="text-[11px] leading-relaxed text-blue-800/80 dark:text-blue-300/80">
                  {isKz
                    ? 'Төлем жасау кезінде шынайы карта нөмірі ешкімге берілмейді. Әр транзакция үшін криптографиялық 1-реттік токен (Dynamic Cryptogram) жасалады.'
                    : 'Номер вашей карты не передается продавцу. Вместо него используется уникальный зашифрованный токен транзакции.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: APPLE WALLET PASS (.PKPASS) GENERATOR */}
      {activeTab === 'apple_pass' && (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Apple Wallet Pass Live Preview */}
          <div className="flex flex-col items-center space-y-4">
            {/* Apple Wallet Pass Card */}
            <div
              style={{ backgroundColor: passConfig.accentColor }}
              className="relative w-full max-w-[360px] overflow-hidden rounded-3xl p-6 text-white shadow-2xl border border-white/20 flex flex-col justify-between min-h-[490px]"
            >
              {/* Card Notch Top for Apple Wallet Pass feel */}
              <div className="pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2 h-8 w-24 rounded-full bg-black/40 blur-xs" />

              {/* Pass Header */}
              <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 text-xs font-black backdrop-blur-md">
                    
                  </span>
                  <div>
                    <div className="text-[10px] font-black tracking-widest uppercase text-blue-100">
                      USHQN PASS
                    </div>
                    <div className="text-[9px] text-white/80">{passConfig.organization}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Radio className="h-4 w-4 text-emerald-300" />
                  <span className="text-[9px] font-black uppercase tracking-wider text-emerald-200">
                    NFC TOUCH
                  </span>
                </div>
              </div>

              {/* Pass Main Body */}
              <div className="my-5 space-y-4">
                <div>
                  <div className="text-[9px] uppercase tracking-wider text-white/70 font-bold">
                    {isKz ? 'ОҚУШЫ / СТУДЕНТ' : 'ИМЯ ВЛАДЕЛЬЦА'}
                  </div>
                  <div className="text-xl font-black tracking-tight">{passConfig.holderName}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[9px] uppercase text-white/70 font-bold">
                      {isKz ? 'СЫНЫП / РОЛЬ' : 'КЛАСС / РОЛЬ'}
                    </div>
                    <div className="text-xs font-bold text-white/95">{passConfig.gradeOrRole}</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase text-white/70 font-bold">
                      {isKz ? 'РЕЙТИНГ' : 'РЕЙТИНГ XP'}
                    </div>
                    <div className="text-xs font-bold text-amber-300">⚡ {passConfig.xpPoints} XP</div>
                  </div>
                </div>
              </div>

              {/* Pass Barcode Section */}
              <div className="rounded-2xl bg-white p-4 text-center text-slate-900 shadow-inner flex flex-col items-center">
                <QrCode className="h-28 w-28 text-slate-950" />
                <span className="mt-2 font-mono text-[11px] font-black tracking-widest text-slate-700">
                  {passConfig.studentId}
                </span>
                <span className="text-[8px] font-bold text-emerald-600 uppercase mt-0.5">
                  ● VERIFIED & CRYPTOGRAPHICALLY SIGNED
                </span>
              </div>
            </div>

            {/* Apple Wallet Badge Button */}
            <button
              type="button"
              onClick={handleDownloadApplePass}
              className="inline-flex items-center gap-3 rounded-2xl bg-black px-6 py-3.5 text-xs font-black text-white shadow-xl hover:bg-zinc-900 active:scale-95"
            >
              <span className="text-base"></span>
              <span className="text-left">
                <span className="block text-[10px] text-zinc-400 font-normal">Add to</span>
                <span className="block font-bold">Apple Wallet (.pkpass)</span>
              </span>
              <Download className="h-4 w-4 text-zinc-400 ml-2" />
            </button>
          </div>

          {/* Pass Customizer Form */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {isKz ? 'Apple Wallet Pass баптаулары' : 'Настройка Apple Wallet Pass'}
                </h3>
              </div>
              <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                PKPass V1
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  {isKz ? 'Пасс Түсі (Background Color)' : 'Цвет фона пропуска'}
                </label>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {[
                    { name: 'Deep Royal', hex: '#1e3a8a' },
                    { name: 'Executive Black', hex: '#18181b' },
                    { name: 'Emerald KZ', hex: '#064e3b' },
                    { name: 'Purple Titanium', hex: '#4c1d95' },
                    { name: 'Crimson Pride', hex: '#881337' },
                  ].map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setPassConfig((p) => ({ ...p, accentColor: c.hex }))}
                      className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                        passConfig.accentColor === c.hex ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  {isKz ? 'Оқушының аты-жөні' : 'ФИО владельца'}
                </label>
                <input
                  type="text"
                  value={passConfig.holderName}
                  onChange={(e) => setPassConfig((p) => ({ ...p, holderName: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  {isKz ? 'Мектеп немесе Ұйым' : 'Школа / Организация'}
                </label>
                <input
                  type="text"
                  value={passConfig.organization}
                  onChange={(e) => setPassConfig((p) => ({ ...p, organization: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">
                    {isKz ? 'Сынып / Рөл' : 'Класс / Роль'}
                  </label>
                  <input
                    type="text"
                    value={passConfig.gradeOrRole}
                    onChange={(e) => setPassConfig((p) => ({ ...p, gradeOrRole: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">
                    Student ID
                  </label>
                  <input
                    type="text"
                    value={passConfig.studentId}
                    onChange={(e) => setPassConfig((p) => ({ ...p, studentId: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-mono text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleDownloadApplePass}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md hover:bg-blue-700 active:scale-95"
                >
                  <Download className="h-4 w-4" />
                  <span>{isKz ? '.pkpass файлын жүктеу' : 'Скачать .pkpass файл'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GOOGLE WALLET PASS (.JSON / JWT) */}
      {activeTab === 'google_pass' && (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Google Material You Pass Preview */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-full max-w-[360px] overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-2xl border border-slate-700 flex flex-col justify-between min-h-[480px]">
              {/* Google Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-xs font-black text-emerald-400">
                    G
                  </span>
                  <span className="text-xs font-bold text-slate-200">Google Wallet Pass</span>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
                  GENERIC OBJECT
                </span>
              </div>

              {/* Google Pass Details */}
              <div className="my-4 space-y-3">
                <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  {passConfig.organization}
                </div>
                <div className="text-xl font-black text-white">{passConfig.holderName}</div>
                <div className="rounded-xl bg-slate-800/80 p-3 text-xs space-y-1">
                  <div className="text-[10px] text-slate-400">Status & Role:</div>
                  <div className="font-bold text-emerald-400">{passConfig.gradeOrRole}</div>
                  <div className="text-[10px] text-slate-400 pt-1">Olympiad Rating:</div>
                  <div className="font-bold text-amber-300">⚡ {passConfig.xpPoints} XP (Diamond)</div>
                </div>
              </div>

              {/* QR */}
              <div className="rounded-2xl bg-white p-4 text-center text-slate-900 shadow-inner flex flex-col items-center">
                <QrCode className="h-24 w-24 text-slate-950" />
                <span className="mt-1 font-mono text-[10px] font-bold text-slate-600">
                  {passConfig.studentId}
                </span>
              </div>
            </div>

            {/* Official Save to Google Wallet Button */}
            <button
              type="button"
              onClick={handleDownloadGoogleWalletJson}
              className="inline-flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-6 py-3.5 text-xs font-bold text-slate-900 shadow-md hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <Wallet className="h-4 w-4 text-blue-500" />
              <span>Save to Google Wallet (.json)</span>
            </button>
          </div>

          {/* Explanation */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {isKz ? 'Google Wallet REST API & JWT Интеграциясы' : 'Интеграция с Google Wallet API'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {isKz
                ? 'Google Wallet API арқылы кез келген оқушының ID картасы, олимпиада билеті немесе грант сертификаты Google Pay қосымшасына лезде синхрондалады.'
                : 'Сгенерированный JSON объект полностью соответствует спецификации Google Wallet Generic Pass API и готов для подписания сервисным аккаунтом.'}
            </p>

            <div className="rounded-2xl bg-slate-900 p-4 font-mono text-[11px] text-emerald-400 overflow-x-auto">
              <pre>
{`{
  "iss": "ushqn-google-wallet@iam.gserviceaccount.com",
  "typ": "savetowallet",
  "payload": {
    "genericObjects": [{
      "id": "3388000000022312.${passConfig.studentId}",
      "cardTitle": "USHQN TALENT PASS",
      "header": "${passConfig.holderName}",
      "barcode": { "type": "QR_CODE", "value": "${passConfig.studentId}" }
    }]
  }
}`}
              </pre>
            </div>

            <button
              type="button"
              onClick={handleDownloadGoogleWalletJson}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-bold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900"
            >
              <Download className="h-4 w-4" />
              <span>{isKz ? 'Google Wallet JWT файлын жүктеу' : 'Скачать Google Wallet JSON'}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: NFC POS TERMINAL SIMULATOR */}
      {activeTab === 'terminal' && (
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          {/* POS Terminal */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6 flex flex-col items-center text-center">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isKz ? 'NFC Контактісіз POS Терминалы' : 'Бесконтактный NFC POS Терминал'}
              </h3>
              <p className="text-xs text-slate-500">
                {isKz ? 'Турникет немесе олимпиада залындағы терминал' : 'Турникет или терминал входа на хакатон'}
              </p>
            </div>

            {/* Terminal Body */}
            <div className="relative w-full max-w-[280px] rounded-3xl bg-gradient-to-b from-zinc-800 to-zinc-950 p-6 text-white shadow-2xl border-4 border-zinc-700">
              {/* Screen */}
              <div className="rounded-2xl bg-emerald-950/80 p-4 border border-emerald-500/40 text-emerald-400 font-mono text-xs space-y-2">
                <div className="flex justify-between text-[10px] text-emerald-300">
                  <span>USHQN POS #0042</span>
                  <span>NFC 13.56MHz</span>
                </div>
                <div className="text-center py-3">
                  {nfcScanning ? (
                    <div className="space-y-2 animate-pulse">
                      <Radio className="mx-auto h-8 w-8 text-emerald-400 animate-spin" />
                      <div className="text-xs font-bold text-emerald-300">
                        {isKz ? 'NFC ОҚЫЛУДА...' : 'СЧИТЫВАНИЕ NFC...'}
                      </div>
                    </div>
                  ) : terminalSuccess ? (
                    <div className="space-y-1">
                      <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-300" />
                      <div className="text-sm font-bold text-white">ТӨЛЕМ ҚАБЫЛДАНДЫ</div>
                      <div className="text-[10px] text-emerald-300">₸1,500 KZT ● APPROVED</div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Radio className="mx-auto h-8 w-8 text-emerald-400" />
                      <div className="text-xs font-bold text-white">
                        {isKz ? 'ТЕЛЕФОНДЫ ТАЯТЫҢЫЗ' : 'ПРИЛОЖИТЕ ТЕЛЕФОН'}
                      </div>
                      <div className="text-[10px] text-emerald-400"> Pay / G Pay Ready</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Contactless symbol on POS */}
              <div className="mt-4 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 border border-zinc-600">
                  <Radio className="h-6 w-6 text-slate-300" />
                </div>
              </div>
            </div>

            {/* Trigger Button */}
            <div className="w-full space-y-3">
              <div className="flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setTerminalPayMethod('apple_pay')}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    terminalPayMethod === 'apple_pay' ? 'bg-black text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800'
                  }`}
                >
                   Apple Pay
                </button>
                <button
                  type="button"
                  onClick={() => setTerminalPayMethod('google_pay')}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    terminalPayMethod === 'google_pay' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800'
                  }`}
                >
                  Google Pay
                </button>
              </div>

              <button
                type="button"
                disabled={nfcScanning}
                onClick={handleRunNfcTerminal}
                className="w-full rounded-2xl bg-blue-600 py-3.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 active:scale-95 disabled:opacity-50"
              >
                {nfcScanning
                  ? isKz
                    ? 'NFC Сигналы берілуде...'
                    : 'Передача NFC...'
                  : isKz
                  ? '📡 Телефонды терминалға жақындату (NFC Tap)'
                  : '📡 Приложить телефон к терминалу'}
              </button>
            </div>
          </div>

          {/* Explanation */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {isKz ? 'NFC Технологиясы қалай жұмыс істейді?' : 'Как работает NFC контакт?'}
            </h3>
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-800/50 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white">
                  1. EMV Contactless ISO/IEC 14443
                </div>
                <p className="text-[11px] text-slate-500">
                  Смартфон терминалға 4 см жақындағанда Apple Pay немесе Google Pay Secure Element чипі 13.56 МГц жиілікте криптограмма жібереді.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-800/50 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white">
                  2. Express Mode & Offline Access
                </div>
                <p className="text-[11px] text-slate-500">
                  Apple Wallet «Express Mode» режимінде тіпті телефонның қуаты таусылып қалған жағдайда да турникетке оқушы ID-ін өткізе береді.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: TRANSACTION LEDGER & RECEIPTS */}
      {activeTab === 'ledger' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isKz ? 'Apple Pay & Google Pay Төлемдер тарихы' : 'История платежей Apple Pay & Google Pay'}
              </h3>
              <p className="text-xs text-slate-500">
                {isKz ? 'Барлық транзакциялар токенизацияланған және фискалды чектермен бекітілген' : 'Все платежи токенизированы с чеками'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setTransactions([])
                localStorage.removeItem(STORAGE_TX_KEY)
                toast(isKz ? 'Тарих тазартылды' : 'История очищена')
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>{isKz ? 'Тазарту' : 'Очистить'}</span>
            </button>
          </div>

          {transactions.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              {isKz ? 'Әзірге төлемдер жоқ. Жоғарыдағы «1-Click Төлемдер» бөлімінен сынап көріңіз!' : 'Пока нет транзакций.'}
            </div>
          ) : (
            <div className="space-y-2.5">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-800/40"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-2xl text-xs font-black shadow-sm ${
                        tx.method === 'apple_pay' ? 'bg-black text-white' : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {tx.method === 'apple_pay' ? '' : 'G'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{tx.title}</span>
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {tx.status}
                        </span>
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                        <span>{new Date(tx.date).toLocaleString()}</span>
                        <span>•</span>
                        <span>{tx.cardBrand} •••• {tx.cardLast4}</span>
                        <span>•</span>
                        <span className="font-mono text-[10px]">{tx.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <div className="text-right">
                      <div className="text-sm font-black text-slate-900 dark:text-white">
                        ₸{tx.amount.toLocaleString()} {tx.currency}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">0% Fee</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedReceiptTx(tx)}
                        className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      >
                        <Receipt className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                        <span>{isKz ? 'Чек / Receipt' : 'Чек'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopy(tx.token, tx.id)}
                        className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      >
                        {copiedToken === tx.id ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                        <span>{copiedToken === tx.id ? 'Токен!' : 'Токен'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FISCAL RECEIPT MODAL */}
      {selectedReceiptTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <Receipt className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {isKz ? 'Электронды Фискалды Чек' : 'Электронный фискальный чек'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReceiptTx(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Receipt Visual Body */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 space-y-3">
              <div className="text-center border-b border-dashed border-slate-300 pb-2 dark:border-slate-700">
                <div className="font-black text-sm">USHQN KAZAKHSTAN TECH</div>
                <div className="text-[10px] text-slate-500">БСН / БИН: 240840029102 · Алматы, Қазақстан</div>
                <div className="text-[10px] text-emerald-600 font-bold">ОФД ТРАНЗАКЦИЯ РАСТАЛДЫ</div>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Чек № / ID:</span>
                  <span className="font-bold">{selectedReceiptTx.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Төлем әдісі:</span>
                  <span className="font-bold">{selectedReceiptTx.method === 'apple_pay' ? ' Apple Pay (NFC)' : 'Google Pay (EMV)'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Карта:</span>
                  <span>{selectedReceiptTx.cardBrand} •••• {selectedReceiptTx.cardLast4}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Уақыты:</span>
                  <span>{new Date(selectedReceiptTx.date).toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t border-b border-dashed border-slate-300 py-2 dark:border-slate-700 space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="truncate max-w-[200px]">{selectedReceiptTx.title}</span>
                  <span>₸{selectedReceiptTx.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>ҚҚС / НДС (0%):</span>
                  <span>₸0</span>
                </div>
              </div>

              <div className="flex justify-between text-sm font-black pt-1">
                <span>ЖАЛПЫ СОМАСЫ:</span>
                <span className="text-emerald-600">₸{selectedReceiptTx.amount.toLocaleString()} KZT</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedReceiptTx(null)}
                className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                {isKz ? 'Жабу' : 'Закрыть'}
              </button>

              <button
                type="button"
                onClick={() => handleDownloadReceipt(selectedReceiptTx)}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 active:scale-95"
              >
                <Download className="h-4 w-4" />
                <span>{isKz ? 'Чекті Жүктеу (.txt/PDF)' : 'Скачать чек'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* APPLE PAY SHEET MODAL */}
      {applePayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-3">
          <div className="w-full max-w-[420px] rounded-3xl bg-neutral-900 text-white shadow-2xl border border-neutral-700 overflow-hidden animate-in fade-in slide-in-from-bottom-6">
            {/* Sheet Header */}
            <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-black"> Pay</span>
              </div>
              <button
                type="button"
                onClick={() => setApplePayModalOpen(false)}
                className="text-xs font-bold text-neutral-400 hover:text-white"
              >
                {isKz ? 'Болдырмау' : 'Отмена'}
              </button>
            </div>

            {/* Sheet Content */}
            <div className="p-6 space-y-5">
              {applePayStep === 'sheet' && (
                <>
                  {/* Card Selection */}
                  <div className="rounded-2xl bg-neutral-800 p-4 space-y-3">
                    <div className="text-[11px] font-bold text-neutral-400 uppercase">
                      {isKz ? 'ТӨЛЕМ КАРТАСЫ' : 'КАРТА ОПЛАТЫ'}
                    </div>
                    <div className="space-y-2">
                      {[
                        { id: 'kaspi' as const, name: 'Kaspi Gold', last4: '4821', brand: 'Kaspi.kz (₸ KZT)' },
                        { id: 'apple_card' as const, name: 'Apple Card Titanium', last4: '1024', brand: 'Mastercard' },
                        { id: 'halyk' as const, name: 'Halyk Black', last4: '9902', brand: 'Visa Platinum' },
                      ].map((c) => (
                        <div
                          key={c.id}
                          onClick={() => setSelectedAppleCard(c.id)}
                          className={`cursor-pointer flex items-center justify-between rounded-xl p-2.5 transition ${
                            selectedAppleCard === c.id ? 'bg-neutral-700 ring-1 ring-white/30' : 'hover:bg-neutral-750'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-4 w-4 text-neutral-300" />
                            <div>
                              <div className="text-xs font-bold">{c.name} •••• {c.last4}</div>
                              <div className="text-[10px] text-neutral-400">{c.brand}</div>
                            </div>
                          </div>
                          {selectedAppleCard === c.id && <Check className="h-4 w-4 text-emerald-400" />}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-neutral-400">
                      <span>{isKz ? 'Сатушы:' : 'Продавец:'}</span>
                      <span className="font-bold text-white">USHQN Education KZ</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>{isKz ? 'Қызмет:' : 'Услуга:'}</span>
                      <span className="font-bold text-white truncate max-w-[200px]">{selectedProduct.name}</span>
                    </div>
                    <div className="border-t border-neutral-800 pt-2 flex justify-between text-base font-black">
                      <span>{isKz ? 'Барлығы:' : 'Итого:'}</span>
                      <span className="text-white">₸{selectedProduct.price.toLocaleString()} KZT</span>
                    </div>
                  </div>

                  {/* Double Click Face ID prompt */}
                  <div className="text-center pt-2 space-y-3">
                    <div className="text-[11px] text-neutral-400 flex items-center justify-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                      <span>{isKz ? 'Төлемді растау үшін Face ID немесе батырманы басыңыз' : 'Подтвердите оплату Face ID'}</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleConfirmApplePay}
                      className="w-full flex items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-sm font-black text-black shadow-lg hover:bg-slate-100 active:scale-95"
                    >
                      <span> Pay арқылы растау</span>
                    </button>
                  </div>
                </>
              )}

              {applePayStep === 'authenticating' && (
                <div className="py-10 text-center space-y-4">
                  <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-neutral-800 border border-neutral-700">
                    <Smartphone className="h-10 w-10 text-blue-400 animate-pulse" />
                    <span className="absolute inset-0 rounded-3xl border-2 border-blue-500 animate-ping opacity-30" />
                  </div>
                  <div className="text-sm font-bold text-white">
                    {isKz ? 'Face ID расталуда...' : 'Проверка Face ID...'}
                  </div>
                  <div className="text-xs text-neutral-400">
                    {isKz ? 'Apple Secure Enclave токенді шифрлеуде' : 'Генерация криптографического токена'}
                  </div>
                </div>
              )}

              {applePayStep === 'success' && (
                <div className="py-8 text-center space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-bounce">
                    <CheckCheck className="h-9 w-9" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white">{isKz ? 'Төлем сәтті аяқталды!' : 'Оплата прошла успешно!'}</h4>
                    <p className="text-xs text-neutral-400 mt-1">
                      {isKz ? '₸' + selectedProduct.price.toLocaleString() + ' KZT есептен шығарылды' : 'Списано ₸' + selectedProduct.price.toLocaleString()}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setApplePayModalOpen(false)}
                    className="w-full rounded-2xl bg-neutral-800 py-3 text-xs font-bold text-white hover:bg-neutral-700"
                  >
                    {isKz ? 'Жабу' : 'Закрыть'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* GOOGLE PAY SHEET MODAL */}
      {gpayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-3">
          <div className="w-full max-w-[420px] rounded-3xl bg-white text-slate-900 shadow-2xl border border-slate-200 overflow-hidden dark:bg-slate-900 dark:text-white dark:border-slate-800 animate-in fade-in slide-in-from-bottom-6">
            {/* Sheet Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight">
                  <span className="text-blue-500">G</span>
                  <span className="text-red-500">o</span>
                  <span className="text-amber-500">o</span>
                  <span className="text-blue-500">g</span>
                  <span className="text-emerald-500">l</span>
                  <span className="text-red-500">e</span> Pay
                </span>
              </div>
              <button
                type="button"
                onClick={() => setGpayModalOpen(false)}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                {isKz ? 'Болдырмау' : 'Отмена'}
              </button>
            </div>

            {/* Sheet Content */}
            <div className="p-6 space-y-5">
              {gpayStep === 'sheet' && (
                <>
                  <div className="rounded-2xl bg-slate-50 p-4 space-y-3 dark:bg-slate-800/60">
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                      GOOGLE ACCOUNT CARDS
                    </div>
                    <div className="space-y-2">
                      {[
                        { id: 'visa_gpay' as const, name: 'Visa Gold', last4: '8832', bank: 'Kaspi / Google Pay' },
                        { id: 'mastercard_gpay' as const, name: 'Mastercard World', last4: '5519', bank: 'Halyk / Google Pay' },
                      ].map((c) => (
                        <div
                          key={c.id}
                          onClick={() => setSelectedGpayCard(c.id)}
                          className={`cursor-pointer flex items-center justify-between rounded-xl p-2.5 transition ${
                            selectedGpayCard === c.id
                              ? 'bg-blue-50 border border-blue-500 dark:bg-blue-950/40'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-4 w-4 text-blue-600" />
                            <div>
                              <div className="text-xs font-bold">{c.name} •••• {c.last4}</div>
                              <div className="text-[10px] text-slate-500">{c.bank}</div>
                            </div>
                          </div>
                          {selectedGpayCard === c.id && <Check className="h-4 w-4 text-blue-600" />}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-500 dark:text-slate-400">
                      <span>{isKz ? 'Төлем алушы:' : 'Получатель:'}</span>
                      <span className="font-bold text-slate-900 dark:text-white">USHQN Technology LLC</span>
                    </div>
                    <div className="border-t border-slate-100 pt-2 flex justify-between text-base font-black dark:border-slate-800">
                      <span>{isKz ? 'Сомасы:' : 'Сумма:'}</span>
                      <span className="text-blue-600">₸{selectedProduct.price.toLocaleString()} KZT</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleConfirmGooglePay}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-md hover:bg-blue-700 active:scale-95"
                  >
                    <span>Google Pay арқылы растау</span>
                  </button>
                </>
              )}

              {gpayStep === 'processing' && (
                <div className="py-10 text-center space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950">
                    <RefreshCw className="h-8 w-8 animate-spin" />
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {isKz ? 'Google Pay серверімен байланысу...' : 'Связь с сервером Google Pay...'}
                  </div>
                </div>
              )}

              {gpayStep === 'success' && (
                <div className="py-8 text-center space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300">
                    <CheckCheck className="h-8 w-8" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">{isKz ? 'Төлем сәтті өтті!' : 'Оплата прошла успешно!'}</h4>
                    <p className="text-xs text-slate-500 mt-1">₸{selectedProduct.price.toLocaleString()} KZT</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setGpayModalOpen(false)}
                    className="w-full rounded-2xl bg-slate-100 py-3 text-xs font-bold text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-white"
                  >
                    {isKz ? 'Жабу' : 'Закрыть'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
