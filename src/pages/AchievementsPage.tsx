import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { useToast } from '../lib/toast'
import { useConfirm } from '../lib/confirm'
import { format } from 'date-fns'
import { getDateFnsLocale } from '../lib/dateLocale'
import { AppPageMeta } from '../components/AppPageMeta'
import { ExportPdfResumeModal, type ResumeData } from '../components/ExportPdfResumeModal'
import { PlusCircle, Download } from 'lucide-react'
import { ALLOWED_UPLOAD_TYPES, uploadPrivateEvidence, validateUpload } from '../lib/upload'

const CATEGORY_EMOJI: Record<string, string> = {
  robotics: '🤖', programming: '💻', sports: '⚽', debates: '🎤',
  science: '🔬', arts: '🎨', other: '🏅', music: '🎵', math: '📐', language: '🌐',
}

export function AchievementsPage() {
  const { t, i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const isRu = i18n.language === 'ru'
  const { userId } = useAuth()
  const qc = useQueryClient()
  const { toast } = useToast()
  const { confirm } = useConfirm()
  const [file, setFile] = useState<File | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [showPdfModal, setShowPdfModal] = useState(false)

  type Form = { title: string; description?: string; category_id: string }
  const schema = useMemo(
    () =>
      z.object({
        title: z.string().min(1, t('validation.titleRequired')),
        description: z.string().optional(),
        category_id: z.string().uuid(),
      }),
    [t],
  )

  const profileQuery = useQuery({
    queryKey: ['profile', userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId!).single()
      return data
    },
  })

  const categoriesQuery = useQuery({
    queryKey: ['achievement_categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('achievement_categories').select('id,label_ru,default_points,slug').order('label_ru')
      if (error) throw error
      return data ?? []
    },
  })

  const listQuery = useQuery({
    queryKey: ['achievements', userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const [{ data: rows, error: e1 }, { data: cats, error: e2 }] = await Promise.all([
        supabase.from('achievements').select('id,title,description,category_id,file_path,file_bucket,points_awarded,verification_status,rejection_reason,created_at').eq('user_id', userId!).order('created_at', { ascending: false }),
        supabase.from('achievement_categories').select('id,label_ru,slug'),
      ])
      if (e1) throw e1
      if (e2) throw e2
      const labels = new Map((cats ?? []).map((c) => [c.id, c.label_ru]))
      const slugs = new Map((cats ?? []).map((c) => [c.id, c.slug as string]))
      return Promise.all((rows ?? []).map(async (r) => {
        const signed = r.file_path && r.file_bucket === 'evidence'
          ? await supabase.storage.from('evidence').createSignedUrl(r.file_path, 60 * 10)
          : null
        return {
          ...r,
          category_label: labels.get(r.category_id) ?? '—',
          category_slug: slugs.get(r.category_id) ?? 'other',
          file_url: signed?.data?.signedUrl ?? (
            r.file_path && r.file_bucket === 'uploads'
              ? supabase.storage.from('uploads').getPublicUrl(r.file_path).data.publicUrl
              : null
          ),
        }
      }))
    },
  })

  const filteredList = useMemo(() => {
    return (listQuery.data ?? []).filter((a) => {
      if (filterCategory !== 'all' && a.category_id !== filterCategory) return false
      if (search.trim() && !a.title.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [listQuery.data, filterCategory, search])

  const totalPoints = useMemo(() => (listQuery.data ?? []).reduce((s, a) => s + (a.points_awarded ?? 0), 0), [listQuery.data])

  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', description: '', category_id: '' },
  })

  useEffect(() => {
    void form.clearErrors()
    void form.trigger()
  }, [schema, form])

  useEffect(() => {
    const first = categoriesQuery.data?.[0]?.id
    if (first && !form.getValues('category_id')) form.setValue('category_id', first)
  }, [categoriesQuery.data, form])

  const create = useMutation({
    mutationFn: async (values: Form) => {
      let filePath: string | null = null
      if (file && userId) {
        filePath = await uploadPrivateEvidence(userId, `achievements/${Date.now()}-${file.name}`, file)
      }
      const { error } = await supabase.from('achievements').insert({
        user_id: userId!, category_id: values.category_id,
        title: values.title, description: values.description || null, file_path: filePath, file_bucket: 'evidence',
      })
      if (error) throw error
    },
    onSuccess: () => {
      form.reset({ title: '', description: '', category_id: categoriesQuery.data?.[0]?.id ?? '' })
      setFile(null)
      setShowForm(false)
      void qc.invalidateQueries({ queryKey: ['achievements', userId] })
      void qc.invalidateQueries({ queryKey: ['scores', userId] })
      void qc.invalidateQueries({ queryKey: ['leaderboard'] })
      void qc.invalidateQueries({ queryKey: ['total-points', userId] })
      toast(t('achievements.toastAdded'))
    },
    onError: (error) => toast(error instanceof Error ? error.message : t('achievements.toastSaveErr'), 'error'),
  })

  async function remove(id: string, title: string) {
    const ok = await confirm({
      title: t('achievements.confirm_delete'),
      description: t('achievements.confirmRemoveDesc', { title }),
      confirmLabel: t('common.delete'),
      danger: true,
    })
    if (!ok) return
    await supabase.from('achievements').delete().eq('id', id)
    void qc.invalidateQueries({ queryKey: ['achievements', userId] })
    void qc.invalidateQueries({ queryKey: ['scores', userId] })
    void qc.invalidateQueries({ queryKey: ['leaderboard'] })
    void qc.invalidateQueries({ queryKey: ['total-points', userId] })
    toast(t('achievements.toastRemoved'), 'info')
  }

  const dateLocale = getDateFnsLocale(i18n.language)

  const resumeData: ResumeData = useMemo(() => {
    const p = profileQuery.data
    return {
      name: p?.display_name || (isKz ? 'Аты көрсетілмеген' : 'Имя не указано'),
      studentId: p?.id ? `USH-KZ-${p.id.slice(0, 8).toUpperCase()}` : '—',
      school: p?.school_or_org || undefined,
      city: p?.location || undefined,
      bio: p?.bio || undefined,
      totalXp: totalPoints,
      leaderboardRank: 0,
      topPercentile: 0,
      verifiedCount: (listQuery.data ?? []).filter((a) => a.verification_status === 'verified').length,
      achievements: (listQuery.data ?? []).map((a) => ({
        id: a.id,
        title: a.title,
        category: a.category_label,
        points: a.points_awarded,
        date: a.created_at ? format(new Date(a.created_at), 'dd.MM.yyyy') : '2026',
        issuer: a.category_label,
        isVerified: a.verification_status === 'verified',
      })),
      skills: [],
    }
  }, [profileQuery.data, totalPoints, listQuery.data, isKz])

  return (
    <div className="space-y-5">
      <AppPageMeta title={t('nav.achievements')} />
      {/* Header stats */}
      <div className="ushqn-card overflow-hidden p-0">
        <div className="bg-gradient-to-r from-[#0052CC] to-[#2684FF] px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold">{t('achievements.pageHeader')}</h1>
              <p className="mt-0.5 text-sm text-blue-100">{t('achievements.heroSub')}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black">{totalPoints}</p>
              <p className="text-xs text-blue-100">{t('achievements.ushqPoints')}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-white/10 px-3 py-2 text-center backdrop-blur">
              <p className="text-xl font-black">{listQuery.data?.length ?? 0}</p>
              <p className="text-[10px] text-blue-100">{t('achievements.statTotal')}</p>
            </div>
            <div className="rounded-xl bg-white/10 px-3 py-2 text-center backdrop-blur">
              <p className="text-xl font-black">{new Set(listQuery.data?.map((a) => a.category_id)).size}</p>
              <p className="text-[10px] text-blue-100">{t('achievements.statCategories')}</p>
            </div>
            <div className="rounded-xl bg-white/10 px-3 py-2 text-center backdrop-blur">
              <p className="text-xl font-black">{listQuery.data?.filter((a) => a.file_url).length ?? 0}</p>
              <p className="text-[10px] text-blue-100">{t('achievements.statWithFiles')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Toolbar */}
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => {
            setShowForm(true)
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700 active:scale-98"
        >
          <PlusCircle className="h-4 w-4" />
          <span>{t('achievements.addNew')}</span>
        </button>

        <button
          type="button"
          onClick={() => setShowPdfModal(true)}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-xs font-bold text-slate-700 shadow-2xs transition hover:bg-slate-50 active:scale-98 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Download className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>{isKz ? '📄 Ресми PDF Резюме' : isRu ? '📄 Официальное PDF Резюме' : '📄 Export PDF CV'}</span>
        </button>
      </div>

      {/* PDF CV Export Modal */}
      {showPdfModal && (
        <ExportPdfResumeModal
          data={resumeData}
          onClose={() => setShowPdfModal(false)}
        />
      )}

      {/* Add achievement form */}
      {showForm && (
        <div className="ushqn-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#172B4D] dark:text-white">{t('achievements.newTitle')}</h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-[#6B778C] hover:text-[#172B4D] dark:hover:text-white">
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"/>
              </svg>
            </button>
          </div>
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={form.handleSubmit((v) => create.mutate(v))}>
            <div className="sm:col-span-2">
              <label className="ushqn-label">{t('achievements.nameLabel')}</label>
              <input className="ushqn-input" placeholder={t('achievements.namePlaceholder')} {...form.register('title')} />
              {form.formState.errors.title ? <p className="mt-1 text-xs text-red-600">{form.formState.errors.title.message}</p> : null}
            </div>
            <div>
              <label className="ushqn-label">{t('achievements.categoryLabel')}</label>
              <select className="ushqn-input" {...form.register('category_id')}>
                {(categoriesQuery.data ?? []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {CATEGORY_EMOJI[c.slug as string] ?? '🏅'} {c.label_ru}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="ushqn-label">{t('achievements.fileLabel')}</label>
              <label className="mt-1 flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-[#DFE1E6] bg-[#fafbfc] px-3 py-2.5 text-sm text-[#6B778C] hover:border-[#0052CC] hover:text-[#0052CC] transition">
                <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
                  <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688Z"/>
                </svg>
                {file ? file.name : t('achievements.pickFile')}
                <input
                  type="file"
                  accept={ALLOWED_UPLOAD_TYPES.join(',')}
                  className="sr-only"
                  onChange={(e) => {
                    const nextFile = e.target.files?.[0] ?? null
                    const error = nextFile ? validateUpload(nextFile) : null
                    if (error) {
                      toast(error, 'error')
                      e.target.value = ''
                      setFile(null)
                      return
                    }
                    setFile(nextFile)
                  }}
                />
              </label>
            </div>
            <div className="sm:col-span-2">
              <label className="ushqn-label">{t('achievements.descLabel')}</label>
              <textarea rows={3} className="ushqn-input resize-none" placeholder={t('achievements.descPlaceholder')} {...form.register('description')} />
            </div>
            <div className="flex items-center gap-3 sm:col-span-2">
              <button type="submit" disabled={create.isPending} className="ushqn-btn-primary px-6">
                {create.isPending ? t('achievements.savePending') : t('achievements.addButton')}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-[#DFE1E6] px-4 py-2 text-sm font-semibold text-[#6B778C] hover:bg-[#F4F5F7] transition">
                {t('common.cancel')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="ushqn-card p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('achievements.searchPlaceholder')}
            className="ushqn-input max-w-xs"
          />
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setFilterCategory('all')}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${filterCategory === 'all' ? 'border-[#0052CC] bg-[#0052CC] text-white' : 'border-[#DFE1E6] text-[#172B4D] hover:border-[#0052CC]'}`}>
              {t('common.all')}
            </button>
            {(categoriesQuery.data ?? []).map((c) => (
              <button key={c.id} type="button" onClick={() => setFilterCategory(c.id)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${filterCategory === c.id ? 'border-[#0052CC] bg-[#0052CC] text-white' : 'border-[#DFE1E6] text-[#172B4D] hover:border-[#0052CC]'}`}>
                {CATEGORY_EMOJI[c.slug as string] ?? '🏅'} {c.label_ru}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredList.length === 0 ? (
          <div className="ushqn-card flex flex-col items-center justify-center gap-3 py-14 text-center">
            <span className="text-5xl">🏅</span>
            <p className="text-base font-bold text-[#172B4D]">
              {search || filterCategory !== 'all' ? t('achievements.emptyFiltered') : t('achievements.emptyListTitle')}
            </p>
            <p className="text-sm text-[#6B778C]">
              {search || filterCategory !== 'all' ? t('achievements.emptyFilteredHint') : t('achievements.emptyListHint')}
            </p>
          </div>
        ) : (
          filteredList.map((a) => (
            <div key={a.id} className="ushqn-card flex flex-col gap-3 p-4 sm:flex-row sm:items-start transition-shadow hover:shadow-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#DEEBFF] to-[#B3D4FF] text-2xl">
                {CATEGORY_EMOJI[a.category_slug] ?? '🏅'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-[#172B4D]">{a.title}</p>
                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-[#6B778C]">
                  <span className="rounded-full bg-[#DEEBFF] px-2 py-0.5 font-semibold text-[#0052CC]">{a.category_label}</span>
                  {a.verification_status === 'verified' ? (
                    <>
                      <span className="font-semibold text-[#36B37E]">+{a.points_awarded} {t('achievements.points')}</span>
                      <span className="font-semibold text-[#36B37E]">{t('achievements.confirmed')}</span>
                    </>
                  ) : a.verification_status === 'rejected' ? (
                    <span className="font-semibold text-red-600">{isKz ? 'Қабылданбады' : isRu ? 'Отклонено' : 'Rejected'}</span>
                  ) : (
                    <span className="font-semibold text-amber-600">{isKz ? 'Тексерілуде' : isRu ? 'На проверке' : 'Pending review'}</span>
                  )}
                  <span>{format(new Date(a.created_at), 'PP', { locale: dateLocale })}</span>
                </div>
                {a.description ? <p className="mt-1.5 text-sm text-[#6B778C]">{a.description}</p> : null}
                {a.verification_status === 'rejected' && a.rejection_reason ? (
                  <p className="mt-1.5 text-xs font-medium text-red-600">{a.rejection_reason}</p>
                ) : null}
                {a.file_url ? (
                  <a href={a.file_url} target="_blank" rel="noreferrer"
                    className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-[#0052CC] hover:underline">
                    {t('achievements.openAttachment')}
                  </a>
                ) : null}
              </div>
              <button type="button" onClick={() => void remove(a.id, a.title)}
                className="shrink-0 self-start rounded-lg border border-red-100 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 transition">
                {t('common.delete')}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
