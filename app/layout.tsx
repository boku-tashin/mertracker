// app/layout.tsx（または pages/_app.tsx を使ってる場合も）

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}