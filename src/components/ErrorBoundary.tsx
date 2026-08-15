import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in application:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center dark:bg-slate-950">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-2xl dark:bg-amber-950/50">
              ⚠️
            </div>
            <h1 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">Қосымшаны жүктеу кезінде қате шықты</h1>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Бетті қайта жаңартып көріңіз немесе басты бетке оралыңыз.
            </p>
            {this.state.error && (
              <pre className="mt-4 max-h-32 overflow-auto rounded-lg bg-slate-100 p-2.5 text-left text-[10px] text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {this.state.error.message}
              </pre>
            )}
            <div className="mt-6 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full rounded-xl bg-[#162a45] py-2.5 text-xs font-bold text-white transition hover:bg-[#0f1d30]"
              >
                Бетті қайта жүктеу (Reload)
              </button>
              <button
                type="button"
                onClick={() => {
                  window.location.href = '/'
                }}
                className="w-full rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Басты бетке өту
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
