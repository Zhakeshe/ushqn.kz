import { useQuery } from '@tanstack/react-query'
import { Download, Loader2, QrCode, ShieldCheck, WalletCards } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { useToast } from '../lib/toast'

export function AppleWalletPass() {
  const { userId } = useAuth()
  const { i18n } = useTranslation()
  const { toast } = useToast()
  const isKz = i18n.language === 'kk'
  const isRu = i18n.language === 'ru'
  const enabled = import.meta.env.VITE_APPLE_WALLET_ENABLED === 'true'

  const passport = useQuery({
    queryKey: ['apple-wallet-pass', userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const [{ data: profile, error: profileError }, { data: achievements, error: achievementsError }, { data: scores, error: scoresError }] = await Promise.all([
        supabase.from('profiles').select('display_name,school_or_org,location,avatar_url').eq('id', userId!).single(),
        supabase.from('achievements').select('id').eq('user_id', userId!).eq('verification_status', 'verified'),
        supabase.from('user_category_scores').select('points').eq('user_id', userId!),
      ])
      if (profileError) throw profileError
      if (achievementsError) throw achievementsError
      if (scoresError) throw scoresError
      return {
        name: profile.display_name || (isKz ? 'Аты көрсетілмеген' : isRu ? 'Имя не указано' : 'Name not provided'),
        school: profile.school_or_org || profile.location || '—',
        verifiedCount: achievements.length,
        totalXp: scores.reduce((sum, score) => sum + score.points, 0),
      }
    },
  })

  async function downloadPass() {
    if (!enabled) return
    const { data, error } = await supabase.functions.invoke('create-apple-wallet-pass')
    if (error) {
      toast(error.message, 'error')
      return
    }
    if (!(data instanceof Blob)) {
      toast(isKz ? 'Wallet pass файлы келмеді.' : isRu ? 'Файл Wallet pass не получен.' : 'Wallet pass file was not returned.', 'error')
      return
    }
    const url = URL.createObjectURL(data)
    const link = document.createElement('a')
    link.href = url
    link.download = 'ushqn-student-pass.pkpass'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="ushqn-card overflow-hidden p-0">
      <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 px-5 py-6 text-white">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-950"><WalletCards className="h-6 w-6" /></div>
            <div>
              <h2 className="text-lg font-black">USHQN Student Passport</h2>
              <p className="text-xs text-blue-100">Apple Wallet `.pkpass`</p>
            </div>
          </div>
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold text-blue-100">{isKz ? 'Цифрлық визитка' : isRu ? 'Цифровая визитка' : 'Digital identity card'}</span>
        </div>

        <div className="mt-6 grid grid-cols-[1fr_auto] items-end gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200">{isKz ? 'ОҚУШЫ' : isRu ? 'УЧЕНИК' : 'STUDENT'}</p>
            <p className="mt-1 text-xl font-black">{passport.data?.name ?? '…'}</p>
            <p className="mt-1 text-xs text-blue-100">{passport.data?.school ?? '…'}</p>
          </div>
          <div className="rounded-xl bg-white p-2 text-slate-950"><QrCode className="h-16 w-16" aria-label="USHQN passport verification code" /></div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 border-t border-white/15 pt-4 text-xs">
          <div><span className="block text-[10px] text-blue-200">{isKz ? 'Расталған жетістік' : isRu ? 'Подтверждено' : 'Verified'}</span><strong>{passport.data?.verifiedCount ?? 0}</strong></div>
          <div><span className="block text-[10px] text-blue-200">XP</span><strong>{(passport.data?.totalXp ?? 0).toLocaleString()}</strong></div>
        </div>
      </div>

      <div className="space-y-4 p-5">
        {!enabled ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
            <strong>{isKz ? 'Apple Wallet әлі конфигурацияланбаған.' : isRu ? 'Apple Wallet ещё не настроен.' : 'Apple Wallet is not configured yet.'}</strong>
            <p className="mt-1">{isKz ? 'Pass Type ID, Apple signing certificate, private key және WWDR certificate серверге қосылғаннан кейін нақты `.pkpass` файл жасалады.' : isRu ? 'После настройки Pass Type ID, сертификата подписи, private key и WWDR certificate сервер создаст настоящий `.pkpass`.' : 'A real `.pkpass` is generated only after the Pass Type ID, signing certificate, private key, and WWDR certificate are configured on the server.'}</p>
          </div>
        ) : null}

        <button type="button" disabled={!enabled || passport.isLoading} onClick={() => void downloadPass()} className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-45">
          {passport.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          <span>{isKz ? 'Apple Wallet-ке қосу' : isRu ? 'Добавить в Apple Wallet' : 'Add to Apple Wallet'}</span>
        </button>

        <p className="flex items-start gap-2 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />{isKz ? 'Бұл төлем құралы емес: pass тек профиль, QR және расталған жетістік деректерін көрсетеді.' : isRu ? 'Это не платёжный инструмент: pass содержит профиль, QR и подтверждённые достижения.' : 'This is not a payment instrument: it contains profile, QR, and verified-achievement information only.'}</p>
      </div>
    </section>
  )
}
