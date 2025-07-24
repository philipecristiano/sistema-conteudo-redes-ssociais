import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthWrapper from '../components/AuthWrapper'

const inter = Inter({ subsets: ['latin'] } )

export const metadata: Metadata = {
  title: 'Sistema de Conteúdo para Redes Sociais',
  description: 'Sistema inteligente para criação e gerenciamento de conteúdo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthWrapper>
          {children}
        </AuthWrapper>
      </body>
    </html>
  )
}
