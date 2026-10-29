import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE, verifySessionToken } from '@/lib/session'

/**
 * First line of defence for everything under /admin and /api/admin: visitors without a valid signed session
 * never reach the page, its data, or the upload endpoints. (Pages and actions also check the session themselves.)
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isApi = pathname.startsWith('/api/')
  const isLogin = pathname === '/admin/login'
  const authed = verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value)

  if (!authed && !isLogin) {
    if (isApi)
      return NextResponse.json(
        { error: 'Not signed in.' },
        { status: 401, headers: { 'Cache-Control': 'no-store' } },
      )
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    url.search = ''
    return NextResponse.redirect(url, { headers: { 'Cache-Control': 'no-store' } })
  }

  const response = NextResponse.next()
  response.headers.set('Cache-Control', 'no-store') // never let a browser or CDN keep admin pages
  return response
}

export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] }
