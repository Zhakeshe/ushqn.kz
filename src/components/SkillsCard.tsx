import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Briefcase, X, Plus } from 'lucide-react'

type Props = {
  skills: string[]
  onAdd: (skill: string) => void
  onRemove: (skill: string) => void
  readOnly?: boolean
}

export function SkillsCard({ skills, onAdd, onRemove, readOnly }: Props) {
  const { t } = useTranslation()
  const [input, setInput] = useState('')

  function handleAdd() {
    const s = input.trim()
    if (!s || skills.includes(s)) return
    onAdd(s)
    setInput('')
  }

  return (
    <section className="ushqn-card p-5">
      <div className="ushqn-section-header flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-indigo-600" />
          <h2 className="ushqn-section-title">{t('profile.skills')}</h2>
        </div>
        {!readOnly && (
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            {t('profile.edit.selected', { n: skills.length })}
          </span>
        )}
      </div>

      {skills.length === 0 && readOnly ? (
        <p className="text-sm text-slate-500 italic">{t('profile.noSkills')}</p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <AnimatePresence mode="popLayout">
          {skills.map((s) => (
            <motion.span
              key={s}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1.5 text-sm font-semibold text-indigo-600 border border-indigo-100 transition-colors hover:bg-indigo-100"
            >
              {s}
              {!readOnly && (
                <button
                  type="button"
                  aria-label={`${t('common.delete')} ${s}`}
                  className="flex h-4 w-4 items-center justify-center rounded-full text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                  onClick={() => onRemove(s)}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      {!readOnly && (
        <div className="mt-5 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAdd()
              }
            }}
            placeholder={t('profile.skillPlaceholder')}
            className="ushqn-input max-w-xs focus:ring-indigo-500"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="ushqn-btn-primary flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            {t('common.add')}
          </button>
        </div>
      )}
    </section>
  )
}
