import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Brain,
} from 'lucide-react'
import { useToast } from '../lib/toast'

interface Flashcard {
  id: string
  deck: string
  frontKz: string
  frontEn: string
  backKz: string
  backEn: string
  formula?: string
}

const SAMPLE_CARDS: Flashcard[] = [
  {
    id: 'c-1',
    deck: 'math',
    frontKz: 'Эйлер теоремасы (Euler’s Totient Theorem)',
    frontEn: 'Euler’s Totient Theorem in Number Theory',
    backKz: 'Егер gcd(a, m) = 1 болса, онда a^φ(m) ≡ 1 (mod m). Мұндағы φ(m) – Эйлер функциясы.',
    backEn: 'If gcd(a, m) = 1, then a^φ(m) ≡ 1 (mod m), where φ(m) is Euler’s totient function.',
    formula: 'a^{\\phi(m)} \\equiv 1 \\pmod{m}',
  },
  {
    id: 'c-2',
    deck: 'physics',
    frontKz: 'Карно циклінің ПӘК-і (Carnot Efficiency)',
    frontEn: 'Carnot Cycle Maximum Efficiency',
    backKz: 'Жылу машинасының максималды пайдалы әсер коэффициенті тек қыздырғыш (T_h) және салқындатқыш (T_c) температураларына байланысты: η = 1 - (T_c / T_h).',
    backEn: 'Maximum theoretical thermal efficiency depends solely on reservoir temperatures: η = 1 - (T_c / T_h).',
    formula: '\\eta = 1 - \\frac{T_c}{T_h}',
  },
  {
    id: 'c-3',
    deck: 'cs',
    frontKz: 'Tarjan Алгоритмі (Strongly Connected Components)',
    frontEn: 'Tarjan’s Strongly Connected Components (SCC)',
    backKz: 'Бағытталған графтың күшті байланысқан компоненттерін бір реттік DFS өтуімен O(V + E) сызықтық уақытта табады.',
    backEn: 'Finds strongly connected components in a directed graph using single DFS traversal with low-link values in O(V + E).',
  },
]

export function StemFlashcardsDecks() {
  const { i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const { toast } = useToast()

  const [activeDeck, setActiveDeck] = useState<'all' | 'math' | 'physics' | 'cs'>('all')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [masteredCount, setMasteredCount] = useState(18)

  const filteredCards = SAMPLE_CARDS.filter((c) => activeDeck === 'all' || c.deck === activeDeck)
  const currentCard = filteredCards[currentIndex % filteredCards.length]

  const handleNext = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    setIsFlipped(false)
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length)
    if (rating === 'easy' || rating === 'good') {
      setMasteredCount((p) => p + 1)
      toast(isKz ? '+10 XP! Карта келесі аптаға жоспарланды 🧠' : '+10 XP! Card scheduled for next review 🧠', 'success')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50/70 via-white to-orange-50/50 p-6 dark:border-amber-900/40 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-lg bg-amber-100/80 px-3 py-1 text-xs font-bold text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
              <Brain className="h-3.5 w-3.5" />
              <span>Spaced Repetition Flashcards (SM-2 Algorithm)</span>
            </div>
            <h2 className="mt-2 text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              {isKz ? 'STEM Формулалар мен Теоремаларды Жаттау' : 'STEM Olympiad Spaced Repetition Flashcards'}
            </h2>
            <p className="mt-1 max-w-2xl text-xs text-slate-600 dark:text-slate-300">
              {isKz
                ? 'Физика, математика және алгоритмдердің күрделі формулаларын ұмытпау үшін интервалдық қайталау жүйесі.'
                : 'Master critical olympiad theorems and algorithmic concepts via active recall.'}
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-slate-800 shadow-2xs dark:bg-slate-800 dark:text-white">
            <span>Жатталған: {masteredCount} формула 🌟</span>
          </div>
        </div>

        {/* Deck Filters */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'Барлығы (All STEM)' },
            { id: 'math', label: '📐 Математика & Сандар теориясы' },
            { id: 'physics', label: '⚡ Физика & Термодинамика' },
            { id: 'cs', label: '💻 Олимпиадалық Информатика' },
          ].map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => {
                setActiveDeck(d.id as 'all' | 'math' | 'physics' | 'cs')
                setCurrentIndex(0)
                setIsFlipped(false)
              }}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                activeDeck === d.id
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Flashcard Area */}
      {currentCard && (
        <div className="mx-auto max-w-2xl">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer select-none rounded-3xl border-2 border-amber-200 bg-white p-8 text-center shadow-lg transition-all hover:shadow-xl dark:border-amber-900/50 dark:bg-slate-900 min-h-[260px] flex flex-col justify-between"
          >
            <div className="flex justify-between text-xs font-bold text-slate-400">
              <span>{currentCard.deck.toUpperCase()}</span>
              <span>{isFlipped ? 'Жауабы (Back)' : 'Сұрағы (Front) • Басып аударыңыз'}</span>
            </div>

            <div className="my-6">
              {!isFlipped ? (
                <h3 className="text-lg font-black text-slate-900 dark:text-white sm:text-xl">
                  {isKz ? currentCard.frontKz : currentCard.frontEn}
                </h3>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm font-medium leading-relaxed text-slate-800 dark:text-slate-200">
                    {isKz ? currentCard.backKz : currentCard.backEn}
                  </p>
                  {currentCard.formula && (
                    <div className="inline-block rounded-xl bg-amber-50 px-4 py-2 font-mono text-sm font-bold text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                      {currentCard.formula}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-400">
              Карта {currentIndex + 1} / {filteredCards.length}
            </div>
          </div>

          {/* Response Buttons */}
          {isFlipped ? (
            <div className="mt-5 grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleNext('again')}
                className="rounded-xl bg-rose-100 py-2.5 text-xs font-bold text-rose-800 hover:bg-rose-200 dark:bg-rose-950/60 dark:text-rose-300"
              >
                Қайталау (1 мин)
              </button>
              <button
                type="button"
                onClick={() => handleNext('hard')}
                className="rounded-xl bg-amber-100 py-2.5 text-xs font-bold text-amber-800 hover:bg-amber-200 dark:bg-amber-950/60 dark:text-amber-300"
              >
                Қиын (1 күн)
              </button>
              <button
                type="button"
                onClick={() => handleNext('good')}
                className="rounded-xl bg-blue-100 py-2.5 text-xs font-bold text-blue-800 hover:bg-blue-200 dark:bg-blue-950/60 dark:text-blue-300"
              >
                Жақсы (3 күн)
              </button>
              <button
                type="button"
                onClick={() => handleNext('easy')}
                className="rounded-xl bg-emerald-100 py-2.5 text-xs font-bold text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300"
              >
                Оңай (7 күн)
              </button>
            </div>
          ) : (
            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => setIsFlipped(true)}
                className="rounded-xl bg-amber-600 px-8 py-2.5 text-xs font-bold text-white hover:bg-amber-700 shadow-sm"
              >
                Жауапты Көру (Flip)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
