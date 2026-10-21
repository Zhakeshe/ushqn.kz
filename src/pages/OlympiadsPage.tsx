import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Clock,
  Trophy,
  Plus,
  ArrowLeft,
  CheckCircle2,
  Trash2,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { useCopy } from '../product/useCopy'
import { QueryState } from '../components/QueryState'
import { AppPageMeta } from '../components/AppPageMeta'
import type { OlympiadSession, OlympiadAttempt } from '../types/database'

type QuestionDraft = {
  prompt: string
  options: string[]
  correct_index: number
}
const blankQuestion = (): QuestionDraft => ({
  prompt: '',
  options: ['', '', '', ''],
  correct_index: 0,
})

function OlympiadEditor({ onClose }: { onClose: () => void }) {
  const copy = useCopy()
  const qc = useQueryClient()
  const [questions, setQuestions] = useState<QuestionDraft[]>([blankQuestion()])
  const create = useMutation({
    mutationFn: async (form: FormData) => {
      const starts = new Date(String(form.get('starts')))
      const ends = new Date(String(form.get('ends')))
      if (ends <= starts || ends <= new Date())
        throw new Error(
          copy(
            'Проверь даты начала и окончания',
            'Басталу және аяқталу уақытын тексер',
            'Check the start and end dates',
          ),
        )
      const { error } = await supabase.rpc('create_olympiad', {
        p_title: String(form.get('title')).trim(),
        p_subject: String(form.get('subject')).trim(),
        p_description: String(form.get('description')),
        p_duration: Number(form.get('duration')),
        p_starts: starts.toISOString(),
        p_ends: ends.toISOString(),
        p_questions: questions.map((q) => ({
          ...q,
          prompt: q.prompt.trim(),
          options: q.options.map((x) => x.trim()),
        })),
      })
      if (error) throw error
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['olympiads'] })
      onClose()
    },
  })
  function update(index: number, patch: Partial<QuestionDraft>) {
    setQuestions(
      questions.map((q, i) => (i === index ? { ...q, ...patch } : q)),
    )
  }
  return (
    <form
      className="ushqn-card space-y-5"
      onSubmit={(e) => {
        e.preventDefault()
        create.mutate(new FormData(e.currentTarget))
      }}
    >
      <h2>{copy('Новая олимпиада', 'Жаңа олимпиада', 'New olympiad')}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-xs">
          {copy('Название', 'Атауы', 'Title')}
          <input
            className="ushqn-input mt-1"
            name="title"
            required
            minLength={3}
            maxLength={160}
          />
        </label>
        <label className="text-xs">
          {copy('Предмет / направление', 'Пән / бағыт', 'Subject / direction')}
          <input
            className="ushqn-input mt-1"
            name="subject"
            required
            maxLength={80}
          />
        </label>
        <label className="text-xs">
          {copy(
            'Начало (местное время)',
            'Басталуы (жергілікті уақыт)',
            'Starts (local time)',
          )}
          <input
            className="ushqn-input mt-1"
            name="starts"
            type="datetime-local"
            required
          />
        </label>
        <label className="text-xs">
          {copy(
            'Окончание (местное время)',
            'Аяқталуы (жергілікті уақыт)',
            'Ends (local time)',
          )}
          <input
            className="ushqn-input mt-1"
            name="ends"
            type="datetime-local"
            required
          />
        </label>
        <label className="text-xs">
          {copy(
            'Лимит времени, минут',
            'Уақыт шектеуі, минут',
            'Time limit, minutes',
          )}
          <input
            className="ushqn-input mt-1"
            name="duration"
            type="number"
            min={1}
            max={180}
            defaultValue={30}
            required
          />
        </label>
      </div>
      <label className="block text-xs">
        {copy('Описание', 'Сипаттама', 'Description')}
        <textarea
          className="ushqn-input mt-1"
          name="description"
          maxLength={4000}
          rows={3}
        />
      </label>
      {questions.map((q, index) => (
        <fieldset
          key={index}
          className="space-y-3 rounded-xl border border-[var(--color-ushqn-border)] p-4"
        >
          <legend className="px-2 text-xs font-bold">
            {copy('Вопрос', 'Сұрақ', 'Question')} {index + 1}
          </legend>
          <label className="block text-xs">
            {copy('Текст вопроса', 'Сұрақ мәтіні', 'Question text')}
            <textarea
              className="ushqn-input mt-1"
              value={q.prompt}
              onChange={(e) => update(index, { prompt: e.target.value })}
              required
              maxLength={2000}
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            {q.options.map((option, i) => (
              <label key={i} className="flex items-center gap-2 text-xs">
                <input
                  type="radio"
                  name={`correct-${index}`}
                  checked={q.correct_index === i}
                  onChange={() => update(index, { correct_index: i })}
                  aria-label={`${copy('Правильный вариант', 'Дұрыс нұсқа', 'Correct option')} ${i + 1}`}
                />
                <input
                  aria-label={`${copy('Вариант', 'Нұсқа', 'Option')} ${i + 1}`}
                  className="ushqn-input"
                  value={option}
                  onChange={(e) =>
                    update(index, {
                      options: q.options.map((x, j) =>
                        j === i ? e.target.value : x,
                      ),
                    })
                  }
                  required
                  maxLength={500}
                />
              </label>
            ))}
          </div>
          <p className="text-[10px] text-[var(--color-ushqn-muted)]">
            {copy(
              'Отметь правильный ответ кружком слева.',
              'Дұрыс жауапты сол жақтағы дөңгелекпен белгіле.',
              'Select the circle beside the correct answer.',
            )}
          </p>
          {questions.length > 1 && (
            <button
              type="button"
              onClick={() =>
                setQuestions(questions.filter((_, i) => i !== index))
              }
              className="flex items-center gap-2 text-xs text-red-500"
            >
              <Trash2 size={13} />
              {copy('Удалить вопрос', 'Сұрақты жою', 'Remove question')}
            </button>
          )}
        </fieldset>
      ))}
      <button
        type="button"
        disabled={questions.length >= 50}
        onClick={() => setQuestions([...questions, blankQuestion()])}
        className="ushqn-btn-secondary gap-2"
      >
        <Plus size={15} />
        {copy('Добавить вопрос', 'Сұрақ қосу', 'Add question')}
      </button>
      {create.error && (
        <p role="alert" className="text-xs text-red-500">
          {create.error.message}
        </p>
      )}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={create.isPending}
          className="ushqn-btn-primary"
        >
          {create.isPending
            ? copy('Публикуем…', 'Жариялануда…', 'Publishing…')
            : copy('Опубликовать', 'Жариялау', 'Publish')}
        </button>
        <button type="button" onClick={onClose} className="ushqn-btn-secondary">
          {copy('Отмена', 'Бас тарту', 'Cancel')}
        </button>
      </div>
    </form>
  )
}

function AttemptView({
  initial,
  title,
  onClose,
}: {
  initial: OlympiadSession
  title: string
  onClose: () => void
}) {
  const copy = useCopy()
  const qc = useQueryClient()
  const [result, setResult] = useState<OlympiadAttempt | null>(
    initial.attempt.submitted_at ? initial.attempt : null,
  )
  const [answers, setAnswers] = useState(initial.attempt.answers)
  const answersRef = useRef(answers)
  const queue = useRef(Promise.resolve())
  const [saveState, setSaveState] = useState<'saved' | 'saving' | 'error'>(
    'saved',
  )
  const [clock, setClock] = useState(() => Date.now())
  const [offset] = useState(() => new Date(initial.server_now).getTime() - Date.now())
  const remaining = Math.max(
    0,
    Math.ceil(
      (new Date(initial.attempt.deadline).getTime() - clock - offset) /
        1000,
    ),
  )
  const submit = useMutation({
    mutationFn: async () => {
      await queue.current
      const { data, error } = await supabase.rpc('submit_olympiad', {
        p_attempt_id: initial.attempt.id,
        p_answers: answersRef.current,
      })
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      setResult(data)
      void qc.invalidateQueries({ queryKey: ['olympiad-attempts'] })
    },
  })
  const autoSubmitted = useRef(false)
  useEffect(() => {
    const timer = window.setInterval(() => setClock(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])
  useEffect(() => {
    if (remaining === 0 && !result && !autoSubmitted.current) {
      autoSubmitted.current = true
      submit.mutate()
    }
  }, [remaining, result, submit])
  function choose(id: string, value: number) {
    const next = { ...answersRef.current, [id]: value }
    answersRef.current = next
    setAnswers(next)
    setSaveState('saving')
    queue.current = queue.current
      .then(async () => {
        const { data, error } = await supabase.rpc('save_olympiad_answers', {
          p_attempt_id: initial.attempt.id,
          p_answers: { [id]: value },
        })
        setSaveState(error || !data ? 'error' : 'saved')
      })
      .catch(() => setSaveState('error'))
  }
  if (result)
    return (
      <section className="ushqn-card space-y-4 py-12 text-center">
        <CheckCircle2 className="mx-auto text-emerald-500" size={42} />
        <h1 className="text-2xl">{title}</h1>
        <p className="text-sm text-[var(--color-ushqn-muted)]">
          {copy('Твой результат', 'Сенің нәтижең', 'Your result')}
        </p>
        <p className="text-5xl font-bold text-violet-600">
          {result.score}{' '}
          <span className="text-xl text-slate-400">/ {result.total}</span>
        </p>
        <p className="mx-auto max-w-md text-xs leading-6 text-[var(--color-ushqn-muted)]">
          {copy(
            'Тест завершён. Результат сохранён. Баллы теста пока не начисляются в общий рейтинг; дипломы и проверка кода — следующий этап.',
            'Тест аяқталды. Нәтиже сақталды. Тест ұпайлары жалпы рейтингке әзірге қосылмайды; дипломдар мен кодты тексеру — келесі кезең.',
            'Test completed and result saved. Test scores do not yet contribute to your overall rating; diplomas and code judging are planned next.',
          )}
        </p>
        <button type="button" className="ushqn-btn-secondary" onClick={onClose}>
          {copy('К олимпиадам', 'Олимпиадаларға', 'Back to olympiads')}
        </button>
      </section>
    )
  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={onClose}
        className="flex items-center gap-2 text-xs text-[var(--color-ushqn-muted)]"
      >
        <ArrowLeft size={15} />
        {copy(
          'Свернуть тест (время продолжит идти)',
          'Тестті жабу (уақыт жалғаса береді)',
          'Close test (timer will keep running)',
        )}
      </button>
      <div className="sticky top-12 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--color-ushqn-border)] bg-[var(--color-ushqn-surface)] p-4 lg:top-0">
        <h1 className="text-lg">{title}</h1>
        <span
          className="flex items-center gap-2 font-mono text-lg text-violet-500"
          role="timer"
        >
          <Clock size={18} />
          {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}
        </span>
      </div>
      <p className="text-xs text-[var(--color-ushqn-muted)]">
        {copy(
          'Одна попытка. После окончания времени засчитываются только сохранённые ответы.',
          'Бір мүмкіндік. Уақыт аяқталғанда тек сақталған жауаптар есептеледі.',
          'One attempt. Only saved answers count after the deadline.',
        )}
      </p>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          submit.mutate()
        }}
      >
        {initial.questions.map((q, i) => (
          <fieldset
            key={q.id}
            disabled={remaining === 0 || submit.isPending}
            className="ushqn-card"
          >
            <legend className="px-2 text-xs font-bold">
              {copy('Вопрос', 'Сұрақ', 'Question')} {i + 1}
            </legend>
            <p className="mb-4 whitespace-pre-wrap text-sm">{q.prompt}</p>
            <div className="space-y-2">
              {q.options.map((option, index) => (
                <label
                  key={index}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm ${answers[q.id] === index ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/20' : 'border-[var(--color-ushqn-border)]'}`}
                >
                  <input
                    type="radio"
                    name={q.id}
                    checked={answers[q.id] === index}
                    onChange={() => choose(q.id, index)}
                    className="accent-violet-600"
                  />
                  {option}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        <p
          role="status"
          className={`text-xs ${saveState === 'error' ? 'text-red-500' : 'text-[var(--color-ushqn-muted)]'}`}
        >
          {saveState === 'saving'
            ? copy(
                'Сохраняем ответы…',
                'Жауаптар сақталуда…',
                'Saving answers…',
              )
            : saveState === 'error'
              ? copy(
                  'Не удалось сохранить ответ. Проверь соединение и выбери вариант ещё раз.',
                  'Жауап сақталмады. Байланысты тексеріп, нұсқаны қайта таңда.',
                  'Could not save an answer. Check your connection and select it again.',
                )
              : copy('Ответы сохранены', 'Жауаптар сақталды', 'Answers saved')}
        </p>
        {submit.error && (
          <p role="alert" className="text-xs text-red-500">
            {submit.error.message}
          </p>
        )}
        <button
          type="submit"
          disabled={submit.isPending || saveState === 'saving'}
          className="ushqn-btn-primary"
        >
          {submit.isPending
            ? copy('Проверяем…', 'Тексерілуде…', 'Checking…')
            : copy(
                'Завершить и увидеть результат',
                'Аяқтау және нәтижені көру',
                'Finish and see results',
              )}
        </button>
      </form>
    </div>
  )
}

function OrganizerResults({ olympiadId }: { olympiadId: string }) {
  const copy = useCopy()
  const results = useQuery({
    queryKey: ['olympiad-attempts', olympiadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('olympiad_attempts')
        .select('*')
        .eq('olympiad_id', olympiadId)
        .order('score', { ascending: false, nullsFirst: false })
      if (error) throw error
      const ids = (data ?? []).map((a) => a.user_id)
      if (!ids.length) return []
      const profiles = await supabase
        .from('profiles')
        .select('id,display_name')
        .in('id', ids)
      if (profiles.error) throw profiles.error
      return (data ?? []).map((a) => ({
        ...a,
        name:
          profiles.data.find((p) => p.id === a.user_id)?.display_name ?? '—',
      }))
    },
  })
  return (
    <QueryState query={results}>
      <div className="ushqn-card overflow-auto">
        <h2 className="mb-4 text-sm">
          {copy(
            'Результаты участников',
            'Қатысушылар нәтижелері',
            'Participant results',
          )}
        </h2>
        {!results.data?.length ? (
          <p className="text-xs text-slate-500">
            {copy(
              'Пока нет участников',
              'Қатысушылар әзірге жоқ',
              'No participants yet',
            )}
          </p>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr>
                <th className="p-2">
                  {copy('Участник', 'Қатысушы', 'Participant')}
                </th>
                <th className="p-2">{copy('Результат', 'Нәтиже', 'Score')}</th>
                <th className="p-2">{copy('Статус', 'Мәртебе', 'Status')}</th>
              </tr>
            </thead>
            <tbody>
              {results.data.map((a) => (
                <tr
                  key={a.id}
                  className="border-t border-[var(--color-ushqn-border)]"
                >
                  <td className="p-2">{a.name}</td>
                  <td className="p-2">
                    {a.score ?? '—'} / {a.total}
                  </td>
                  <td className="p-2">
                    {a.submitted_at
                      ? copy('Завершён', 'Аяқталды', 'Submitted')
                      : copy('Не завершён', 'Аяқталмады', 'Not submitted')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </QueryState>
  )
}

export function OlympiadsPage() {
  const copy = useCopy()
  const { userId } = useAuth()
  const [editor, setEditor] = useState(false)
  const [selected, setSelected] = useState<{
    title: string
    session: OlympiadSession
  } | null>(null)
  const [resultsId, setResultsId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])
  const staff = useQuery({
    queryKey: ['profile-staff-flags', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin,is_moderator')
        .eq('id', userId!)
        .single()
      if (error) throw error
      return { isAdmin: !!data.is_admin, isModerator: !!data.is_moderator }
    },
  })
  const list = useQuery({
    queryKey: ['olympiads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('olympiads')
        .select('*')
        .order('starts_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
  })
  const attempts = useQuery({
    queryKey: ['olympiad-attempts', 'mine', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('olympiad_attempts')
        .select('*')
        .eq('user_id', userId!)
      if (error) throw error
      return data ?? []
    },
  })
  const start = useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      const { data, error } = await supabase.rpc('start_olympiad', {
        p_olympiad_id: id,
      })
      if (error) throw error
      return { title, session: data }
    },
    onSuccess: (data) => setSelected(data),
  })
  if (selected)
    return (
      <AttemptView
        key={selected.session.attempt.id}
        initial={selected.session}
        title={selected.title}
        onClose={() => {
          setSelected(null)
          void attempts.refetch()
        }}
      />
    )
  const visible =
    list.data?.filter((o) =>
      `${o.title} ${o.subject}`.toLowerCase().includes(search.toLowerCase()),
    ) ?? []
  return (
    <div className="space-y-6">
      <AppPageMeta title={copy('Олимпиады', 'Олимпиадалар', 'Olympiads')} />
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-violet-500">
            Challenge yourself
          </p>
          <h1 className="mt-2 text-3xl">
            {copy('Олимпиады', 'Олимпиадалар', 'Olympiads')}
          </h1>
          <p className="mt-3 text-sm text-[var(--color-ushqn-muted)]">
            {copy(
              'Новый вызов. Новые знания. Твой следующий результат.',
              'Жаңа сын-қатер. Жаңа білім. Сенің келесі нәтижең.',
              'A new challenge. New knowledge. Your next achievement.',
            )}
          </p>
        </div>
        {(staff.data?.isAdmin || staff.data?.isModerator) && (
          <button
            type="button"
            onClick={() => setEditor(!editor)}
            className="ushqn-btn-primary gap-2"
          >
            <Plus size={16} />
            {copy('Создать олимпиаду', 'Олимпиада құру', 'Create olympiad')}
          </button>
        )}
      </header>
      {editor && <OlympiadEditor onClose={() => setEditor(false)} />}
      <input
        className="ushqn-input"
        aria-label={copy(
          'Поиск олимпиад',
          'Олимпиада іздеу',
          'Search olympiads',
        )}
        placeholder={copy(
          'Поиск по названию или предмету',
          'Атауы не пәні бойынша іздеу',
          'Search by title or subject',
        )}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {start.error && (
        <p role="alert" className="ushqn-card text-sm text-red-500">
          {start.error.message}
        </p>
      )}
      <QueryState query={list}>
        {!visible.length ? (
          <div className="ushqn-card py-14 text-center">
            <Trophy size={36} className="mx-auto mb-4 text-violet-400" />
            <h2 className="text-lg">
              {copy(
                'Олимпиады не найдены',
                'Олимпиадалар табылмады',
                'No olympiads found',
              )}
            </h2>
            <p className="mt-2 text-xs text-[var(--color-ushqn-muted)]">
              {copy(
                'Здесь появятся соревнования, опубликованные организаторами.',
                'Мұнда ұйымдастырушылар жариялаған жарыстар пайда болады.',
                'Competitions published by organizers will appear here.',
              )}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {visible.map((o) => {
              const attempt = attempts.data?.find((a) => a.olympiad_id === o.id)
              const future = new Date(o.starts_at).getTime() > now
              const ended = new Date(o.ends_at).getTime() <= now
              return (
                <article className="ushqn-card flex flex-col" key={o.id}>
                  <div className="mb-5 flex items-center justify-between">
                    <span className="rounded-full bg-violet-100 px-3 py-1 text-[10px] font-bold text-violet-700">
                      {o.subject}
                    </span>
                    <span className="text-[10px] text-[var(--color-ushqn-muted)]">
                      {ended
                        ? copy('Завершена', 'Аяқталды', 'Ended')
                        : future
                          ? copy('Скоро', 'Жақында', 'Upcoming')
                          : copy('Открыта', 'Ашық', 'Open')}
                    </span>
                  </div>
                  <h2 className="text-xl">{o.title}</h2>
                  <p className="mt-3 flex-1 whitespace-pre-wrap text-xs leading-6 text-[var(--color-ushqn-muted)]">
                    {o.description}
                  </p>
                  <div className="my-4 space-y-1 text-xs text-[var(--color-ushqn-muted)]">
                    <p className="flex items-center gap-2">
                      <Clock size={14} />
                      {o.duration_minutes} {copy('минут', 'минут', 'minutes')}
                    </p>
                    <p>
                      {new Date(o.starts_at).toLocaleString()} →{' '}
                      {new Date(o.ends_at).toLocaleString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={
                      start.isPending ||
                      attempts.isPending ||
                      attempts.isError ||
                      (!attempt && (ended || future))
                    }
                    onClick={() => start.mutate({ id: o.id, title: o.title })}
                    className="ushqn-btn-primary"
                  >
                    {attempt?.submitted_at
                      ? copy('Мой результат', 'Менің нәтижем', 'My result')
                      : attempt
                        ? copy(
                            'Продолжить попытку',
                            'Жалғастыру',
                            'Resume attempt',
                          )
                        : copy(
                            'Начать (1 попытка)',
                            'Бастау (1 мүмкіндік)',
                            'Start (one attempt)',
                          )}
                  </button>
                  {attempts.isError && (
                    <button
                      type="button"
                      onClick={() => void attempts.refetch()}
                      className="mt-2 text-xs text-red-500"
                    >
                      {copy(
                        'Не удалось загрузить попытки. Повторить',
                        'Нәтижелер жүктелмеді. Қайталау',
                        'Could not load attempts. Retry',
                      )}
                    </button>
                  )}
                  {o.organizer_id === userId && (
                    <button
                      type="button"
                      onClick={() =>
                        setResultsId(resultsId === o.id ? null : o.id)
                      }
                      className="mt-3 text-xs text-violet-500"
                    >
                      {copy(
                        'Результаты участников',
                        'Қатысушылар нәтижелері',
                        'Participant results',
                      )}
                    </button>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </QueryState>
      {resultsId && <OrganizerResults olympiadId={resultsId} />}
    </div>
  )
}
