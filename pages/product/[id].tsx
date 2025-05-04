// pages/product/[id].tsx
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useState } from 'react'

export default function ProductPage() {
  const router = useRouter()
  const { id } = router.query
  const [graphType, setGraphType] = useState<'line' | 'bar'>('line')
  const [days, setDays] = useState<number>(7)

  return (
    <>
      <Head>
        <title>商品価格グラフ - Mark Down</title>
      </Head>

      <main className="p-6 bg-white min-h-screen">
        <h1 className="text-xl font-bold text-blue-600 mb-6">📈 グラフ（リアルタイム）</h1>

        {/* フィルター選択 */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            className="border p-2 rounded"
            value={graphType}
            onChange={(e) => setGraphType(e.target.value as 'line' | 'bar')}
          >
            <option value="line">平均価格（折れ線）</option>
            <option value="bar">平均価格（棒グラフ）</option>
          </select>

          <select
            className="border p-2 rounded"
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
          >
            <option value="3">直近3日</option>
            <option value="7">直近7日</option>
            <option value="30">直近30日</option>
          </select>
        </div>

        {/* 商品キーワードのボタン（例としてPS5固定） */}
        <div className="flex flex-wrap gap-3 mb-6">
          {['PS5', 'Switch', 'iPhone'].map((kw) => (
            <button
              key={kw}
              className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm"
              onClick={() => router.push(`/product/${kw}`)}
            >
              {kw}
            </button>
          ))}
        </div>

        {/* グラフ画像（Flaskで提供） */}
        <div className="bg-gray-100 rounded shadow p-4">
          <img
            src={`http://localhost:5001/graph?keyword=${id}&type=${graphType}&days=${days}&t=${Date.now()}`}
            alt={`価格グラフ - ${id}`}
            className="w-full border rounded"
          />
        </div>
      </main>
    </>
  )
}