# Monster Strike Bot v5.0 <!-- omit in toc -->

This bot automates gameplay in _Monster Strike_ without directly accessing or modifying game data. It operates solely on **ratio-based positioning** and **image recognition** with color matching to determine states and actions.  
A built-in web dashboard allows you to remotely monitor the bot’s run status in real time.

## Table of Contents <!-- omit in toc -->

- [About](#about)
- [How To Use](#how-to-use)
- [Docs](#docs)
  - [Bot Docs](#bot-docs)
  - [Web API Docs](#web-api-docs)
- [Versions](#versions)

## About

### What's new <!-- omit in toc -->

### Development environment <!-- omit in toc -->

- Windows 11
- Monster strike TW v27.0.0
- NoxPlayer settings
  - Custom: CPU 6 core, Memory 8192 MB
  - Graphics rendering mode: Enhanced compatibility mode
  - Resolution setting: Mobile phone, 900x1600
  - Frame setting: 60
  - Mobile phone model: Default model (Samsung Galaxy S20 ultra)
  - Toolbar display: Only show the icon

## How To Use

## Docs

### Bot Docs

### Web API Docs

**POST `/api/sessions`**  
Creates a new session on the server.  
**Returns:**

```ts
{
  "sessionId": string,
  "startAt": Timestamp,
  "writeToken": string
}
```

**Get `/api/sessions/:id`**  
Retrieves info for the specified session.  
**Parameters:** `id` — Session ID (string)  
**Returns:**

```ts
{
  "session": string,
  "startAt": Timestamp,
  "updatedAt": Timestamp,
  "totalMatches": number,
  "status": string,
  "logs": [
    {
      "level": "log | info | warning | error",
      "message": string,
      "ts": Timestamp
    }
  ]
}
```

**POST `/api/sessions/:id/increment_match`**  
Increments the totalMatches for the session by 1.  
**Headers:** `x-write-token` — The writeToken returned from `POST /api/sessions`  
**Parameters:** `id` — Session ID (string)  
**Returns:**

```ts
{
  "ok": boolean,
  "totalMatches": number
}
```

**POST `/api/sessions/:id/logbox`**  
Adds a log to the specified session.  
**Headers:** `x-write-token` — The writeToken returned from `POST /api/sessions`  
**Parameters:** `id` — Session ID (string)  
**Body:**

```ts
{
  "message": string "(required)",
  "type": "log | info | warning | error (optional, defaults to 'info')"
}
```

**Returns:**

```ts
{
  "ok": boolean,
  "status": 'normal' | 'alert' | 'stopped'
}
```

## Versions

- 5.0
