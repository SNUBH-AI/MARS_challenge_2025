import { AuthState, Team } from '@/shared/types'

const AUTH_KEY = 'auth'

export class Auth {
  static getAuthState(): AuthState {
    const authData = localStorage.getItem(AUTH_KEY)
    
    if (!authData) {
      return {
        team: null,
        token: null,
        isAuthenticated: false,
      }
    }

    try {
      const { team, token } = JSON.parse(authData)
      return {
        team,
        token,
        isAuthenticated: !!token,
      }
    } catch {
      return {
        team: null,
        token: null,
        isAuthenticated: false,
      }
    }
  }

  static setAuth(team: Team, token: string): void {
    const authData = { team, token }
    localStorage.setItem(AUTH_KEY, JSON.stringify(authData))
  }

  static clearAuth(): void {
    localStorage.removeItem(AUTH_KEY)
  }

  static isAuthenticated(): boolean {
    return this.getAuthState().isAuthenticated
  }

  static getToken(): string | null {
    return this.getAuthState().token
  }

  static getTeam(): Team | null {
    return this.getAuthState().team
  }
}

export default Auth
