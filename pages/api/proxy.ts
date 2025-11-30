import type { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'

function rewriteHtml(html: string, upstream: string) {
  const proxyPrefix = '/api/proxy'
  // root-relative src/href
  html = html.replace(/(src|href)=["']\/([^"']*)["']/g, (m, attr, path) => {
    return `${attr}="${proxyPrefix}/${path}"`
  })
  // css url(/path)
  html = html.replace(/url\(\s*['"]?\/([^'")]+)['"]?\s*\)/g, (m, path) => {
    return `url(${proxyPrefix}/${path})`
  })
  // absolute upstream origin -> proxy
  try {
    const u = new URL(upstream)
    const abs = u.origin.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
    const absRegex = new RegExp(`(src|href)=["']${abs}(.*?)["']`, 'g')
    html = html.replace(absRegex, (m, attr, path) => {
      return `${attr}="/api/proxy${path}"`
    })
  } catch (e) {}
  return html
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const upstream = process.env.UPSTREAM_SITE || ''
  if (!upstream) {
    res.status(500).send('UPSTREAM_SITE not configured')
    return
  }
  const stripped = req.url?.replace(/^\/api\/proxy/, '') || '/'
  const url = new URL(stripped, upstream).toString()
  try {
    const upstreamRes = await fetch(url, {
      method: req.method,
      headers: {
        'User-Agent': 'Proxy'
      },
      body: ['POST','PUT','PATCH'].includes(req.method || '') ? req.body as any : undefined
    })
    const contentType = upstreamRes.headers.get('content-type') || ''
    if (!contentType.includes('text/html')) {
      res.setHeader('Content-Type', contentType)
      const buf = Buffer.from(await upstreamRes.arrayBuffer())
      res.send(buf)
      return
    }
    let html = await upstreamRes.text()
    html = rewriteHtml(html, upstream)
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.send(html)
  } catch (err) {
    console.error(err)
    res.status(502).send('Proxy error')
  }
}
