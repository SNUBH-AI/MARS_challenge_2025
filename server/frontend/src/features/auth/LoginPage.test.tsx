import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import { LoginPage } from './LoginPage'
import * as authService from './services/auth.service'

// Mock auth service
vi.mock('./services/auth.service', () => ({
  login: vi.fn(),
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

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should render login form with email and API token fields', () => {
    render(<LoginPage />)
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/api token/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  it('should show validation errors for empty fields', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    
    const submitButton = screen.getByRole('button', { name: /login/i })
    await user.click(submitButton)
    
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument()
    expect(await screen.findByText(/api token is required/i)).toBeInTheDocument()
  })

  it('should show validation error for invalid email format', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/email/i)
    await user.type(emailInput, 'invalid-email')
    
    const submitButton = screen.getByRole('button', { name: /login/i })
    await user.click(submitButton)
    
    expect(await screen.findByText(/invalid email format/i)).toBeInTheDocument()
  })

  it('should call login service with correct credentials', async () => {
    const user = userEvent.setup()
    const mockLoginResponse = {
      team: {
        id: '1',
        name: 'Test Team',
        email: 'team@test.com',
      },
      token: 'test-token',
    }
    
    vi.mocked(authService.login).mockResolvedValueOnce(mockLoginResponse)
    
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const tokenInput = screen.getByLabelText(/api token/i)
    
    await user.type(emailInput, 'team@test.com')
    await user.type(tokenInput, 'test-api-token')
    
    const submitButton = screen.getByRole('button', { name: /login/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        email: 'team@test.com',
        apiToken: 'test-api-token',
      })
    })
  })

  it('should navigate to leaderboard after successful login', async () => {
    const user = userEvent.setup()
    const mockLoginResponse = {
      team: {
        id: '1',
        name: 'Test Team',
        email: 'team@test.com',
      },
      token: 'test-token',
    }
    
    vi.mocked(authService.login).mockResolvedValueOnce(mockLoginResponse)
    
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const tokenInput = screen.getByLabelText(/api token/i)
    
    await user.type(emailInput, 'team@test.com')
    await user.type(tokenInput, 'test-api-token')
    
    const submitButton = screen.getByRole('button', { name: /login/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/leaderboard')
    })
  })

  it('should store auth data in localStorage after successful login', async () => {
    const user = userEvent.setup()
    const mockLoginResponse = {
      team: {
        id: '1',
        name: 'Test Team',
        email: 'team@test.com',
      },
      token: 'test-token',
    }
    
    vi.mocked(authService.login).mockResolvedValueOnce(mockLoginResponse)
    
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const tokenInput = screen.getByLabelText(/api token/i)
    
    await user.type(emailInput, 'team@test.com')
    await user.type(tokenInput, 'test-api-token')
    
    const submitButton = screen.getByRole('button', { name: /login/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      const storedAuth = localStorage.getItem('auth')
      expect(storedAuth).toBeTruthy()
      const parsedAuth = JSON.parse(storedAuth!)
      expect(parsedAuth.team.email).toBe('team@test.com')
      expect(parsedAuth.token).toBe('test-token')
    })
  })

  it('should show error message when login fails', async () => {
    const user = userEvent.setup()
    
    vi.mocked(authService.login).mockRejectedValueOnce(
      new Error('Invalid credentials')
    )
    
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const tokenInput = screen.getByLabelText(/api token/i)
    
    await user.type(emailInput, 'team@test.com')
    await user.type(tokenInput, 'wrong-token')
    
    const submitButton = screen.getByRole('button', { name: /login/i })
    await user.click(submitButton)
    
    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument()
  })

  it('should disable submit button while loading', async () => {
    const user = userEvent.setup()
    
    // Mock a delayed response
    vi.mocked(authService.login).mockImplementationOnce(
      () => new Promise(resolve => setTimeout(resolve, 1000))
    )
    
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const tokenInput = screen.getByLabelText(/api token/i)
    
    await user.type(emailInput, 'team@test.com')
    await user.type(tokenInput, 'test-api-token')
    
    const submitButton = screen.getByRole('button', { name: /login/i })
    await user.click(submitButton)
    
    expect(submitButton).toBeDisabled()
    expect(screen.getByText(/logging in/i)).toBeInTheDocument()
  })
})
