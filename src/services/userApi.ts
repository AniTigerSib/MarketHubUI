import { request } from './api'

export interface Profile {
  id: string
  username: string
  email: string
  displayName: string
  avatarUrl: string | null
  phone: string | null
}
export type ProfileUpdate = Pick<Profile, 'displayName' | 'avatarUrl' | 'phone'>

export function getMe(accessToken: string): Promise<Profile> {
  return request('/users/me', undefined, accessToken)
}

export function updateMe(accessToken: string, body: ProfileUpdate): Promise<Profile> {
  return request('/users/me', body, accessToken, 'PUT')
}
