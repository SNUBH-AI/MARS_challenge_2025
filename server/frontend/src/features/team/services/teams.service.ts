import httpClient from '@/shared/api/http'
import { TeamInfo } from '@/shared/types'

// Use mockup data when API is not available
const USE_MOCK = true // Set to false when backend is ready

// Mock team data
const mockTeamsData: Record<string, TeamInfo> = {
  'alphateam': {
    teamId: 'alphateam',
    teamName: 'AlphaTeam',
    currentRank: 1,
    bestScore: 0.95,
    totalSubmissions: 12,
    remainingSubmissions: 88,
    lastSubmission: new Date('2024-01-15T10:30:00').toISOString(),
    createdAt: new Date('2024-01-01T09:00:00').toISOString(),
  },
  'betasquad': {
    teamId: 'betasquad',
    teamName: 'BetaSquad',
    currentRank: 2,
    bestScore: 0.93,
    totalSubmissions: 8,
    remainingSubmissions: 92,
    lastSubmission: new Date('2024-01-15T09:45:00').toISOString(),
    createdAt: new Date('2024-01-01T10:00:00').toISOString(),
  },
  'gammaforce': {
    teamId: 'gammaforce',
    teamName: 'GammaForce',
    currentRank: 3,
    bestScore: 0.91,
    totalSubmissions: 15,
    remainingSubmissions: 85,
    lastSubmission: new Date('2024-01-15T11:20:00').toISOString(),
    createdAt: new Date('2024-01-01T11:00:00').toISOString(),
  },
  'deltariders': {
    teamId: 'deltariders',
    teamName: 'DeltaRiders',
    currentRank: 4,
    bestScore: 0.89,
    totalSubmissions: 10,
    remainingSubmissions: 90,
    lastSubmission: new Date('2024-01-14T16:30:00').toISOString(),
    createdAt: new Date('2024-01-01T12:00:00').toISOString(),
  },
  'testteam': {
    teamId: 'testteam',
    teamName: 'TestTeam',
    currentRank: 10,
    bestScore: 0.75,
    totalSubmissions: 3,
    remainingSubmissions: 97,
    lastSubmission: new Date('2024-01-14T08:00:00').toISOString(),
    createdAt: new Date('2024-01-02T09:00:00').toISOString(),
  },
}

export async function getTeamInfo(teamId: string): Promise<TeamInfo> {
  if (USE_MOCK) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const teamData = mockTeamsData[teamId.toLowerCase()]
    if (teamData) {
      return teamData
    }
    
    // Return default data if team not found
    return {
      teamId: teamId,
      teamName: teamId.charAt(0).toUpperCase() + teamId.slice(1),
      currentRank: 999,
      bestScore: 0,
      totalSubmissions: 0,
      remainingSubmissions: 100,
      lastSubmission: null,
      createdAt: new Date().toISOString(),
    }
  }
  return httpClient.get<TeamInfo>(`/teams/${teamId}`)
}
