import httpClient from '@/shared/api/http'
import { TeamInfo } from '@/shared/types'

export async function getTeamInfo(teamId: string): Promise<TeamInfo> {
  return httpClient.get<TeamInfo>(`/teams/${teamId}`)
}
