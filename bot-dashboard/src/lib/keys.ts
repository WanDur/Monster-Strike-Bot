export const SESSION_TTL_SEC = 60 * 60 * 48 // 48h
export const LOG_LIMIT = 500

export const kSess = (id: string) => `sess:${id}` // hash
export const kMatches = (id: string) => `sess:${id}:matches` // int
export const kStatus = (id: string) => `sess:${id}:status` // string
export const kLogs = (id: string) => `sess:${id}:logs` // list
export const kIdem = (id: string, key: string) => `sess:${id}:idem:${key}` // string
