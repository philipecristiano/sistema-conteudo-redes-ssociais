'use client'; // <-- ESSENCIAL: Adicione esta linha no topo!

import { useState } from 'react';

interface SearchResult {
  link: string;
  title: string;
  source: string;
  snippet: string;
  credibility: string;
}

export default function PesquisaPage() {
  const [tema, setTema] = useState('');
  const [nicho, setNicho] = useState('');
  const [plataforma, setPlataforma] = useState(''); // Mantido, embora não usado na API atual
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Log para ver o estado atual na renderização
  console.log('Renderizando PesquisaPage. isLoading:', isLoading, 'results.length:', results.length);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('handleSearch iniciado. isLoading ANTES:', isLoading); // Log 1
    
    if (!tema) {
      setError('Por favor, informe um tema para pesquisar');
      return;
    }
    
    setIsLoading(true);
    setResults([]); // Limpa resultados anteriores
    console.log('handleSearch: isLoading APÓS setIsLoading(true):', isLoading); // Log 2
    
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(tema)}&nicho=${encodeURIComponent(nicho)}`);
      
      if (!response.ok) {
        let errorMsg = 'Erro ao realizar a pesquisa';
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
        } catch (parseError) {
        }
        throw new Error(errorMsg);
      }
      
      const data = await response.json();
      setResults(data.results || []);
      console.log('handleSearch: Resultados recebidos. results.length:', (data.results || []).length); // Log 3
      
      if (!data.results || data.results.length === 0) {
        setError('Nenhum resultado encontrado para este tema.');
      }
      
    } catch (err) {
      setError((err instanceof Error ? err.message : 'Ocorreu um erro inesperado.') || 'Ocorreu um erro inesperado. Verifique sua chave de API e tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false); // Termina o carregamento
      console.log('handleSearch: finally block. isLoading APÓS setIsLoading(false):', isLoading); // Log 4
    }
  };

  // O restante é a estrutura visual (JSX)
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-8">Pesquisa de Fontes Confiáveis</h1>
      
      {/* Formulário de Pesquisa */}
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md mb-8">
        <form className="space-y-4" onSubmit={handleSearch}>
          <div>
            <label htmlFor="tema" className="block text-sm font-medium mb-1">
              Tema da Pesquisa
            </label>
            <input
              type="text"
              id="tema"
              value={tema} // Conecta ao estado 'tema'
              onChange={(e) => setTema(e.target.value)} // Atualiza o estado quando o usuário digita
              placeholder="Ex: Benefícios do exercício físico"
              className="w-full p-2 border border-gray-300 rounded-md"
              required // Torna o campo obrigatório
            />
          </div>
          
          <div>
            <label htmlFor="nicho" className="block text-sm font-medium mb-1">
              Nicho (Opcional)
            </label>
            <select
              id="nicho"
              value={nicho} // Conecta ao estado 'nicho'
              onChange={(e) => setNicho(e.target.value)} // Atualiza o estado
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Qualquer Nicho</option>
              <option value="saude">Saúde e Bem-estar</option>
              <option value="financas">Finanças Pessoais</option>
              <option value="tecnologia">Tecnologia</option>
              <option value="educacao">Educação</option>
              <option value="entretenimento">Entretenimento</option>
            </select>
          </div>
          
          {/* Campo Plataforma mantido visualmente, mas não usado na lógica atual da API */}
          <div>
            <label htmlFor="plataforma" className="block text-sm font-medium mb-1">
              Plataforma (Visual)
            </label>
            <select
              id="plataforma"
              value={plataforma}
              onChange={(e) => setPlataforma(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Qualquer Plataforma</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="tiktok">TikTok</option>
              <option value="linkedin">LinkedIn</option>
              <option value="youtube">YouTube</option>
            </select>
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading} // Desabilita o botão durante o carregamento
          >
            {isLoading ? 'Pesquisando...' : 'Pesquisar Fontes'} 
          </button>
          
          {/* Mostra a mensagem de erro, se houver */}
          {error && (
            <div className="mt-4 p-3 text-red-700 bg-red-100 border border-red-300 rounded-md">
              {error}
            </div>
          )}
        </form>
      </div>
      
      {/* Área de Resultados */}
      <div className="w-full max-w-2xl mt-8">
        <h2 className="text-xl font-semibold mb-4">Resultados da Pesquisa</h2>
        
        {/* Mostra mensagem inicial ou de carregamento */}
        {!isLoading && results.length === 0 && !error && (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-gray-500">
              Digite um tema e clique em "Pesquisar Fontes" para ver os resultados.
            </p>
          </div>
        )}
        {isLoading && (
           <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <p className="text-blue-600">Carregando resultados...</p>
          </div>
        )}
        
        {/* Mostra os resultados da busca */}
        {!isLoading && results.length > 0 && (
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-medium mb-1">
                  <a 
                    href={result.link} 
                    target="_blank" // Abre em nova aba
                    rel="noopener noreferrer" // Boa prática de segurança
                    className="text-blue-700 hover:underline hover:text-blue-900"
                  >
                    {result.title}
                  </a>
                </h3>
                <p className="text-sm text-green-700 mb-2">{result.source}</p>
                <p className="text-gray-700 text-sm mb-3">{result.snippet}</p>
                <div className="flex justify-end">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ // Estilos para o nível de credibilidade
                    result.credibility === 'Alta' 
                      ? 'bg-green-100 text-green-800' 
                      : result.credibility === 'Média'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    Credibilidade: {result.credibility}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
