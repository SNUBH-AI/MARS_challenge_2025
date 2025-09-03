import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthState, Team } from '@/shared/types'
import Auth from './auth'

export function useAuth() {
  const navigate = useNavigate()
  const [authState, setAuthState] = useState<AuthState>(Auth.getAuthState())

  useEffect(() => {
    // Listen for storage changes (e.g., logout in another tab)
    const handleStorageChange = () => {
      setAuthState(Auth.getAuthState())
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const login = (team: Team, token: string) => {
    Auth.setAuth(team, token)
    setAuthState({
      team,
      token,
      isAuthenticated: true,
    })
  }

  const logout = () => {
    Auth.clearAuth()
    setAuthState({
      team: null,
      token: null,
      isAuthenticated: false,
    })
    navigate('/login')
  }

  return {
    ...authState,
    login,
    logout,
  }
}

export default useAuth
