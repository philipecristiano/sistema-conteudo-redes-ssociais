import AuthWrapper from '../components/AuthWrapper'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
} ) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthWrapper>
          {children}
        </AuthWrapper>
      </body>
    </html>
  )
}
