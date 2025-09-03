import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { login } from './services/auth.service'
import { LoginCredentials } from '@/shared/types'
import { isValidEmail } from '@/shared/utils/validators'
import { cn } from '@/shared/utils/classnames'
import useAuth from '@/shared/auth/useAuth'

export function LoginPage() {
  const navigate = useNavigate()
  const { login: setAuth } = useAuth()
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    apiToken: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth(data.team, data.token)
      navigate('/leaderboard')
    },
    onError: (error: any) => {
      setErrors({
        form: error.message || 'Invalid credentials',
      })
    },
  })

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.apiToken) {
      newErrors.apiToken = 'API Token is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      loginMutation.mutate(formData)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your team account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your team email and API token to access the dashboard
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          {errors.form && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-800">{errors.form}</div>
            </div>
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={cn(
                  "appearance-none relative block w-full px-3 py-2 border rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm",
                  errors.email ? "border-red-300" : "border-gray-300"
                )}
                placeholder="team@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="apiToken" className="block text-sm font-medium text-gray-700 mb-1">
                API Token
              </label>
              <input
                id="apiToken"
                name="apiToken"
                type="password"
                autoComplete="current-password"
                required
                value={formData.apiToken}
                onChange={handleChange}
                className={cn(
                  "appearance-none relative block w-full px-3 py-2 border rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm",
                  errors.apiToken ? "border-red-300" : "border-gray-300"
                )}
                placeholder="Enter your API token"
              />
              {errors.apiToken && (
                <p className="mt-1 text-sm text-red-600">{errors.apiToken}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className={cn(
                "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                loginMutation.isPending
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              )}
            >
              {loginMutation.isPending ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
