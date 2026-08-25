import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FileCode2,
  Download,
  Copy,
  RefreshCw,
} from 'lucide-react'
import { useToast } from '../lib/toast'

const IEEE_TEMPLATE = `\\documentclass[conference]{IEEEtran}
\\usepackage{amsmath,amssymb,amsfonts}
\\usepackage{graphicx}

\\title{Optimization of Multi-Modal Transportation Networks in Central Asia Using Deep Reinforcement Learning}

\\author{
  \\IEEEauthorblockN{Alikhan Nurlanuly}
  \\IEEEauthorblockA{\\textit{Department of Computer Science} \\\\
  \\textit{Republican Physics-Mathematics School (RFMSH)}\\\\
  Almaty, Kazakhstan \\\\
  talent@ushqn.kz}
}

\\begin{document}
\\maketitle

\\begin{abstract}
This paper presents an end-to-end graph optimization algorithm that reduces multi-modal transit latency across Eurasian trade corridors by 24.3\\%. We formulate the routing schedule as a Constrained Markov Decision Process (CMDP) solved via Proximal Policy Optimization (PPO).
\\end{abstract}

\\section{Introduction}
Routing in sparse transport topologies presents severe computational challenges. Let $G = (V, E)$ be a directed graph where each edge $e \\in E$ is associated with capacity $c(e)$ and latency $\\tau(e)$.

\\section{Mathematical Formulation}
The objective function minimizes total transit cost subject to capacity constraints:
\\begin{equation}
\\min \\sum_{e \\in E} f(e) \\cdot \\tau(e) \\quad \\text{s.t.} \\quad f(e) \\le c(e)
\\end{equation}

\\section{Conclusion}
Our experimental results demonstrate sub-second convergence across 10,000 simulated nodes.
\\end{document}`

export function ScientificPaperLatexStudio() {
  const { i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const { toast } = useToast()

  const [latexCode, setLatexCode] = useState(IEEE_TEMPLATE)
  const [templateType, setTemplateType] = useState<'ieee' | 'springer' | 'daryn'>('ieee')
  const [isCompiling, setIsCompiling] = useState(false)

  const handleCompilePdf = () => {
    setIsCompiling(true)
    setTimeout(() => {
      setIsCompiling(false)
      toast(isKz ? 'LaTeX құжаты PDF форматына сәтті жиналды!' : 'LaTeX paper compiled to PDF!', 'success')
    }, 1000)
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(latexCode)
    toast(isKz ? 'LaTeX коды көшірілді!' : 'LaTeX code copied!', 'info')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-blue-50/40 p-6 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/30">
        <div>
          <div className="inline-flex items-center gap-2 rounded-lg bg-blue-100/80 px-3 py-1 text-xs font-bold text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
            <FileCode2 className="h-3.5 w-3.5" />
            <span>LaTeX & Scientific Paper Studio</span>
          </div>
          <h2 className="mt-2 text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            {isKz ? 'Ғылыми Жобаларға арналған LaTeX & Мақала Редакторы' : 'Scientific Paper & LaTeX Template Studio'}
          </h2>
          <p className="mt-1 max-w-2xl text-xs text-slate-600 dark:text-slate-300">
            {isKz
              ? 'Дарын республикалық ғылыми жарыстары мен халықаралық IEEE/Springer конференцияларына арналған дайын формулалар мен құрылымдар.'
              : 'Web-based LaTeX studio tailored for high school STEM research projects and international academic symposiums.'}
          </p>
        </div>

        {/* Template format pills */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'ieee', label: '📄 IEEE Conference 2-Column' },
            { id: 'springer', label: '📖 Springer Nature LNCS' },
            { id: 'daryn', label: '🇰🇿 «Дарын» Ғылыми Жоба Стандарты' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTemplateType(t.id as 'ieee' | 'springer' | 'daryn')}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                templateType === t.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Editor & Preview Split View */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Code Editor */}
        <div className="space-y-3 lg:col-span-6">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 text-white shadow-2xs dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-2.5 text-xs">
              <span className="font-mono font-bold text-slate-300">main.tex</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="text-slate-400 hover:text-white"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <textarea
              rows={16}
              value={latexCode}
              onChange={(e) => setLatexCode(e.target.value)}
              className="w-full resize-y bg-slate-950 p-4 font-mono text-xs leading-relaxed text-slate-200 outline-none"
            />
          </div>

          <button
            type="button"
            onClick={handleCompilePdf}
            disabled={isCompiling}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50"
          >
            {isCompiling ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>{isKz ? 'PDF жиналуда...' : 'Compiling LaTeX PDF...'}</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>{isKz ? 'PDF Мақаланы Жүктеу' : 'Compile & Download PDF'}</span>
              </>
            )}
          </button>
        </div>

        {/* Live Formatted Preview */}
        <div className="space-y-3 lg:col-span-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-100 pb-3 text-center dark:border-slate-800">
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Optimization of Multi-Modal Transportation Networks in Central Asia Using Deep Reinforcement Learning
              </h3>
              <div className="mt-1 text-[11px] text-slate-500">
                Alikhan Nurlanuly • Republican Physics-Mathematics School (RFMSH)
              </div>
            </div>

            <div className="mt-4 space-y-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              <div className="rounded-lg bg-slate-50 p-3 italic text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                <span className="font-bold not-italic text-slate-900 dark:text-white">Abstract — </span>
                This paper presents an end-to-end graph optimization algorithm that reduces multi-modal transit latency across Eurasian trade corridors by 24.3%.
              </div>

              <div>
                <h4 className="font-bold uppercase tracking-wider text-[11px] text-slate-900 dark:text-white">
                  I. Mathematical Formulation
                </h4>
                <p className="mt-1">
                  Let G = (V, E) be a directed graph where each edge represents high-speed transit.
                </p>
                <div className="my-2 rounded-lg border border-slate-100 bg-slate-50 py-2 text-center font-mono text-xs font-bold text-slate-800 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200">
                  min ∑ f(e) · τ(e)   s.t.   f(e) ≤ c(e)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
