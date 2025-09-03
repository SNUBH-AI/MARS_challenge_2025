import React, { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { TeamSummary } from './components/TeamSummary'
import { FileUpload } from './components/FileUpload'
import { SubmissionList } from './components/SubmissionList'
import { getTeamInfo } from './services/teams.service'
import { getRecentSubmissions, submitSolution } from './services/submissions.service'
import { getDailyUsage } from './services/usage.service'
import useAuth from '@/shared/auth/useAuth'
import { Submission } from '@/shared/types'

export function TeamDashboardPage() {
  const { team } = useAuth()
  const queryClient = useQueryClient()

  if (!team) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Not Authenticated</h2>
          <p className="text-gray-600">Please login to view your dashboard</p>
        </div>
      </div>
    )
  }

  const { data: teamInfo, isLoading: isLoadingTeam, error: teamError } = useQuery({
    queryKey: ['teamInfo', team.id],
    queryFn: () => getTeamInfo(team.id),
  })

  const { data: submissions, isLoading: isLoadingSubmissions } = useQuery({
    queryKey: ['recentSubmissions', team.id],
    queryFn: () => getRecentSubmissions(team.id, 5),
    refetchInterval: (query) => {
      // Poll every 5 seconds if there are processing submissions
      const data = query.state.data as Submission[] | undefined
      const hasProcessing = data?.some(s => s.status === 'processing' || s.status === 'queued')
      return hasProcessing ? 5000 : false
    },
  })

  const { data: dailyUsage, isLoading: isLoadingUsage } = useQuery({
    queryKey: ['dailyUsage', team.id],
    queryFn: () => getDailyUsage(team.id),
  })

  const uploadMutation = useMutation({
    mutationFn: submitSolution,
    onSuccess: () => {
      // Refetch submissions and usage after upload
      queryClient.invalidateQueries({ queryKey: ['recentSubmissions', team.id] })
      queryClient.invalidateQueries({ queryKey: ['dailyUsage', team.id] })
    },
  })

  const handleFileUpload = (file: File) => {
    uploadMutation.mutate(file)
  }

  const isLoading = isLoadingTeam || isLoadingSubmissions || isLoadingUsage

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
            <p className="text-center text-gray-500 mt-4">Loading team data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (teamError) {
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
                Failed to load team data
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {(teamError as any).message || 'An error occurred while fetching team information'}
              </p>
              <button
                onClick={() => window.location.reload()}
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

  const canUpload = dailyUsage && dailyUsage.remaining > 0

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Team Summary */}
        {teamInfo && dailyUsage && (
          <TeamSummary teamInfo={teamInfo} dailyUsage={dailyUsage} />
        )}

        {/* File Upload */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Solution</h3>
          <FileUpload
            onUpload={handleFileUpload}
            disabled={!canUpload}
            isUploading={uploadMutation.isPending}
          />
          {uploadMutation.isError && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded">
              {(uploadMutation.error as any).message || 'Failed to upload file'}
            </div>
          )}
          {uploadMutation.isSuccess && (
            <div className="mt-4 p-3 bg-green-50 text-green-700 rounded">
              File uploaded successfully!
            </div>
          )}
        </div>

        {/* Recent Submissions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Submissions</h3>
          <SubmissionList submissions={submissions || []} />
        </div>
      </div>
    </div>
  )
}
