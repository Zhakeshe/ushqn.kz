import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ThumbsUp,
  Sparkles,
  Send,
} from 'lucide-react'
import { useToast } from '../lib/toast'

interface ReviewSubmission {
  id: string
  author: string
  school: string
  taskTitle: string
  language: string
  codeSnippet: string
  commentsCount: number
  upvotes: number
  reviews: { id: string; reviewer: string; text: string; xpAwarded: number }[]
}

const SAMPLE_SUBMISSIONS: ReviewSubmission[] = [
  {
    id: 'sub-1',
    author: 'Санжар Әлімжан',
    school: 'РФМШ Алматы',
    taskTitle: 'Segment Tree with Lazy Propagation (IZhO Task 2)',
    language: 'C++20',
    codeSnippet: `void update(int v, int tl, int tr, int l, int r, long long add) {
    if (l > r) return;
    if (l == tl && tr == r) {
        tree[v] += add * (tr - tl + 1);
        lazy[v] += add;
    } else {
        push(v, tl, tr);
        int tm = (tl + tr) / 2;
        update(v*2, tl, tm, l, min(r, tm), add);
        update(v*2+1, tm+1, tr, max(l, tm+1), r, add);
        tree[v] = tree[v*2] + tree[v*2+1];
    }
}`,
    commentsCount: 3,
    upvotes: 14,
    reviews: [
      {
        id: 'rev-1',
        reviewer: 'Ернар (IOI Silver)',
        text: 'Керемет таза код! Бірақ tree[v] overflow болмауы үшін long long қолданғаныңыз дұрыс болған.',
        xpAwarded: 25,
      },
    ],
  },
  {
    id: 'sub-2',
    author: 'Айзере Нұртас',
    school: 'НИШ Талдықорған',
    taskTitle: 'Dijkstra with Priority Queue & Path Reconstruction',
    language: 'Python 3.12',
    codeSnippet: `import heapq

def dijkstra(n, adj, start):
    dist = [float('inf')] * (n + 1)
    dist[start] = 0
    pq = [(0, start)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        for v, w in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(pq, (dist[v], v))
    return dist`,
    commentsCount: 2,
    upvotes: 9,
    reviews: [
      {
        id: 'rev-2',
        reviewer: 'Дәурен (Astana Hub Mentor)',
        text: 'Python үшін heap өте жақсы жазылған. Үлкен графтар үшін sys.setrecursionlimit қажет болуы мүмкін.',
        xpAwarded: 20,
      },
    ],
  },
]

export function PeerCodeReviewHub() {
  const { i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const { toast } = useToast()

  const [submissions, setSubmissions] = useState<ReviewSubmission[]>(SAMPLE_SUBMISSIONS)
  const [selectedSub, setSelectedSub] = useState<ReviewSubmission>(SAMPLE_SUBMISSIONS[0])
  const [newComment, setNewComment] = useState('')

  const handleAddReview = () => {
    if (!newComment.trim()) return
    const updated = {
      ...selectedSub,
      reviews: [
        ...selectedSub.reviews,
        {
          id: `rev-${Date.now()}`,
          reviewer: 'Сіз (Peer Reviewer)',
          text: newComment.trim(),
          xpAwarded: 25,
        },
      ],
      commentsCount: selectedSub.commentsCount + 1,
    }

    setSubmissions(submissions.map((s) => (s.id === selectedSub.id ? updated : s)))
    setSelectedSub(updated)
    setNewComment('')
    toast(isKz ? 'Пікір қосылды! +25 Reviewer XP берілді 🎉' : 'Review posted! +25 Reviewer XP awarded 🎉', 'success')
  }

  const handleUpvote = (id: string) => {
    setSubmissions(
      submissions.map((s) => (s.id === id ? { ...s, upvotes: s.upvotes + 1 } : s))
    )
    if (selectedSub.id === id) {
      setSelectedSub({ ...selectedSub, upvotes: selectedSub.upvotes + 1 })
    }
    toast(isKz ? 'Кодқа қолдау білдірілді 👍' : 'Upvoted solution 👍', 'info')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50/70 via-white to-emerald-50/50 p-6 dark:border-teal-900/40 dark:from-slate-900 dark:via-slate-900 dark:to-teal-950/30">
        <div>
          <div className="inline-flex items-center gap-2 rounded-lg bg-teal-100/80 px-3 py-1 text-xs font-bold text-teal-800 dark:bg-teal-900/50 dark:text-teal-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Peer Review & Code Critique</span>
          </div>
          <h2 className="mt-2 text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            {isKz ? 'Олимпиадалық Кодты Тексеру & Талқылау' : 'Peer Code Review & Critique Exchange'}
          </h2>
          <p className="mt-1 max-w-2xl text-xs text-slate-600 dark:text-slate-300">
            {isKz
              ? 'Басқа оқушылардың олимпиадалық алгоритмдеріне рецензия жазып, қателерді көрсетіңіз және «Master Reviewer» дәрежесі мен XP жинаңыз.'
              : 'Review peers’ code, point out edge cases and optimization tips, and earn Master Reviewer XP.'}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Submissions List */}
        <div className="space-y-3 lg:col-span-4">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {isKz ? 'Талқылаудағы Есептер:' : 'Solutions in Review:'}
          </label>
          {submissions.map((sub) => {
            const isSelected = selectedSub.id === sub.id
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => setSelectedSub(sub)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  isSelected
                    ? 'border-teal-600 bg-teal-50/70 dark:border-teal-500 dark:bg-teal-950/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold text-teal-700 dark:text-teal-400">{sub.language}</span>
                  <span>{sub.reviews.length} пікір</span>
                </div>
                <h4 className="mt-1 text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                  {sub.taskTitle}
                </h4>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{sub.author} ({sub.school})</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">👍 {sub.upvotes}</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Right Code & Critique View */}
        <div className="space-y-4 lg:col-span-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {selectedSub.taskTitle}
                </h3>
                <div className="text-xs text-slate-500">
                  Автор: {selectedSub.author} • {selectedSub.school}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleUpvote(selectedSub.id)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <ThumbsUp className="h-3.5 w-3.5 text-teal-600" />
                <span>{selectedSub.upvotes} Upvote</span>
              </button>
            </div>

            {/* Code Block */}
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-200 leading-relaxed">
              <pre className="overflow-x-auto">{selectedSub.codeSnippet}</pre>
            </div>

            {/* Existing Reviews */}
            <div className="mt-6 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {isKz ? 'Пікірлер мен Рецензиялар:' : 'Reviews & Critiques:'}
              </h4>

              {selectedSub.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-800/50"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">{rev.reviewer}</span>
                    <span className="rounded bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-800 dark:bg-teal-900/60 dark:text-teal-300">
                      +{rev.xpAwarded} XP Awarded
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-700 dark:text-slate-300">{rev.text}</p>
                </div>
              ))}
            </div>

            {/* Add Review Box */}
            <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={
                    isKz
                      ? 'Конструктивті пікір жазыңыз (мыс: уақыт күрделілігі, шекаралық жағдайлар)...'
                      : 'Write constructive critique (e.g. edge cases, memory optimization)...'
                  }
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddReview()}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleAddReview}
                  className="flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{isKz ? 'Жіберу' : 'Post'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
