// API para busca real no Semantic Scholar
// Arquivo: app/api/search/semantic-scholar/route.js

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

    // Buscar no Semantic Scholar API
    const searchUrl = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(searchTerm)}&limit=${maxResults}&fields=paperId,title,abstract,authors,year,journal,citationCount,url,openAccessPdf`;
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Sistema-Conteudo-Redes-Sociais/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`Semantic Scholar API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return NextResponse.json({ results: [] });
    }

    // Processar e formatar resultados
    const results = data.data.map(paper => {
      // Extrair autores
      let authors = 'Não informado';
      if (paper.authors && paper.authors.length > 0) {
        authors = paper.authors
          .slice(0, 3) // Primeiros 3 autores
          .map(author => author.name)
          .join('; ');
        if (paper.authors.length > 3) {
          authors += ' et al.';
        }
      }

      // Extrair revista
      let journal = 'Revista não informada';
      if (paper.journal && paper.journal.name) {
        journal = paper.journal.name;
      }

      // Ano
      const year = paper.year ? paper.year.toString() : 'Ano não informado';

      // Criar snippet do abstract ou título
      let snippet = paper.title || 'Título não disponível';
      if (paper.abstract) {
        snippet = paper.abstract.length > 300 
          ? paper.abstract.substring(0, 300) + '...'
          : paper.abstract;
      }

      // URL do artigo
      let url = paper.url || `https://www.semanticscholar.org/paper/${paper.paperId}`;

      // PDF gratuito se disponível
      let pdfUrl = null;
      if (paper.openAccessPdf && paper.openAccessPdf.url) {
        pdfUrl = paper.openAccessPdf.url;
      }

      return {
        id: paper.paperId,
        title: paper.title || 'Título não disponível',
        authors: authors,
        journal: journal,
        year: year,
        snippet: snippet,
        url: url,
        source: 'Semantic Scholar',
        type: 'scientific',
        paper_id: paper.paperId,
        citations: paper.citationCount || 0,
        pdf_url: pdfUrl,
        has_pdf: !!pdfUrl
      };
    });

    return NextResponse.json({ 
      results: results,
      total: data.total || results.length,
      source: 'Semantic Scholar'
    });

  } catch (error) {
    console.error('Erro na busca Semantic Scholar:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor ao buscar no Semantic Scholar' },
      { status: 500 }
    );
  }
}

