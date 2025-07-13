'use client';

import { useState, useEffect } from 'react';

export default function InstagramPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  // Verificar se já está conectado ao carregar a página
  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const response = await fetch('/api/instagram/accounts');
      if (response.ok) {
        const data = await response.json();
        if (data.connected) {
          setIsConnected(true);
          setUserInfo(data.userInfo);
        }
      }
    } catch (error) {
      console.log('Não conectado ainda');
    }
  };

  const handleConnect = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/instagram/auth/start?user_id=user_1');
      
      if (response.ok) {
        const data = await response.json();
        // Redirecionar para a URL de autenticação do Facebook
        window.location.href = data.authUrl;
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erro ao conectar com Instagram');
      }
    } catch (error) {
      setError('Erro de conexão. Tente novamente.');
      console.error('Erro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      // Implementar lógica de desconexão se necessário
      setIsConnected(false);
      setUserInfo(null);
    } catch (error) {
      setError('Erro ao desconectar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-8">Integração com Instagram</h1>
      
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <div className="w-14 h-14 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-full"></div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4 text-center">Conecte sua conta do Instagram</h2>
        <p className="text-gray-600 mb-6 text-center">
          Conecte sua conta do Instagram para publicar e agendar conteúdo diretamente do sistema.
        </p>

        <div className="space-y-4">
          <h3 className="text-md font-medium mb-2">Status da conexão:</h3>
          <div className="flex items-center text-gray-600">
            <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            {isConnected ? (
              <span className="text-green-600">
                Conectado {userInfo && `como ${userInfo.username}`}
              </span>
            ) : (
              <span>Não conectado</span>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mt-6">
          {!isConnected ? (
            <button
              onClick={handleConnect}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-md hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Conectando...' : 'Conectar com Instagram'}
            </button>
          ) : (
            <button
              onClick={handleDisconnect}
              disabled={isLoading}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Desconectando...' : 'Desconectar'}
            </button>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h2 className="text-xl font-semibold mb-4">Publicar no Instagram</h2>
        <p className="text-gray-600 mb-6">
          Após conectar sua conta, você poderá publicar conteúdo diretamente no Instagram.
        </p>

        {isConnected && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecione o conteúdo
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-md">
                <option>Selecione um conteúdo gerado</option>
                <option>Dicas de alimentação saudável...</option>
                <option>Exercícios para fazer em casa</option>
                <option>Meditação para iniciantes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de publicação
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-md">
                <option>Selecione o tipo</option>
                <option>Feed</option>
                <option>Reels</option>
                <option>Story</option>
                <option>Carrossel</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Legenda
              </label>
              <textarea 
                className="w-full p-2 border border-gray-300 rounded-md h-32"
                placeholder="Digite a legenda do seu post..."
              ></textarea>
            </div>

            <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
              Publicar no Instagram
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

