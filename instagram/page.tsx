'use client';

import { useState, useEffect } from 'react';

interface InstagramAccount {
  pageId: string;
  pageName: string;
  instagramId: string;
  instagramName: string;
  instagramUsername: string;
}

interface AccountData {
  connected: boolean;
  facebookUser?: {
    id: string;
    name: string;
  };
  accounts: InstagramAccount[];
  connectedAt?: string;
  expired?: boolean;
}

interface Post {
  id: string;
  caption: string;
  mediaUrl: string;
  status: string;
  scheduledFor?: string;
  publishedAt?: string;
  instagramUsername: string;
  createdAt: string;
  error?: string;
}

export default function InstagramPage() {
  const [accountData, setAccountData] = useState<AccountData>({ connected: false, accounts: [] });
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  
  // Estados do formulário de post
  const [caption, setCaption] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [scheduledFor, setScheduledFor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userId = 'user_1'; // Em um app real, isso viria da autenticação

  useEffect(() => {
    loadAccountData();
    loadPosts();
  }, []);

  const loadAccountData = async () => {
    try {
      const response = await fetch(`/api/instagram/accounts?user_id=${userId}`);
      const data = await response.json();
      setAccountData(data);
      
      if (data.accounts.length > 0 && !selectedAccount) {
        setSelectedAccount(data.accounts[0].instagramId);
      }
    } catch (error) {
      console.error('Erro ao carregar dados da conta:', error);
    }
  };

  const loadPosts = async () => {
    try {
      const response = await fetch(`/api/instagram/posts?user_id=${userId}`);
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectInstagram = async () => {
    try {
      const response = await fetch(`/api/instagram/auth/start?user_id=${userId}`);
      const data = await response.json();
      
      if (data.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (error) {
      console.error('Erro ao conectar Instagram:', error);
      alert('Erro ao conectar com Instagram');
    }
  };

  const disconnectInstagram = async () => {
    if (!confirm('Tem certeza que deseja desconectar sua conta do Instagram?')) {
      return;
    }

    try {
      const response = await fetch(`/api/instagram/accounts?user_id=${userId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setAccountData({ connected: false, accounts: [] });
        setPosts([]);
        alert('Conta desconectada com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao desconectar:', error);
      alert('Erro ao desconectar conta');
    }
  };

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAccount || !caption || !mediaUrl) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/instagram/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          instagramId: selectedAccount,
          caption,
          mediaUrl,
          scheduledFor: scheduledFor || null
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        setCaption('');
        setMediaUrl('');
        setScheduledFor('');
        setShowCreatePost(false);
        loadPosts();
      } else {
        alert(`Erro: ${data.error}`);
      }
    } catch (error) {
      console.error('Erro ao criar post:', error);
      alert('Erro ao criar post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-600';
      case 'scheduled': return 'text-blue-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'Publicado';
      case 'scheduled': return 'Agendado';
      case 'failed': return 'Falhou';
      case 'draft': return 'Rascunho';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Instagram</h1>
          <p className="text-gray-600">Gerencie sua integração com o Instagram e agende publicações</p>
        </div>

        {/* Status da Conexão */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Status da Conexão</h2>
          
          {!accountData.connected ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Instagram não conectado</h3>
              <p className="text-gray-600 mb-4">Conecte sua conta do Instagram Business para começar a publicar</p>
              <button
                onClick={connectInstagram}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Conectar Instagram
              </button>
            </div>
          ) : accountData.expired ? (
            <div className="text-center py-8">
              <div className="text-red-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-red-900 mb-2">Token Expirado</h3>
              <p className="text-red-600 mb-4">Sua conexão com o Instagram expirou. Reconecte sua conta.</p>
              <button
                onClick={connectInstagram}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reconectar Instagram
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="text-green-400 mr-3">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Conectado como {accountData.facebookUser?.name}</h3>
                    <p className="text-gray-600">Conectado em {accountData.connectedAt ? formatDate(accountData.connectedAt) : 'Data não disponível'}</p>
                  </div>
                </div>
                <button
                  onClick={disconnectInstagram}
                  className="text-red-600 hover:text-red-700 px-4 py-2 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Desconectar
                </button>
              </div>

              {/* Contas Instagram */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {accountData.accounts.map((account) => (
                  <div key={account.instagramId} className="border rounded-lg p-4 hover:bg-gray-50">
                    <h4 className="font-medium text-gray-900">@{account.instagramUsername}</h4>
                    <p className="text-sm text-gray-600">{account.instagramName}</p>
                    <p className="text-xs text-gray-500">Página: {account.pageName}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Criar Post */}
        {accountData.connected && !accountData.expired && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Criar Post</h2>
              <button
                onClick={() => setShowCreatePost(!showCreatePost)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {showCreatePost ? 'Cancelar' : 'Novo Post'}
              </button>
            </div>

            {showCreatePost && (
              <form onSubmit={createPost} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Conta Instagram
                  </label>
                  <select
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {accountData.accounts.map((account) => (
                      <option key={account.instagramId} value={account.instagramId}>
                        @{account.instagramUsername} - {account.instagramName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Legenda *
                  </label>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Escreva a legenda do seu post..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL da Imagem *
                  </label>
                  <input
                    type="url"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="https://exemplo.com/imagem.jpg"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Agendar para (opcional )
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledFor}
                    onChange={(e) => setScheduledFor(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Deixe em branco para publicar imediatamente
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? 'Criando...' : (scheduledFor ? 'Agendar Post' : 'Publicar Agora')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreatePost(false)}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Lista de Posts */}
        {accountData.connected && !accountData.expired && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Seus Posts</h2>
            
            {posts.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum post encontrado</h3>
                <p className="text-gray-600">Crie seu primeiro post para começar!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-sm font-medium ${getStatusColor(post.status)}`}>
                            {getStatusText(post.status)}
                          </span>
                          <span className="text-sm text-gray-500">@{post.instagramUsername}</span>
                        </div>
                        <p className="text-gray-900 mb-2">{post.caption.substring(0, 150)}{post.caption.length > 150 ? '...' : ''}</p>
                        <div className="text-sm text-gray-500 space-y-1">
                          <p>Criado: {formatDate(post.createdAt)}</p>
                          {post.scheduledFor && (
                            <p>Agendado para: {formatDate(post.scheduledFor)}</p>
                          )}
                          {post.publishedAt && (
                            <p>Publicado: {formatDate(post.publishedAt)}</p>
                          )}
                          {post.error && (
                            <p className="text-red-600">Erro: {post.error}</p>
                          )}
                        </div>
                      </div>
                      {post.mediaUrl && (
                        <img 
                          src={post.mediaUrl} 
                          alt="Preview" 
                          className="w-16 h-16 object-cover rounded-lg ml-4"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
