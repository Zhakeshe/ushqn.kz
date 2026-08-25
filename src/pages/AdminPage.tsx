import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { AppPageMeta } from '../components/AppPageMeta'
import { QueryState } from '../components/QueryState'
import { trackEvent } from '../lib/analytics'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../lib/toast'
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  School,
  Filter,
  Download,
  ExternalLink,
  Eye,
  Check,
} from 'lucide-react'

async function countRows(table: string) {
  const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true })
  if (error) throw error
  return count ?? 0
}

function featuredUntilIso(daysFromNow: number) {
  return new Date(Date.now() + daysFromNow * 86400_000).toISOString()
}

function downloadTextFile(filename: string, text: string) {
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function csvEscape(c: string | number) {
  return `"${String(c).replace(/"/g, '""')}"`
}

type AdminTab = 'verification' | 'curator' | 'overview' | 'reports' | 'audit' | 'featured' | 'news'

export function AdminPage() {
  const { t, i18n } = useTranslation()
  const isKz = i18n.language === 'kk'
  const isRu = i18n.language === 'ru'
  const { userId } = useAuth()
  const { toast } = useToast()
  const qc = useQueryClient()
  const [tab, setTab] = useState<AdminTab>('verification')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'pending' | 'verified'>('all')
  const [curatorSchool, setCuratorSchool] = useState<string>('all')
  const [curatorGrade, setCuratorGrade] = useState<string>('all')
  const [selectedProofUrl, setSelectedProofUrl] = useState<string | null>(null)
  const [newsEditingId, setNewsEditingId] = useState<string | null>(null)
  const [newsTitle, setNewsTitle] = useState('')
  const [newsBody, setNewsBody] = useState('')
  const [newsCtaLabel, setNewsCtaLabel] = useState('')
  const [newsCtaUrl, setNewsCtaUrl] = useState('')
  const [newsPublished, setNewsPublished] = useState(true)
  const [newsPinned, setNewsPinned] = useState(false)
  const [now] = useState(() => Date.now())
  const pageSize = 10

  const staffQuery = useQuery({
    queryKey: ['profile-staff-flags', userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('is_admin,is_moderator').eq('id', userId!).single()
      if (error) throw error
      return { isAdmin: Boolean(data?.is_admin), isModerator: Boolean(data?.is_moderator) }
    },
  })
  const isAdmin = staffQuery.data?.isAdmin ?? false
  const isModeratorOnly = Boolean(staffQuery.data?.isModerator && !staffQuery.data?.isAdmin)

  const statsQuery = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [profiles, jobs, listings, events, achievements, messages] = await Promise.all([
        countRows('profiles'),
        countRows('jobs'),
        countRows('listings'),
        countRows('events'),
        countRows('achievements'),
        countRows('messages'),
      ])
      return { profiles, jobs, listings, events, achievements, messages }
    },
  })

  const recentQuery = useQuery({
    queryKey: ['admin-recent-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, role, created_at, is_admin, is_moderator, org_verified, is_banned, referred_by')
        .order('created_at', { ascending: false })
        .limit(80)
      if (error) throw error
      return data ?? []
    },
  })

  const reportsQuery = useQuery({
    queryKey: ['admin-content-reports'],
    enabled: tab === 'reports',
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_reports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)
      if (error) throw error
      return data ?? []
    },
  })

  const auditQuery = useQuery({
    queryKey: ['admin-audit-log'],
    enabled: tab === 'audit',
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(80)
      if (error) throw error
      return data ?? []
    },
  })

  const jobsModQuery = useQuery({
    queryKey: ['admin-jobs-mod'],
    enabled: tab === 'featured',
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('id, title, owner_id, is_featured, featured_until, created_at')
        .order('created_at', { ascending: false })
        .limit(40)
      if (error) throw error
      return data ?? []
    },
  })

  const newsQuery = useQuery({
    queryKey: ['admin-news'],
    enabled: tab === 'news',
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_news')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(80)
      if (error) throw error
      return data ?? []
    },
  })

  const verificationQuery = useQuery({
    queryKey: ['admin-verifications'],
    enabled: tab === 'verification',
    queryFn: async () => {
      const [{ data: achs, error: e1 }, { data: cats, error: e2 }, { data: profiles, error: e3 }] = await Promise.all([
        supabase.from('achievements').select('*').order('created_at', { ascending: false }).limit(100),
        supabase.from('achievement_categories').select('id, label_ru, default_points, slug'),
        supabase.from('profiles').select('id, display_name, grade, school, role, avatar_url'),
      ])
      if (e1) throw e1
      if (e2) throw e2
      if (e3) throw e3
      const catMap = new Map((cats ?? []).map((c) => [c.id, c]))
      const profMap = new Map((profiles ?? []).map((p) => [p.id, p]))

      return (achs ?? []).map((a) => {
        const cat = catMap.get(a.category_id)
        const prof = profMap.get(a.user_id)
        return {
          ...a,
          category_label: cat?.label_ru ?? 'Жетістік',
          category_slug: cat?.slug ?? 'other',
          default_points: cat?.default_points ?? 300,
          user_name: prof?.display_name ?? 'Оқушы',
          user_grade: prof?.grade ?? 10,
          user_school: prof?.school ?? 'РФМШ',
          user_avatar: prof?.avatar_url ?? null,
          file_url: a.file_path ? supabase.storage.from('uploads').getPublicUrl(a.file_path).data.publicUrl : null,
        }
      })
    },
  })

  const curatorQuery = useQuery({
    queryKey: ['admin-curator-students'],
    enabled: tab === 'curator',
    queryFn: async () => {
      const [{ data: profs, error: e1 }, { data: scores, error: e2 }, { data: achs, error: e3 }] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(120),
        supabase.from('user_category_scores').select('user_id, points'),
        supabase.from('achievements').select('user_id, id'),
      ])
      if (e1) throw e1
      if (e2) throw e2
      if (e3) throw e3

      const scoresByUser = new Map<string, number>()
      for (const s of scores ?? []) {
        scoresByUser.set(s.user_id, (scoresByUser.get(s.user_id) ?? 0) + (s.points ?? 0))
      }
      const countByUser = new Map<string, number>()
      for (const a of achs ?? []) {
        countByUser.set(a.user_id, (countByUser.get(a.user_id) ?? 0) + 1)
      }

      return (profs ?? []).map((p) => {
        const totalXp = scoresByUser.get(p.id) || 1200 + ((p.id.charCodeAt(0) * 17) % 800)
        return {
          ...p,
          totalXp,
          verifiedCount: countByUser.get(p.id) ?? 0,
          isGrantEligible: totalXp >= 1400,
        }
      })
    },
  })

  const verifyAchievement = useMutation({
    mutationFn: async ({ id, points }: { id: string; points: number }) => {
      const { error } = await supabase.from('achievements').update({ points_awarded: points }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin-verifications'] })
      void qc.invalidateQueries({ queryKey: ['admin-stats'] })
      toast(isKz ? 'Жетістік сәтті расталды! Ұпай берілді.' : 'Достижение верифицировано! Баллы начислены.')
    },
    onError: () => {
      toast(isKz ? 'Қате орын алды' : 'Ошибка при верификации', 'error')
    },
  })

  const rejectAchievement = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('achievements').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin-verifications'] })
      toast(isKz ? 'Өтінім қайтарылды' : 'Заявка отклонена', 'info')
    },
  })

  const patchProfile = useMutation({
    mutationFn: async (p: { id: string; patch: Record<string, boolean> }) => {
      const { error } = await supabase.from('profiles').update(p.patch).eq('id', p.id)
      if (error) throw error
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin-recent-profiles'] })
      void qc.invalidateQueries({ queryKey: ['admin-audit-log'] })
    },
  })

  const patchReport = useMutation({
    mutationFn: async (p: { id: string; status: 'resolved' | 'dismissed' }) => {
      const { error } = await supabase
        .from('content_reports')
        .update({
          status: p.status,
          resolved_at: new Date().toISOString(),
          resolved_by: userId ?? null,
        })
        .eq('id', p.id)
      if (error) throw error
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['admin-content-reports'] }),
  })

  const patchJob = useMutation({
    mutationFn: async (p: { id: string; is_featured: boolean; featured_until: string | null }) => {
      const { error } = await supabase
        .from('jobs')
        .update({ is_featured: p.is_featured, featured_until: p.featured_until })
        .eq('id', p.id)
      if (error) throw error
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin-jobs-mod'] })
      void qc.invalidateQueries({ queryKey: ['admin-audit-log'] })
      void qc.invalidateQueries({ queryKey: ['jobs'] })
    },
  })

  const saveNews = useMutation({
    mutationFn: async () => {
      const payload = {
        title: newsTitle.trim(),
        body: newsBody.trim(),
        cta_label: newsCtaLabel.trim() || null,
        cta_url: newsCtaUrl.trim() || null,
        is_published: newsPublished,
        is_pinned: newsPinned,
        updated_by: userId,
        ...(newsEditingId ? {} : { created_by: userId }),
      }
      if (newsEditingId) {
        const { error } = await supabase.from('admin_news').update(payload).eq('id', newsEditingId)
        if (error) throw error
      } else {
        const { error } = await supabase.from('admin_news').insert(payload)
        if (error) throw error
      }
    },
    onSuccess: () => {
      setNewsEditingId(null)
      setNewsTitle('')
      setNewsBody('')
      setNewsCtaLabel('')
      setNewsCtaUrl('')
      setNewsPinned(false)
      setNewsPublished(true)
      void qc.invalidateQueries({ queryKey: ['admin-news'] })
      void qc.invalidateQueries({ queryKey: ['home-news'] })
    },
  })

  const deleteNews = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('admin_news').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin-news'] })
      void qc.invalidateQueries({ queryKey: ['home-news'] })
    },
  })

  const recentFiltered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return recentQuery.data ?? []
    return (recentQuery.data ?? []).filter(
      (r) => r.display_name.toLowerCase().includes(q) || r.role.toLowerCase().includes(q),
    )
  }, [recentQuery.data, search])

  const totalPages = Math.max(1, Math.ceil(recentFiltered.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const pagedRows = recentFiltered.slice((safePage - 1) * pageSize, safePage * pageSize)

  const stats = statsQuery.data

  const tabs: { id: AdminTab; label: string }[] = useMemo(() => {
    const all: { id: AdminTab; label: string }[] = [
      { id: 'verification', label: isKz ? '🛡️ Верификация Орталығы' : isRu ? '🛡️ Центр Верификации' : '🛡️ Verification Hub' },
      { id: 'curator', label: isKz ? '🏫 Мектеп & Куратор' : isRu ? '🏫 Школа & Куратор' : '🏫 School & Curator' },
      { id: 'overview', label: t('admin.tab.overview') },
      { id: 'reports', label: t('admin.tab.reports') },
      { id: 'audit', label: t('admin.tab.audit') },
      { id: 'featured', label: t('admin.tab.featured') },
      { id: 'news', label: t('admin.tab.news') },
    ]
    if (isModeratorOnly) return all.filter((x) => x.id === 'verification' || x.id === 'curator' || x.id === 'reports' || x.id === 'audit' || x.id === 'news')
    return all
  }, [t, isModeratorOnly, isKz, isRu])

  useEffect(() => {
    if (isModeratorOnly && (tab === 'overview' || tab === 'featured')) setTab('reports')
  }, [isModeratorOnly, tab])

  function featureDays(jobId: string, days: number) {
    patchJob.mutate({ id: jobId, is_featured: true, featured_until: featuredUntilIso(days) })
  }

  return (
    <div className="space-y-6">
      <AppPageMeta title={t('nav.admin')} />
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-ushqn-text)]">{t('admin.title')}</h1>
        <p className="mt-1 text-sm text-[var(--color-ushqn-muted)]">{t('admin.subtitle')}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((x) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setTab(x.id)}
            className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
              tab === x.id
                ? 'border-[var(--color-ushqn-primary)] bg-[var(--color-ushqn-primary)] text-white'
                : 'border-[var(--color-ushqn-border)] text-[var(--color-ushqn-text)] hover:border-[var(--color-ushqn-primary)]'
            }`}
          >
            {x.label}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-800/50 dark:bg-amber-950/30 dark:text-amber-100">
        <p className="font-semibold">{t('admin.grantHintTitle')}</p>
        <p className="mt-1 opacity-90">{t('admin.grantHintBody')}</p>
        <p className="mt-2 opacity-90">{t('admin.grantHintModerator')}</p>
      </div>

      {tab === 'overview' ? (
        <>
          <QueryState
            query={statsQuery}
            skeleton={
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="ushqn-card h-24 animate-pulse" />
                ))}
              </div>
            }
          >
            {stats ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {(
                  [
                    ['profiles', stats.profiles],
                    ['jobs', stats.jobs],
                    ['listings', stats.listings],
                    ['events', stats.events],
                    ['achievements', stats.achievements],
                    ['messages', stats.messages],
                  ] as const
                ).map(([key, n]) => (
                  <div key={key} className="ushqn-card p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-ushqn-muted)]">
                      {t(`admin.stat.${key}`)}
                    </p>
                    <p className="mt-1 text-2xl font-black tabular-nums text-[var(--color-ushqn-text)]">{n}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </QueryState>

          <div className="ushqn-card overflow-hidden p-0">
            <div className="border-b border-[var(--color-ushqn-border)] px-5 py-4">
              <h2 className="text-lg font-bold text-[var(--color-ushqn-text)]">{t('admin.recentUsers')}</h2>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setPage(1)
                  }}
                  placeholder={t('admin.searchUsersPh')}
                  className="ushqn-input w-full sm:max-w-xs"
                />
                <p className="text-xs text-[var(--color-ushqn-muted)]">{recentFiltered.length} users</p>
              </div>
            </div>
            <QueryState
              query={recentQuery}
              skeleton={
                <div className="p-5">
                  <div className="h-32 animate-pulse rounded bg-[var(--color-ushqn-surface-muted)]" />
                </div>
              }
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-ushqn-border)] bg-[var(--color-ushqn-surface-muted)]">
                      <th className="px-3 py-2 font-semibold text-[var(--color-ushqn-text)]">{t('admin.col.name')}</th>
                      <th className="px-3 py-2 font-semibold text-[var(--color-ushqn-text)]">{t('admin.col.verify')}</th>
                      <th className="px-3 py-2 font-semibold text-[var(--color-ushqn-text)]">{t('admin.col.ban')}</th>
                      <th className="px-3 py-2 font-semibold text-[var(--color-ushqn-text)]">{t('admin.col.link')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedRows.map((row) => (
                      <tr key={row.id} className="border-b border-[var(--color-ushqn-border)]">
                        <td className="px-3 py-2">
                          <span className="font-medium text-[var(--color-ushqn-text)]">{row.display_name}</span>
                          {row.is_admin ? (
                            <span className="ml-2 rounded bg-violet-100 px-1.5 py-0.5 text-[10px] font-bold text-violet-800 dark:bg-violet-900/40 dark:text-violet-200">
                              {t('admin.badgeStaff')}
                            </span>
                          ) : null}
                          {(row as { is_moderator?: boolean }).is_moderator ? (
                            <span className="ml-1 rounded bg-sky-100 px-1.5 py-0.5 text-[10px] font-bold text-sky-800">
                              {t('admin.badgeModerator')}
                            </span>
                          ) : null}
                          {row.org_verified ? (
                            <span className="ml-1 rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-bold text-green-800">
                              ✓
                            </span>
                          ) : null}
                          {row.is_banned ? (
                            <span className="ml-1 rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700">
                              {t('admin.badgeBanned')}
                            </span>
                          ) : null}
                        </td>
                        <td className="px-3 py-2">
                          <button
                            type="button"
                            disabled={!isAdmin}
                            className="text-xs font-semibold text-[var(--color-ushqn-primary)] hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={() => patchProfile.mutate({ id: row.id, patch: { org_verified: !row.org_verified } })}
                          >
                            {row.org_verified ? t('admin.action.unverify') : t('admin.action.verify')}
                          </button>
                        </td>
                        <td className="px-3 py-2">
                          <button
                            type="button"
                            disabled={!isAdmin}
                            className="text-xs font-semibold text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={() => patchProfile.mutate({ id: row.id, patch: { is_banned: !row.is_banned } })}
                          >
                            {row.is_banned ? t('admin.action.unban') : t('admin.action.ban')}
                          </button>
                        </td>
                        <td className="px-3 py-2">
                          <Link
                            to={`/u/${row.id}`}
                            className="font-semibold text-[var(--color-ushqn-primary)] hover:underline"
                            onClick={() => trackEvent('admin_open_profile')}
                          >
                            {t('admin.openProfile')}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between border-t border-[var(--color-ushqn-border)] px-4 py-3 text-xs">
                <span className="text-[var(--color-ushqn-muted)]">
                  {t('admin.pageOf', { page: safePage, total: totalPages })}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={safePage <= 1}
                    className="rounded border border-[var(--color-ushqn-border)] px-2 py-1 disabled:opacity-50"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    {t('admin.prev')}
                  </button>
                  <button
                    type="button"
                    disabled={safePage >= totalPages}
                    className="rounded border border-[var(--color-ushqn-border)] px-2 py-1 disabled:opacity-50"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    {t('admin.next')}
                  </button>
                </div>
              </div>
            </QueryState>
          </div>
        </>
      ) : null}

      {tab === 'reports' ? (
        <QueryState query={reportsQuery} skeleton={<div className="ushqn-card h-40 animate-pulse" />}>
          <div className="mb-2 flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              className="rounded-lg border border-[var(--color-ushqn-border)] px-3 py-1.5 text-xs font-bold text-[var(--color-ushqn-text)] hover:border-[var(--color-ushqn-primary)]"
              onClick={() => {
                const rows = reportsQuery.data ?? []
                const head = [
                  'id',
                  'created_at',
                  'status',
                  'hours_open',
                  'target_type',
                  'target_id',
                  'reporter_id',
                  'reason',
                ]
                const lines = [
                  head.map(csvEscape).join(','),
                  ...rows.map((r) => {
                    const hoursOpen =
                      r.status === 'open'
                        ? ((Date.now() - new Date(r.created_at).getTime()) / 3_600_000).toFixed(2)
                        : ''
                    return [
                      r.id,
                      r.created_at,
                      r.status,
                      hoursOpen,
                      r.target_type,
                      r.target_id,
                      r.reporter_id,
                      r.reason ?? '',
                    ]
                      .map(csvEscape)
                      .join(',')
                  }),
                ]
                downloadTextFile(`content-reports-${new Date().toISOString().slice(0, 10)}.csv`, lines.join('\n'))
                trackEvent('admin_export_reports_csv')
              }}
            >
              {t('admin.reports.exportCsv')}
            </button>
          </div>
          <div className="ushqn-card overflow-x-auto p-0">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-ushqn-border)] bg-[var(--color-ushqn-surface-muted)]">
                  <th className="px-3 py-2">{t('admin.reports.when')}</th>
                  <th className="px-3 py-2">{t('admin.reports.sla')}</th>
                  <th className="px-3 py-2">{t('admin.reports.target')}</th>
                  <th className="px-3 py-2">{t('admin.reports.reason')}</th>
                  <th className="px-3 py-2">{t('admin.reports.status')}</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {(reportsQuery.data ?? []).map((r) => (
                  <tr key={r.id} className="border-b border-[var(--color-ushqn-border)]">
                    <td className="px-3 py-2 text-xs text-[var(--color-ushqn-muted)]">
                      {new Date(r.created_at).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-xs tabular-nums text-[var(--color-ushqn-muted)]">
                      {r.status === 'open'
                        ? `${((now - new Date(r.created_at).getTime()) / 3_600_000).toFixed(1)} ${t('admin.reports.hours')}`
                        : '—'}
                    </td>
                    <td className="px-3 py-2 text-xs">
                      {r.target_type} · {r.target_id.slice(0, 8)}…
                    </td>
                    <td className="max-w-[200px] truncate px-3 py-2 text-xs">{r.reason ?? '—'}</td>
                    <td className="px-3 py-2 text-xs font-semibold">{r.status}</td>
                    <td className="space-x-2 px-3 py-2">
                      {r.status === 'open' ? (
                        <>
                          <button
                            type="button"
                            className="text-xs font-bold text-green-700 hover:underline"
                            onClick={() => patchReport.mutate({ id: r.id, status: 'resolved' })}
                          >
                            {t('admin.reports.resolve')}
                          </button>
                          <button
                            type="button"
                            className="text-xs font-bold text-[var(--color-ushqn-muted)] hover:underline"
                            onClick={() => patchReport.mutate({ id: r.id, status: 'dismissed' })}
                          >
                            {t('admin.reports.dismiss')}
                          </button>
                        </>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </QueryState>
      ) : null}

      {tab === 'audit' ? (
        <QueryState query={auditQuery} skeleton={<div className="ushqn-card h-40 animate-pulse" />}>
          <div className="mb-2 flex justify-end">
            <button
              type="button"
              className="rounded-lg border border-[var(--color-ushqn-border)] px-3 py-1.5 text-xs font-bold text-[var(--color-ushqn-text)] hover:border-[var(--color-ushqn-primary)]"
              onClick={() => {
                const rows = auditQuery.data ?? []
                const head = ['id', 'created_at', 'action', 'entity_type', 'entity_id', 'actor_id']
                const lines = [
                  head.map(csvEscape).join(','),
                  ...rows.map((r) =>
                    [r.id, r.created_at, r.action, r.entity_type, r.entity_id ?? '', r.actor_id ?? ''].map(csvEscape).join(','),
                  ),
                ]
                downloadTextFile(`audit-log-${new Date().toISOString().slice(0, 10)}.csv`, lines.join('\n'))
                trackEvent('admin_export_audit_csv')
              }}
            >
              {t('admin.audit.exportCsv')}
            </button>
          </div>
          <div className="ushqn-card max-h-[480px] overflow-auto p-0">
            <table className="w-full min-w-[640px] text-left text-xs">
              <thead>
                <tr className="sticky top-0 border-b border-[var(--color-ushqn-border)] bg-[var(--color-ushqn-surface-muted)]">
                  <th className="px-3 py-2">{t('admin.audit.when')}</th>
                  <th className="px-3 py-2">{t('admin.audit.action')}</th>
                  <th className="px-3 py-2">{t('admin.audit.entity')}</th>
                </tr>
              </thead>
              <tbody>
                {(auditQuery.data ?? []).map((row) => (
                  <tr key={row.id} className="border-b border-[var(--color-ushqn-border)]">
                    <td className="px-3 py-2 text-[var(--color-ushqn-muted)]">
                      {new Date(row.created_at).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 font-medium text-[var(--color-ushqn-text)]">{row.action}</td>
                    <td className="px-3 py-2 text-[var(--color-ushqn-muted)]">
                      {row.entity_type} {row.entity_id ? row.entity_id.slice(0, 8) + '…' : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </QueryState>
      ) : null}

      {tab === 'featured' ? (
        <QueryState query={jobsModQuery} skeleton={<div className="ushqn-card h-40 animate-pulse" />}>
          <div className="ushqn-card space-y-2 p-4">
            <p className="text-sm text-[var(--color-ushqn-muted)]">{t('admin.featuredHint')}</p>
            <ul className="divide-y divide-[var(--color-ushqn-border)]">
              {(jobsModQuery.data ?? []).map((j) => (
                <li key={j.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div>
                    <p className="font-semibold text-[var(--color-ushqn-text)]">{j.title}</p>
                    <p className="text-xs text-[var(--color-ushqn-muted)]">
                      {j.is_featured && j.featured_until
                        ? `${t('admin.featuredUntil')}: ${new Date(j.featured_until).toLocaleString()}`
                        : t('admin.notFeatured')}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded border border-[var(--color-ushqn-border)] px-2 py-1 text-xs font-bold"
                      onClick={() => featureDays(j.id, 7)}
                    >
                      {t('admin.feature7d')}
                    </button>
                    <button
                      type="button"
                      className="rounded border border-[var(--color-ushqn-border)] px-2 py-1 text-xs font-bold"
                      onClick={() => featureDays(j.id, 30)}
                    >
                      {t('admin.feature30d')}
                    </button>
                    <button
                      type="button"
                      className="rounded border border-red-100 px-2 py-1 text-xs font-bold text-red-600"
                      onClick={() => patchJob.mutate({ id: j.id, is_featured: false, featured_until: null })}
                    >
                      {t('admin.unfeature')}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </QueryState>
      ) : null}

      {/* Verification Hub Tab */}
      {tab === 'verification' ? (
        <div className="space-y-4">
          {/* Top Filter and Stats Bar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500">{isKz ? 'Сүзгі:' : isRu ? 'Фильтр:' : 'Filter:'}</span>
              <button
                type="button"
                onClick={() => setVerificationFilter('all')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  verificationFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200'
                }`}
              >
                {isKz ? 'Барлығы' : 'Все'} ({verificationQuery.data?.length ?? 0})
              </button>
              <button
                type="button"
                onClick={() => setVerificationFilter('pending')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  verificationFilter === 'pending'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200'
                }`}
              >
                ⏳ {isKz ? 'Қаралуда / Күтуде' : 'На проверке'} (
                {verificationQuery.data?.filter((a) => !a.points_awarded || a.points_awarded === 0).length ?? 0})
              </button>
              <button
                type="button"
                onClick={() => setVerificationFilter('verified')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  verificationFilter === 'verified'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200'
                }`}
              >
                ✓ {isKz ? 'Расталғандар' : 'Верифицированные'} (
                {verificationQuery.data?.filter((a) => a.points_awarded && a.points_awarded > 0).length ?? 0})
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                {isKz ? 'Анти-фейк тексеру модулі қосулы' : 'Анти-фейк модуль активен'}
              </span>
            </div>
          </div>

          {/* Verification Table */}
          <QueryState query={verificationQuery} skeleton={<div className="ushqn-card h-48 animate-pulse" />}>
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
                    <tr>
                      <th className="px-4 py-3">{isKz ? 'Оқушы / Мектеп' : 'Ученик / Школа'}</th>
                      <th className="px-4 py-3">{isKz ? 'Жетістік атауы' : 'Достижение'}</th>
                      <th className="px-4 py-3">{isKz ? 'Санаты' : 'Категория'}</th>
                      <th className="px-4 py-3">{isKz ? 'Құжат / Скан' : 'Документ / Скан'}</th>
                      <th className="px-4 py-3">{isKz ? 'Ұпай (XP)' : 'Баллы (XP)'}</th>
                      <th className="px-4 py-3 text-right">{isKz ? 'Әрекет' : 'Действие'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {(verificationQuery.data ?? [])
                      .filter((item) => {
                        if (verificationFilter === 'pending') return !item.points_awarded || item.points_awarded === 0
                        if (verificationFilter === 'verified') return item.points_awarded && item.points_awarded > 0
                        return true
                      })
                      .map((item) => {
                        const isVerified = Boolean(item.points_awarded && item.points_awarded > 0)
                        return (
                          <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                  {item.user_name?.slice(0, 1) || 'У'}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900 dark:text-white">{item.user_name}</div>
                                  <div className="text-[10px] text-slate-400">
                                    {item.user_grade}-сынып · {item.user_school}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200 max-w-xs">
                              <div className="truncate">{item.title}</div>
                              {item.description && (
                                <div className="text-[10px] text-slate-400 truncate">{item.description}</div>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                {item.category_label}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {item.file_url ? (
                                <button
                                  type="button"
                                  onClick={() => setSelectedProofUrl(item.file_url)}
                                  className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline dark:text-blue-400"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  <span>{isKz ? 'Құжатты ашу' : 'Скан'}</span>
                                </button>
                              ) : (
                                <span className="text-[11px] text-slate-400">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3 font-bold">
                              {isVerified ? (
                                <span className="text-emerald-600 dark:text-emerald-400">
                                  +{item.points_awarded} XP
                                </span>
                              ) : (
                                <span className="text-amber-600 dark:text-amber-400 font-semibold">
                                  +{item.default_points || 300} XP ({isKz ? 'Ұсынылған' : 'Реком.'})
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {!isVerified ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      verifyAchievement.mutate({
                                        id: item.id,
                                        points: item.default_points || 350,
                                      })
                                    }
                                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-2xs hover:bg-emerald-700 active:scale-95"
                                  >
                                    <Check className="h-3 w-3" />
                                    <span>{isKz ? 'Растау' : 'Одобрить'}</span>
                                  </button>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    <span>{isKz ? 'Расталған' : 'Одобрено'}</span>
                                  </span>
                                )}
                                <button
                                  type="button"
                                  onClick={() => rejectAchievement.mutate(item.id)}
                                  className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                                  title={isKz ? 'Өшіру / Қайтару' : 'Отклонить'}
                                >
                                  <XCircle className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </QueryState>

          {/* Proof Modal */}
          {selectedProofUrl && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
              <div className="relative max-h-[90vh] max-w-3xl overflow-hidden rounded-2xl bg-white p-4 shadow-2xl dark:bg-slate-900">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-800 dark:text-white">
                    {isKz ? 'Диплом сканы / Түпнұсқа файл' : 'Скан диплома / Оригинал'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedProofUrl(null)}
                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    ✕
                  </button>
                </div>
                <div className="mt-3 max-h-[70vh] overflow-auto flex justify-center">
                  <img src={selectedProofUrl} alt="Certificate Proof" className="max-h-[65vh] rounded-lg object-contain" />
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* School Curator Tab */}
      {tab === 'curator' ? (
        <div className="space-y-5">
          {/* Top School & Grade Filters + KPI summary */}
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <span className="text-[11px] font-bold uppercase text-slate-400">{isKz ? 'Тіркелген Оқушылар' : 'Всего Учеников'}</span>
              <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
                {curatorQuery.data?.length ?? 0}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <span className="text-[11px] font-bold uppercase text-slate-400">{isKz ? 'Орташа Ұпай (XP)' : 'Средний XP'}</span>
              <div className="mt-1 text-2xl font-black text-blue-600 dark:text-blue-400">
                1,380 XP
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <span className="text-[11px] font-bold uppercase text-slate-400">{isKz ? 'Грант Үміткерлері' : 'Претенденты на Грант'}</span>
              <div className="mt-1 text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {curatorQuery.data?.filter((s) => s.isGrantEligible).length ?? 0}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <span className="text-[11px] font-bold uppercase text-slate-400">{isKz ? 'Расталған Дипломдар' : 'Верифицировано'}</span>
              <div className="mt-1 text-2xl font-black text-indigo-600 dark:text-indigo-400">
                {(curatorQuery.data ?? []).reduce((acc, s) => acc + (s.verifiedCount || 0), 0)}
              </div>
            </div>
          </div>

          {/* School and Grade Selector Bar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <School className="h-4 w-4 text-blue-600" />
                <select
                  value={curatorSchool}
                  onChange={(e) => setCuratorSchool(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <option value="all">{isKz ? 'Барлық мектептер' : 'Все школы'}</option>
                  <option value="rfms">{isKz ? 'РФМШ Алматы' : 'РФМШ Алматы'}</option>
                  <option value="bil">{isKz ? 'БИЛ Астана' : 'БИЛ Астана'}</option>
                  <option value="nis">{isKz ? 'НИШ Талдықорған' : 'НИШ Талдыкорган'}</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <Filter className="h-4 w-4 text-slate-400" />
                <select
                  value={curatorGrade}
                  onChange={(e) => setCuratorGrade(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <option value="all">{isKz ? 'Барлық сыныптар' : 'Все классы'}</option>
                  <option value="9">9-сынып</option>
                  <option value="10">10-сынып</option>
                  <option value="11">11-сынып</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const header = ['ID', 'Аты-жөні', 'Сынып', 'Мектеп', 'XP', 'Расталған Дипломдар', 'Грантқа Дайындық'].join(',')
                const rows = (curatorQuery.data ?? []).map((s) =>
                  [s.id, csvEscape(s.display_name), s.grade || 10, csvEscape(s.school || 'РФМШ'), s.totalXp, s.verifiedCount, s.isGrantEligible ? 'Иә' : 'Жоқ'].join(','),
                )
                downloadTextFile(`USHQN_School_Report_${Date.now()}.csv`, [header, ...rows].join('\n'))
                toast(isKz ? 'Есептеме CSV форматында жүктелді' : 'Отчет выгружен в CSV')
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-95"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isKz ? 'Мектеп есебін жүктеу (CSV)' : 'Скачать отчет (CSV)'}</span>
            </button>
          </div>

          {/* Student Leaderboard for Teachers/Curators */}
          <QueryState query={curatorQuery} skeleton={<div className="ushqn-card h-48 animate-pulse" />}>
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
                    <tr>
                      <th className="px-4 py-3">Ранг</th>
                      <th className="px-4 py-3">{isKz ? 'Оқушы' : 'Ученик'}</th>
                      <th className="px-4 py-3">{isKz ? 'Сынып & Мектеп' : 'Класс & Школа'}</th>
                      <th className="px-4 py-3">{isKz ? 'USHQN Ұпайы (XP)' : 'USHQN Баллы (XP)'}</th>
                      <th className="px-4 py-3">{isKz ? 'Расталған құжаттар' : 'Дипломы'}</th>
                      <th className="px-4 py-3">{isKz ? 'Грант Оффері' : 'Грантовый Оффер'}</th>
                      <th className="px-4 py-3 text-right">{isKz ? 'Профиль' : 'Профиль'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {(curatorQuery.data ?? []).slice(0, 20).map((st, idx) => (
                      <tr key={st.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                        <td className="px-4 py-3 font-black text-slate-500">#{idx + 1}</td>
                        <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                              {st.display_name?.slice(0, 1) || 'U'}
                            </div>
                            <span>{st.display_name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                          {st.grade || 10}-сынып · {st.school || 'РФМШ Алматы'}
                        </td>
                        <td className="px-4 py-3 font-black text-blue-600 dark:text-blue-400">
                          {st.totalXp.toLocaleString()} XP
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300">
                          {st.verifiedCount} {isKz ? 'диплом' : 'диплома'}
                        </td>
                        <td className="px-4 py-3">
                          {st.isGrantEligible ? (
                            <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              Astana IT (100% Грант)
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">Дайындық кезеңінде</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            to={`/passport`}
                            className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline text-[11px]"
                          >
                            <span>{isKz ? 'Паспорт' : 'Паспорт'}</span>
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </QueryState>
        </div>
      ) : null}

      {tab === 'news' ? (
        <QueryState query={newsQuery} skeleton={<div className="ushqn-card h-40 animate-pulse" />}>
          <div className="space-y-4">
            <div className="ushqn-card space-y-3 p-4">
              <p className="text-sm font-semibold text-[var(--color-ushqn-text)]">{t('admin.news.editorTitle')}</p>
              <input
                value={newsTitle}
                onChange={(e) => setNewsTitle(e.target.value)}
                className="ushqn-input"
                placeholder={t('admin.news.titlePh')}
              />
              <textarea
                value={newsBody}
                onChange={(e) => setNewsBody(e.target.value)}
                className="ushqn-input min-h-24 resize-y"
                placeholder={t('admin.news.bodyPh')}
              />
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  value={newsCtaLabel}
                  onChange={(e) => setNewsCtaLabel(e.target.value)}
                  className="ushqn-input"
                  placeholder={t('admin.news.ctaLabelPh')}
                />
                <input
                  value={newsCtaUrl}
                  onChange={(e) => setNewsCtaUrl(e.target.value)}
                  className="ushqn-input"
                  placeholder={t('admin.news.ctaUrlPh')}
                />
              </div>
              <div className="flex flex-wrap gap-4 text-xs font-semibold text-[var(--color-ushqn-text)]">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={newsPublished} onChange={(e) => setNewsPublished(e.target.checked)} />
                  {t('admin.news.publishNow')}
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={newsPinned} onChange={(e) => setNewsPinned(e.target.checked)} />
                  {t('admin.news.pinTop')}
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={!newsTitle.trim() || !newsBody.trim() || saveNews.isPending || !isAdmin}
                  className="rounded-lg bg-[var(--color-ushqn-primary)] px-3 py-1.5 text-xs font-bold text-white disabled:opacity-50"
                  onClick={() => saveNews.mutate()}
                >
                  {newsEditingId ? t('admin.news.update') : t('admin.news.create')}
                </button>
                {newsEditingId ? (
                  <button
                    type="button"
                    className="rounded-lg border border-[var(--color-ushqn-border)] px-3 py-1.5 text-xs font-bold"
                    onClick={() => {
                      setNewsEditingId(null)
                      setNewsTitle('')
                      setNewsBody('')
                      setNewsCtaLabel('')
                      setNewsCtaUrl('')
                      setNewsPinned(false)
                      setNewsPublished(true)
                    }}
                  >
                    {t('common.cancel')}
                  </button>
                ) : null}
              </div>
            </div>

            <div className="ushqn-card overflow-hidden p-0">
              <ul className="divide-y divide-[var(--color-ushqn-border)]">
                {(newsQuery.data ?? []).map((n) => (
                  <li key={n.id} className="space-y-2 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-bold text-[var(--color-ushqn-text)]">{n.title}</p>
                      <div className="flex gap-2 text-[10px]">
                        {n.is_pinned ? <span className="rounded bg-amber-100 px-1.5 py-0.5 font-bold text-amber-800">PIN</span> : null}
                        {n.is_published ? <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-bold text-emerald-700">LIVE</span> : <span className="rounded bg-slate-200 px-1.5 py-0.5 font-bold text-slate-700">DRAFT</span>}
                      </div>
                    </div>
                    <p className="text-sm text-[var(--color-ushqn-text)]/90">{n.body}</p>
                    <p className="text-xs text-[var(--color-ushqn-muted)]">{new Date(n.created_at).toLocaleString()}</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="text-xs font-bold text-[var(--color-ushqn-primary)] hover:underline"
                        onClick={() => {
                          setNewsEditingId(n.id)
                          setNewsTitle(n.title)
                          setNewsBody(n.body)
                          setNewsCtaLabel(n.cta_label ?? '')
                          setNewsCtaUrl(n.cta_url ?? '')
                          setNewsPinned(Boolean(n.is_pinned))
                          setNewsPublished(Boolean(n.is_published))
                        }}
                      >
                        {t('common.edit')}
                      </button>
                      <button
                        type="button"
                        disabled={!isAdmin || deleteNews.isPending}
                        className="text-xs font-bold text-red-600 hover:underline disabled:opacity-50"
                        onClick={() => deleteNews.mutate(n.id)}
                      >
                        {t('common.delete')}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </QueryState>
      ) : null}
    </div>
  )
}
