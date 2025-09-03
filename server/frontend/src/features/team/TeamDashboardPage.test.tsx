import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import { TeamDashboardPage } from './TeamDashboardPage'
import * as teamsService from './services/teams.service'
import * as submissionsService from './services/submissions.service'
import * as usageService from './services/usage.service'

// Mock services
vi.mock('./services/teams.service', () => ({
  getTeamInfo: vi.fn(),
}))

vi.mock('./services/submissions.service', () => ({
  getRecentSubmissions: vi.fn(),
  submitSolution: vi.fn(),
}))

vi.mock('./services/usage.service', () => ({
  getDailyUsage: vi.fn(),
}))

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('TeamDashboardPage', () => {
  const mockTeamInfo = {
    id: '1',
    name: 'Test Team',
    email: 'team@test.com',
    bestScore: 85.5,
    totalSubmissions: 15,
  }

  const mockRecentSubmissions = [
    {
      id: 's1',
      fileName: 'solution_v1.py',
      status: 'completed',
      score: 85.5,
      submittedAt: '2025-01-15T10:30:00Z',
      isFinal: true,
    },
    {
      id: 's2',
      fileName: 'solution_v2.py',
      status: 'completed',
      score: 82.3,
      submittedAt: '2025-01-15T09:15:00Z',
      isFinal: false,
    },
    {
      id: 's3',
      fileName: 'solution_v3.py',
      status: 'failed',
      score: null,
      submittedAt: '2025-01-15T08:00:00Z',
      isFinal: false,
      error: 'Syntax error on line 42',
    },
    {
      id: 's4',
      fileName: 'solution_v4.py',
      status: 'processing',
      score: null,
      submittedAt: '2025-01-15T11:45:00Z',
      isFinal: false,
    },
    {
      id: 's5',
      fileName: 'solution_v5.py',
      status: 'queued',
      score: null,
      submittedAt: '2025-01-15T11:50:00Z',
      isFinal: false,
    },
  ]

  const mockDailyUsage = {
    date: '2025-01-15',
    used: 5,
    limit: 10,
    remaining: 5,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Set auth in localStorage
    localStorage.setItem('auth', JSON.stringify({
      team: { id: '1', name: 'Test Team' },
      token: 'test-token',
    }))
  })

  it('should display team information', async () => {
    vi.mocked(teamsService.getTeamInfo).mockResolvedValueOnce(mockTeamInfo)
    vi.mocked(submissionsService.getRecentSubmissions).mockResolvedValueOnce([])
    vi.mocked(usageService.getDailyUsage).mockResolvedValueOnce(mockDailyUsage)
    
    render(<TeamDashboardPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Team')).toBeInTheDocument()
      expect(screen.getByText(/best score: 85.5/i)).toBeInTheDocument()
      expect(screen.getByText(/total submissions: 15/i)).toBeInTheDocument()
    })
  })

  it('should display daily submission usage', async () => {
    vi.mocked(teamsService.getTeamInfo).mockResolvedValueOnce(mockTeamInfo)
    vi.mocked(submissionsService.getRecentSubmissions).mockResolvedValueOnce([])
    vi.mocked(usageService.getDailyUsage).mockResolvedValueOnce(mockDailyUsage)
    
    render(<TeamDashboardPage />)
    
    await waitFor(() => {
      expect(screen.getByText(/submissions today: 5 \/ 10/i)).toBeInTheDocument()
      expect(screen.getByText(/5 remaining/i)).toBeInTheDocument()
    })
  })

  it('should display recent submissions', async () => {
    vi.mocked(teamsService.getTeamInfo).mockResolvedValueOnce(mockTeamInfo)
    vi.mocked(submissionsService.getRecentSubmissions).mockResolvedValueOnce(mockRecentSubmissions)
    vi.mocked(usageService.getDailyUsage).mockResolvedValueOnce(mockDailyUsage)
    
    render(<TeamDashboardPage />)
    
    await waitFor(() => {
      expect(screen.getByText('solution_v1.py')).toBeInTheDocument()
      expect(screen.getByText('solution_v2.py')).toBeInTheDocument()
      expect(screen.getByText('solution_v3.py')).toBeInTheDocument()
      expect(screen.getByText('solution_v4.py')).toBeInTheDocument()
      expect(screen.getByText('solution_v5.py')).toBeInTheDocument()
    })
  })

  it('should display submission statuses correctly', async () => {
    vi.mocked(teamsService.getTeamInfo).mockResolvedValueOnce(mockTeamInfo)
    vi.mocked(submissionsService.getRecentSubmissions).mockResolvedValueOnce(mockRecentSubmissions)
    vi.mocked(usageService.getDailyUsage).mockResolvedValueOnce(mockDailyUsage)
    
    render(<TeamDashboardPage />)
    
    await waitFor(() => {
      // Check status badges
      expect(screen.getByTestId('status-s1')).toHaveTextContent(/completed/i)
      expect(screen.getByTestId('status-s1')).toHaveClass('bg-green-100')
      
      expect(screen.getByTestId('status-s3')).toHaveTextContent(/failed/i)
      expect(screen.getByTestId('status-s3')).toHaveClass('bg-red-100')
      
      expect(screen.getByTestId('status-s4')).toHaveTextContent(/processing/i)
      expect(screen.getByTestId('status-s4')).toHaveClass('bg-blue-100')
      
      expect(screen.getByTestId('status-s5')).toHaveTextContent(/queued/i)
      expect(screen.getByTestId('status-s5')).toHaveClass('bg-gray-100')
    })
  })

  it('should mark final submission with special indicator', async () => {
    vi.mocked(teamsService.getTeamInfo).mockResolvedValueOnce(mockTeamInfo)
    vi.mocked(submissionsService.getRecentSubmissions).mockResolvedValueOnce(mockRecentSubmissions)
    vi.mocked(usageService.getDailyUsage).mockResolvedValueOnce(mockDailyUsage)
    
    render(<TeamDashboardPage />)
    
    await waitFor(() => {
      const finalBadge = screen.getByTestId('final-badge-s1')
      expect(finalBadge).toBeInTheDocument()
      expect(finalBadge).toHaveTextContent(/final/i)
    })
  })

  it('should show error message for failed submissions', async () => {
    vi.mocked(teamsService.getTeamInfo).mockResolvedValueOnce(mockTeamInfo)
    vi.mocked(submissionsService.getRecentSubmissions).mockResolvedValueOnce(mockRecentSubmissions)
    vi.mocked(usageService.getDailyUsage).mockResolvedValueOnce(mockDailyUsage)
    
    render(<TeamDashboardPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Syntax error on line 42')).toBeInTheDocument()
    })
  })

  it('should handle file upload', async () => {
    const user = userEvent.setup()
    
    vi.mocked(teamsService.getTeamInfo).mockResolvedValueOnce(mockTeamInfo)
    vi.mocked(submissionsService.getRecentSubmissions).mockResolvedValueOnce([])
    vi.mocked(usageService.getDailyUsage).mockResolvedValueOnce(mockDailyUsage)
    vi.mocked(submissionsService.submitSolution).mockResolvedValueOnce({
      id: 'new-submission',
      fileName: 'new_solution.py',
      status: 'queued',
    })
    
    render(<TeamDashboardPage />)
    
    await waitFor(() => {
      expect(screen.getByTestId('file-upload')).toBeInTheDocument()
    })
    
    const file = new File(['print("Hello")'], 'solution.py', { type: 'text/x-python' })
    const input = screen.getByTestId('file-input') as HTMLInputElement
    
    await user.upload(input, file)
    
    await waitFor(() => {
      expect(submissionsService.submitSolution).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'solution.py',
        })
      )
    })
  })

  it('should reject non-python files', async () => {
    const user = userEvent.setup()
    
    vi.mocked(teamsService.getTeamInfo).mockResolvedValueOnce(mockTeamInfo)
    vi.mocked(submissionsService.getRecentSubmissions).mockResolvedValueOnce([])
    vi.mocked(usageService.getDailyUsage).mockResolvedValueOnce(mockDailyUsage)
    
    render(<TeamDashboardPage />)
    
    await waitFor(() => {
      expect(screen.getByTestId('file-upload')).toBeInTheDocument()
    })
    
    const file = new File(['test'], 'solution.txt', { type: 'text/plain' })
    const input = screen.getByTestId('file-input') as HTMLInputElement
    
    await user.upload(input, file)
    
    await waitFor(() => {
      expect(screen.getByText(/only \.py files are allowed/i)).toBeInTheDocument()
    })
  })

  it('should disable upload when daily limit reached', async () => {
    vi.mocked(teamsService.getTeamInfo).mockResolvedValueOnce(mockTeamInfo)
    vi.mocked(submissionsService.getRecentSubmissions).mockResolvedValueOnce([])
    vi.mocked(usageService.getDailyUsage).mockResolvedValueOnce({
      date: '2025-01-15',
      used: 10,
      limit: 10,
      remaining: 0,
    })
    
    render(<TeamDashboardPage />)
    
    await waitFor(() => {
      const uploadButton = screen.getByTestId('upload-button')
      expect(uploadButton).toBeDisabled()
      expect(screen.getByText(/daily submission limit reached/i)).toBeInTheDocument()
    })
  })

  it('should support drag and drop file upload', async () => {
    vi.mocked(teamsService.getTeamInfo).mockResolvedValueOnce(mockTeamInfo)
    vi.mocked(submissionsService.getRecentSubmissions).mockResolvedValueOnce([])
    vi.mocked(usageService.getDailyUsage).mockResolvedValueOnce(mockDailyUsage)
    vi.mocked(submissionsService.submitSolution).mockResolvedValueOnce({
      id: 'new-submission',
      fileName: 'dropped_solution.py',
      status: 'queued',
    })
    
    render(<TeamDashboardPage />)
    
    await waitFor(() => {
      expect(screen.getByTestId('drop-zone')).toBeInTheDocument()
    })
    
    const dropZone = screen.getByTestId('drop-zone')
    const file = new File(['print("Dropped")'], 'dropped_solution.py', { type: 'text/x-python' })
    
    // Simulate drag over
    fireEvent.dragOver(dropZone)
    expect(dropZone).toHaveClass('bg-blue-50')
    
    // Simulate drop
    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [file],
      },
    })
    
    await waitFor(() => {
      expect(submissionsService.submitSolution).toHaveBeenCalled()
    })
  })

  it('should show loading state while fetching data', () => {
    vi.mocked(teamsService.getTeamInfo).mockImplementationOnce(
      () => new Promise(resolve => setTimeout(resolve, 1000))
    )
    
    render(<TeamDashboardPage />)
    expect(screen.getByText(/loading team data/i)).toBeInTheDocument()
  })

  it('should show error state when API fails', async () => {
    vi.mocked(teamsService.getTeamInfo).mockRejectedValueOnce(
      new Error('Failed to fetch team info')
    )
    
    render(<TeamDashboardPage />)
    
    await waitFor(() => {
      expect(screen.getByText(/failed to load team data/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
    })
  })

  it('should refresh submission status for processing items', async () => {
    vi.useFakeTimers()
    
    const updatedSubmissions = mockRecentSubmissions.map(sub => 
      sub.id === 's4' 
        ? { ...sub, status: 'completed', score: 90.0 }
        : sub
    )
    
    vi.mocked(teamsService.getTeamInfo).mockResolvedValue(mockTeamInfo)
    vi.mocked(usageService.getDailyUsage).mockResolvedValue(mockDailyUsage)
    vi.mocked(submissionsService.getRecentSubmissions)
      .mockResolvedValueOnce(mockRecentSubmissions)
      .mockResolvedValueOnce(updatedSubmissions)
    
    render(<TeamDashboardPage />)
    
    // Initial load with processing status
    await waitFor(() => {
      expect(screen.getByTestId('status-s4')).toHaveTextContent(/processing/i)
    })
    
    // Advance timer by 5 seconds (polling interval)
    vi.advanceTimersByTime(5000)
    
    // Check if status updated
    await waitFor(() => {
      expect(screen.getByTestId('status-s4')).toHaveTextContent(/completed/i)
      expect(screen.getByText('90')).toBeInTheDocument()
    })
    
    vi.useRealTimers()
  })

  it('should navigate to submission detail page when clicking on submission', async () => {
    vi.mocked(teamsService.getTeamInfo).mockResolvedValueOnce(mockTeamInfo)
    vi.mocked(submissionsService.getRecentSubmissions).mockResolvedValueOnce(mockRecentSubmissions)
    vi.mocked(usageService.getDailyUsage).mockResolvedValueOnce(mockDailyUsage)
    
    render(<TeamDashboardPage />)
    
    await waitFor(() => {
      const submission = screen.getByTestId('submission-s1')
      fireEvent.click(submission)
      expect(mockNavigate).toHaveBeenCalledWith('/team/submissions/s1')
    })
  })
})
