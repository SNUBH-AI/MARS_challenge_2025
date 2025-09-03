import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LoginPage } from '@/features/auth/LoginPage'
import { LeaderboardPage } from '@/features/leaderboard/LeaderboardPage'
import { TeamDashboardPage } from '@/features/team/TeamDashboardPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <Navigate to="/leaderboard" replace />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'leaderboard',
        element: <LeaderboardPage />,
      },
      {
        path: 'team',
        element: (
          <ProtectedRoute>
            <TeamDashboardPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
])
