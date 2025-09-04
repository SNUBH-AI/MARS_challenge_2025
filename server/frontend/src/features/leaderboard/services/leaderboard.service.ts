import httpClient from '@/shared/api/http'
import { LeaderboardEntry } from '@/shared/types'

// Mockup data for development
const mockLeaderboardData: LeaderboardEntry[] = [
  {
    id: 'alphateam',
    rank: 1,
    teamName: 'AlphaTeam',
    score: 0.95,
    lastSubmissionAt: new Date('2024-01-15T10:30:00').toISOString(),
    submissionCount: 12,
  },
  {
    id: 'betasquad',
    rank: 2,
    teamName: 'BetaSquad',
    score: 0.93,
    lastSubmissionAt: new Date('2024-01-15T09:45:00').toISOString(),
    submissionCount: 8,
  },
  {
    id: 'gammaforce',
    rank: 3,
    teamName: 'GammaForce',
    score: 0.91,
    lastSubmissionAt: new Date('2024-01-15T11:20:00').toISOString(),
    submissionCount: 15,
  },
  {
    id: 'deltariders',
    rank: 4,
    teamName: 'DeltaRiders',
    score: 0.89,
    lastSubmissionAt: new Date('2024-01-14T16:30:00').toISOString(),
    submissionCount: 10,
  },
  {
    id: 'epsiloncrew',
    rank: 5,
    teamName: 'EpsilonCrew',
    score: 0.87,
    lastSubmissionAt: new Date('2024-01-14T14:15:00').toISOString(),
    submissionCount: 7,
  },
  {
    id: 'zetawarriors',
    rank: 6,
    teamName: 'ZetaWarriors',
    score: 0.85,
    lastSubmissionAt: new Date('2024-01-14T12:00:00').toISOString(),
    submissionCount: 9,
  },
  {
    id: 'thetaminds',
    rank: 7,
    teamName: 'ThetaMinds',
    score: 0.83,
    lastSubmissionAt: new Date('2024-01-13T18:45:00').toISOString(),
    submissionCount: 6,
  },
  {
    id: 'iotainnovators',
    rank: 8,
    teamName: 'IotaInnovators',
    score: 0.80,
    lastSubmissionAt: new Date('2024-01-13T15:30:00').toISOString(),
    submissionCount: 5,
  },
  {
    id: 'iotainnovators',
    rank: 8,
    teamName: 'IotaInnovators',
    score: 0.80,
    lastSubmissionAt: new Date('2024-01-13T15:30:00').toISOString(),
    submissionCount: 5,
  },
  {
    id: 'iotainnovators',
    rank: 8,
    teamName: 'IotaInnovators',
    score: 0.80,
    lastSubmissionAt: new Date('2024-01-13T15:30:00').toISOString(),
    submissionCount: 5,
  },
  {
    id: 'iotainnovators',
    rank: 8,
    teamName: 'IotaInnovators',
    score: 0.80,
    lastSubmissionAt: new Date('2024-01-13T15:30:00').toISOString(),
    submissionCount: 5,
  },
  {
    id: 'iotainnovators',
    rank: 8,
    teamName: 'IotaInnovators',
    score: 0.80,
    lastSubmissionAt: new Date('2024-01-13T15:30:00').toISOString(),
    submissionCount: 5,
  },
]

// Use mockup data when API is not available
const USE_MOCK = true // Set to false when backend is ready

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  if (USE_MOCK) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockLeaderboardData
  }
  return httpClient.get<LeaderboardEntry[]>('/leaderboard')
}

export async function getTeamRank(teamId: string): Promise<number> {
  if (USE_MOCK) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300))
    // Find team rank from mock data
    const team = mockLeaderboardData.find(entry => 
      entry.teamName.toLowerCase() === teamId.toLowerCase()
    )
    return team?.rank || 999
  }
  return httpClient.get<number>(`/leaderboard/team/${teamId}/rank`)
}
