import type { AxiosPromise } from 'axios'
import axios from 'axios'
import { parseCookies } from 'nookies'

export interface ApiOptions {
  serverSide?: boolean
  csrfToken?: string
  sessionId?: string
  csrfCookie?: boolean
  locale?: string
}

export type ApiConfig = {
  baseUrl: string
  headers: Record<string, string>
}

type AxiosHeaders = {
  'Accept-Language'?: string
  'Content-Type'?: string
  'X-CSRFToken'?: string
  Authorization?: string
  Cookie?: string
}

const composeHeaders = (options?: ApiOptions) => {
  const headers: AxiosHeaders = {}
  if (options?.csrfToken) {
    headers['X-CSRFToken'] = options.csrfToken
    headers['Cookie'] = `csrftoken=${options.csrfToken}`
  }

  if (options?.sessionId) {
    const prevCookies = headers['Cookie'] ? `${headers['Cookie']}; ` : ''
    headers['Cookie'] = prevCookies + `sessionid=${options.sessionId}`
  }

  return headers
}

const languages = {
  en: 'en-US',
  it: 'it-IT'
}

// Request interceptor
axios.interceptors.request.use(config => {
  ;(config.headers as AxiosHeaders)['Content-Type'] =
    'application/json; charset=utf-8'
  if (parseCookies()?.NEXT_LOCALE) {
    const lang = parseCookies().NEXT_LOCALE as 'it' | 'en'
    ;(config.headers as AxiosHeaders)['Accept-Language'] = languages[lang]
  }
  config.headers['Content-Type'] = 'application/json; charset=utf-8'
  if (config.method !== 'get') {
    if (parseCookies()?.csrftoken) {
      config.headers['X-CSRFToken'] = parseCookies().csrftoken
    }
  }
  return config
})

// Response interceptor
axios.interceptors.response.use(
  res => res,
  err => Promise.reject(err)
)

// Attach options (ApiOptions) to and api function
const withApiOptions = <Response, Args extends unknown[] = []>(
  apiFunction: (config: ApiConfig, ...args: Args) => AxiosPromise<Response>
) => {
  return (options: ApiOptions, ...args: Args) => {
    const serverSide = options && options.serverSide
    const headers = composeHeaders(options)
    const baseUrl = serverSide
      ? process?.env?.INTERNAL_BACKEND_URL || ''
      : process?.env?.NEXT_PUBLIC_PROJECT_URL || ''
    const config = {
      baseUrl: baseUrl,
      headers
    }

    return apiFunction(config, ...args)
  }
}

export { axios, withApiOptions }