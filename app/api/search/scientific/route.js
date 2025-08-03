// API unificada para busca em múltiplas bases científicas
// Arquivo: app/api/search/scientific/route.js

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { searchTerm, sources = ['pubmed', 'crossref', 'arxiv', 'semantic-scholar'], maxResults = 5 } = await request.json();

    if (!searchTerm) {
      return NextResponse.json(
        { error: 'Termo de busca é obrigatório' },
        { status: 400 }
      );
    }

    const allResults = [];
    const errors = [];

    // Função para fazer busca em uma fonte específica
    const searchInSource = async (source) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/search/${source}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ searchTerm, maxResults })
        });

        if (response.ok) {
          const data = await response.json();
          return data.results || [];
        } else {
          throw new Error(`Erro ${response.status} em ${source}`);
        }
      } catch (error) {
        console.error(`Erro na busca ${source}:`, error);
        errors.push({ source, error: error.message });
        return [];
      }
    };

    // Buscar em paralelo em todas as fontes selecionadas
    const searchPromises = sources.map(source => searchInSource(source));
    const resultsArrays = await Promise.all(searchPromises);

    // Combinar todos os resultados
    resultsArrays.forEach((results, index) => {
      if (results && results.length > 0) {
        allResults.push(...results);
      }
    });

    // Ordenar por relevância (pode ser melhorado com algoritmo mais sofisticado)
    const sortedResults = allResults.sort((a, b) => {
      // Priorizar por fonte (PubMed > Semantic Scholar > CrossRef > arXiv)
      const sourceOrder = { 'PubMed': 4, 'Semantic Scholar': 3, 'CrossRef': 2, 'arXiv': 1 };
      const aScore = sourceOrder[a.source] || 0;
      const bScore = sourceOrder[b.source] || 0;
      
      if (aScore !== bScore) {
        return bScore - aScore;
      }

      // Depois por citações (se disponível)
      const aCitations = a.citations || 0;
      const bCitations = b.citations || 0;
      
      if (aCitations !== bCitations) {
        return bCitations - aCitations;
      }

      // Por último, por ano (mais recente primeiro)
      const aYear = parseInt(a.year) || 0;
      const bYear = parseInt(b.year) || 0;
      
      return bYear - aYear;
    });

    // Remover duplicatas baseado no título (algoritmo simples)
    const uniqueResults = [];
    const seenTitles = new Set();

    for (const result of sortedResults) {
      const normalizedTitle = result.title.toLowerCase().replace(/[^\w\s]/g, '').trim();
      if (!seenTitles.has(normalizedTitle)) {
        seenTitles.add(normalizedTitle);
        uniqueResults.push(result);
      }
    }

    // Estatísticas por fonte
    const sourceStats = {};
    uniqueResults.forEach(result => {
      sourceStats[result.source] = (sourceStats[result.source] || 0) + 1;
    });

    return NextResponse.json({ 
      results: uniqueResults.slice(0, maxResults * sources.length), // Limitar resultados totais
      total: uniqueResults.length,
      sourceStats: sourceStats,
      searchTerm: searchTerm,
      sources: sources,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro na busca científica unificada:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor na busca científica' },
      { status: 500 }
    );
  }
}

// Função auxiliar para normalizar títulos e detectar duplicatas
function normalizeTitle(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove pontuação
    .replace(/\s+/g, ' ') // Normaliza espaços
    .trim();
}

// Função auxiliar para calcular similaridade entre títulos
function calculateSimilarity(title1, title2) {
  const words1 = new Set(title1.split(' '));
  const words2 = new Set(title2.split(' '));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size; // Jaccard similarity
}

