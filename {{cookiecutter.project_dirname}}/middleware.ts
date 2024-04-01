import { NextResponse } from 'next/server'

import type { RequestCookies } from 'next/dist/server/web/spec-extension/cookies'
import type { NextRequest } from 'next/server'

const isLanguageSet = (cookies: RequestCookies) => {
  return cookies.get('NEXT_LOCALE')
}

export function middleware(req: NextRequest) {
  if (!isLanguageSet(req.cookies)) {
    const response = NextResponse.next()

    response.cookies.set('NEXT_LOCALE', req.nextUrl.locale)

    return response
  }
  return NextResponse.next()
}
