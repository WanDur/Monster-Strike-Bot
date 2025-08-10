'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export default function Page() {
  const [code, setCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  const go = useCallback(() => {
    const trimmed = code.trim()
    if (!trimmed) return
    setSubmitting(true)
    // Small delay for UX so the disabled state is visible
    setTimeout(() => {
      router.push(`/dashboard/${encodeURIComponent(trimmed.toUpperCase())}`)
    }, 30)
  }, [code, router])

  const handlePasteClick = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) setCode(text.trim().slice(0, 6))
    } catch (e) {
      console.warn('Clipboard paste failed', e)
    }
  }, [])

  return (
    <main className="min-h-dvh bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-black text-slate-900 dark:text-slate-100 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="relative rounded-3xl shadow-xl shadow-slate-200/60 dark:shadow-black/40 ring-1 ring-slate-200 dark:ring-slate-800 bg-white/80 dark:bg-slate-900/70 backdrop-blur p-6 sm:p-7 space-y-6">
          <header className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Connect to your bot session</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              You can find the session code in <span className="font-bold">ms-bot.exe</span>
            </p>
          </header>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              go()
            }}
            className="space-y-4"
          >
            <label htmlFor="session-code" className="sr-only">
              Session code
            </label>
            <div className="relative">
              <input
                id="session-code"
                value={code}
                onChange={(e) => setCode(e.target.value.slice(0, 6))}
                placeholder="session code"
                autoComplete="one-time-code"
                inputMode="text"
                className="w-full uppercase text-lg rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-950/50 px-4 pr-24 py-3 outline-none ring-offset-2 focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600 transition-shadow placeholder:text-slate-400 uppercase"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    if (code.trim().length === 6) go()
                  }
                }}
              />

              <button
                type="button"
                onClick={handlePasteClick}
                title="Paste from clipboard"
                className="absolute right-2 top-1 bottom-1 my-auto h-10 px-3 inline-flex items-center gap-2 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white/70 dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/70 active:scale-[0.99] transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 opacity-80"
                  aria-hidden="true"
                >
                  <path d="M9 2a2 2 0 0 0-2 2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V9.5a2 2 0 0 0-.586-1.414l-2.5-2.5A2 2 0 0 0 15.5 5H15a2 2 0 0 0-2-2H9Zm4 3h2.5a.5.5 0 0 1 .353.146l2.5 2.5A.5.5 0 0 1 18.5 8H17a2 2 0 0 0-2 2V5ZM9 4h4v2H9a1 1 0 1 1 0-2Z" />
                </svg>
                <span className="text-sm font-medium">Paste</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={code.trim().length !== 6 || submitting}
              className="w-full rounded-2xl py-3 font-medium ring-offset-2 focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600 transition disabled:opacity-50 disabled:cursor-not-allowed bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
            >
              {submitting ? 'Opening…' : 'View dashboard'}
            </button>
          </form>

          <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Note: The code should be exactly 6 characters long
          </div>
        </div>
      </div>
    </main>
  )
}
