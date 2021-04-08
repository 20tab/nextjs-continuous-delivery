import { AxiosPromise } from 'axios'

export type ApiResponse <T> = AxiosPromise<T>

export interface ApiOptions {
  serverSide: boolean
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  firstName: string
  lastName: string
  username: string
  token: string
}
