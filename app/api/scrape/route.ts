import { NextResponse } from 'next/server'
import * as dns from 'dns/promises'
import * as cheerio from 'cheerio'

const PRIVATE_IP_RE = [
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^169\.254\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^0\./,
  /^::1$/,
  /^fc/,
  /^fd/,
]

function isPrivateIP(ip: string): boolean {
  return PRIVATE_IP_RE.some(re => re.test(ip))
}

async function assertSSRFSafe(hostname: string): Promise<void> {
  let addresses: string[]
  try {
    const results = await dns.resolve(hostname)
    addresses = results
  } catch {
    // If DNS fails, treat as safe to attempt (will fail at fetch anyway)
    return
  }

  for (const addr of addresses) {
    if (isPrivateIP(addr)) {
      throw new Error('SSRF: private IP blocked')
    }
  }
}

function extractMeta(html: string, url: string) {
  const $ = cheerio.load(html)

  const og = (name: string) =>
    $(`meta[property="og:${name}"]`).attr('content') ?? undefined

  const meta = (name: string) =>
    $(`meta[name="${name}"]`).attr('content') ?? undefined

  const title =
    og('title') ??
    meta('twitter:title') ??
    $('title').text().trim() ??
    undefined

  const description =
    og('description') ??
    meta('description') ??
    meta('twitter:description') ??
    undefined

  const image =
    og('image') ??
    meta('twitter:image') ??
    undefined

  const siteName = og('site_name') ?? undefined

  const hostname = (() => {
    try { return new URL(url).hostname } catch { return undefined }
  })()

  return { title, description, image, siteName, url, hostname }
}

export async function POST(request: Request) {
  let body: { url?: string }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }

  const { url } = body

  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: 'url is required' }, { status: 400 })
  }

  // Validate URL format
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return NextResponse.json({ error: 'invalid url' }, { status: 400 })
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return NextResponse.json({ error: 'only http/https allowed' }, { status: 400 })
  }

  // SSRF protection
  try {
    await assertSSRFSafe(parsed.hostname)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'blocked'
    return NextResponse.json({ error: message }, { status: 403 })
  }

  // Fetch with a timeout and size limit
  let html: string
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'ememo-scraper/1.0 (+https://ememo.app)',
        Accept: 'text/html,application/xhtml+xml',
      },
      redirect: 'follow',
    })
    clearTimeout(timeout)

    if (!res.ok) {
      return NextResponse.json({ error: `fetch failed: ${res.status}` }, { status: 502 })
    }

    const contentType = res.headers.get('content-type') ?? ''
    if (!contentType.includes('text/html')) {
      return NextResponse.json({ error: 'not an html page' }, { status: 422 })
    }

    // Limit response size to 500KB
    const buffer = await res.arrayBuffer()
    if (buffer.byteLength > 500_000) {
      html = new TextDecoder().decode(buffer.slice(0, 500_000))
    } else {
      html = new TextDecoder().decode(buffer)
    }
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      return NextResponse.json({ error: 'request timed out' }, { status: 504 })
    }
    return NextResponse.json({ error: 'fetch error' }, { status: 502 })
  }

  const meta = extractMeta(html, url)
  return NextResponse.json(meta)
}
