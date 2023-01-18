import { axios, withApiOptions } from '@/utils/api/axios'
import type * as T from '@/models/Api'

export const login = withApiOptions<T.LoginResponse, [T.LoginRequest]>(
  ({ baseUrl }, body) => {
    return axios.post(`${baseUrl}/api/auth/login/`, body)
  }
)

export const logout = withApiOptions(({ baseUrl, headers }) => {
  return axios.post(`${baseUrl}/api/auth/logout/`, {}, { headers })
})

export const getLoggedUser = withApiOptions<T.LoginRequest>(
  ({ baseUrl, headers }) => {
    return axios.get(`${baseUrl}/api/auth/me/`, { headers })
  }
)
