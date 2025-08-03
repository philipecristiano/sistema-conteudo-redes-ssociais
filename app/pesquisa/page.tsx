'use client';

import { useState } from 'react';

interface SearchResult {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: string;
  snippet: string;
  url: string;
  source: string;
  type: 'scientific' | 'general';
  citations?: number;
  doi?: string;
  pmid?: string;
  pdf_url?: string;
  has_pdf?: boolean;
}

interface SearchResponse {
  results: SearchResult[];
  total?: number;
  sourceStats?: Record<string, number>;
  errors?: Array<{ source: string; error: string }>;
}

export default function PesquisaCientificaReal() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedSources, setSelectedSources] = useState<string[]>(['pubmed', 'crossref', 'semantic-scholar']);
  const [sourceStats, setSourceStats] = useState<Record<string, number>>({});
  const [searchErrors, setSearchErrors] = useState<Array<{ source: string; error: string }>>([]);
  const [articleText, setArticleText] = useState('');
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Opções de fontes disponíveis
  const availableSources = [
    { id: 'pubmed', name: 'PubMed', description: 'Base médica e biomédica' },
    { id: 'crossref', name: 'CrossRef', description: 'Metadados científicos globais' },
    { id: 'semantic-scholar', name: 'Semantic Scholar', description: 'IA para pesquisa acadêmica' },
    { id: 'arxiv', name: 'arXiv', description: 'Preprints científicos' }
  ];

  // Busca real usando as APIs implementadas
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setError('');
    setResults([]);
    setSourceStats({});
    setSearchErrors([]);

    try {
      // Usar a API unificada que combina todas as fontes
      const response = await fetch('/api/search/scientific', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchTerm: searchTerm.trim(),
          sources: selectedSources,
          maxResults: 5
        })
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data: SearchResponse = await response.json();

      if (data.results && data.results.length > 0) {
        setResults(data.results);
        setSourceStats(data.sourceStats || {});
        setSearchErrors(data.errors || []);
      } else {
        setError('Nenhum resultado encontrado para este termo de busca.');
      }

    } catch (err) {
      console.error('Erro na busca:', err);
      setError('Erro ao realizar a pesquisa. Verifique sua conexão e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Gerar resumo do artigo usando API real
  const handleSummarize = async () => {
    if (!articleText.trim()) return;

    setIsSummarizing(true);
    setSummary('');

    try {
      const response = await fetch('/api/search/generate-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Analise o seguinte artigo científico e gere um resumo estruturado destacando os pontos mais importantes:

${articleText}

Por favor, organize o resumo com as seguintes seções:
- Objetivo do estudo
- Metodologia utilizada
- Principais resultados
- Conclusões
- Implicações práticas
- Limitações do estudo`,
          maxTokens: 1000
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSummary(data.text || 'Resumo gerado com sucesso, mas conteúdo não disponível.');
      } else {
        throw new Error('Erro ao gerar resumo');
      }

    } catch (err) {
      console.error('Erro ao gerar resumo:', err);
      setError('Erro ao gerar resumo. Tente novamente.');
    } finally {
      setIsSummarizing(false);
    }
  };

  // Toggle de seleção de fontes
  const toggleSource = (sourceId: string) => {
    setSelectedSources(prev => 
      prev.includes(sourceId) 
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            🔬 Pesquisa Científica com APIs Reais
          </h1>
          <p className="text-gray-600 text-lg">
            Busca real em PubMed, CrossRef, Semantic Scholar e arXiv
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Seção de Pesquisa */}
          <div className="space-y-6">
            {/* Formulário de Pesquisa */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-purple-100">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                🔍 Busca em Bases Científicas Reais
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tema de Pesquisa
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Ex: diabetes tipo 2, machine learning, climate change..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>

                {/* Seleção de Fontes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bases de Dados (selecione uma ou mais)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableSources.map(source => (
                      <label key={source.id} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedSources.includes(source.id)}
                          onChange={() => toggleSource(source.id)}
                          className="text-purple-600 focus:ring-purple-500"
                        />
                        <div>
                          <div className="font-medium text-sm">{source.name}</div>
                          <div className="text-xs text-gray-500">{source.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSearch}
                  disabled={isLoading || !searchTerm.trim() || selectedSources.length === 0}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Buscando em {selectedSources.length} base(s)...
                    </div>
                  ) : (
                    '🔍 Buscar em Bases Científicas'
                  )}
                </button>
              </div>

              {/* Estatísticas por Fonte */}
              {Object.keys(sourceStats).length > 0 && (
                <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">📊 Resultados por Base:</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(sourceStats).map(([source, count]) => (
                      <div key={source} className="flex justify-between text-purple-700">
                        <span>{source}:</span>
                        <span className="font-medium">{count} artigos</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Erros por Fonte */}
              {searchErrors.length > 0 && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Avisos:</h3>
                  {searchErrors.map((error, index) => (
                    <div key={index} className="text-sm text-yellow-700">
                      <strong>{error.source}:</strong> {error.error}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Resultados da Pesquisa */}
            {results.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6 border border-purple-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  📊 Resultados Encontrados ({results.length})
                </h3>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {results.map((result, index) => (
                    <div key={`${result.source}-${result.id}`} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {result.source}
                        </span>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          {result.year && <span>{result.year}</span>}
                          {result.citations !== undefined && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                              {result.citations} citações
                            </span>
                          )}
                          {result.has_pdf && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              PDF disponível
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <h4 className="font-semibold text-gray-800 mb-2 leading-tight">
                        <a href={result.url} target="_blank" rel="noopener noreferrer" 
                           className="hover:text-purple-600 transition-colors">
                          {result.title}
                        </a>
                      </h4>
                      
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Autores:</strong> {result.authors}
                      </p>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Revista:</strong> {result.journal}
                      </p>
                      
                      <p className="text-sm text-gray-700 leading-relaxed mb-3">
                        {result.snippet}
                      </p>
                      
                      <div className="flex items-center space-x-4">
                        <a href={result.url} target="_blank" rel="noopener noreferrer"
                           className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                          📖 Ver artigo →
                        </a>
                        {result.pdf_url && (
                          <a href={result.pdf_url} target="_blank" rel="noopener noreferrer"
                             className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                            📄 PDF gratuito →
                          </a>
                        )}
                        {result.doi && (
                          <a href={`https://doi.org/${result.doi}`} target="_blank" rel="noopener noreferrer"
                             className="text-sm text-gray-600 hover:text-gray-800">
                            DOI: {result.doi}
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Seção de Resumo de Artigos */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6 border border-pink-100">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                📝 Gerador de Resumo com IA
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cole o texto do artigo aqui:
                  </label>
                  <textarea
                    value={articleText}
                    onChange={(e) => setArticleText(e.target.value)}
                    placeholder="Cole aqui o texto completo do artigo científico que deseja resumir..."
                    className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Dica: Copie o texto completo do artigo para obter um resumo mais preciso
                  </p>
                </div>

                <button
                  onClick={handleSummarize}
                  disabled={isSummarizing || !articleText.trim()}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                >
                  {isSummarizing ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Gerando Resumo com IA...
                    </div>
                  ) : (
                    '🤖 Gerar Resumo Inteligente'
                  )}
                </button>
              </div>
            </div>

            {/* Resumo Gerado */}
            {summary && (
              <div className="bg-white rounded-lg shadow-lg p-6 border border-green-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    ✨ Resumo Gerado com IA
                  </h3>
                  <button
                    onClick={() => navigator.clipboard.writeText(summary)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    📋 Copiar
                  </button>
                </div>
                
                <div className="prose prose-sm max-w-none">
                  <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-line text-sm leading-relaxed">
                    {summary}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-center">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

