'use client'

import useSWR from 'swr'
import { jsonFetch } from '@/lib/fetcher'
import type { DashboardPayload } from '@/lib/types'

export function useSession(session: string) {
  const key = session ? `/api/sessions/${encodeURIComponent(session)}` : null

  const { data, error, isLoading, mutate } = useSWR<DashboardPayload>(key, jsonFetch, {
    refreshInterval: (data) => (data ? 30000 : 0), // poll every 30s
    shouldRetryOnError: (err) => err?.status !== 404,
    revalidateOnFocus: false,
    keepPreviousData: true
  })

  return { data, error, isLoading, mutate }
}
