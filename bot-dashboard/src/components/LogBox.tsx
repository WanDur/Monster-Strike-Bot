import { useEffect, useRef } from 'react'
import { LogLine } from '@/lib/types'

type Tone = 'normal' | 'alert' | 'stopped'

const STATUS_STYLES: Record<Tone, { ring: string; dot: string; text: string; bg: string }> = {
  normal: {
    ring: 'ring-emerald-300/50 dark:ring-emerald-600/40',
    dot: 'bg-emerald-500',
    text: 'text-emerald-700 dark:text-emerald-300',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20'
  },
  alert: {
    ring: 'ring-amber-300/50 dark:ring-amber-600/40',
    dot: 'bg-amber-500',
    text: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-50 dark:bg-amber-900/20'
  },
  stopped: {
    ring: 'ring-rose-300/50 dark:ring-rose-700/40',
    dot: 'bg-rose-500',
    text: 'text-rose-700 dark:text-rose-300',
    bg: 'bg-rose-50 dark:bg-rose-900/20'
  }
}

function levelToTone(level: LogLine['level']): Tone {
  switch (level) {
    case 'warning':
      return 'alert'
    case 'error':
      return 'stopped'
    default:
      return 'normal'
  }
}

function Badge({ content, tone }: { content: string; tone: Tone }) {
  const s = STATUS_STYLES[tone]
  return (
    <span className="inline-flex items-center gap-2 rounded-md px-2 py-0.5 ">
      <span className={['ring-2 rounded-xl px-3 py-2 min-w-50', s.ring, s.text].join(' ')}>{content}</span>
    </span>
  )
}

const LogBox = ({ items }: { items: LogLine[] }) => {
  const ref = useRef<HTMLDivElement | null>(null)

  // slice first 100 items
  const displayItems = items.slice(0, 100)

  // auto-scroll to bottom on new items
  useEffect(() => {
    const el = ref.current
    if (el) el.scrollTop = el.scrollHeight
  }, [displayItems])

  return (
    <div
      ref={ref}
      className="h-80 overflow-y-auto rounded-xl bg-white/60 dark:bg-slate-900/30 p-3 
      [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full
      [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
    >
      {displayItems.length === 0 ? (
        <div className="text-sm text-slate-500 dark:text-slate-400 px-1 py-2">No logs yet.</div>
      ) : (
        <ul className="space-y-2 text-sm leading-tight text-slate-800 dark:text-slate-200">
          {displayItems.map((l, i) => {
            const actualIndex = items.length - displayItems.length + i + 1
            const tone = levelToTone(l.level)
            const time = new Date(l.ts).toLocaleTimeString([], {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })
            const lineText = `${time} — ${l.message}`

            return (
              <li
                key={`${l.ts}-${actualIndex}`}
                className="rounded-lg px-3 py-2 bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/50"
                title={lineText}
              >
                <span className="text-slate-500 dark:text-slate-400 mr-2 tabular-nums">
                  {String(actualIndex + 1).padStart(3, '0')}
                </span>
                <Badge content={lineText} tone={tone} />
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default LogBox
