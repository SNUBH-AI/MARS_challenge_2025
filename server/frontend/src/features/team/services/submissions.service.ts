import httpClient from '@/shared/api/http'
import { Submission, SubmissionDetail } from '@/shared/types'

// Use mockup data when API is not available
const USE_MOCK = true // Set to false when backend is ready

// Mock submissions data
const mockSubmissionsData: Record<string, Submission[]> = {
  'alphateam': [
    {
      id: 'sub-alpha-12',
      teamId: 'alphateam',
      submittedAt: new Date('2024-01-15T10:30:00').toISOString(),
      score: 0.95,
      status: 'completed',
      isFinal: true,
      fileName: 'solution_v12.csv',
    },
    {
      id: 'sub-alpha-11',
      teamId: 'alphateam',
      submittedAt: new Date('2024-01-15T09:15:00').toISOString(),
      score: 0.94,
      status: 'completed',
      isFinal: false,
      fileName: 'solution_v11.csv',
    },
    {
      id: 'sub-alpha-10',
      teamId: 'alphateam',
      submittedAt: new Date('2024-01-14T16:45:00').toISOString(),
      score: 0.92,
      status: 'completed',
      isFinal: false,
      fileName: 'solution_v10.csv',
    },
    {
      id: 'sub-alpha-9',
      teamId: 'alphateam',
      submittedAt: new Date('2024-01-14T14:20:00').toISOString(),
      score: 0.90,
      status: 'completed',
      isFinal: false,
      fileName: 'solution_v9.csv',
    },
    {
      id: 'sub-alpha-8',
      teamId: 'alphateam',
      submittedAt: new Date('2024-01-14T10:00:00').toISOString(),
      score: 0.88,
      status: 'completed',
      isFinal: false,
      fileName: 'solution_v8.csv',
    },
  ],
  'testteam': [
    {
      id: 'sub-test-3',
      teamId: 'testteam',
      submittedAt: new Date('2024-01-14T08:00:00').toISOString(),
      score: 0.75,
      status: 'completed',
      isFinal: true,
      fileName: 'test_solution_3.csv',
    },
    {
      id: 'sub-test-2',
      teamId: 'testteam',
      submittedAt: new Date('2024-01-13T15:30:00').toISOString(),
      score: 0.72,
      status: 'completed',
      isFinal: false,
      fileName: 'test_solution_2.csv',
    },
    {
      id: 'sub-test-1',
      teamId: 'testteam',
      submittedAt: new Date('2024-01-13T09:00:00').toISOString(),
      score: 0.68,
      status: 'completed',
      isFinal: false,
      fileName: 'test_solution_1.csv',
    },
  ],
}

// Mock submission details
const mockSubmissionDetails: Record<string, SubmissionDetail> = {
  'sub-alpha-12': {
    id: 'sub-alpha-12',
    teamId: 'alphateam',
    submittedAt: new Date('2024-01-15T10:30:00').toISOString(),
    score: 0.95,
    status: 'completed',
    isFinal: true,
    fileName: 'solution_v12.csv',
    fileSize: 1024 * 512, // 512KB
    processingTime: 2500,
    errorMessage: null,
    metrics: {
      accuracy: 0.95,
      precision: 0.94,
      recall: 0.96,
      f1Score: 0.95,
    },
  },
  'sub-test-3': {
    id: 'sub-test-3',
    teamId: 'testteam',
    submittedAt: new Date('2024-01-14T08:00:00').toISOString(),
    score: 0.75,
    status: 'completed',
    isFinal: true,
    fileName: 'test_solution_3.csv',
    fileSize: 1024 * 256, // 256KB
    processingTime: 1800,
    errorMessage: null,
    metrics: {
      accuracy: 0.75,
      precision: 0.73,
      recall: 0.77,
      f1Score: 0.75,
    },
  },
}

export async function getRecentSubmissions(teamId: string, limit: number = 5): Promise<Submission[]> {
  if (USE_MOCK) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const submissions = mockSubmissionsData[teamId.toLowerCase()] || []
    return submissions.slice(0, limit)
  }
  return httpClient.get<Submission[]>(`/teams/${teamId}/submissions?limit=${limit}`)
}

export async function getAllSubmissions(teamId: string): Promise<Submission[]> {
  if (USE_MOCK) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return mockSubmissionsData[teamId.toLowerCase()] || []
  }
  return httpClient.get<Submission[]>(`/teams/${teamId}/submissions`)
}

export async function getSubmissionDetail(submissionId: string): Promise<SubmissionDetail> {
  if (USE_MOCK) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const detail = mockSubmissionDetails[submissionId]
    if (detail) {
      return detail
    }
    
    // Return a generic detail if not found
    return {
      id: submissionId,
      teamId: 'unknown',
      submittedAt: new Date().toISOString(),
      score: 0,
      status: 'failed',
      isFinal: false,
      fileName: 'unknown.csv',
      fileSize: 0,
      processingTime: 0,
      errorMessage: 'Submission not found',
      metrics: null,
    }
  }
  return httpClient.get<SubmissionDetail>(`/submissions/${submissionId}`)
}

export async function submitSolution(file: File): Promise<Submission> {
  if (USE_MOCK) {
    // Simulate network delay and processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Get current user's team from localStorage
    const auth = localStorage.getItem('auth')
    const teamId = auth ? JSON.parse(auth).teamId : 'testteam'
    
    // Create new submission
    const newSubmission: Submission = {
      id: `sub-${teamId}-${Date.now()}`,
      teamId: teamId,
      submittedAt: new Date().toISOString(),
      score: Math.random() * 0.3 + 0.7, // Random score between 0.7 and 1.0
      status: 'completed',
      isFinal: false,
      fileName: file.name,
    }
    
    // Add to mock data
    if (!mockSubmissionsData[teamId]) {
      mockSubmissionsData[teamId] = []
    }
    mockSubmissionsData[teamId].unshift(newSubmission)
    
    return newSubmission
  }
  return httpClient.upload<Submission>('/submissions', file)
}

export async function setFinalSubmission(submissionId: string): Promise<void> {
  if (USE_MOCK) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Update the submission in mock data
    for (const teamSubmissions of Object.values(mockSubmissionsData)) {
      for (const submission of teamSubmissions) {
        if (submission.id === submissionId) {
          // Reset all other final submissions for this team
          teamSubmissions.forEach(s => s.isFinal = false)
          submission.isFinal = true
          break
        }
      }
    }
    return
  }
  return httpClient.put(`/submissions/${submissionId}/final`)
}
