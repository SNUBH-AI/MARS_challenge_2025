import httpClient from '@/shared/api/http'
import { DailyUsage } from '@/shared/types'

// Use mockup data when API is not available
const USE_MOCK = true // Set to false when backend is ready

// Generate mock usage data for the last N days
function generateMockUsageHistory(teamId: string, days: number): DailyUsage[] {
  const history: DailyUsage[] = []
  const today = new Date()
  
  // Different usage patterns for different teams
  const usagePatterns: Record<string, { base: number, variation: number }> = {
    'alphateam': { base: 80, variation: 15 },
    'betasquad': { base: 65, variation: 20 },
    'gammaforce': { base: 90, variation: 10 },
    'deltariders': { base: 70, variation: 25 },
    'testteam': { base: 30, variation: 15 },
  }
  
  const pattern = usagePatterns[teamId.toLowerCase()] || { base: 50, variation: 20 }
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)
    
    // Generate random usage based on team's pattern
    const requestCount = Math.floor(pattern.base + (Math.random() - 0.5) * pattern.variation)
    const computeTime = requestCount * (2 + Math.random() * 3) // 2-5 seconds per request
    const tokensUsed = requestCount * (1000 + Math.floor(Math.random() * 2000)) // 1000-3000 tokens per request
    
    history.push({
      date: date.toISOString().split('T')[0],
      requestCount: Math.max(0, requestCount),
      computeTime: Math.max(0, Math.floor(computeTime)),
      tokensUsed: Math.max(0, tokensUsed),
      costEstimate: Math.max(0, Number((tokensUsed * 0.00001).toFixed(2))), // $0.01 per 1000 tokens
    })
  }
  
  return history
}

export async function getDailyUsage(teamId: string): Promise<DailyUsage> {
  if (USE_MOCK) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Get today's usage from the history
    const todayUsage = generateMockUsageHistory(teamId, 1)[0]
    
    // Add some real-time variation for today
    const hoursPassed = new Date().getHours()
    const usagePercentage = hoursPassed / 24
    
    return {
      ...todayUsage,
      requestCount: Math.floor(todayUsage.requestCount * usagePercentage),
      computeTime: Math.floor(todayUsage.computeTime * usagePercentage),
      tokensUsed: Math.floor(todayUsage.tokensUsed * usagePercentage),
      costEstimate: Number((todayUsage.costEstimate * usagePercentage).toFixed(2)),
    }
  }
  return httpClient.get<DailyUsage>(`/teams/${teamId}/usage/today`)
}

export async function getUsageHistory(teamId: string, days: number = 7): Promise<DailyUsage[]> {
  if (USE_MOCK) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400))
    
    return generateMockUsageHistory(teamId, days)
  }
  return httpClient.get<DailyUsage[]>(`/teams/${teamId}/usage?days=${days}`)
}
