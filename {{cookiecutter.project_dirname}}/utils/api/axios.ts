import axios, { AxiosPromise } from 'axios'
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

const composeHeaders = (options?: ApiOptions) => {
  const headers = {}
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
  if (typeof window !== 'undefined')
    config.headers['Accept-Language'] = languages[window?.__NEXT_DATA__?.locale]

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

const getPublicApiURL = () => {
  const isServer = typeof window === 'undefined'

  if (isServer) {
    return process.env.NEXT_PUBLIC_PROJECT_URL
  } else {
    const state = window.__NEXT_DATA__?.props?.initialState
    return state?.utils?.envs?.NEXT_PUBLIC_PROJECT_URL || ''
  }
}

// Attach options (ApiOptions) to and api function
const withApiOptions = <Response, Args extends unknown[] = []>(
  apiFunction: (config: ApiConfig, ...args: Args) => AxiosPromise<Response>
) => {
  return (options: ApiOptions, ...args: Args) => {
    const serverSide = options && options.serverSide
    const headers = composeHeaders(options)
    const config = {
      baseUrl: serverSide
        ? /* istanbul ignore next */ process?.env?.INTERNAL_API_URL
        : getPublicApiURL(),
      headers
    }

    return apiFunction(config, ...args)
  }
}

export { axios, withApiOptions }
