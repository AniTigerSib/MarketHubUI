import { request } from './api'

export interface Tokens {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  displayName?: string
}

export interface RegisterResponse {
  userId: string
  username: string
  email: string
}

export function login(login: string, password: string): Promise<Tokens> {
  return request('/auth/login', { login, password })
}

export function register(body: RegisterRequest): Promise<RegisterResponse> {
  return request('/auth/register', body)
}

export function refresh(refreshToken: string): Promise<Tokens> {
  return request('/auth/refresh', { refreshToken })
}

export function logout(refreshToken: string, accessToken: string): Promise<void> {
  return request('/auth/logout', { refreshToken }, accessToken)
}
