// Team related types
export interface Team {
  id: string
  name: string
  email: string
}

export interface TeamInfo extends Team {
  bestScore: number
  totalSubmissions: number
}

// Auth related types
export interface LoginCredentials {
  email: string
  apiToken: string
}

export interface AuthResponse {
  team: Team
  token: string
}

export interface AuthState {
  team: Team | null
  token: string | null
  isAuthenticated: boolean
}

// Submission related types
export type SubmissionStatus = 'queued' | 'processing' | 'completed' | 'failed'

export interface Submission {
  id: string
  fileName: string
  status: SubmissionStatus
  score: number | null
  submittedAt: string
  isFinal: boolean
  error?: string
}

export interface SubmissionDetail extends Submission {
  logs?: string[]
  executionTime?: number
  memoryUsed?: number
}

// Leaderboard related types
export interface LeaderboardEntry {
  id: string
  teamName: string
  score: number
  submissionCount: number
  lastSubmissionAt: string
  rank: number
}

// Usage related types
export interface DailyUsage {
  date: string
  used: number
  limit: number
  remaining: number
}

// API response types
export interface ApiError {
  message: string
  code?: string
  details?: Record<string, any>
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}
