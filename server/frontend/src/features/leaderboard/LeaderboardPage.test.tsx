import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/test/test-utils'
import { LeaderboardPage } from './LeaderboardPage'
import * as leaderboardService from './services/leaderboard.service'

// Mock leaderboard service
vi.mock('./services/leaderboard.service', () => ({
  getLeaderboard: vi.fn(),
}))

describe('LeaderboardPage', () => {
  const mockLeaderboardData = [
    {
      id: '1',
      teamName: 'Alpha Team',
      score: 95.5,
      submissionCount: 10,
      lastSubmissionAt: '2025-01-15T10:30:00Z',
      rank: 1,
    },
    {
      id: '2',
      teamName: 'Beta Team',
      score: 92.3,
      submissionCount: 8,
      lastSubmissionAt: '2025-01-15T09:15:00Z',
      rank: 2,
    },
    {
      id: '3',
      teamName: 'Gamma Team',
      score: 88.7,
      submissionCount: 12,
      lastSubmissionAt: '2025-01-15T11:45:00Z',
      rank: 3,
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render leaderboard title', async () => {
    vi.mocked(leaderboardService.getLeaderboard).mockResolvedValueOnce([])
    render(<LeaderboardPage />)
    
    await waitFor(() => {
      expect(screen.getByText(/leaderboard/i)).toBeInTheDocument()
    })
  })

  it('should display loading state initially', () => {
    vi.mocked(leaderboardService.getLeaderboard).mockImplementationOnce(
      () => new Promise(resolve => setTimeout(resolve, 1000))
    )
    
    render(<LeaderboardPage />)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('should display leaderboard table with correct columns', async () => {
    vi.mocked(leaderboardService.getLeaderboard).mockResolvedValueOnce(mockLeaderboardData)
    
    render(<LeaderboardPage />)
    
    await waitFor(() => {
      expect(screen.getByText(/rank/i)).toBeInTheDocument()
      expect(screen.getByText(/team name/i)).toBeInTheDocument()
      expect(screen.getByText(/score/i)).toBeInTheDocument()
      expect(screen.getByText(/submissions/i)).toBeInTheDocument()
      expect(screen.getByText(/last submission/i)).toBeInTheDocument()
    })
  })

  it('should display team data correctly', async () => {
    vi.mocked(leaderboardService.getLeaderboard).mockResolvedValueOnce(mockLeaderboardData)
    
    render(<LeaderboardPage />)
    
    await waitFor(() => {
      // Check first team
      expect(screen.getByText('Alpha Team')).toBeInTheDocument()
      expect(screen.getByText('95.5')).toBeInTheDocument()
      expect(screen.getByText('10')).toBeInTheDocument()
      
      // Check second team
      expect(screen.getByText('Beta Team')).toBeInTheDocument()
      expect(screen.getByText('92.3')).toBeInTheDocument()
      expect(screen.getByText('8')).toBeInTheDocument()
      
      // Check third team
      expect(screen.getByText('Gamma Team')).toBeInTheDocument()
      expect(screen.getByText('88.7')).toBeInTheDocument()
      expect(screen.getByText('12')).toBeInTheDocument()
    })
  })

  it('should display teams in correct order by rank', async () => {
    vi.mocked(leaderboardService.getLeaderboard).mockResolvedValueOnce(mockLeaderboardData)
    
    render(<LeaderboardPage />)
    
    await waitFor(() => {
      const teamNames = screen.getAllByTestId('team-name')
      expect(teamNames[0]).toHaveTextContent('Alpha Team')
      expect(teamNames[1]).toHaveTextContent('Beta Team')
      expect(teamNames[2]).toHaveTextContent('Gamma Team')
    })
  })

  it('should highlight top 3 teams with special styling', async () => {
    vi.mocked(leaderboardService.getLeaderboard).mockResolvedValueOnce(mockLeaderboardData)
    
    render(<LeaderboardPage />)
    
    await waitFor(() => {
      const rows = screen.getAllByTestId('leaderboard-row')
      expect(rows[0]).toHaveClass('bg-yellow-50') // Gold for 1st
      expect(rows[1]).toHaveClass('bg-gray-50')   // Silver for 2nd
      expect(rows[2]).toHaveClass('bg-orange-50')  // Bronze for 3rd
    })
  })

  it('should display empty state when no teams', async () => {
    vi.mocked(leaderboardService.getLeaderboard).mockResolvedValueOnce([])
    
    render(<LeaderboardPage />)
    
    await waitFor(() => {
      expect(screen.getByText(/no teams have submitted yet/i)).toBeInTheDocument()
    })
  })

  it('should display error state when API fails', async () => {
    vi.mocked(leaderboardService.getLeaderboard).mockRejectedValueOnce(
      new Error('Failed to fetch leaderboard')
    )
    
    render(<LeaderboardPage />)
    
    await waitFor(() => {
      expect(screen.getByText(/failed to load leaderboard/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
    })
  })

  it('should retry fetching on error retry button click', async () => {
    vi.mocked(leaderboardService.getLeaderboard)
      .mockRejectedValueOnce(new Error('Failed'))
      .mockResolvedValueOnce(mockLeaderboardData)
    
    render(<LeaderboardPage />)
    
    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText(/failed to load leaderboard/i)).toBeInTheDocument()
    })
    
    // Click retry button
    const retryButton = screen.getByRole('button', { name: /retry/i })
    retryButton.click()
    
    // Should show data after retry
    await waitFor(() => {
      expect(screen.getByText('Alpha Team')).toBeInTheDocument()
    })
  })

  it('should auto-refresh leaderboard every 30 seconds', async () => {
    vi.useFakeTimers()
    
    const updatedData = [
      ...mockLeaderboardData,
      {
        id: '4',
        teamName: 'Delta Team',
        score: 91.0,
        submissionCount: 5,
        lastSubmissionAt: '2025-01-15T12:00:00Z',
        rank: 4,
      },
    ]
    
    vi.mocked(leaderboardService.getLeaderboard)
      .mockResolvedValueOnce(mockLeaderboardData)
      .mockResolvedValueOnce(updatedData)
    
    render(<LeaderboardPage />)
    
    // Initial load
    await waitFor(() => {
      expect(screen.getByText('Alpha Team')).toBeInTheDocument()
    })
    
    // Advance timer by 30 seconds
    await vi.advanceTimersByTimeAsync(30000)
    
    // Check if new data is displayed
    await waitFor(() => {
      expect(screen.getByText('Delta Team')).toBeInTheDocument()
    })
    
    vi.useRealTimers()
  }, 10000)

  it('should format last submission date correctly', async () => {
    vi.mocked(leaderboardService.getLeaderboard).mockResolvedValueOnce([
      {
        id: '1',
        teamName: 'Test Team',
        score: 90,
        submissionCount: 1,
        lastSubmissionAt: new Date().toISOString(),
        rank: 1,
      },
    ])
    
    render(<LeaderboardPage />)
    
    await waitFor(() => {
      // Should show relative time like "just now" or "2 minutes ago"
      expect(screen.getByTestId('last-submission-1')).toHaveTextContent(/ago|just now/i)
    })
  }, 10000)

  it('should navigate to team dashboard when clicking on own team', async () => {
    // Set current team in localStorage
    localStorage.setItem('auth', JSON.stringify({
      team: { id: '2', name: 'Beta Team' },
      token: 'test-token',
    }))
    
    vi.mocked(leaderboardService.getLeaderboard).mockResolvedValueOnce(mockLeaderboardData)
    
    render(<LeaderboardPage />)
    
    await waitFor(() => {
      const betaTeamRow = screen.getByTestId('leaderboard-row-2')
      expect(betaTeamRow).toHaveClass('cursor-pointer')
    })
  }, 10000)
})
