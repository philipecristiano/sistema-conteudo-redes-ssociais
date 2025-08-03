// API para busca real no arXiv
// Arquivo: app/api/search/arxiv/route.js

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

    // Buscar no arXiv API
    const searchUrl = `http://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(searchTerm)}&start=0&max_results=${maxResults}&sortBy=relevance&sortOrder=descending`;
    
    const response = await fetch(searchUrl);

    if (!response.ok) {
      throw new Error(`arXiv API error: ${response.status}`);
    }

    const xmlText = await response.text();
    
    // Parse XML simples (em produção, usar uma biblioteca XML)
    const results = parseArXivXML(xmlText);

    return NextResponse.json({ 
      results: results,
      source: 'arXiv'
    });

  } catch (error) {
    console.error('Erro na busca arXiv:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor ao buscar no arXiv' },
      { status: 500 }
    );
  }
}

// Função para fazer parse básico do XML do arXiv
function parseArXivXML(xmlText) {
  const results = [];
  
  try {
    // Parse básico usando regex (em produção, usar DOMParser ou biblioteca XML)
    const entryRegex = /<entry>(.*?)<\/entry>/gs;
    const entries = xmlText.match(entryRegex) || [];

    for (const entry of entries) {
      // Extrair campos usando regex
      const titleMatch = entry.match(/<title>(.*?)<\/title>/s);
      const summaryMatch = entry.match(/<summary>(.*?)<\/summary>/s);
      const authorMatches = entry.match(/<author>.*?<name>(.*?)<\/name>.*?<\/author>/gs) || [];
      const publishedMatch = entry.match(/<published>(.*?)<\/published>/);
      const idMatch = entry.match(/<id>(.*?)<\/id>/);
      const categoryMatches = entry.match(/<category term="(.*?)".*?\/>/g) || [];

      if (titleMatch && summaryMatch && idMatch) {
        // Processar autores
        let authors = 'Não informado';
        if (authorMatches.length > 0) {
          const authorNames = authorMatches
            .map(match => {
              const nameMatch = match.match(/<name>(.*?)<\/name>/);
              return nameMatch ? nameMatch[1].trim() : '';
            })
            .filter(name => name)
            .slice(0, 3); // Primeiros 3 autores
          
          authors = authorNames.join('; ');
          if (authorMatches.length > 3) {
            authors += ' et al.';
          }
        }

        // Processar data
        let year = 'Ano não informado';
        if (publishedMatch) {
          const yearMatch = publishedMatch[1].match(/(\d{4})/);
          if (yearMatch) {
            year = yearMatch[1];
          }
        }

        // Processar categorias
        let categories = [];
        if (categoryMatches.length > 0) {
          categories = categoryMatches
            .map(match => {
              const termMatch = match.match(/term="(.*?)"/);
              return termMatch ? termMatch[1] : '';
            })
            .filter(cat => cat)
            .slice(0, 3);
        }

        // Extrair ID do arXiv
        const arxivId = idMatch[1].split('/').pop();

        // Limpar título e resumo
        const title = titleMatch[1].replace(/\s+/g, ' ').trim();
        const summary = summaryMatch[1].replace(/\s+/g, ' ').trim();
        const snippet = summary.length > 300 ? summary.substring(0, 300) + '...' : summary;

        results.push({
          id: arxivId,
          title: title,
          authors: authors,
          journal: 'arXiv Preprint',
          year: year,
          snippet: snippet,
          url: `https://arxiv.org/abs/${arxivId}`,
          source: 'arXiv',
          type: 'scientific',
          arxiv_id: arxivId,
          categories: categories,
          pdf_url: `https://arxiv.org/pdf/${arxivId}.pdf`
        });
      }
    }
  } catch (error) {
    console.error('Erro ao fazer parse do XML do arXiv:', error);
  }

  return results;
}

