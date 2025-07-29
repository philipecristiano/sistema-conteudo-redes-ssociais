'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Verificar autenticação
  useEffect(() => {
    const checkAuth = () => {
      // Se estiver na página de login, não verificar autenticação
      if (pathname === '/login') {
        setIsAuthenticated(true); // Permitir acesso à página de login
        setIsLoading(false);
        return;
      }

      const authenticated = localStorage.getItem('authenticated');
      const loginTime = localStorage.getItem('loginTime');

      if (authenticated === 'true' && loginTime) {
        // Verificar se a sessão não expirou (24 horas)
        const now = Date.now();
        const loginTimestamp = parseInt(loginTime);
        const twentyFourHours = 24 * 60 * 60 * 1000;

        if (now - loginTimestamp < twentyFourHours) {
          setIsAuthenticated(true);
        } else {
          // Sessão expirada
          localStorage.removeItem('authenticated');
          localStorage.removeItem('loginTime');
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [pathname]);

  // Redirecionar para login se não autenticado
  useEffect(() => {
    if (!isLoading && isAuthenticated === false && pathname !== '/login') {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Função de logout
  const handleLogout = () => {
    localStorage.removeItem('authenticated');
    localStorage.removeItem('loginTime');
    setIsAuthenticated(false);
    router.push('/login');
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-purple-700 mb-2">
            Carregando Sistema
          </h2>
          <p className="text-purple-600">
            Verificando autenticação...
          </p>
        </div>
      </div>
    );
  }

  // Se não autenticado e não estiver na página de login, não renderizar nada
  // (o useEffect vai redirecionar)
  if (!isAuthenticated && pathname !== '/login') {
    return null;
  }

  // Se estiver na página de login, renderizar sem header
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // Renderizar com header de autenticação
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com logout */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Título */}
            <div className="flex items-center">
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Sistema de Conteúdo
              </h1>
            </div>

            {/* Informações do usuário e logout */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Sistema Ativo</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2"
              >
                <span>🔓</span>
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer opcional */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>🔒 Sistema protegido por autenticação • Desenvolvido com segurança</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

