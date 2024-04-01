import axios from 'axios'
import { parseCookies } from 'nookies'

import type { ApiOptions } from '@/models/Api'
import type { AxiosPromise } from 'axios'

// with 'X-Api-Token' instead of 'Authorization' you can use endpoints
// that need authentication with traefik's basic auth
const AuthorizationKey = 'Authorization'

export type ApiConfig = {
  baseUrl: string
  headers: Record<string, string>
}

type AxiosHeaders = {
  'Accept-Language'?: string
  'Content-Type'?: string
  'X-CSRFToken'?: string
  [AuthorizationKey]?: string
  Cookie?: string
}

const composeHeaders = (options?: ApiOptions) => {
  const headers: AxiosHeaders = {}

  headers['Content-Type'] = 'application/json; charset=utf-8'

  if (options?.csrfToken) {
    headers['X-CSRFToken'] = options.csrfToken
    headers['Cookie'] = `csrftoken=${options.csrfToken}`
  }

  if (options?.token) {
    headers[AuthorizationKey] = `Token ${options.token}`
  }

  if (options?.locale) {
    headers['Accept-Language'] = options?.locale
  }

  return headers
}

// Request interceptor
axios.interceptors.request.use(config => {
  ;(config.headers as AxiosHeaders)['Content-Type'] =
    'application/json; charset=utf-8'
  if (parseCookies()?.NEXT_LOCALE) {
    const lang = parseCookies().NEXT_LOCALE as 'it' | 'en'
    ;(config.headers as AxiosHeaders)['Accept-Language'] = lang
  }
  ;(config.headers as AxiosHeaders)['Content-Type'] =
    'application/json; charset=utf-8'
  if (config.method !== 'get') {
    if (parseCookies()?.csrftoken) {
      ;(config.headers as AxiosHeaders)['X-CSRFToken'] =
        parseCookies().csrftoken
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
    const baseUrl =
      options && options.baseUrl
        ? options.baseUrl
        : serverSide
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
