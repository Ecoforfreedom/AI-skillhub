'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Play, RefreshCw, Eye, EyeOff, Edit2, Trash2, CheckCircle, XCircle,
  Activity, Database, Zap, AlertTriangle, ChevronLeft, ChevronRight, Lock, X
} from 'lucide-react'

// ────────────────────────────────────────────────────────────────────────────
// Auth gate
// ────────────────────────────────────────────────────────────────────────────
function useAdminAuth() {
  const [pwd, setPwd] = useState<string | null>(null)
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('admin_pwd')
    if (stored) { setPwd(stored); setAuthed(true) }
  }, [])

  function login(p: string) {
    localStorage.setItem('admin_pwd', p)
    setPwd(p)
    setAuthed(true)
  }

  function logout() {
    localStorage.removeItem('admin_pwd')
    setPwd(null)
    setAuthed(false)
  }

  function headers() {
    return { 'x-admin-password': pwd || '', 'Content-Type': 'application/json' }
  }

  return { authed, login, logout, headers }
}

// ────────────────────────────────────────────────────────────────────────────
// Stat card
// ────────────────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <div className={`rounded-xl border bg-gray-900 p-5 flex items-center gap-4 ${color}`}>
      <div className="p-2.5 rounded-lg bg-gray-800">{icon}</div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Toast notification
// ────────────────────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }: { msg: string; type: 'ok' | 'err'; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t) }, [onClose])
  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg border px-4 py-3 shadow-xl text-sm ${
      type === 'ok' ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-red-500/30 bg-red-500/10 text-red-300'
    }`}>
      {type === 'ok' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
      {msg}
      <button onClick={onClose}><X className="h-3.5 w-3.5" /></button>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Main Admin page
// ────────────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const { authed, login, logout, headers } = useAdminAuth()
  const [tab, setTab] = useState<'dashboard' | 'skills' | 'crawl_logs' | 'enrich_logs'>('dashboard')
  const [stats, setStats] = useState<any>(null)
  const [skills, setSkills] = useState<any[]>([])
  const [skillTotal, setSkillTotal] = useState(0)
  const [skillPage, setSkillPage] = useState(1)
  const [skillFilter, setSkillFilter] = useState('all')
  const [crawlLogs, setCrawlLogs] = useState<any[]>([])
  const [enrichLogs, setEnrichLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)
  const [editSkill, setEditSkill] = useState<any | null>(null)

  const showToast = (msg: string, type: 'ok' | 'err' = 'ok') => setToast({ msg, type })

  // ── Data fetchers ──────────────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    const res = await fetch('/api/admin/stats', { headers: headers() })
    if (res.ok) setStats(await res.json())
  }, [headers])

  const fetchSkills = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/admin/skills?page=${skillPage}&pageSize=20&filter=${skillFilter}`, { headers: headers() })
    if (res.ok) {
      const d = await res.json()
      setSkills(d.skills)
      setSkillTotal(d.total)
    }
    setLoading(false)
  }, [skillPage, skillFilter, headers])

  const fetchCrawlLogs = useCallback(async () => {
    const res = await fetch('/api/admin/logs?type=crawl', { headers: headers() })
    if (res.ok) { const d = await res.json(); setCrawlLogs(d.logs || []) }
  }, [headers])

  const fetchEnrichLogs = useCallback(async () => {
    const res = await fetch('/api/admin/logs?type=enrichment', { headers: headers() })
    if (res.ok) { const d = await res.json(); setEnrichLogs(d.logs || []) }
  }, [headers])

  useEffect(() => {
    if (!authed) return
    fetchStats()
  }, [authed, fetchStats])

  useEffect(() => {
    if (!authed) return
    if (tab === 'skills') fetchSkills()
    else if (tab === 'crawl_logs') fetchCrawlLogs()
    else if (tab === 'enrich_logs') fetchEnrichLogs()
  }, [authed, tab, fetchSkills, fetchCrawlLogs, fetchEnrichLogs])

  // ── Actions ────────────────────────────────────────────────────────────────
  async function runCrawl(source: string) {
    setLoading(true)
    const res = await fetch('/api/admin/crawl', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ source }),
    })
    setLoading(false)
    if (res.ok) showToast(`Crawl (${source}) started in background`)
    else showToast('Crawl failed', 'err')
  }

  async function runEnrich(limit = 10) {
    setLoading(true)
    const res = await fetch('/api/admin/enrich', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ limit }),
    })
    setLoading(false)
    if (res.ok) showToast(`Enrichment started (limit: ${limit})`)
    else showToast('Enrichment failed', 'err')
  }

  async function toggleHide(id: string, hidden: boolean) {
    const res = await fetch(`/api/admin/skills/${id}`, {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify({ isHidden: !hidden }),
    })
    if (res.ok) { showToast('Updated'); fetchSkills() }
    else showToast('Update failed', 'err')
  }

  async function toggleActive(id: string, active: boolean) {
    const res = await fetch(`/api/admin/skills/${id}`, {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify({ isActive: !active }),
    })
    if (res.ok) { showToast('Updated'); fetchSkills() }
    else showToast('Update failed', 'err')
  }

  async function saveEdit() {
    if (!editSkill) return
    const res = await fetch(`/api/admin/skills/${editSkill.id}`, {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify({
        name: editSkill.name,
        oneLiner: editSkill.oneLiner,
        score: parseInt(editSkill.score),
        isActive: editSkill.isActive,
        isHidden: editSkill.isHidden,
      }),
    })
    if (res.ok) { showToast('Saved'); setEditSkill(null); fetchSkills() }
    else showToast('Save failed', 'err')
  }

  async function reEnrichSkill(id: string) {
    const res = await fetch('/api/admin/enrich', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ skillId: id }),
    })
    if (res.ok) showToast('Enrichment started')
    else showToast('Failed', 'err')
  }

  // ── Login screen ───────────────────────────────────────────────────────────
  if (!authed) {
    return <LoginScreen onLogin={login} />
  }

  // ── Main admin UI ──────────────────────────────────────────────────────────
  const TABS = [
    { key: 'dashboard',   label: 'Dashboard' },
    { key: 'skills',      label: 'Skills' },
    { key: 'crawl_logs',  label: 'Crawl Logs' },
    { key: 'enrich_logs', label: 'Enrich Logs' },
  ] as const

  return (
    <div className="min-h-screen bg-gray-950">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Edit modal */}
      {editSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-lg rounded-xl border border-gray-700 bg-gray-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white">Edit Skill</h3>
              <button onClick={() => setEditSkill(null)}><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Name', key: 'name', type: 'text' },
                { label: 'One Liner', key: 'oneLiner', type: 'text' },
                { label: 'Score (0-100)', key: 'score', type: 'number' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs text-gray-400 mb-1">{f.label}</label>
                  <input
                    type={f.type}
                    value={(editSkill as any)[f.key] || ''}
                    onChange={e => setEditSkill({ ...editSkill, [f.key]: e.target.value })}
                    className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>
              ))}
              <div className="flex gap-4">
                {[
                  { label: 'Active', key: 'isActive' },
                  { label: 'Hidden', key: 'isHidden' },
                ].map(f => (
                  <label key={f.key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(editSkill as any)[f.key]}
                      onChange={e => setEditSkill({ ...editSkill, [f.key]: e.target.checked })}
                      className="accent-violet-600"
                    />
                    <span className="text-sm text-gray-300">{f.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={saveEdit} className="flex-1 rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700">
                Save Changes
              </button>
              <button onClick={() => setEditSkill(null)} className="px-4 py-2 text-sm text-gray-400 hover:text-white">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900">
        <div className="container flex items-center justify-between py-4">
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-violet-400" />
            Admin Dashboard
          </h1>
          <button onClick={logout} className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1">
            <Lock className="h-3 w-3" /> Logout
          </button>
        </div>
        <div className="container flex gap-1 pb-0">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 text-sm border-b-2 transition-colors ${
                tab === t.key
                  ? 'border-violet-500 text-violet-300'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="container py-6">
        {/* ── DASHBOARD ── */}
        {tab === 'dashboard' && (
          <div className="space-y-6">
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total Skills" value={stats.totalSkills} icon={<Database className="h-5 w-5 text-violet-400" />} color="border-violet-500/20" />
                <StatCard label="Active" value={stats.activeSkills} icon={<CheckCircle className="h-5 w-5 text-green-400" />} color="border-green-500/20" />
                <StatCard label="Pending Enrich" value={stats.pendingEnrichment} icon={<AlertTriangle className="h-5 w-5 text-amber-400" />} color="border-amber-500/20" />
                <StatCard label="Hidden" value={stats.hiddenSkills} icon={<EyeOff className="h-5 w-5 text-gray-400" />} color="border-gray-700" />
              </div>
            )}

            {/* Action panels */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Crawl panel */}
              <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
                <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-cyan-400" /> Data Crawler
                </h2>
                <p className="text-xs text-gray-500 mb-4">
                  Fetch new tools from GitHub and Awesome Lists. Runs in background.
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { source: 'all', label: 'Run All' },
                    { source: 'github', label: 'GitHub Only' },
                    { source: 'awesome_lists', label: 'Awesome Lists' },
                  ].map(btn => (
                    <button
                      key={btn.source}
                      onClick={() => runCrawl(btn.source)}
                      disabled={loading}
                      className="flex items-center gap-1.5 rounded-md bg-cyan-600/20 border border-cyan-500/30 text-cyan-300 px-3 py-2 text-sm hover:bg-cyan-600/30 disabled:opacity-50 transition-colors"
                    >
                      <Play className="h-3.5 w-3.5" />
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Enrich panel */}
              <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
                <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-violet-400" /> AI Enrichment
                </h2>
                <p className="text-xs text-gray-500 mb-4">
                  Use AI to classify and summarize pending skills. Requires OpenAI API key.
                </p>
                <div className="flex flex-wrap gap-2">
                  {[5, 10, 20, 50].map(n => (
                    <button
                      key={n}
                      onClick={() => runEnrich(n)}
                      disabled={loading}
                      className="flex items-center gap-1.5 rounded-md bg-violet-600/20 border border-violet-500/30 text-violet-300 px-3 py-2 text-sm hover:bg-violet-600/30 disabled:opacity-50 transition-colors"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Enrich {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
              <h2 className="font-semibold text-white mb-4">Quick Actions</h2>
              <div className="flex flex-wrap gap-2">
                <button onClick={fetchStats} className="text-xs px-3 py-1.5 rounded-md border border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white flex items-center gap-1.5">
                  <RefreshCw className="h-3 w-3" /> Refresh Stats
                </button>
                <button onClick={() => { setTab('skills'); setSkillFilter('pending') }} className="text-xs px-3 py-1.5 rounded-md border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 flex items-center gap-1.5">
                  <AlertTriangle className="h-3 w-3" /> View Pending ({stats?.pendingEnrichment || 0})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── SKILLS ── */}
        {tab === 'skills' && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex items-center gap-3 flex-wrap">
              {['all', 'pending', 'active', 'hidden', 'irrelevant'].map(f => (
                <button
                  key={f}
                  onClick={() => { setSkillFilter(f); setSkillPage(1) }}
                  className={`px-3 py-1.5 rounded-md text-xs border transition-colors ${
                    skillFilter === f
                      ? 'border-violet-500 bg-violet-500/10 text-violet-300'
                      : 'border-gray-700 text-gray-500 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
              <button onClick={fetchSkills} className="ml-auto text-xs px-3 py-1.5 rounded-md border border-gray-700 text-gray-500 hover:bg-gray-800">
                <RefreshCw className="h-3 w-3" />
              </button>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-gray-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-900 border-b border-gray-800">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Name</th>
                    <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium hidden md:table-cell">One Liner</th>
                    <th className="text-center px-3 py-3 text-xs text-gray-500 font-medium">Score</th>
                    <th className="text-center px-3 py-3 text-xs text-gray-500 font-medium">Active</th>
                    <th className="text-center px-3 py-3 text-xs text-gray-500 font-medium">Hidden</th>
                    <th className="text-right px-4 py-3 text-xs text-gray-500 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {loading ? (
                    <tr><td colSpan={6} className="text-center py-8 text-gray-600">Loading...</td></tr>
                  ) : skills.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-8 text-gray-600">No skills found</td></tr>
                  ) : (
                    skills.map(s => (
                      <tr key={s.id} className="hover:bg-gray-900/60">
                        <td className="px-4 py-3">
                          <a href={`/skills/${s.slug}`} target="_blank" className="text-violet-300 hover:text-violet-200 font-medium text-xs">
                            {s.name}
                          </a>
                          <p className="text-xs text-gray-600 mt-0.5">{s.sourceType}</p>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500 max-w-xs truncate hidden md:table-cell">
                          {s.oneLiner || <span className="text-amber-600/60 italic">not enriched</span>}
                        </td>
                        <td className="px-3 py-3 text-center text-xs font-bold text-gray-400">{s.score || '—'}</td>
                        <td className="px-3 py-3 text-center">
                          <button onClick={() => toggleActive(s.id, s.isActive)} title="Toggle active">
                            {s.isActive
                              ? <CheckCircle className="h-4 w-4 text-green-400 mx-auto" />
                              : <XCircle className="h-4 w-4 text-gray-600 mx-auto" />}
                          </button>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <button onClick={() => toggleHide(s.id, s.isHidden)} title="Toggle hidden">
                            {s.isHidden
                              ? <EyeOff className="h-4 w-4 text-red-400 mx-auto" />
                              : <Eye className="h-4 w-4 text-gray-600 mx-auto" />}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button onClick={() => setEditSkill(s)} title="Edit" className="p-1 text-gray-600 hover:text-violet-400">
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => reEnrichSkill(s.id)} title="Re-enrich" className="p-1 text-gray-600 hover:text-cyan-400">
                              <Zap className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Total: {skillTotal}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setSkillPage(p => Math.max(1, p - 1))} disabled={skillPage === 1} className="p-1 hover:text-white disabled:opacity-40">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span>Page {skillPage}</span>
                <button onClick={() => setSkillPage(p => p + 1)} disabled={skills.length < 20} className="p-1 hover:text-white disabled:opacity-40">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── CRAWL LOGS ── */}
        {tab === 'crawl_logs' && (
          <div className="rounded-xl border border-gray-800 overflow-hidden">
            <div className="bg-gray-900 px-4 py-3 border-b border-gray-800 flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Crawl Logs</span>
              <button onClick={fetchCrawlLogs} className="text-gray-500 hover:text-white"><RefreshCw className="h-4 w-4" /></button>
            </div>
            <table className="w-full text-xs">
              <thead className="bg-gray-900/50 border-b border-gray-800">
                <tr>
                  {['Source', 'Query', 'Status', 'Found', 'Saved', 'Updated', 'Time'].map(h => (
                    <th key={h} className="text-left px-3 py-2 text-gray-600 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {crawlLogs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-900/40">
                    <td className="px-3 py-2 text-gray-400">{log.source}</td>
                    <td className="px-3 py-2 text-gray-500 max-w-[160px] truncate">{log.query || '—'}</td>
                    <td className="px-3 py-2">
                      <span className={`rounded-full px-2 py-0.5 ${
                        log.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                        log.status === 'failed' ? 'bg-red-500/10 text-red-400' :
                        'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-gray-400">{log.totalFound ?? '—'}</td>
                    <td className="px-3 py-2 text-green-400">{log.totalSaved ?? '—'}</td>
                    <td className="px-3 py-2 text-cyan-400">{log.totalUpdated ?? '—'}</td>
                    <td className="px-3 py-2 text-gray-600">{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
                {crawlLogs.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-8 text-gray-600">No logs yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ── ENRICH LOGS ── */}
        {tab === 'enrich_logs' && (
          <div className="rounded-xl border border-gray-800 overflow-hidden">
            <div className="bg-gray-900 px-4 py-3 border-b border-gray-800 flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Enrichment Logs</span>
              <button onClick={fetchEnrichLogs} className="text-gray-500 hover:text-white"><RefreshCw className="h-4 w-4" /></button>
            </div>
            <table className="w-full text-xs">
              <thead className="bg-gray-900/50 border-b border-gray-800">
                <tr>
                  {['Skill', 'Model', 'Status', 'Input Tokens', 'Output Tokens', 'Error', 'Time'].map(h => (
                    <th key={h} className="text-left px-3 py-2 text-gray-600 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {enrichLogs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-900/40">
                    <td className="px-3 py-2">
                      {log.skill ? (
                        <a href={`/skills/${log.skill.slug}`} className="text-violet-400 hover:text-violet-300">
                          {log.skill.name}
                        </a>
                      ) : log.skillId}
                    </td>
                    <td className="px-3 py-2 text-gray-500">{log.model || '—'}</td>
                    <td className="px-3 py-2">
                      <span className={`rounded-full px-2 py-0.5 ${
                        log.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                        log.status === 'failed' ? 'bg-red-500/10 text-red-400' :
                        'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-gray-500">{log.inputTokens ?? '—'}</td>
                    <td className="px-3 py-2 text-gray-500">{log.outputTokens ?? '—'}</td>
                    <td className="px-3 py-2 text-red-400 max-w-[200px] truncate" title={log.errorMessage || ''}>
                      {log.errorMessage ? log.errorMessage.slice(0, 60) + '...' : '—'}
                    </td>
                    <td className="px-3 py-2 text-gray-600">{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
                {enrichLogs.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-8 text-gray-600">No logs yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Login screen
// ────────────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (p: string) => void }) {
  const [pwd, setPwd] = useState('')
  const [err, setErr] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    const res = await fetch('/api/admin/stats', {
      headers: { 'x-admin-password': pwd },
    })
    if (res.ok) {
      onLogin(pwd)
    } else {
      setErr('Wrong password')
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-full max-w-sm rounded-xl border border-gray-800 bg-gray-900 p-8">
        <div className="flex items-center gap-2 mb-6">
          <Lock className="h-5 w-5 text-violet-400" />
          <h1 className="text-lg font-bold text-white">Admin Login</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Password</label>
            <input
              type="password"
              value={pwd}
              onChange={e => setPwd(e.target.value)}
              placeholder="Enter ADMIN_PASSWORD"
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>
          {err && <p className="text-xs text-red-400">{err}</p>}
          <button
            type="submit"
            className="w-full rounded-md bg-violet-600 py-2 text-sm font-medium text-white hover:bg-violet-700 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
