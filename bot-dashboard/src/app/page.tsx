'use client'
import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const MAX_LEN = 5

export default function Page() {
  const router = useRouter()

  const [code, setCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [errorVisible, setErrorVisible] = useState(false)

  useEffect(() => {
    if (!errorMsg) {
      setErrorVisible(false)
      return
    }
    setErrorVisible(false)
    const t = requestAnimationFrame(() => setErrorVisible(true))
    return () => cancelAnimationFrame(t)
  }, [errorMsg])

  const checkSessionExists = async (session: string) => {
    try {
      const res = await fetch(`/api/sessions/${encodeURIComponent(session)}`, { cache: 'no-store' })
      if (res.status === 200) return true
      if (res.status === 404) return false
      throw new Error(await res.text().catch(() => res.statusText))
    } catch (e: any) {
      throw e
    }
  }

  const go = useCallback(async () => {
    const trimmed = code.trim().toUpperCase()
    if (trimmed.length !== MAX_LEN) return

    setErrorMsg('')
    setSubmitting(true)

    try {
      const exists = await checkSessionExists(trimmed)
      if (exists) {
        router.push(`/dashboard/${encodeURIComponent(trimmed)}`)
        return
      }
      setErrorMsg('Session not found. Check the code and try again.')
    } catch {
      setErrorMsg('Unable to reach the server. Please try again later.')
    } finally {
      setSubmitting(false)
    }
  }, [code, router])

  const handlePasteClick = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) setCode(text.trim().toUpperCase().slice(0, MAX_LEN))
    } catch (e) {
      console.warn('Clipboard paste failed', e)
    }
  }, [])

  return (
    <main className="min-h-dvh bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-black text-slate-900 dark:text-slate-100 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="relative rounded-3xl shadow-xl shadow-slate-200/60 dark:shadow-black/40 ring-1 ring-slate-200 dark:ring-slate-800 bg-white/80 dark:bg-slate-900/70 backdrop-blur p-6 sm:p-7 space-y-6">
          <header className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Connect to your bot</h1>
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
                onChange={(e) => setCode(e.target.value.slice(0, MAX_LEN))}
                placeholder="session code"
                autoComplete="one-time-code"
                inputMode="text"
                className="w-full uppercase text-lg rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-950/50 px-4 pr-24 py-3 outline-none ring-offset-2 focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600 transition-shadow placeholder:text-slate-400 uppercase"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    if (code.trim().length === MAX_LEN) go()
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
              disabled={code.trim().length !== MAX_LEN || submitting}
              className="w-full rounded-2xl py-3 font-medium ring-offset-2 focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600 transition disabled:opacity-50 disabled:cursor-not-allowed bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white flex items-center justify-center"
            >
              {submitting ? (
                <span className="h-5 w-5 rounded-full border-2 border-black/60 border-t-transparent animate-spin" />
              ) : (
                'View dashboard'
              )}
            </button>
          </form>

          <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Note: The code should be exactly {MAX_LEN} characters long
          </div>

          <div
            className={`transition-[grid-template-rows] duration-300 grid ${
              errorMsg ? 'grid-rows-[1fr] mt-2' : 'grid-rows-[0fr] mt-0'
            }`}
            aria-live="polite"
          >
            <div className="min-h-0 overflow-hidden">
              <div
                role="alert"
                className={`text-sm font-medium rounded-xl border px-3 py-2
                  border-rose-300/60 bg-rose-50/80 text-rose-700
                  dark:border-rose-800/60 dark:bg-rose-900/30 dark:text-rose-300
                  transition-opacity duration-300 ${errorMsg ? 'opacity-100' : 'opacity-0'}`}
              >
                {errorMsg}
              </div>
            </div>
          </div>
        </div>

        {/* GitHub logo link */}
        <div className="flex justify-center mt-4">
          <a
            href="https://github.com/WanDur/Monster-Strike-Bot"
            target="_blank"
            className="inline-flex items-center gap-2 hover:opacity-80 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path
                fillRule="evenodd"
                d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.29 3.438 9.772 8.205 11.36.6.11.82-.26.82-.577
              0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73
              1.205.085 1.84 1.236 1.84 1.236 1.07 1.834 2.807 1.303 3.492.997.108-.775.42-1.303.763-1.603-2.665-.305-5.466-1.334-5.466-5.933
              0-1.31.468-2.38 1.236-3.22-.124-.305-.536-1.53.117-3.188 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 0 1 3-.404
              c1.02.005 2.047.138 3 .404 2.29-1.552 3.297-1.23 3.297-1.23.655 1.658.243 2.883.12 3.188.77.84 1.235 1.91
              1.235 3.22 0 4.61-2.804 5.625-5.475 5.922.43.37.823 1.096.823 2.21
              0 1.596-.015 2.884-.015 3.277 0 .32.218.694.825.576C20.565 22.27 24 17.788 24 12.5
              24 5.87 18.627.5 12 .5z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium">View on GitHub</span>
          </a>
        </div>
      </div>

      <div className="absolute bottom-4 text-sm text-slate-500 dark:text-slate-500">Version: beta</div>
    </main>
  )
}
