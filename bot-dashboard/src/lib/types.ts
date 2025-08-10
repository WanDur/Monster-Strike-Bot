export type StatusKind = 'normal' | 'alert' | 'stopped'

export type LogLine = {
  level: 'log' | 'info' | 'warning' | 'error'
  message: string
  ts: number // ms epoch
}

export type SessionRecord = {
  startAt: number
  updatedAt: number
  totalMatches: number
  status: StatusKind
}

export type DashboardPayload = {
  session: string
  startAt: number
  updatedAt: number
  totalMatches: number
  status: StatusKind
  logs: LogLine[]
}
