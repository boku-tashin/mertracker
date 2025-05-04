import Image from 'next/image'
import Link from 'next/link'

export type HeaderProps = {
  favoriteCount: number
}

export default function Header({ favoriteCount }: HeaderProps) {
  return (
    <header className="bg-blue-700 text-white py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        {/* ロゴ＋テキスト */}
        <Link href="/" className="flex items-center space-x-3 hover:opacity-90 cursor-pointer">
          <div className="flex items-center space-x-3">
            <Image
              src="/logo.png"
              alt="MerTracking Logo"
              width={40}
              height={40}
              style={{ objectFit: 'contain' }}
            />
            <div className="leading-tight">
              <div className="text-xs">メルカリ相場トラッキング</div>
              <div className="text-lg font-semibold">Mer Tracking</div>
            </div>
          </div>
        </Link>

        {/* ナビゲーション */}
        <nav className="flex items-center space-x-6 text-sm font-semibold">
          <Link href="/" className="hover:underline cursor-pointer">
            TOP
          </Link>
          <Link href="/favorites" className="relative hover:underline cursor-pointer">
            お気に入り
            {favoriteCount > 0 && (
              <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {favoriteCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  )
}