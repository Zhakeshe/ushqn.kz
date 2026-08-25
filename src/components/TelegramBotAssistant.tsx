import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Send,
  ExternalLink,
} from 'lucide-react'
import { useToast } from '../lib/toast'

export function TelegramBotAssistant() {
  const { i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const { toast } = useToast()

  const [isConnected, setIsConnected] = useState(true)
  const [notifyDailyStreak, setNotifyDailyStreak] = useState(true)
  const [notifyOlympiadBattle, setNotifyOlympiadBattle] = useState(true)
  const [notifyGrantOffer, setNotifyGrantOffer] = useState(true)
  const [notifyPeerReview, setNotifyPeerReview] = useState(false)

  const handleTestNotification = () => {
    toast(
      isKz
        ? '🤖 Telegram @ushqn_kz_bot: «Тесттік хабарлама сәтті жіберілді!»'
        : '🤖 Telegram @ushqn_kz_bot: "Test notification delivered successfully!"',
      'success'
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50/70 via-white to-blue-50/50 p-6 dark:border-sky-900/40 dark:from-slate-900 dark:via-slate-900 dark:to-sky-950/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-lg bg-sky-100/80 px-3 py-1 text-xs font-bold text-sky-800 dark:bg-sky-900/50 dark:text-sky-300">
              <Send className="h-3.5 w-3.5" />
              <span>Telegram Bot Integration (@ushqn_kz_bot)</span>
            </div>
            <h2 className="mt-2 text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              {isKz ? 'Telegram Жеке Көмекшісі & Лездік Хабарламалар' : 'Automated Telegram Bot Assistant'}
            </h2>
            <p className="mt-1 max-w-2xl text-xs text-slate-600 dark:text-slate-300">
              {isKz
                ? 'Жетістіктерді растау, баттлға шақырулар, күнделікті 08:00 логикалық есептер және ЖОО гранттары туралы лезде Telegram арқылы хабардар болыңыз.'
                : 'Real-time Telegram sync for instant verification alerts, 08:00 streak reminders, and direct university grant offers.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIsConnected((prev) => !prev)
                toast(isConnected ? 'Telegram байланысы үзілді' : 'Telegram сәтті қосылды!')
              }}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{isConnected ? 'Telegram Қосулы (@ushqn_bot)' : 'Байланыспаған'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Settings Column */}
        <div className="space-y-4 lg:col-span-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {isKz ? 'Хабарлама Параметрлері:' : 'Push Notification Preferences:'}
            </h3>

            <div className="mt-4 space-y-3">
              {[
                {
                  labelKz: '🔥 Күнделікті 08:00 Math Streak ескертпесі',
                  labelEn: '🔥 Daily 08:00 Math Streak reminder',
                  state: notifyDailyStreak,
                  setter: setNotifyDailyStreak,
                },
                {
                  labelKz: '⚔️ Мектептер Баттлы & Командалық шақырулар',
                  labelEn: '⚔️ School Clash & Squad invitations',
                  state: notifyOlympiadBattle,
                  setter: setNotifyOlympiadBattle,
                },
                {
                  labelKz: '🏛️ ЖОО және Корпоративтік Тікелей Гранттар',
                  labelEn: '🏛️ University & Corporate Direct Grant Offers',
                  state: notifyGrantOffer,
                  setter: setNotifyGrantOffer,
                },
                {
                  labelKz: '💬 Peer Code Review және пікірлер',
                  labelEn: '💬 Peer Code Review & comments',
                  state: notifyPeerReview,
                  setter: setNotifyPeerReview,
                },
              ].map((item, idx) => (
                <label
                  key={idx}
                  className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs font-bold text-slate-800 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-200"
                >
                  <span>{isKz ? item.labelKz : item.labelEn}</span>
                  <input
                    type="checkbox"
                    checked={item.state}
                    onChange={(e) => item.setter(e.target.checked)}
                    className="h-4 w-4 rounded accent-blue-600"
                  />
                </label>
              ))}
            </div>

            <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800 flex gap-2">
              <button
                type="button"
                onClick={handleTestNotification}
                className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-700 shadow-xs"
              >
                {isKz ? 'Тесттік Хабарлама Жіберу' : 'Send Test Notification'}
              </button>
              <a
                href="https://t.me/telegram"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                <span>Telegram Bot Ашу</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Telegram Message Simulator Preview */}
        <div className="space-y-4 lg:col-span-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-900 p-5 text-white shadow-2xs dark:border-slate-800">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white font-black text-xs">
                ✈️
              </div>
              <div>
                <div className="text-xs font-bold">USHQN Official Bot (@ushqn_kz_bot)</div>
                <div className="text-[10px] text-blue-400">bot • online</div>
              </div>
            </div>

            <div className="mt-4 space-y-3 font-sans text-xs">
              {/* Message 1 */}
              <div className="max-w-[85%] rounded-2xl rounded-tl-none bg-slate-800 p-3.5 leading-relaxed text-slate-200">
                <div className="font-bold text-amber-400">🔥 Күнделікті Олимпиадалық Стрик:</div>
                <p className="mt-1">
                  «Барлық нақты x үшін f(x) + 2f(1 - x) = 3x^2 болса, f(2) мәні неге тең?»
                </p>
                <div className="mt-2 text-[10px] text-slate-400">Бүгінгі ұпай: +50 XP ⚡</div>
              </div>

              {/* Message 2 */}
              <div className="max-w-[85%] rounded-2xl rounded-tl-none bg-slate-800 p-3.5 leading-relaxed text-slate-200">
                <div className="font-bold text-emerald-400">🏛️ Жаңа Гранттық Ұсыныс!</div>
                <p className="mt-1">
                  Nazarbayev University SEDS Honors колледжінен профиліңізге толық грант шақыруы келді.
                </p>
                <div className="mt-2 text-[10px] text-slate-400">12:45 PM • USHQN System</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
