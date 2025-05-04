import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-blue-700 text-white py-10">
      <div className="flex flex-col items-center justify-center space-y-3">
        <Image
          src="/logo_full.png"
          alt="MerTracking Logo"
          width={80}
          height={80}
          className="object-contain"
        />
        <div className="text-sm">&copy; 2025 Mer Tracking Inc.</div>
      </div>
    </footer>
  )
}