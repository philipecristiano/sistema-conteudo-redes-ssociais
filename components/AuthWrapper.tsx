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

  useEffect(() => {
    // Verificar autenticação
    const checkAuth = () => {
      const authStatus = localStorage.getItem('sistema_auth') === 'true';
      setIsAuthenticated(authStatus);
      setIsLoading(false);

      // Se não está autenticado e não está na página de login, redirecionar
      if (!authStatus && pathname !== '/login') {
        router.push('/login');
      }
    };

    checkAuth();

    // Listener para mudanças no localStorage (logout em outras abas)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sistema_auth') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [router, pathname]);

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-6 backdrop-blur-sm">
            <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">
            Carregando Sistema...
          </h2>
          <p className="text-purple-200">
            Verificando autenticação
          </p>
        </div>
      </div>
    );
  }

  // Se está na página de login, mostrar sem verificação adicional
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // Se não está autenticado, não mostrar nada (redirecionamento já foi feito)
  if (!isAuthenticated) {
    return null;
  }

  // Se está autenticado, mostrar conteúdo com header de logout
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com logout */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🚀</span>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Sistema de Conteúdo
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Sistema Privado
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem('sistema_auth');
                  router.push('/login');
                }}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
              >
                <span className="mr-2">🚪</span>
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main>
        {children}
      </main>
    </div>
  );
}

