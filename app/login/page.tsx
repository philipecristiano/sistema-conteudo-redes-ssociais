'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Verificar se já está autenticado
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('sistema_auth') === 'true';
    if (isAuthenticated) {
      router.push('/');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simular delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Senha definida (você pode alterar aqui)
    const correctPassword = 'sistema2025';

    if (password === correctPassword) {
      localStorage.setItem('sistema_auth', 'true');
      router.push('/');
    } else {
      setError('Senha incorreta. Tente novamente.');
      setPassword('');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 flex items-center justify-center p-4">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-6 backdrop-blur-sm">
            <span className="text-4xl">🚀</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Sistema de Conteúdo
          </h1>
          <p className="text-purple-200 text-lg">
            Redes Sociais Inteligente
          </p>
        </div>

        {/* Card de Login */}
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white border-opacity-20">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">
              Acesso Privado
            </h2>
            <p className="text-purple-200">
              Digite sua senha para continuar
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-purple-200 mb-2">
                Senha de Acesso
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm"
                  placeholder="Digite sua senha..."
                  required
                  autoFocus
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <span className="text-purple-300">🔒</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-500 bg-opacity-20 border border-red-400 border-opacity-30 rounded-xl p-3 backdrop-blur-sm">
                <div className="flex items-center">
                  <span className="text-red-300 mr-2">⚠️</span>
                  <span className="text-red-200 text-sm">{error}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Verificando...
                </>
              ) : (
                <>
                  <span className="mr-2">🚀</span>
                  Entrar no Sistema
                </>
              )}
            </button>
          </form>

          {/* Informações adicionais */}
          <div className="mt-8 pt-6 border-t border-white border-opacity-20">
            <div className="text-center">
              <p className="text-purple-200 text-sm mb-4">
                Sistema protegido por autenticação
              </p>
              <div className="flex items-center justify-center space-x-4 text-xs text-purple-300">
                <div className="flex items-center">
                  <span className="mr-1">🔒</span>
                  Seguro
                </div>
                <div className="flex items-center">
                  <span className="mr-1">⚡</span>
                  Rápido
                </div>
                <div className="flex items-center">
                  <span className="mr-1">🎯</span>
                  Privado
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-purple-300 text-sm">
            © 2025 Sistema de Conteúdo para Redes Sociais
          </p>
        </div>
      </div>
    </div>
  );
}

