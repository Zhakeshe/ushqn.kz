import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Play,
  Pause,
  RotateCcw,
  Edit3,
  Trash2,
  CheckCircle2,
  Circle,
  Users,
  Zap,
  Coffee,
} from 'lucide-react'
import { useToast } from '../lib/toast'

export function P2PStudyRoom() {
  const { i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const { toast } = useToast()

  // Pomodoro State
  const [secondsLeft, setSecondsLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState<'focus' | 'break'>('focus')

  // Sound ambience
  const [activeSound, setActiveSound] = useState<'rain' | 'library' | 'lofi' | 'off'>('off')

  // Study tasks
  const [tasks, setTasks] = useState([
    { id: 't1', textKz: 'Жәутіков есептерін талдау (1-3 есеп)', textRu: 'Разбор Жаутыковских задач (1-3)', done: true },
    { id: 't2', textKz: 'DP Optimization конспектісін жазу', textRu: 'Написать конспект по оптимизациям ДП', done: false },
    { id: 't3', textKz: 'Codeforces 1 Div2 раундына қатысу', textRu: 'Участие в раунде Codeforces Div2', done: false },
  ])
  const [newTaskInput, setNewTaskInput] = useState('')

  // Whiteboard drawing canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawColor, setDrawColor] = useState('#2563eb')

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => setSecondsLeft((prev) => prev - 1), 1000)
    } else if (secondsLeft === 0) {
      if (mode === 'focus') {
        toast(isKz ? '🎉 Фокус сессиясы аяқталды! +100 XP. 5 минут демалыңыз.' : '🎉 Фокус завершен! +100 XP.')
        setMode('break')
        setSecondsLeft(5 * 60)
      } else {
        toast(isKz ? '⚡ Демалыс аяқталды! Фокус уақыты.' : '⚡ Перерыв окончен! Время учиться.')
        setMode('focus')
        setSecondsLeft(25 * 60)
      }
      setIsRunning(false)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, secondsLeft, mode, isKz, toast])

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleAddTask = () => {
    if (!newTaskInput.trim()) return
    setTasks((prev) => [
      ...prev,
      { id: Date.now().toString(), textKz: newTaskInput, textRu: newTaskInput, done: false },
    ])
    setNewTaskInput('')
  }

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    )
  }

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    ctx.beginPath()
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
    setIsDrawing(true)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
    ctx.strokeStyle = drawColor
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-6 text-white shadow-xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-300 backdrop-blur-md">
              <Users className="h-3.5 w-3.5 text-blue-400" />
              <span>Peer-to-Peer Study Room</span>
              <span className="rounded bg-emerald-500/30 px-1.5 py-0.5 text-[10px] font-black text-emerald-300">
                128 STUDENTS ONLINE
              </span>
            </div>
            <h2 className="text-xl font-black tracking-tight sm:text-2xl">
              {isKz ? 'Бірлескен Виртуалды Сынып & Pomodoro' : 'Виртуальный Коворкинг и Pomodoro'}
            </h2>
            <p className="max-w-xl text-xs text-blue-100/80 sm:text-sm">
              {isKz
                ? 'Басқа дарынды оқушылармен бірге фокусталып оқыңыз, ортақ тақтада (Whiteboard) есеп шығарыңыз және күнделікті фокус XP ұпайын жинаңыз.'
                : 'Учитесь вместе с лучшими олимпиадниками страны, делитесь идеями на интерактивной доске и поддерживайте стрик.'}
            </p>
          </div>

          {/* Ambience audio controls */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'rain', labelKz: '🌧️ Алматы Жаңбыры', labelRu: '🌧️ Дождь' },
              { id: 'library', labelKz: '📚 Ұлттық Кітапхана', labelRu: '📚 Библиотека' },
              { id: 'lofi', labelKz: '🎧 Lo-Fi Beat', labelRu: '🎧 Lo-Fi' },
              { id: 'off', labelKz: '🔇 Өшіру', labelRu: '🔇 Выкл' },
            ].map((snd) => (
              <button
                key={snd.id}
                type="button"
                onClick={() => {
                  setActiveSound(snd.id as 'rain' | 'library' | 'lofi' | 'off')
                  toast(isKz ? `Аудио фоны: ${snd.labelKz}` : `Звуковой фон: ${snd.labelRu}`, 'info')
                }}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  activeSound === snd.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                {isKz ? snd.labelKz : snd.labelRu}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Pomodoro & Whiteboard */}
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        {/* Left Column: Pomodoro & Task list */}
        <div className="space-y-4">
          {/* Pomodoro Timer Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {mode === 'focus' ? <Zap className="h-3.5 w-3.5 text-amber-500" /> : <Coffee className="h-3.5 w-3.5 text-blue-500" />}
              <span>{mode === 'focus' ? (isKz ? '🎯 Терең Фокус (25 мин)' : '🎯 Фокус Сессия') : (isKz ? '☕ Демалыс (5 мин)' : '☕ Перерыв')}</span>
            </div>

            <div className="text-5xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
              {formatTime(secondsLeft)}
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsRunning((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 active:scale-95"
              >
                {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-white" />}
                <span>{isRunning ? (isKz ? 'Кідірту' : 'Пауза') : (isKz ? 'Бастау' : 'Старт')}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsRunning(false)
                  setSecondsLeft(mode === 'focus' ? 25 * 60 : 5 * 60)
                }}
                className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                title={isKz ? 'Қайтару' : 'Сбросить'}
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Today Tasks */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              {isKz ? 'Оқу Мақсаттары (Today Tasks)' : 'Задачи на сегодня'}
            </h3>

            <div className="space-y-1.5">
              {tasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => toggleTask(t.id)}
                  className={`flex cursor-pointer items-center gap-2 rounded-xl p-2.5 text-xs transition ${
                    t.done
                      ? 'bg-emerald-50/50 text-emerald-900 line-through opacity-75 dark:bg-emerald-950/30 dark:text-emerald-300'
                      : 'bg-slate-50 text-slate-800 hover:bg-slate-100 dark:bg-slate-800/60 dark:text-slate-200'
                  }`}
                >
                  {t.done ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-slate-400 shrink-0" />
                  )}
                  <span>{isKz ? t.textKz : t.textRu}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newTaskInput}
                onChange={(e) => setNewTaskInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddTask()
                }}
                placeholder={isKz ? 'Жаңа мақсат...' : 'Новая задача...'}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddTask}
                className="rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Scratchpad / Whiteboard */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 flex flex-col space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Edit3 className="h-4 w-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                {isKz ? 'Интерактивті Есеп Шығару Тақтасы (Whiteboard)' : 'Интерактивная доска для формул и кода'}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {['#2563eb', '#16a34a', '#dc2626', '#1e293b'].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setDrawColor(color)}
                    className={`h-5 w-5 rounded-full border-2 transition ${
                      drawColor === color ? 'scale-110 border-black dark:border-white' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={clearCanvas}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
              >
                <Trash2 className="h-3 w-3" />
                <span>{isKz ? 'Тазалау' : 'Очистить'}</span>
              </button>
            </div>
          </div>

          <div className="flex-1 relative rounded-xl border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950 min-h-[320px] overflow-hidden">
            <canvas
              ref={canvasRef}
              width={650}
              height={360}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="w-full h-full cursor-crosshair touch-none"
            />
          </div>
          <span className="text-[10px] text-slate-400">
            {isKz ? '💡 Тінтуірмен формулаларды, графиктерді немесе код схемасын еркін сызыңыз.' : '💡 Рисуйте формулы и схемы решения задач курсором.'}
          </span>
        </div>
      </div>
    </div>
  )
}
