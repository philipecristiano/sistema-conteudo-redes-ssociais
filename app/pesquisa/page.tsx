'use client';

import { useState } from 'react';

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
  type: 'scientific' | 'general';
  authors?: string;
  year?: string;
  journal?: string;
}

export default function PesquisaCientifica() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchType, setSearchType] = useState<'scientific' | 'mixed'>('scientific');
  const [articleText, setArticleText] = useState('');
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Simular busca em bases científicas
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setError('');
    setResults([]);

    try {
      // Simular resultados de diferentes bases científicas
      const mockResults: SearchResult[] = [
        // PubMed
        {
          title: `${searchTerm}: A Systematic Review and Meta-Analysis`,
          url: `https://pubmed.ncbi.nlm.nih.gov/example1`,
          snippet: `Comprehensive systematic review examining the effects of ${searchTerm} on health outcomes. This meta-analysis includes 45 randomized controlled trials with over 10,000 participants...`,
          source: 'PubMed',
          type: 'scientific',
          authors: 'Silva, J.P.; Santos, M.A.; Oliveira, R.C.',
          year: '2024',
          journal: 'Journal of Medical Research'
        },
        {
          title: `Clinical Applications of ${searchTerm} in Modern Medicine`,
          url: `https://pubmed.ncbi.nlm.nih.gov/example2`,
          snippet: `Recent advances in ${searchTerm} have shown promising results in clinical trials. This study presents evidence-based recommendations for healthcare professionals...`,
          source: 'PubMed',
          type: 'scientific',
          authors: 'Rodriguez, A.L.; Kim, S.H.',
          year: '2024',
          journal: 'Clinical Medicine Today'
        },
        // Google Scholar
        {
          title: `The Impact of ${searchTerm} on Sustainable Development`,
          url: `https://scholar.google.com/example1`,
          snippet: `This research investigates the relationship between ${searchTerm} and sustainable development goals. Our findings suggest significant correlations with environmental outcomes...`,
          source: 'Google Scholar',
          type: 'scientific',
          authors: 'Thompson, K.M.; Patel, N.R.',
          year: '2023',
          journal: 'Environmental Science Quarterly'
        },
        // SciELO
        {
          title: `${searchTerm}: Perspectivas Brasileiras e Internacionais`,
          url: `https://scielo.br/example1`,
          snippet: `Estudo comparativo sobre ${searchTerm} no contexto brasileiro e internacional. A pesquisa analisa dados de 15 países e apresenta recomendações específicas...`,
          source: 'SciELO',
          type: 'scientific',
          authors: 'Costa, L.B.; Ferreira, A.M.',
          year: '2024',
          journal: 'Revista Brasileira de Pesquisa'
        },
        // ResearchGate
        {
          title: `Innovative Approaches to ${searchTerm}: A Multidisciplinary Study`,
          url: `https://researchgate.net/example1`,
          snippet: `Novel methodologies for studying ${searchTerm} across multiple disciplines. This collaborative research presents innovative frameworks and practical applications...`,
          source: 'ResearchGate',
          type: 'scientific',
          authors: 'Johnson, R.K.; Lee, M.S.; Brown, T.A.',
          year: '2024',
          journal: 'Interdisciplinary Research Journal'
        }
      ];

      // Se busca mista, adicionar resultados gerais
      if (searchType === 'mixed') {
        mockResults.push(
          {
            title: `${searchTerm} - Guia Completo e Atualizado`,
            url: `https://example.com/guia-${searchTerm}`,
            snippet: `Guia completo sobre ${searchTerm} com informações atualizadas, dicas práticas e exemplos reais. Conteúdo verificado por especialistas...`,
            source: 'Portal Especializado',
            type: 'general'
          },
          {
            title: `Tudo sobre ${searchTerm}: Benefícios e Aplicações`,
            url: `https://example.com/beneficios-${searchTerm}`,
            snippet: `Descubra os principais benefícios de ${searchTerm} e como aplicar no dia a dia. Artigo baseado em evidências científicas...`,
            source: 'Site Educativo',
            type: 'general'
          }
        );
      }

      setResults(mockResults);
    } catch (err) {
      setError('Erro ao realizar a pesquisa. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Gerar resumo do artigo
  const handleSummarize = async () => {
    if (!articleText.trim()) return;

    setIsSummarizing(true);
    setSummary('');

    try {
      // Simular processamento de resumo
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockSummary = `
## 📋 Resumo Executivo

### 🎯 Pontos Principais:
• **Objetivo:** Análise abrangente dos efeitos e aplicações do tema pesquisado
• **Metodologia:** Revisão sistemática com critérios rigorosos de seleção
• **Amostra:** Estudos com alta qualidade metodológica e relevância científica

### 🔬 Principais Descobertas:
1. **Eficácia Comprovada:** Os resultados demonstram evidências consistentes de benefícios significativos
2. **Segurança:** Perfil de segurança favorável com baixa incidência de efeitos adversos
3. **Aplicabilidade:** Potencial de implementação em diferentes contextos e populações

### 📊 Resultados Quantitativos:
• **Melhoria observada:** 65-80% dos casos estudados
• **Significância estatística:** p < 0.001 em análises principais
• **Tamanho do efeito:** Moderado a grande (d = 0.7-1.2)

### 🎯 Conclusões:
As evidências suportam a eficácia e segurança da abordagem estudada. Recomenda-se implementação gradual com monitoramento contínuo dos resultados.

### 📚 Implicações Práticas:
• Aplicação imediata em contextos clínicos/práticos
• Necessidade de treinamento adequado para implementação
• Potencial para políticas públicas baseadas em evidências

### 🔍 Limitações:
• Heterogeneidade entre estudos incluídos
• Necessidade de estudos longitudinais adicionais
• Variabilidade nas populações estudadas

---
*Resumo gerado automaticamente com base no texto fornecido*
      `;

      setSummary(mockSummary);
    } catch (err) {
      setError('Erro ao gerar resumo. Tente novamente.');
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            🔬 Pesquisa Científica Avançada
          </h1>
          <p className="text-gray-600 text-lg">
            Busca prioritária em bases científicas e geração automática de resumos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Seção de Pesquisa */}
          <div className="space-y-6">
            {/* Formulário de Pesquisa */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-purple-100">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                🔍 Busca em Bases Científicas
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
                    placeholder="Ex: diabetes tipo 2, inteligência artificial, sustentabilidade..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Busca
                  </label>
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value as 'scientific' | 'mixed')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="scientific">🔬 Apenas Artigos Científicos</option>
                    <option value="mixed">📚 Científicos + Fontes Gerais</option>
                  </select>
                </div>

                <button
                  onClick={handleSearch}
                  disabled={isLoading || !searchTerm.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Pesquisando...
                    </div>
                  ) : (
                    '🔍 Pesquisar em Bases Científicas'
                  )}
                </button>
              </div>

              {/* Bases de Dados */}
              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">📚 Bases Consultadas:</h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-purple-700">
                  <div>• PubMed (Medicina)</div>
                  <div>• Google Scholar</div>
                  <div>• SciELO (Brasil)</div>
                  <div>• ResearchGate</div>
                </div>
              </div>
            </div>

            {/* Resultados da Pesquisa */}
            {results.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6 border border-purple-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  📊 Resultados Encontrados ({results.length})
                </h3>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {results.map((result, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          result.type === 'scientific' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {result.source}
                        </span>
                        {result.year && (
                          <span className="text-xs text-gray-500">{result.year}</span>
                        )}
                      </div>
                      
                      <h4 className="font-semibold text-gray-800 mb-2 leading-tight">
                        <a href={result.url} target="_blank" rel="noopener noreferrer" 
                           className="hover:text-purple-600 transition-colors">
                          {result.title}
                        </a>
                      </h4>
                      
                      {result.authors && (
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Autores:</strong> {result.authors}
                        </p>
                      )}
                      
                      {result.journal && (
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Revista:</strong> {result.journal}
                        </p>
                      )}
                      
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {result.snippet}
                      </p>
                      
                      <a href={result.url} target="_blank" rel="noopener noreferrer"
                         className="inline-block mt-2 text-sm text-purple-600 hover:text-purple-800 font-medium">
                        📖 Ler artigo completo →
                      </a>
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
                📝 Gerador de Resumo de Artigos
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
                      Gerando Resumo...
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
                    ✨ Resumo Gerado
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

