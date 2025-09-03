import httpClient from '@/shared/api/http'
import { Submission, SubmissionDetail } from '@/shared/types'

export async function getRecentSubmissions(teamId: string, limit: number = 5): Promise<Submission[]> {
  return httpClient.get<Submission[]>(`/teams/${teamId}/submissions?limit=${limit}`)
}

export async function getAllSubmissions(teamId: string): Promise<Submission[]> {
  return httpClient.get<Submission[]>(`/teams/${teamId}/submissions`)
}

export async function getSubmissionDetail(submissionId: string): Promise<SubmissionDetail> {
  return httpClient.get<SubmissionDetail>(`/submissions/${submissionId}`)
}

export async function submitSolution(file: File): Promise<Submission> {
  return httpClient.upload<Submission>('/submissions', file)
}

export async function setFinalSubmission(submissionId: string): Promise<void> {
  return httpClient.put(`/submissions/${submissionId}/final`)
}
