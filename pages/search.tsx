import { useRouter } from 'next/router'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { useFavorite } from '../contexts/FavoriteContext'
import toast from 'react-hot-toast'
import path from 'path'
import fs from 'fs'

const API_URL = process.env.NEXT_PUBLIC_API_URL

// 🔍 検索キーワードをログに送信
const logSearch = async (keyword: string) => {
  try {
    await fetch(`${API_URL}/api/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword })
    })
  } catch (error) {
    console.error('検索ログ送信エラー:', error)
  }
}

type Product = {
  name: string
  price: number
  image: string
  category: string
  description: string
  history: { date: string; price: number }[]
}

export default function SearchPage({ products }: { products: Product[] }) {
  const router = useRouter()
  const keyword = (router.query.keyword as string || '').toLowerCase()
  const [filtered, setFiltered] = useState<Product[]>([])
  const { favorites, toggleFavorite } = useFavorite()
  const [recentKeywords, setRecentKeywords] = useState<string[]>([])

  useEffect(() => {
    if (!keyword) return

    // 🔍 フィルター処理
    const result = products.filter((p) =>
      p.name.toLowerCase().includes(keyword) ||
      p.category.toLowerCase().includes(keyword)
    )
    setFiltered(result)

    // 🔁 ログ送信
    logSearch(keyword)

    // 🕓 ローカル検索履歴更新
    const stored = JSON.parse(localStorage.getItem('searchHistory') || '[]')
    const updated = [keyword, ...stored.filter((k: string) => k !== keyword)].slice(0, 10)
    localStorage.setItem('searchHistory', JSON.stringify(updated))
    setRecentKeywords(updated)
  }, [keyword, products])

  const handleHistoryClick = (kw: string) => {
    router.push(`/search?keyword=${encodeURIComponent(kw)}`)
  }

  const stats = {
    count: filtered.length,
    average: filtered.length > 0
      ? Math.round(filtered.reduce((sum, p) => sum + p.price, 0) / filtered.length)
      : 0,
    max: filtered.length > 0 ? Math.max(...filtered.map((p) => p.price)) : 0,
    min: filtered.length > 0 ? Math.min(...filtered.map((p) => p.price)) : 0,
  }

  return (
    <>
      <Head>
        <title>検索結果 - {keyword} | MerTracking</title>
      </Head>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">🔍 検索結果：「{keyword}」</h1>

        {/* 🔁 検索履歴 */}
        {recentKeywords.length > 0 && (
          <div className="mb-4 text-sm text-gray-500">
            <span className="mr-2">最近の検索：</span>
            {recentKeywords.map((kw, i) => (
              <button
                key={i}
                onClick={() => handleHistoryClick(kw)}
                className="mr-2 inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs hover:bg-gray-300 transition cursor-pointer"
              >
                {kw}
              </button>
            ))}
          </div>
        )}

        {/* 📊 統計表示 */}
        {filtered.length > 0 && (
          <div className="bg-white border rounded p-4 mb-6 shadow text-sm text-gray-700">
            <div className="flex flex-wrap gap-6">
              <div>📦 出品数：{stats.count} 件</div>
              <div>💴 平均価格：¥{stats.average.toLocaleString()}</div>
              <div>🔼 最高価格：¥{stats.max.toLocaleString()}</div>
              <div>🔽 最低価格：¥{stats.min.toLocaleString()}</div>
            </div>
          </div>
        )}

        {/* 🛍️ 商品リスト */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.map((item, index) => (
              <ProductCard
                key={index}
                id={index}
                name={item.name}
                price={item.price}
                image={item.image}
                isFavorite={favorites.includes(index)}
                onToggleFavorite={() => {
                  toggleFavorite(index)
                  toast.success(
                    favorites.includes(index)
                      ? 'お気に入りから削除しました'
                      : 'お気に入りに追加しました'
                  )
                }}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-10">
            該当する商品は見つかりませんでした。
          </p>
        )}
      </div>
    </>
  )
}

// ✅ 静的データ取得
export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'public/data/products.json')
  const jsonData = fs.readFileSync(filePath, 'utf-8')
  const products = JSON.parse(jsonData)

  return {
    props: {
      products,
    },
  }
}