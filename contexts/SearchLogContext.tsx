// contexts/SearchLogContext.tsx
import { createContext, useContext, useEffect, useState } from 'react'

type SearchEntry = {
  keyword: string
  timestamp: string
}

type SearchLogContextType = {
  log: SearchEntry[]
  addKeyword: (keyword: string) => void
}

const SearchLogContext = createContext<SearchLogContextType | undefined>(undefined)

export function SearchLogProvider({ children }: { children: React.ReactNode }) {
  const [log, setLog] = useState<SearchEntry[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('searchHistoryLog')
    if (stored) {
      setLog(JSON.parse(stored))
    }
  }, [])

  const addKeyword = (keyword: string) => {
    const entry: SearchEntry = {
      keyword: keyword.toLowerCase(),
      timestamp: new Date().toISOString(),
    }

    const updated = [entry, ...log].slice(0, 100) // 最大100件保持
    setLog(updated)
    localStorage.setItem('searchHistoryLog', JSON.stringify(updated))
  }

  return (
    <SearchLogContext.Provider value={{ log, addKeyword }}>
      {children}
    </SearchLogContext.Provider>
  )
}

export function useSearchLog() {
  const context = useContext(SearchLogContext)
  if (!context) {
    throw new Error('useSearchLog must be used within a SearchLogProvider')
  }
  return context
}