// pages/favorites.tsx
import Head from 'next/head'
import Link from 'next/link'

const mockFavorites = ['PS5', 'Switch', 'iPhone', 'MacBook', 'カメラ', 'AirPods', 'ルンバ', 'テレビ']

export default function FavoritesPage() {
  return (
    <>
      <Head>
        <title>お気に入り一覧 - Mer Tracking</title>
      </Head>

      <main className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <h1 className="text-xl font-bold text-blue-600 mb-6 flex items-center">
            <span className="mr-2">📦</span> お気に入り一覧
          </h1>

          <div className="flex flex-wrap gap-4">
            {mockFavorites.map((keyword, i) => (
              <Link href={`/product/${keyword}`} passHref key={i}>
                <a className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm hover:opacity-90 transition">
                  {keyword}
                </a>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}