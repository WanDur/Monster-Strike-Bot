import { createClient, type RedisClientType } from 'redis'

let client: RedisClientType | null = null

export async function getRedis(): Promise<RedisClientType> {
  if (client && client.isOpen) return client
  client = createClient({ url: process.env.REDIS_URL })
  client.on('error', (err) => console.error('Redis error', err))
  await client.connect()
  return client
}
