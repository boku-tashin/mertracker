// pages/_app.tsx
import '../styles/globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import { FavoriteProvider, useFavorite } from '../contexts/FavoriteContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FavoriteProvider>
      <LayoutWithHeader>
        <Component {...pageProps} />
      </LayoutWithHeader>
      <Toaster position="top-center" reverseOrder={false} />
    </FavoriteProvider>
  )
}

function LayoutWithHeader({ children }: { children: React.ReactNode }) {
  const { favorites } = useFavorite()
  return (
    <>
      <Header favoriteCount={favorites.length} />
      <main className="min-h-screen bg-gray-100">{children}</main>
      <Footer />
    </>
  )
}

export default MyApp