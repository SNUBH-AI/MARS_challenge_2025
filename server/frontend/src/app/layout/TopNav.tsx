import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '@/shared/auth/useAuth'
import { cn } from '@/shared/utils/classnames'

export function TopNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, team, logout } = useAuth()

  const navItems = [
    { path: '/leaderboard', label: 'Leaderboard' },
    { path: '/team', label: 'Dashboard', requireAuth: true },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-900">
                MARS Challenge
              </Link>
            </div>

            {/* Navigation Items */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => {
                if (item.requireAuth && !isAuthenticated) return null
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                      location.pathname === item.path
                        ? "border-blue-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    )}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  {team?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
