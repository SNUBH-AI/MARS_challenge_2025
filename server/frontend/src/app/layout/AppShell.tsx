import React from 'react'
import { Outlet } from 'react-router-dom'
import { TopNav } from './TopNav'

export function AppShell() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
