import { axios, withApiOptions } from '@/utils/api/axios'
import * as T from '@/models/Api'

export const login = withApiOptions<T.LoginResponse, [T.LoginRequest]>(
  ({ baseUrl }, body) => {
    return axios.post(`${baseUrl}/api/auth/login/`, body)
  }
)
