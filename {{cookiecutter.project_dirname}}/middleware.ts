import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'
import type { RequestCookies } from 'next/dist/server/web/spec-extension/cookies'
import { Theme } from '@/src/models/Utils'

const isLanguageSet = (cookies: RequestCookies) => {
  return cookies.get('NEXT_LOCALE')
}

const isThemeSet = (cookies: RequestCookies) => {
  return cookies.get('THEME')
}

export function middleware(req: NextRequest) {
  if (!isThemeSet(req.cookies)) {
    const response = NextResponse.next()

    response.cookies.set('THEME', Theme.light)

    return response
  }
  if (!isLanguageSet(req.cookies)) {
    const response = NextResponse.next()

    response.cookies.set('NEXT_LOCALE', req.nextUrl.locale)

    return response
  }
  return NextResponse.next()
}
