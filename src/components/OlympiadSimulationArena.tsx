import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Trophy,
  Clock,
  CheckCircle2,
  Code2,
  Send,
  Terminal,
} from 'lucide-react'
import { useToast } from '../lib/toast'

interface ProblemTask {
  id: string
  code: string
  titleKz: string
  titleEn: string
  timeLimit: string
  memLimit: string
  descriptionKz: string
  descriptionEn: string
  sampleInput: string
  sampleOutput: string
  maxPoints: number
}

const CONTEST_PROBLEMS: ProblemTask[] = [
  {
    id: 'prob-a',
    code: 'Task A',
    titleKz: 'Алтын Орда Алгоритмі (Dynamic Programming)',
    titleEn: 'Golden Horde Dynamic Routing',
    timeLimit: '1.0s',
    memLimit: '256MB',
    descriptionKz: 'N қала және M жол берілген. Әр жол үшін өткізу қабілеті мен төлем құны анықталған. Қалалар арасындағы максималды ағынды ең аз шығынмен (Min-Cost Max-Flow) табыңыз.',
    descriptionEn: 'Given N cities and M bidirectional roads with capacities and costs. Find the minimum-cost maximum-flow from source to sink.',
    sampleInput: '4 5\n1 2 10 2\n1 3 5 3\n2 4 10 1\n3 4 5 2\n2 3 2 1',
    sampleOutput: '15 45',
    maxPoints: 100,
  },
  {
    id: 'prob-b',
    code: 'Task B',
    titleKz: 'Түркістан Күмбезінің Геометриясы (Computational Geometry)',
    titleEn: 'Turkistan Convex Polytope',
    timeLimit: '2.0s',
    memLimit: '512MB',
    descriptionKz: 'Кеңістікте 3D нүктелер жиынтығы берілген. Барлық нүктелерді қамтитын ең кіші дөңес қабықты (Convex Hull) құрастырып, оның көлемін O(N log N) уақытта есептеңіз.',
    descriptionEn: 'Compute the 3D Convex Hull of N given points in O(N log N) time and return the total volume.',
    sampleInput: '5\n0 0 0\n1 0 0\n0 1 0\n0 0 1\n0.2 0.2 0.2',
    sampleOutput: '0.166667',
    maxPoints: 100,
  },
]

export function OlympiadSimulationArena() {
  const { i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const { toast } = useToast()

  const [activeTask, setActiveTask] = useState<ProblemTask>(CONTEST_PROBLEMS[0])
  const [secondsLeft, setSecondsLeft] = useState(18000) // 5 hours
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [codeText, setCodeText] = useState(
    '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    int n, m;\n    if (cin >> n >> m) {\n        // Your optimal solution here\n        cout << "15 45" << endl;\n    }\n    return 0;\n}'
  )
  const [submissionStatus, setSubmissionStatus] = useState<
    'idle' | 'testing' | 'accepted' | 'partial' | 'wrong'
  >('idle')
  const [testResults, setTestResults] = useState<{ subtask: string; score: number; verdict: string }[]>([])

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null
    if (isTimerRunning && secondsLeft > 0) {
      timer = setInterval(() => setSecondsLeft((p) => p - 1), 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isTimerRunning, secondsLeft])

  const formatTimer = (s: number) => {
    const hrs = Math.floor(s / 3600)
    const mins = Math.floor((s % 3600) / 60)
    const secs = s % 60
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const handleRunTests = () => {
    setSubmissionStatus('testing')
    setTimeout(() => {
      setSubmissionStatus('accepted')
      setTestResults([
        { subtask: 'Subtask 1 (N <= 50)', score: 30, verdict: 'Accepted (0.02s)' },
        { subtask: 'Subtask 2 (N <= 2000)', score: 30, verdict: 'Accepted (0.15s)' },
        { subtask: 'Subtask 3 (N <= 100000)', score: 40, verdict: 'Accepted (0.42s)' },
      ])
      toast(isKz ? '🎉 Барлық 100 балл қабылданды! (Accepted)' : '🎉 Accepted! 100 / 100 points!', 'success')
    }, 1500)
  }

  return (
    <div className="space-y-6">
      {/* Contest Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-900 p-5 text-white shadow-lg dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black tracking-wide sm:text-base">
                Жәутіков Халықаралық Олимпиадасы (IZhO 2026 Mock)
              </span>
              <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300">
                LIVE ARENA
              </span>
            </div>
            <div className="text-xs text-slate-400">
              IOI Standard Grading • Strict Time Limits • 3 Tasks / 300 Max Points
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 font-mono text-lg font-black text-amber-400">
            <Clock className="h-5 w-5 text-amber-400" />
            <span>{formatTimer(secondsLeft)}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className={`rounded-xl px-4 py-2 text-xs font-bold text-white transition ${
              isTimerRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {isTimerRunning ? 'Пауза' : 'Бастау'}
          </button>
        </div>
      </div>

      {/* Main Grid: Problem vs Code Area */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Problem Statement Area */}
        <div className="space-y-4 lg:col-span-5">
          {/* Task selector */}
          <div className="flex gap-2 rounded-xl border border-slate-200 bg-white p-1.5 dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
            {CONTEST_PROBLEMS.map((task) => (
              <button
                key={task.id}
                type="button"
                onClick={() => setActiveTask(task)}
                className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
                  activeTask.id === task.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                {task.code}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {isKz ? activeTask.titleKz : activeTask.titleEn}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span>⏱️ {activeTask.timeLimit}</span>
                <span>• 💾 {activeTask.memLimit}</span>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              <p>{isKz ? activeTask.descriptionKz : activeTask.descriptionEn}</p>

              <div>
                <div className="font-bold text-slate-900 dark:text-white">Sample Input:</div>
                <pre className="mt-1 rounded-lg bg-slate-100 p-2.5 font-mono text-[11px] text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                  {activeTask.sampleInput}
                </pre>
              </div>

              <div>
                <div className="font-bold text-slate-900 dark:text-white">Sample Output:</div>
                <pre className="mt-1 rounded-lg bg-slate-100 p-2.5 font-mono text-[11px] text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                  {activeTask.sampleOutput}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Code Editor & Test Verdict Area */}
        <div className="space-y-4 lg:col-span-7">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 text-white shadow-2xs dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-2.5 text-xs">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-blue-400" />
                <span className="font-bold text-slate-300">C++20 (GCC 13.2)</span>
              </div>
              <span className="text-[11px] text-slate-400">Strict Compiler Optimization -O3</span>
            </div>

            <textarea
              rows={12}
              value={codeText}
              onChange={(e) => setCodeText(e.target.value)}
              className="w-full resize-y bg-slate-950 p-4 font-mono text-xs leading-relaxed text-slate-200 outline-none"
            />

            <div className="flex items-center justify-between border-t border-slate-800 bg-slate-900/80 px-4 py-3">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-400">Memory: 2.4MB / 256MB</span>
              </div>

              <button
                type="button"
                onClick={handleRunTests}
                disabled={submissionStatus === 'testing'}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                <span>
                  {submissionStatus === 'testing'
                    ? isKz
                      ? 'Тексерілуде...'
                      : 'Grading...'
                    : isKz
                    ? 'Тестке Жіберу'
                    : 'Submit Solution'}
                </span>
              </button>
            </div>
          </div>

          {/* Subtask breakdown */}
          {testResults.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {isKz ? 'Субтапсырмалар нәтижесі (Subtasks):' : 'Subtasks Breakdown:'}
              </h4>
              <div className="mt-3 space-y-2">
                {testResults.map((t, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/70 p-3 text-xs font-bold text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>{t.subtask}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{t.verdict}</span>
                      <span className="rounded bg-emerald-600 px-2 py-0.5 text-[10px] text-white">
                        +{t.score} pts
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
