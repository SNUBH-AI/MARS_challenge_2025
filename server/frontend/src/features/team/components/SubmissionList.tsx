import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Submission } from '@/shared/types'
import { formatRelativeTime } from '@/shared/utils/date'
import { cn } from '@/shared/utils/classnames'

interface SubmissionListProps {
  submissions: Submission[]
}

export function SubmissionList({ submissions }: SubmissionListProps) {
  const navigate = useNavigate()

  const getStatusColor = (status: Submission['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'queued':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No submissions yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {submissions.map((submission) => (
        <div
          key={submission.id}
          data-testid={`submission-${submission.id}`}
          className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate(`/team/submissions/${submission.id}`)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h4 className="font-medium text-gray-900">{submission.fileName}</h4>
                <span
                  data-testid={`status-${submission.id}`}
                  className={cn(
                    "px-2 py-1 text-xs font-medium rounded-full",
                    getStatusColor(submission.status)
                  )}
                >
                  {submission.status}
                </span>
                {submission.isFinal && (
                  <span
                    data-testid={`final-badge-${submission.id}`}
                    className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full"
                  >
                    Final
                  </span>
                )}
              </div>

              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                <span>{formatRelativeTime(submission.submittedAt)}</span>
                {submission.score !== null && (
                  <span className="font-semibold text-gray-900">
                    Score: {submission.score.toFixed(1)}
                  </span>
                )}
              </div>

              {submission.error && (
                <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-700">
                  {submission.error}
                </div>
              )}
            </div>

            <div className="ml-4">
              {submission.status === 'processing' && (
                <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
