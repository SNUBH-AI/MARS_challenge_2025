import httpClient from '@/shared/api/http'
import { LoginCredentials, AuthResponse } from '@/shared/types'

// Use mockup data when API is not available
const USE_MOCK = true // Set to false when backend is ready

// Mock user data
const mockUsers = [
  { email: 'alpha@mars.com', apiToken: 'alpha-token-123', teamName: 'AlphaTeam', teamId: 'alphateam' },
  { email: 'beta@mars.com', apiToken: 'beta-token-456', teamName: 'BetaSquad', teamId: 'betasquad' },
  { email: 'gamma@mars.com', apiToken: 'gamma-token-789', teamName: 'GammaForce', teamId: 'gammaforce' },
  { email: 'delta@mars.com', apiToken: 'delta-token-012', teamName: 'DeltaRiders', teamId: 'deltariders' },
  { email: 'test@mars.com', apiToken: 'test-token-345', teamName: 'TestTeam', teamId: 'testteam' },
]

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  if (USE_MOCK) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Check if credentials match any mock user
    const user = mockUsers.find(
      u => u.email === credentials.email && u.apiToken === credentials.apiToken
    )
    
    if (user) {
      // Generate mock token
      const mockToken = btoa(JSON.stringify({ email: user.email, teamId: user.teamId, timestamp: Date.now() }))
      return {
        token: mockToken,
        team: {
          id: user.teamId,
          name: user.teamName,
          email: user.email,
        },
      }
    } else {
      throw new Error('Invalid email or API token')
    }
  }
  return httpClient.post<AuthResponse>('/auth/login', credentials)
}

export async function logout(): Promise<void> {
  if (USE_MOCK) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200))
    return
  }
  return httpClient.post('/auth/logout')
}

export async function validateToken(): Promise<boolean> {
  if (USE_MOCK) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100))
    // Check if there's a token in localStorage
    const auth = localStorage.getItem('auth')
    if (auth) {
      try {
        const { token } = JSON.parse(auth)
        return !!token
      } catch {
        return false
      }
    }
    return false
  }
  
  try {
    await httpClient.get('/auth/validate')
    return true
  } catch {
    return false
  }
}
