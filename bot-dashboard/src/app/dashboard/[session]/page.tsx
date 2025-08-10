// app/s/[session]/page.tsx
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

type StatusKind = 'alert' | 'normal' | 'stopped'

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
// You can remove this once your GET /api/sessions/[session] is wired up.
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
    <div ref={ref} className="h-80 overflow-y-auto rounded-xl bg-white/60 dark:bg-slate-900/30 p-3">
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

export default function SessionPage({ params }: { params: { session: string } }) {
  const session = decodeURIComponent(params.session)

  // TODO: swap this dummy hook for your real fetcher (e.g., SWR to /api/sessions/[session])
  const data = useDummy(session)

  // Ensure sensible fallbacks if API hasn't set them yet
  const startAt = data.startAt ?? Date.now() - 45_000 // pretend it started <1min ago
  const totalMatches = data.totalMatches ?? 0
  const status = (data.status ?? 'alert') as StatusKind
  const allLogs = data.logs ?? []

  // Keep all logs but show a rail that easily displays ~10 at a glance; newest at the end.
  const logs = allLogs

  return (
    <main className="min-h-dvh bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        {/* header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Monster Strike Bot Dashboard</h1>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Session: <span className="text-slate-600 dark:text-slate-300">{session}</span>
          </h1>
        </div>

        {/* top widgets */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* total matches */}
          <WidgetCard title="Total matches">
            <BigNumber value={totalMatches} />
          </WidgetCard>

          {/* total time (live label) */}
          <WidgetCard title="Total time" right={<LiveDot />}>
            <TimeLive startAt={startAt} />
          </WidgetCard>

          {/* status — big, obvious */}
          <div className="md:col-span-2">
            <WidgetCard title="Status">
              <StatusPill status={status} />
            </WidgetCard>
          </div>
        </div>

        {/* log box */}
        <WidgetCard title="Logs">
          <div className="w-full">
            <LogBox items={logs} />
          </div>
        </WidgetCard>
      </div>
    </main>
  )
}
