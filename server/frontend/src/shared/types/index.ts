// Team related types
export interface Team {
  id: string
  name: string
  email: string
}

export interface TeamInfo {
  teamId: string
  teamName: string
  currentRank: number
  bestScore: number
  totalSubmissions: number
  remainingSubmissions: number
  lastSubmission: string | null
  createdAt: string
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
  teamId: string
  fileName: string
  status: SubmissionStatus
  score: number
  submittedAt: string
  isFinal: boolean
  error?: string
}

export interface SubmissionDetail extends Submission {
  fileSize: number
  processingTime: number
  errorMessage: string | null
  metrics: {
    accuracy: number
    precision: number
    recall: number
    f1Score: number
  } | null
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
  requestCount: number
  computeTime: number
  tokensUsed: number
  costEstimate: number
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
