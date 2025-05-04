// pages/average.tsx
import Head from 'next/head'
import { useEffect, useState } from 'react'
import Link from 'next/link'

type PriceStatus = {
  keyword: string
  latest: number | string
  previous: number | string
  diff: number | string
  percent: number | string
}

export default function AveragePage() {
  const [data, setData] = useState<PriceStatus[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/average-prices')
        const json = await res.json()
        setData(json)
      } catch (err) {
        console.error('データ取得エラー:', err)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      <Head>
        <title>最新価格一覧 - Mark Down</title>
      </Head>

      <main className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-blue-600">📋 最新の平均価格一覧</h1>

        <table className="min-w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">キーワード</th>
              <th className="border px-4 py-2">最新価格</th>
              <th className="border px-4 py-2">前回価格</th>
              <th className="border px-4 py-2">差額</th>
              <th className="border px-4 py-2">変動率</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="text-center">
                <td className="border px-4 py-2">{row.keyword}</td>
                <td className="border px-4 py-2">{row.latest !== '-' ? `¥${row.latest}` : '-'}</td>
                <td className="border px-4 py-2">{row.previous !== '-' ? `¥${row.previous}` : '-'}</td>
                <td className="border px-4 py-2">
                  {row.diff !== '-' ? `${Number(row.diff) >= 0 ? '+' : ''}${row.diff}` : '-'}
                </td>
                <td className="border px-4 py-2">
                  {row.percent !== '-' ? `${Number(row.percent) >= 0 ? '+' : ''}${row.percent}%` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 text-center">
          <Link href="/" passHref>
            <a className="text-blue-600 hover:underline">← トップに戻る</a>
          </Link>
        </div>
      </main>
    </>
  )
}