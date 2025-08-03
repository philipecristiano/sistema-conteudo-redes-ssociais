// API para busca real no CrossRef
// Arquivo: app/api/search/crossref/route.js

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { searchTerm, maxResults = 10 } = await request.json();

    if (!searchTerm) {
      return NextResponse.json(
        { error: 'Termo de busca é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar no CrossRef API
    const searchUrl = `https://api.crossref.org/works?query=${encodeURIComponent(searchTerm)}&rows=${maxResults}&sort=relevance&order=desc`;
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Sistema-Conteudo-Redes-Sociais/1.0 (mailto:contato@exemplo.com)'
      }
    });

    if (!response.ok) {
      throw new Error(`CrossRef API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.message || !data.message.items) {
      return NextResponse.json({ results: [] });
    }

    // Processar e formatar resultados
    const results = data.message.items.map(item => {
      // Extrair autores
      let authors = 'Não informado';
      if (item.author && item.author.length > 0) {
        authors = item.author
          .slice(0, 3) // Primeiros 3 autores
          .map(author => {
            const given = author.given || '';
            const family = author.family || '';
            return `${family}, ${given}`.trim();
          })
          .filter(name => name !== ',')
          .join('; ');
        if (item.author.length > 3) {
          authors += ' et al.';
        }
      }

      // Extrair revista
      let journal = 'Revista não informada';
      if (item['container-title'] && item['container-title'].length > 0) {
        journal = item['container-title'][0];
      }

      // Extrair ano
      let year = 'Ano não informado';
      if (item.published && item.published['date-parts'] && item.published['date-parts'][0]) {
        year = item.published['date-parts'][0][0].toString();
      } else if (item['published-online'] && item['published-online']['date-parts'] && item['published-online']['date-parts'][0]) {
        year = item['published-online']['date-parts'][0][0].toString();
      }

      // Criar snippet do abstract ou título
      let snippet = item.title ? item.title[0] : 'Título não disponível';
      if (item.abstract) {
        snippet = item.abstract.length > 300 
          ? item.abstract.substring(0, 300) + '...'
          : item.abstract;
      }

      // URL do artigo
      let url = item.URL || `https://doi.org/${item.DOI}`;

      return {
        id: item.DOI,
        title: item.title ? item.title[0] : 'Título não disponível',
        authors: authors,
        journal: journal,
        year: year,
        snippet: snippet,
        url: url,
        source: 'CrossRef',
        type: 'scientific',
        doi: item.DOI,
        citations: item['is-referenced-by-count'] || 0,
        type_article: item.type || 'journal-article'
      };
    });

    return NextResponse.json({ 
      results: results,
      total: data.message['total-results'],
      source: 'CrossRef'
    });

  } catch (error) {
    console.error('Erro na busca CrossRef:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor ao buscar no CrossRef' },
      { status: 500 }
    );
  }
}

