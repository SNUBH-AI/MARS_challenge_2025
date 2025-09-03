import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// 각 테스트 후 cleanup
afterEach(() => {
  cleanup()
})

// localStorage mock
const localStorageMock: Storage = (function () {
  let store: Record<string, string> = {}

  return {
    getItem(key: string) {
      return store[key] || null
    },
    setItem(key: string, value: string) {
      store[key] = value.toString()
    },
    removeItem(key: string) {
      delete store[key]
    },
    clear() {
      store = {}
    },
    get length() {
      return Object.keys(store).length
    },
    key(index: number) {
      const keys = Object.keys(store)
      return keys[index] || null
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// matchMedia mock
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
