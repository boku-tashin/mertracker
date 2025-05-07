// pages/index.tsx
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-flask-api.onrender.com' // ← Fallbackを設定

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [ranking, setRanking] = useState<string[]>([])
  const [surging, setSurging] = useState<string[]>([])
  const [otherKeywords, setOtherKeywords] = useState<string[]>([])
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const res = await fetch(`${API_URL}/api/trends`)
        const data = await res.json()
        setRanking(data.ranking || [])
        setSurging(data.surging || [])

        const combined = new Set([...(data.ranking || []), ...(data.surging || [])])
        const fallback = [
          'PS5', 'Switch', 'iPhone', 'MacBook',
          'AirPods', 'Nintendo', 'Galaxy', 'カメラ', '時計', 'ドローン',
          'GoPro', 'イヤホン', 'Surface', 'Kindle', '一眼レフ', 'ミラーレス',
          'BOSE', 'JBL', 'モニター', 'ルンバ', 'バイク', '冷蔵庫', '炊飯器',
          '掃除機', 'デロンギ', '扇風機', 'プロジェクター', 'ガジェット'
        ]
        setOtherKeywords(fallback.filter(k => !combined.has(k)))
      } catch (error) {
        console.error('❌ トレンド取得エラー:', error)
        setRanking(['PS5', 'Switch', 'iPhone'])
        setSurging(['カメラ', 'MacBook'])
        setOtherKeywords(['AirPods', 'Nintendo', 'Galaxy', '時計', 'ドローン'])
      }
    }

    const loadHistory = () => {
      const stored = JSON.parse(localStorage.getItem('searchHistory') || '[]')
      setSearchHistory(stored)
    }

    fetchTrends()
    loadHistory()
  }, [])

  const handleSearch = async (keyword: string) => {
    const trimmed = keyword.trim()
    if (!trimmed) return

    try {
      await fetch(`${API_URL}/api/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: trimmed }),
      })
    } catch (err) {
      console.error('検索ログ送信エラー:', err)
    }

    const stored = JSON.parse(localStorage.getItem('searchHistory') || '[]')
    const updated = [trimmed, ...stored.filter((k: string) => k !== trimmed)].slice(0, 10)
    localStorage.setItem('searchHistory', JSON.stringify(updated))
    setSearchHistory(updated)

    router.push(`/search?keyword=${encodeURIComponent(trimmed)}`)
  }

  const renderKeywordButtons = (keywords: string[], icon: string, style: string) => (
    <div className="flex flex-wrap gap-3">
      {keywords.map((kw) => (
        <button
          key={kw}
          onClick={() => handleSearch(kw)}
          className={`px-4 py-2 rounded-full border transition text-sm cursor-pointer ${style}`}
        >
          {icon} {kw}
        </button>
      ))}
    </div>
  )

  return (
    <>
      <Head>
        <title>メルカリ相場トラッキング - MerTracking</title>
      </Head>

      <main className="bg-gray-50 min-h-screen pb-10">
        <div className="max-w-3xl mx-auto px-4">
          <div className="mt-8 text-center">
            <input
              type="text"
              placeholder="🔍 商品名で検索"
              className="w-full max-w-xl px-4 py-2 border rounded-full shadow focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch(searchQuery)
              }}
            />
            <div className="flex flex-wrap gap-2 justify-center text-sm text-gray-400 mt-2">
              {searchHistory.map((kw, i) => (
                <button
                  key={i}
                  onClick={() => handleSearch(kw)}
                  className="px-3 py-1 border border-gray-300 rounded-full hover:bg-gray-200 transition"
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>

          <section className="mt-10">
            <h2 className="text-lg font-semibold mb-4">人気商品💡</h2>
            {renderKeywordButtons(ranking, '🔍', 'bg-white text-blue-600 hover:bg-blue-600 hover:text-white')}
          </section>

          <section className="mt-10">
            <h2 className="text-lg font-semibold mb-4">急上昇🔥</h2>
            {renderKeywordButtons(surging, '📈', 'bg-white text-red-600 hover:bg-red-600 hover:text-white')}
          </section>

          <section className="mt-10">
            <h2 className="text-lg font-semibold mb-4">相場変動📉</h2>
            {renderKeywordButtons(otherKeywords, '📊', 'bg-white text-gray-600 hover:bg-gray-600 hover:text-white')}
          </section>

          <section className="mt-10">
            <h2 className="text-lg font-semibold mb-4">お気に入り📈</h2>
            {renderKeywordButtons(
              ['PS5', 'Switch', 'iPhone', 'MacBook', 'AirPods'],
              '❤️',
              'bg-white text-pink-500 hover:bg-pink-500 hover:text-white'
            )}
          </section>
        </div>
      </main>
    </>
  )
}