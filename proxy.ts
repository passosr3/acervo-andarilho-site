import { NextRequest, NextResponse } from 'next/server'

const PROTECTED_PREFIXES = ['/account', '/purchases', '/admin']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Pass pathname to root layout via request header (used for conditional chrome)
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)

  // Auth guard: redirect unauthenticated users to login
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  if (isProtected) {
    const cookie = request.cookies.get('pb_auth')
    let isAuthenticated = false

    if (cookie?.value) {
      try {
        // pb_auth value is a JSON string: {"token":"...","record":{...}}
        const parsed = JSON.parse(decodeURIComponent(cookie.value))
        isAuthenticated = typeof parsed?.token === 'string' && parsed.token.length > 0
      } catch {
        isAuthenticated = false
      }
    }

    if (!isAuthenticated) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/auth/login'
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl, {
        headers: { 'x-pathname': pathname },
      })
    }
  }

  // Redirect already-authenticated users away from auth pages
  const isAuthPage = pathname.startsWith('/auth/')
  if (isAuthPage) {
    const cookie = request.cookies.get('pb_auth')
    let isAuthenticated = false

    if (cookie?.value) {
      try {
        const parsed = JSON.parse(decodeURIComponent(cookie.value))
        isAuthenticated = typeof parsed?.token === 'string' && parsed.token.length > 0
      } catch {
        isAuthenticated = false
      }
    }

    if (isAuthenticated) {
      const redirect = request.nextUrl.searchParams.get('redirect') || '/account'
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = redirect
      redirectUrl.search = ''
      return NextResponse.redirect(redirectUrl)
    }
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  })
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public assets
     */
    '/((?!_next/static|_next/image|favicon\\.ico|images|icons|fonts|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.webp$).*)',
  ],
}
