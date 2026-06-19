import { NextResponse } from 'next/server'

interface SpotifyTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

interface SpotifyImage {
  url: string
  height: number
  width: number
}

interface SpotifyTrack {
  id: string
  name: string
  external_urls: { spotify: string }
  artists: Array<{ name: string }>
  album: { name: string; images: SpotifyImage[] }
  preview_url: string | null
}

interface SpotifySearchResult {
  tracks: { items: SpotifyTrack[] }
}

async function getAccessToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('Spotify credentials not configured')
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`Spotify auth failed: ${res.status}`)
  }

  const data = (await res.json()) as SpotifyTokenResponse
  return data.access_token
}

function extractTrackId(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (parsed.hostname !== 'open.spotify.com') return null
    const match = parsed.pathname.match(/^\/track\/([A-Za-z0-9]+)/)
    return match ? match[1] : null
  } catch {
    return null
  }
}

function formatTrack(track: SpotifyTrack) {
  const artistNames = track.artists.map(a => a.name).join(', ')
  const albumName = track.album.name
  const image = track.album.images[0]?.url ?? null

  return {
    title: track.name,
    subtitle: `${artistNames} · ${albumName}`,
    thumbnail_url: image,
    external_url: track.external_urls.spotify,
    spotify_id: track.id,
    embed_url: `https://open.spotify.com/embed/track/${track.id}`,
  }
}

export async function POST(request: Request) {
  let body: { url?: string; query?: string }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }

  const { url, query } = body

  if (!url && !query) {
    return NextResponse.json({ error: 'provide url or query' }, { status: 400 })
  }

  try {
    const token = await getAccessToken()

    let track: SpotifyTrack

    const trackId = url ? extractTrackId(url) : null

    if (trackId) {
      // Direct track lookup by ID
      const res = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      })
      if (!res.ok) {
        return NextResponse.json({ error: 'track not found' }, { status: 404 })
      }
      track = (await res.json()) as SpotifyTrack
    } else {
      // Search by query (or URL that's not a track link)
      const searchTerm = query ?? url ?? ''
      const params = new URLSearchParams({ q: searchTerm, type: 'track', limit: '1' })
      const res = await fetch(`https://api.spotify.com/v1/search?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      })
      if (!res.ok) {
        return NextResponse.json({ error: 'search failed' }, { status: 502 })
      }
      const data = (await res.json()) as SpotifySearchResult
      const first = data.tracks.items[0]
      if (!first) {
        return NextResponse.json({ error: 'no results' }, { status: 404 })
      }
      track = first
    }

    return NextResponse.json(formatTrack(track))
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
