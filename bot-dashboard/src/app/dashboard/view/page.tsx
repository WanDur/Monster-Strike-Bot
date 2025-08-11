'use client'

import { useState } from 'react'
import useSWR from 'swr'

type StatusKind = 'normal' | 'alert' | 'stopped'

type Row = {
  session: string
  startAt: number
  updatedAt: number
  totalMatches: number
  status: StatusKind
  logCount: number
}

type SessionResp = {
  session: string
  startAt: number
  updatedAt: number
  totalMatches: number
  status: StatusKind
  logs: LogLine[]
}

type ListResp = { total: number; items: Row[] }

type LogLine = { level: 'log' | 'info' | 'warning' | 'error'; message: string; ts: number }

const fetcher = async <T,>(url: string): Promise<T> => {
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(await res.text().catch(() => res.statusText))
  return res.json()
}

function formatTime(ts?: number) {
  if (!ts) return '—'
  const d = new Date(ts)
  return isNaN(d.getTime()) ? '—' : d.toLocaleString()
}

function StatusBadge({ s }: { s: StatusKind }) {
  const map: Record<StatusKind, string> = {
    normal:
      'bg-emerald-50 text-emerald-700 ring-emerald-300/60 dark:bg-emerald-900/20 dark:text-emerald-300 dark:ring-emerald-700/40',
    alert:
      'bg-amber-50 text-amber-700 ring-amber-300/60 dark:bg-amber-900/20 dark:text-amber-300 dark:ring-amber-700/40',
    stopped: 'bg-rose-50 text-rose-700 ring-rose-300/60 dark:bg-rose-900/20 dark:text-rose-300 dark:ring-rose-700/40'
  }
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ring-2 ${map[s]}`}>{s}</span>
  )
}

export default function ViewAllSessionsPage() {
  const { data, error, isLoading, mutate } = useSWR<ListResp>('/api/sessions/list', fetcher, {
    refreshInterval: 60000, // 1 minute
    revalidateOnFocus: true,
    keepPreviousData: true
  })

  const [openFor, setOpenFor] = useState<string | null>(null)
  const [logs, setLogs] = useState<LogLine[]>([])
  const [loadingLogs, setLoadingLogs] = useState(false)
  const [logsErr, setLogsErr] = useState('')

  async function openLogs(session: string) {
    setOpenFor(session)
    setLogs([])
    setLogsErr('')
    setLoadingLogs(true)

    try {
      const res = await fetch(`/api/sessions/${encodeURIComponent(session)}`, { cache: 'no-store' })
      if (!res.ok) throw new Error(await res.text().catch(() => res.statusText))

      const j: SessionResp = await res.json()
      setLogs(j.logs || [])
    } catch (e: any) {
      setLogsErr(e?.message || 'Failed to load logs')
    } finally {
      setLoadingLogs(false)
    }
  }

  function closeLogs() {
    setOpenFor(null)
    setLogs([])
    setLogsErr('')
  }

  return (
    <main className="min-h-dvh p-6 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">All Sessions</h1>
          </div>
          <button
            onClick={() => mutate()}
            className="rounded-xl px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Refresh
          </button>
        </header>

        <div className="overflow-hidden rounded-2xl ring-1 ring-slate-200 dark:ring-slate-800 bg-white/70 dark:bg-slate-900/50 backdrop-blur">
          <table className="w-full text-sm">
            <thead className="bg-slate-100/70 dark:bg-slate-800/40">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium">Session</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Last Updated</th>
                <th className="px-4 py-3 font-medium">Matches</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Logs</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-slate-500">
                    Loading…
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-rose-600">
                    Failed to load sessions.
                  </td>
                </tr>
              ) : !data || data.items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-slate-500">
                    No sessions.
                  </td>
                </tr>
              ) : (
                data.items.map((row) => (
                  <tr key={row.session} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="px-4 py-3 font-mono">{row.session}</td>
                    <td className="px-4 py-3">{formatTime(row.startAt)}</td>
                    <td className="px-4 py-3">{formatTime(row.updatedAt)}</td>
                    <td className="px-4 py-3 tabular-nums">{row.totalMatches}</td>
                    <td className="px-4 py-3">
                      <StatusBadge s={row.status} />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        className="text-slate-700 dark:text-slate-200 underline underline-offset-4 hover:opacity-80"
                        onClick={() => openLogs(row.session)}
                        title="View logs"
                      >
                        {row.logCount}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Logs Modal */}
        {openFor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeLogs} />
            <div className="relative w-full max-w-3xl max-h-[80dvh] overflow-hidden rounded-2xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 shadow-xl">
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-slate-800">
                <div className="font-semibold">Logs — {openFor}</div>
                <button onClick={closeLogs} className="rounded-lg px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800">
                  Close
                </button>
              </div>
              <div className="p-5 overflow-y-auto">
                {loadingLogs ? (
                  <div className="text-slate-500">Loading logs…</div>
                ) : logsErr ? (
                  <div className="text-rose-600">{logsErr}</div>
                ) : logs.length === 0 ? (
                  <div className="text-slate-500">No logs.</div>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {logs.map((l, i) => (
                      <li key={i} className="rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2">
                        <div className="text-xs text-slate-500">{new Date(l.ts).toLocaleString()}</div>
                        <div className="mt-0.5">
                          <span className="inline-block min-w-14 mr-2 text-xs uppercase tracking-wide opacity-70">
                            {l.level}
                          </span>
                          <span>{l.message}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
