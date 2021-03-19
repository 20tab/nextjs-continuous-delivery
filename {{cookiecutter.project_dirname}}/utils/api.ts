import axios from 'axios'

import * as T from '@/models/Api'

const composeBaseUrl = (options?: T.ApiOptions) => {
  return (
    options && options.serverSide
      ? process.env.INTERNAL_API_URL
      : process.env.NEXT_PUBLIC_API_URL
  ) || ''
}

axios.interceptors.request.use(config => {
  config.headers['Content-Type'] = 'application/json; charset=utf-8'
  return config
})

axios.interceptors.response.use(res => res, err => Promise.reject(err))

export const login = (body: T.LoginRequest, options?: T.ApiOptions) => {
  const baseUrl = composeBaseUrl(options)
  return axios.post<T.LoginResponse>(`${baseUrl}/api/auth/login/`, body)
}

export { axios }
