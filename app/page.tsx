// app/page.tsx
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-800 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">
        中古相場トラッカー <span className="text-gray-900">Mark Down</span>
      </h1>
      <p className="text-base text-gray-600 mb-6">
        メルカリの商品価格推移を自動で記録・グラフ化します。
      </p>

      <div className="mt-10 flex flex-col items-start gap-4">
        <a
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          href="https://nextjs.org/docs"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/globe.svg"
            alt="Docs"
            width={20}
            height={20}
            className="invert"
          />
          Next.js ドキュメントへ
        </a>
      </div>
    </main>
  );
}
