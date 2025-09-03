import httpClient from '@/shared/api/http'
import { DailyUsage } from '@/shared/types'

export async function getDailyUsage(teamId: string): Promise<DailyUsage> {
  return httpClient.get<DailyUsage>(`/teams/${teamId}/usage/today`)
}

export async function getUsageHistory(teamId: string, days: number = 7): Promise<DailyUsage[]> {
  return httpClient.get<DailyUsage[]>(`/teams/${teamId}/usage?days=${days}`)
}
