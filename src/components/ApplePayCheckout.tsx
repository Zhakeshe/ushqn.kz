import { useEffect, useState } from 'react'
import { CreditCard, ExternalLink, Loader2, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { useToast } from '../lib/toast'

type ApplePayWindow = Window & {
  ApplePaySession?: { canMakePayments: () => boolean }
}

export function ApplePayCheckout() {
  const { i18n } = useTranslation()
  const { toast } = useToast()
  const isKz = i18n.language === 'kk'
  const isRu = i18n.language === 'ru'
  const enabled = import.meta.env.VITE_APPLE_PAY_ENABLED === 'true'
  const [supported, setSupported] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const applePay = (window as ApplePayWindow).ApplePaySession
    setSupported(Boolean(applePay?.canMakePayments()))
  }, [])

  async function openCheckout() {
    if (!enabled || loading) return
    setLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('create-apple-pay-checkout')
      if (error) throw error
      if (!data?.url || typeof data.url !== 'string') throw new Error('Checkout URL was not returned.')
      window.location.assign(data.url)
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : isKz ? 'Төлем бетін ашу мүмкін болмады.' : isRu ? 'Не удалось открыть оплату.' : 'Could not open checkout.',
        'error',
      )
      setLoading(false)
    }
  }

  return (
    <section className="ushqn-card overflow-hidden p-0">
      <div className="border-b border-slate-200 bg-slate-950 px-5 py-5 text-white dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl text-black"></div>
          <div>
            <h2 className="text-lg font-black">Apple Pay</h2>
            <p className="text-xs text-slate-300">
              {isKz ? 'Stripe Checkout арқылы қорғалған төлем' : isRu ? 'Защищённая оплата через Stripe Checkout' : 'Secure payment through Stripe Checkout'}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <Status label={isKz ? 'Backend' : 'Backend'} ok={enabled} />
          <Status label={isKz ? 'HTTPS және домен' : isRu ? 'HTTPS и домен' : 'HTTPS and domain'} ok={location.protocol === 'https:'} />
          <Status label={isKz ? 'Осы құрылғы' : isRu ? 'Это устройство' : 'This device'} ok={supported === true} neutral={supported === null} />
        </div>

        {!enabled ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
            <p className="font-bold">{isKz ? 'Apple Pay әзірге қосылмаған' : isRu ? 'Apple Pay пока не подключён' : 'Apple Pay is not configured yet'}</p>
            <p className="mt-1 text-xs leading-relaxed opacity-90">
              {isKz
                ? 'Жалған төлем симуляциясы өшірілді. Іске қосу үшін Stripe secret, Price ID және production доменін Stripe Dashboard-та тіркеу қажет.'
                : isRu
                ? 'Фальшивая симуляция оплаты отключена. Для запуска нужны Stripe secret, Price ID и регистрация production-домена в Stripe Dashboard.'
                : 'The fake payment simulation is disabled. A Stripe secret, Price ID, and registered production domain are required.'}
            </p>
          </div>
        ) : null}

        <button
          type="button"
          disabled={!enabled || loading}
          onClick={() => void openCheckout()}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-45"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
          <span>{isKz ? 'Apple Pay арқылы жалғастыру' : isRu ? 'Продолжить с Apple Pay' : 'Continue with Apple Pay'}</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </button>

        <div className="flex items-start gap-2 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          <span>{isKz ? 'Карта деректері USHQN серверіне түспейді; төлемді Stripe және Apple қорғайды.' : isRu ? 'Данные карты не попадают на сервер USHQN; платёж обрабатывают Stripe и Apple.' : 'Card details never reach USHQN servers; Stripe and Apple process the payment.'}</span>
        </div>
      </div>
    </section>
  )
}

function Status({ label, ok, neutral = false }: { label: string; ok: boolean; neutral?: boolean }) {
  return (
    <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
      <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`mt-1 text-xs font-bold ${neutral ? 'text-slate-500' : ok ? 'text-emerald-600' : 'text-amber-600'}`}>
        {neutral ? '…' : ok ? 'Ready' : 'Setup required'}
      </p>
    </div>
  )
}
