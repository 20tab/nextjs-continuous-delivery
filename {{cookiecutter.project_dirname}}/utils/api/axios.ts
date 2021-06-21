import axios, { AxiosPromise } from 'axios'

export interface ApiOptions {
  serverSide?: boolean
  token?: string
}

export type ApiConfig = {
  baseUrl: string
  headers: Record<string, string>
}

const composeHeaders = (options?: ApiOptions) => {
  const headers = {}

  if (options?.token) {
    headers['Authorization'] = `Token ${options.token}`
  }

  return headers
}

// Request interceptor
axios.interceptors.request.use(config => {
  config.headers['Content-Type'] = 'application/json; charset=utf-8'

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
    return process.env.NEXT_PUBLIC_API_URL
  } else {
    const state = window.__NEXT_DATA__?.props?.initialState
    return state.utils?.envs?.NEXT_PUBLIC_API_URL || ''
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
      baseUrl: serverSide ? process?.env?.INTERNAL_API_URL : getPublicApiURL(),
      headers
    }

    return apiFunction(config, ...args)
  }
}

export { axios, withApiOptions }
