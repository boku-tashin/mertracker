// components/PopularKeywords.tsx
import { useSearchLog } from '../contexts/SearchLogContext'
import { useMemo } from 'react'
import Link from 'next/link'

type Props = {
  title: string
  type: 'popular' | 'trending'
}

export default function PopularKeywords({ title, type }: Props) {
  const { log } = useSearchLog()

  // 🔢 集計処理
  const keywords = useMemo(() => {
    const now = new Date()
    const recentLimit = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000) // 直近3日間

    const counts: Record<string, number> = {}

    log.forEach(({ keyword, timestamp }) => {
      const date = new Date(timestamp)

      if (type === 'popular' || (type === 'trending' && date >= recentLimit)) {
        counts[keyword] = (counts[keyword] || 0) + 1
      }
    })

    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)

    return sorted.map(([keyword]) => keyword)
  }, [log, type])

  if (keywords.length === 0) return null

  return (
    <div className="mt-6">
      <h2 className="text-md font-bold text-gray-700 mb-2">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {keywords.map((kw, i) => (
          <Link key={i} href={`/search?keyword=${encodeURIComponent(kw)}`}>
            <span className="cursor-pointer bg-white text-gray-700 border border-gray-300 px-3 py-1 rounded-full text-sm hover:bg-blue-600 hover:text-white transition">
              #{kw}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}