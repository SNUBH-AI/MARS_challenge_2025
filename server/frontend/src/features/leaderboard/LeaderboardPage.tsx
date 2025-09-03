import React, { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getLeaderboard } from './services/leaderboard.service'
import { LeaderboardTable } from './components/LeaderboardTable'
import { cn } from '@/shared/utils/classnames'

export function LeaderboardPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: getLeaderboard,
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  })

  // Set up data-testid for rows
  useEffect(() => {
    if (data) {
      const rows = document.querySelectorAll('.leaderboard-row')
      rows.forEach((row, index) => {
        row.setAttribute('data-testid', 'leaderboard-row')
      })
    }
  }, [data])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
            <div className="text-center py-4">
              <span className="text-gray-500">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                Failed to load leaderboard
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {(error as any).message || 'An error occurred while fetching the leaderboard'}
              </p>
              <button
                onClick={() => refetch()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Auto-refreshes every 30s</span>
                <button
                  onClick={() => refetch()}
                  className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  title="Refresh now"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <LeaderboardTable entries={data || []} />
        </div>
      </div>
    </div>
  )
}
