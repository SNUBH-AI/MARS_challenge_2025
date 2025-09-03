import httpClient from '@/shared/api/http'
import { LoginCredentials, AuthResponse } from '@/shared/types'

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  return httpClient.post<AuthResponse>('/auth/login', credentials)
}

export async function logout(): Promise<void> {
  return httpClient.post('/auth/logout')
}

export async function validateToken(): Promise<boolean> {
  try {
    await httpClient.get('/auth/validate')
    return true
  } catch {
    return false
  }
}
