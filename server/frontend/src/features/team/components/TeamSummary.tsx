import React from 'react'
import { TeamInfo, DailyUsage } from '@/shared/types'

interface TeamSummaryProps {
  teamInfo: TeamInfo
  dailyUsage: DailyUsage
}

export function TeamSummary({ teamInfo, dailyUsage }: TeamSummaryProps) {
  const usagePercentage = (dailyUsage.used / dailyUsage.limit) * 100

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Team Info */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{teamInfo.name}</h2>
          <p className="text-sm text-gray-500 mt-1">{teamInfo.email}</p>
        </div>

        {/* Best Score */}
        <div className="text-center">
          <p className="text-sm text-gray-500">Best Score</p>
          <p className="text-3xl font-bold text-blue-600">{teamInfo.bestScore.toFixed(1)}</p>
          <p className="text-xs text-gray-500 mt-1">Total Submissions: {teamInfo.totalSubmissions}</p>
        </div>

        {/* Daily Usage */}
        <div>
          <p className="text-sm text-gray-500">Submissions Today: {dailyUsage.used} / {dailyUsage.limit}</p>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">{dailyUsage.remaining} remaining</p>
        </div>
      </div>
    </div>
  )
}
