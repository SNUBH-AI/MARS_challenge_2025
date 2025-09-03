import httpClient from '@/shared/api/http'
import { LeaderboardEntry } from '@/shared/types'

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  return httpClient.get<LeaderboardEntry[]>('/leaderboard')
}

export async function getTeamRank(teamId: string): Promise<number> {
  return httpClient.get<number>(`/leaderboard/team/${teamId}/rank`)
}
