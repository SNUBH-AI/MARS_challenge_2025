import React from 'react'
import { useNavigate } from 'react-router-dom'
import { LeaderboardEntry } from '@/shared/types'
import { formatRelativeTime } from '@/shared/utils/date'
import { cn } from '@/shared/utils/classnames'
import useAuth from '@/shared/auth/useAuth'

interface LeaderboardTableProps {
  entries: LeaderboardEntry[]
}

export function LeaderboardTable({ entries }: LeaderboardTableProps) {
  const navigate = useNavigate()
  const { team } = useAuth()

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-50' // Gold
      case 2:
        return 'bg-gray-50' // Silver
      case 3:
        return 'bg-orange-50' // Bronze
      default:
        return ''
    }
  }

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇'
      case 2:
        return '🥈'
      case 3:
        return '🥉'
      default:
        return "" + rank.toString()
    }
  }

  const handleRowClick = (entry: LeaderboardEntry) => {
    if (team && entry.id === team.id) {
      navigate('/team')
    }
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No teams have submitted yet</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rank
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Team Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Score
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Submissions
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Submission
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {entries.map((entry) => (
            <tr
              key={entry.id}
              data-testid={`leaderboard-row-${entry.id}`}
              className={cn(
                "hover:bg-gray-50 transition-colors",
                getRankStyle(entry.rank),
                team && entry.id === team.id && "cursor-pointer font-semibold",
                "leaderboard-row"
              )}
              onClick={() => handleRowClick(entry)}
            >
              <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-900">
                <span className="text-lg">{getRankBadge(entry.rank)}</span>
              </td>
              <td 
                className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-900"
                data-testid="team-name"
              >
                <div className="flex items-center">
                  <span>{entry.teamName}</span>
                  {team && entry.id === team.id && (
                    <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      Your Team
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-900">
                <span className="font-mono font-semibold">{entry.score.toFixed(1)}</span>
              </td>
              <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-900">
                {entry.submissionCount}
              </td>
              <td 
                className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-500"
                data-testid={`last-submission-${entry.id}`}
              >
                {formatRelativeTime(entry.lastSubmissionAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
