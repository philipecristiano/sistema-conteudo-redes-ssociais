// Force deploy sync - v2.0.1

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthWrapper from "../components/AuthWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistema de Conteúdo para Redes Sociais",
  description: "Sistema completo para pesquisa, criação e agendamento de conteúdo para redes sociais",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthWrapper>
          <div className="min-h-screen bg-gray-50">
            {/* Navegação principal */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex">
                    <div className="flex-shrink-0 flex items-center">
                      <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Sistema de Conteúdo
                      </h1>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                      {/* Links de navegação */}
                      <a
                        href="/"
                        className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
                      >
                        🏠 Início
                      </a>
                      <a
                        href="/pesquisa"
                        className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
                      >
                        🔍 Pesquisa de Fontes
                      </a>
                      <a
                        href="/geracao-texto"
                        className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
                      >
                        📝 Resumo Inteligente
                      </a>
                      <a
                        href="/criacao-imagens"
                        className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
                      >
                        🎨 Geração de Imagens
                      </a>
                      <a
                        href="/agendamento"
                        className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
                      >
                        📅 Agendamento
                      </a>
                    </div>
                  </div>
                  
                  {/* Indicador de status */}
                  <div className="flex items-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-600 hidden sm:block">Sistema Online</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu mobile */}
              <div className="sm:hidden">
                <div className="pt-2 pb-3 space-y-1">
                  <a
                    href="/"
                    className="text-gray-500 hover:text-gray-700 block px-3 py-2 text-base font-medium"
                  >
                    🏠 Início
                  </a>
                  <a
                    href="/pesquisa"
                    className="text-gray-500 hover:text-gray-700 block px-3 py-2 text-base font-medium"
                  >
                    🔍 Pesquisa de Fontes
                  </a>
                  <a
                    href="/geracao-texto"
                    className="text-gray-500 hover:text-gray-700 block px-3 py-2 text-base font-medium"
                  >
                    📝 Resumo Inteligente
                  </a>
                  <a
                    href="/criacao-imagens"
                    className="text-gray-500 hover:text-gray-700 block px-3 py-2 text-base font-medium"
                  >
                    🎨 Geração de Imagens
                  </a>
                  <a
                    href="/agendamento"
                    className="text-gray-500 hover:text-gray-700 block px-3 py-2 text-base font-medium"
                  >
                    📅 Agendamento
                  </a>
                </div>
              </div>
            </nav>

            {/* Conteúdo principal */}
            <main className="flex-1">
              {children}
            </main>
          </div>
        </AuthWrapper>
      </body>
    </html>
  );
}
