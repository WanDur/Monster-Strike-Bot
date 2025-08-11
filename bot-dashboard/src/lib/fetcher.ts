export async function jsonFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    const err: any = new Error(text || res.statusText)

    err.status = res.status
    throw err
  }
  return res.json() as Promise<T>
}
