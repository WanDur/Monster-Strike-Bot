'use client'

import { use, useEffect, useMemo, useRef, useState } from 'react'
import { useSession } from '@/hooks/useSession'
import type { StatusKind, DashboardPayload } from '@/lib/types'

type StatusPayload = {
  session: string
  startAt?: number // when the session code was first created (ms epoch)
  updatedAt?: number // last update time (ms epoch)
  totalMatches?: number
  status?: StatusKind
  logs?: string[] // newest last
}

// ---- helpers ---------------------------------------------------------------

function classNames(...xs: (string | false | null | undefined)[]) {
  return xs.filter(Boolean).join(' ')
}

// format per spec:
// <1min, then "2mins", "50mins", then "1hr", "1hr 25mins", and cap top unit at hr (e.g., "26hr 30mins")
function formatSince(startAt?: number): string {
  if (!startAt) return '—'
  const diffMs = Date.now() - startAt
  const totalMin = Math.floor(diffMs / 60000)
  if (totalMin < 1) return '<1min'
  if (totalMin < 60) return `${totalMin}mins`
  const hours = Math.floor(totalMin / 60)
  const mins = totalMin % 60
  return mins === 0 ? `${hours}hr` : `${hours}hr ${mins}mins`
}

function useTicker(intervalMs = 30000) {
  const [, setTick] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), intervalMs)
    return () => clearInterval(t)
  }, [intervalMs])
}

// ---- dummy data (fallback) -------------------------------------------------
function useDummy(session: string): StatusPayload {
  const start = useMemo(() => Date.now() - 1000 * 60 * 87 - 1000 * 30, []) // ~1hr 27mins 30s ago
  const [state, setState] = useState<StatusPayload>({
    session,
    startAt: start,
    updatedAt: Date.now(),
    totalMatches: 128,
    status: 'normal',
    logs: [
      'boot: reading config',
      'network: connected',
      'auth: ok',
      'engine: warm start',
      'scan: found 12 candidates',
      'filter: 7 valid',
      'matcher: running phase 1',
      'matcher: 42/100',
      'matcher: 84/100',
      'matcher: complete',
      'post: results sent'
    ]
  })

  // lightly simulate activity
  useEffect(() => {
    const t = setInterval(() => {
      setState((prev) => {
        const now = Date.now()
        const bump = Math.random() < 0.5 ? 1 : 0
        const statuses: StatusKind[] = ['normal', 'alert', 'normal', 'normal', 'stopped', 'normal']
        const maybeStatus = statuses[Math.floor(Math.random() * statuses.length)]
        const next: StatusPayload = {
          ...prev,
          updatedAt: now,
          totalMatches: (prev.totalMatches ?? 0) + bump,
          status: maybeStatus === 'normal' ? 'normal' : prev.status, // mostly stay normal
          logs: [
            ...(prev.logs ?? []),
            bump
              ? `match added: #${(prev.totalMatches ?? 0) + bump}`
              : `heartbeat ${new Date(now).toLocaleTimeString()}`
          ].slice(-50)
        }
        return next
      })
    }, 4000)
    return () => clearInterval(t)
  }, [])

  return state
}

// ---- components ------------------------------------------------------------

function WidgetCard({ title, children, right }: { title: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 backdrop-blur p-5 shadow-sm h-full">
      <div className="flex items-start justify-between gap-3">
        <div className="text-s text-slate-500">{title}</div>
        {right ? <div>{right}</div> : null}
      </div>
      <div className="mt-2 flex-1 flex items-center">{children}</div>
    </div>
  )
}

function BigNumber({ value }: { value: number | string | undefined }) {
  return <div className="text-4xl md:text-5xl font-semibold tabular-nums">{value ?? '—'}</div>
}

function StatusPill({ status }: { status?: StatusKind }) {
  const s = status ?? 'alert'
  const map: Record<StatusKind, { label: string; ring: string; dot: string; text: string; bg: string }> = {
    normal: {
      label: 'Normal',
      ring: 'ring-emerald-300/50 dark:ring-emerald-600/40',
      dot: 'bg-emerald-500',
      text: 'text-emerald-700 dark:text-emerald-300',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20'
    },
    alert: {
      label: 'Alert',
      ring: 'ring-amber-300/50 dark:ring-amber-600/40',
      dot: 'bg-amber-500',
      text: 'text-amber-700 dark:text-amber-300',
      bg: 'bg-amber-50 dark:bg-amber-900/20'
    },
    stopped: {
      label: 'Stopped',
      ring: 'ring-rose-300/50 dark:ring-rose-700/40',
      dot: 'bg-rose-500',
      text: 'text-rose-700 dark:text-rose-300',
      bg: 'bg-rose-50 dark:bg-rose-900/20'
    }
  }
  const c = map[s]
  return (
    <div
      className={classNames(
        'flex items-center gap-3 rounded-2xl mt-2 px-5 py-6 ring-4',
        c.ring,
        c.bg,
        'shadow-sm w-full'
      )}
    >
      <span className={classNames('h-3 w-3 rounded-full', c.dot)} />
      <span className={classNames('text-lg font-medium', c.text)}>{c.label}</span>
    </div>
  )
}

function LiveDot() {
  // recording-like: solid dot + subtle ping
  return (
    <div className="relative flex items-center">
      <span className="absolute inline-flex h-3 w-3 rounded-full opacity-75 animate-ping bg-red-500/80" />
      <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500/80 shadow" />
    </div>
  )
}

function TimeLive({ startAt }: { startAt?: number }) {
  useTicker(15000) // update label every 15s
  return <BigNumber value={formatSince(startAt)} />
}

function LogBox({ items }: { items: string[] }) {
  const ref = useRef<HTMLDivElement | null>(null)

  // Show only the last 10 items
  const displayItems = items.slice(-10)

  // auto-scroll to bottom on new items
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [displayItems])

  return (
    <div
      ref={ref}
      className="h-80 overflow-y-auto rounded-xl bg-white/60 dark:bg-slate-900/30 p-3 
      [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full
      [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
    >
      <ul className="space-y-2 text-sm leading-tight text-slate-800 dark:text-slate-200">
        {displayItems.map((t, i) => {
          // Calculate the actual index in the original array
          const actualIndex = items.length - displayItems.length + i
          return (
            <li
              key={`${actualIndex}-${t.slice(0, 16)}`}
              className="rounded-lg px-3 py-2 bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/50"
              title={t}
            >
              <span className="text-slate-500 dark:text-slate-400 mr-2 tabular-nums">
                {String(actualIndex + 1).padStart(3, '0')}
              </span>
              <span className="break-words">{t}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

// ---- page ------------------------------------------------------------------

export default function SessionPage({ params }: { params: Promise<{ session: string }> }) {
  const { session } = use(params)
  const { data, error, isLoading } = useSession(session)

  const startAt = data?.startAt ?? undefined
  const totalMatches = data?.totalMatches ?? 0
  const status = (data?.status ?? 'alert') as StatusKind
  const logs = data?.logs?.map((l) => `${new Date(l.ts).toLocaleTimeString()} — ${l.level}: ${l.message}`) ?? []

  return (
    <main className="min-h-dvh bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        {/* header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Monster Strike Bot Dashboard</h1>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Session: <span className="text-slate-600 dark:text-slate-300">{session}</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isLoading
              ? 'Loading…'
              : (error as any)?.status === 404
              ? 'Session not found. Check the session code.'
              : error
              ? 'API error. Please try again.'
              : ''}
          </p>
        </div>

        {/* top widgets */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* total matches */}
          <WidgetCard title="Total matches">
            <BigNumber value={isLoading ? '—' : totalMatches} />
          </WidgetCard>

          {/* total time (live label) */}
          <WidgetCard title="Total time" right={<LiveDot />}>
            {startAt ? <TimeLive startAt={startAt} /> : <div className="text-slate-400">—</div>}
          </WidgetCard>

          {/* status — big, obvious */}
          <div className="md:col-span-2">
            <WidgetCard title="Status">
              {/* show skeleton-ish while loading */}
              {isLoading ? (
                <div className="rounded-2xl mt-2 px-5 py-6 w-full bg-slate-100 dark:bg-slate-800 animate-pulse" />
              ) : (
                <StatusPill status={status} />
              )}
            </WidgetCard>
          </div>
        </div>

        {/* log box */}
        <WidgetCard title="Logs">
          <div className="w-full">
            {isLoading ? (
              <div className="h-80 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ) : (
              <LogBox items={logs} />
            )}
          </div>
        </WidgetCard>
      </div>
    </main>
  )
}
