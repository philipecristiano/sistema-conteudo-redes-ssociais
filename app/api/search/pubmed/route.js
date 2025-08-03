// API para busca real no PubMed
// Arquivo: app/api/search/pubmed/route.js

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

    // Passo 1: Buscar IDs dos artigos no PubMed
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(searchTerm)}&retmax=${maxResults}&retmode=json&sort=relevance`;
    
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (!searchData.esearchresult || !searchData.esearchresult.idlist) {
      return NextResponse.json({ results: [] });
    }

    const ids = searchData.esearchresult.idlist;
    
    if (ids.length === 0) {
      return NextResponse.json({ results: [] });
    }

    // Passo 2: Buscar detalhes dos artigos
    const detailsUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.join(',')}&retmode=json`;
    
    const detailsResponse = await fetch(detailsUrl);
    const detailsData = await detailsResponse.json();

    // Passo 3: Processar e formatar resultados
    const results = [];
    
    for (const id of ids) {
      const article = detailsData.result[id];
      if (article && article.title) {
        // Extrair autores
        let authors = 'Não informado';
        if (article.authors && article.authors.length > 0) {
          authors = article.authors
            .slice(0, 3) // Primeiros 3 autores
            .map(author => author.name)
            .join('; ');
          if (article.authors.length > 3) {
            authors += ' et al.';
          }
        }

        // Extrair revista
        let journal = article.fulljournalname || article.source || 'Revista não informada';

        // Extrair ano
        let year = 'Ano não informado';
        if (article.pubdate) {
          const yearMatch = article.pubdate.match(/(\d{4})/);
          if (yearMatch) {
            year = yearMatch[1];
          }
        }

        // Criar snippet do abstract ou usar título
        let snippet = article.title;
        if (article.abstract) {
          snippet = article.abstract.length > 300 
            ? article.abstract.substring(0, 300) + '...'
            : article.abstract;
        }

        results.push({
          id: article.uid,
          title: article.title,
          authors: authors,
          journal: journal,
          year: year,
          snippet: snippet,
          url: `https://pubmed.ncbi.nlm.nih.gov/${article.uid}/`,
          source: 'PubMed',
          type: 'scientific',
          pmid: article.uid,
          doi: article.elocationid || null
        });
      }
    }

    return NextResponse.json({ 
      results: results,
      total: searchData.esearchresult.count,
      source: 'PubMed'
    });

  } catch (error) {
    console.error('Erro na busca PubMed:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor ao buscar no PubMed' },
      { status: 500 }
    );
  }
}

// Função auxiliar para limpar HTML tags
function stripHtml(html) {
  return html.replace(/<[^>]*>/g, '');
}

