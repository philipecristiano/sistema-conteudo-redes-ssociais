export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const nicho = searchParams.get('nicho') || '';
  
  if (!query) {
    return new Response(JSON.stringify({ error: 'Query parameter is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Adicione filtros baseados no nicho
  let fullQuery = query;
  if (nicho && nicho !== '') {
    fullQuery += ` ${nicho}`;
  }
  
  try {
    const response = await fetch(`https://google-search72.p.rapidapi.com/search?q=${encodeURIComponent(fullQuery )}&num=10`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || 'sua-chave-aqui',
        'X-RapidAPI-Host': 'google-search72.p.rapidapi.com'
      }
    });
    
    const data = await response.json();
    
    // Transformar os resultados para um formato mais amigável
    const results = data.results?.map(item => ({
      title: item.title,
      link: item.link,
      snippet: item.description,
      source: new URL(item.link).hostname,
      credibility: calculateCredibility(item.link)
    })) || [];
    
    return new Response(JSON.stringify({ results }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Função simples para calcular a credibilidade baseada no domínio
function calculateCredibility(url) {
  const domain = new URL(url).hostname;
  
  // Lista de domínios confiáveis
  const highCredibilityDomains = [
    'gov.br', 'edu.br', 'org.br', 
    'who.int', 'un.org', 'nasa.gov',
    'bbc.com', 'reuters.com', 'nytimes.com',
    'folha.uol.com.br', 'estadao.com.br', 'g1.globo.com'
  ];
  
  // Verificar se o domínio ou parte dele está na lista
  for (const credDomain of highCredibilityDomains) {
    if (domain.includes(credDomain)) {
      return 'Alta';
    }
  }
  
  // Verificar domínios de média credibilidade
  const mediumCredibilityDomains = [
    'com.br', 'medium.com', 'wikipedia.org'
  ];
  
  for (const credDomain of mediumCredibilityDomains) {
    if (domain.includes(credDomain)) {
      return 'Média';
    }
  }
  
  return 'A verificar';
}
