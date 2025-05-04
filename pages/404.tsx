// pages/404.tsx
import Link from 'next/link'
import Head from 'next/head'

export default function Custom404() {
  return (
    <>
      <Head>
        <title>ページが見つかりません - MerTracking</title>
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6">
        <h1 className="text-6xl font-bold text-blue-700 mb-4">404</h1>
        <p className="text-lg text-gray-700 mb-6">お探しのページは見つかりませんでした。</p>
        <Link href="/">
          <span className="text-blue-600 underline text-sm hover:text-blue-800 cursor-pointer">
            トップページに戻る
          </span>
        </Link>
      </div>
    </>
  )
}