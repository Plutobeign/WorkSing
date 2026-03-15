const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const REDIRECT_URI = `${window.location.origin}/callback`
const SCOPES = [
  'user-read-currently-playing',
  'user-read-playback-state',
].join(' ')

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'ws_access_token',
  REFRESH_TOKEN: 'ws_refresh_token',
  EXPIRES_AT: 'ws_expires_at',
  VERIFIER: 'ws_pkce_verifier',
}

// ── PKCE helpers ──────────────────────────────────────────

function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  const arr = new Uint8Array(length)
  crypto.getRandomValues(arr)
  return Array.from(arr, (b) => chars[b % chars.length]).join('')
}

async function sha256(plain) {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  return crypto.subtle.digest('SHA-256', data)
}

function base64UrlEncode(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

async function generateCodeChallenge(verifier) {
  const hashed = await sha256(verifier)
  return base64UrlEncode(hashed)
}

// ── Auth flow ─────────────────────────────────────────────

export async function redirectToSpotifyLogin() {
  const verifier = generateRandomString(64)
  const challenge = await generateCodeChallenge(verifier)
  sessionStorage.setItem(STORAGE_KEYS.VERIFIER, verifier)

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    code_challenge_method: 'S256',
    code_challenge: challenge,
  })

  window.location.href = `https://accounts.spotify.com/authorize?${params}`
}

export async function exchangeCodeForToken(code) {
  const verifier = sessionStorage.getItem(STORAGE_KEYS.VERIFIER)
  if (!verifier) throw new Error('No PKCE verifier found')

  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: verifier,
  })

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error_description || 'Token exchange failed')
  }

  const data = await res.json()
  saveTokens(data)
  sessionStorage.removeItem(STORAGE_KEYS.VERIFIER)
  return data
}

export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
  if (!refreshToken) {
    clearTokens()
    return null
  }

  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  })

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  if (!res.ok) {
    clearTokens()
    return null
  }

  const data = await res.json()
  saveTokens(data)
  return data.access_token
}

// ── Token storage ─────────────────────────────────────────

function saveTokens({ access_token, refresh_token, expires_in }) {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token)
  if (refresh_token) {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh_token)
  }
  const expiresAt = Date.now() + expires_in * 1000
  localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, String(expiresAt))
}

export function clearTokens() {
  Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k))
  sessionStorage.removeItem(STORAGE_KEYS.VERIFIER)
}

export function getAccessToken() {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
}

export function isTokenExpired() {
  const expiresAt = localStorage.getItem(STORAGE_KEYS.EXPIRES_AT)
  if (!expiresAt) return true
  return Date.now() > Number(expiresAt) - 60_000
}

export function isLoggedIn() {
  return !!getAccessToken() && !!localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
}

// ── Authenticated fetch ───────────────────────────────────

export async function spotifyFetch(url, options = {}) {
  let token = getAccessToken()

  if (isTokenExpired()) {
    token = await refreshAccessToken()
    if (!token) return { status: 401 }
  }

  const res = await fetch(`https://api.spotify.com/v1${url}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })

  return res
}
