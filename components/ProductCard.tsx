// components/ProductCard.tsx
import { HeartIcon as SolidHeart } from '@heroicons/react/24/solid'
import { HeartIcon as OutlineHeart } from '@heroicons/react/24/outline'

type Props = {
  id: number
  name: string
  price: number
  image: string
  isFavorite: boolean
  onToggleFavorite: () => void
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  isFavorite,
  onToggleFavorite,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow group hover:shadow-lg transition relative p-3">
      {/* お気に入りボタン */}
      <button
        onClick={onToggleFavorite}
        aria-label="お気に入りに追加・削除"
        className="absolute top-2 right-2 z-10 cursor-pointer"
      >
        {isFavorite ? (
          <SolidHeart className="w-6 h-6 text-red-500" />
        ) : (
          <OutlineHeart className="w-6 h-6 text-gray-400 group-hover:text-red-400 transition" />
        )}
      </button>

      {/* 商品画像 */}
      <div className="aspect-square overflow-hidden rounded-md mb-3 bg-gray-100">
        <img
          src={image}
          alt={name || '商品画像'}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* 商品名 */}
      <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2">
        {name}
      </h3>

      {/* 価格 */}
      <p className="text-blue-600 font-bold text-base">
        ¥{price.toLocaleString()}
      </p>
    </div>
  )
}