export async function POST(request) {
  try {
    const { prompt, estilo, formato } = await request.json();
    
    if (!prompt) {
      return new Response(JSON.stringify({ error: 'O prompt para a imagem é obrigatório.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Construir o prompt melhorado com estilo e formato
    let enhancedPrompt = prompt;
    
    if (estilo && estilo !== 'Padrão') {
      enhancedPrompt += `, ${estilo} style`;
    }
    
    if (formato && formato !== 'Quadrado') {
      if (formato === 'Retrato') {
        enhancedPrompt += ', portrait orientation';
      } else if (formato === 'Paisagem') {
        enhancedPrompt += ', landscape orientation';
      }
    }

    // Usar a API gratuita do Pollinations.ai para gerar imagem real
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt )}?width=512&height=512&seed=${Math.floor(Math.random() * 1000000)}`;
    
    // Verificar se a imagem foi gerada com sucesso
    try {
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        throw new Error('Falha ao gerar imagem');
      }
      
      return new Response(JSON.stringify({ 
        imageUrl: imageUrl,
        message: 'Imagem gerada com sucesso!'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
      
    } catch (imageError) {
      console.error('Erro ao gerar imagem via Pollinations:', imageError);
      
      // Fallback: retornar uma imagem SVG como backup
      const fallbackSvg = createFallbackSVG(prompt, estilo, formato);
      const base64Image = `data:image/svg+xml;base64,${Buffer.from(fallbackSvg).toString('base64')}`;
      
      return new Response(JSON.stringify({ 
        imageUrl: base64Image,
        message: 'Imagem gerada com sucesso! (modo fallback)'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('Erro ao gerar imagem:', error);
    return new Response(JSON.stringify({ error: 'Erro interno do servidor.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Função para criar SVG de fallback
function createFallbackSVG(prompt, estilo, formato) {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
  const bgColor = colors[Math.floor(Math.random() * colors.length)];
  const textColor = '#FFFFFF';
  
  const words = prompt.split(' ').slice(0, 6);
  const title = words.join(' ');
  
  return `
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${adjustColor(bgColor, -30 )};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" fill="url(#bg)" />
      <circle cx="256" cy="150" r="60" fill="${textColor}" opacity="0.1" />
      <circle cx="100" cy="400" r="40" fill="${textColor}" opacity="0.1" />
      <circle cx="400" cy="350" r="50" fill="${textColor}" opacity="0.1" />
      <text x="256" y="200" font-family="Arial, sans-serif" font-size="20" font-weight="bold" 
            text-anchor="middle" fill="${textColor}">
        ${title}
      </text>
      <text x="256" y="280" font-family="Arial, sans-serif" font-size="14" 
            text-anchor="middle" fill="${textColor}" opacity="0.8">
        Estilo: ${estilo || 'Padrão'}
      </text>
      <text x="256" y="310" font-family="Arial, sans-serif" font-size="14" 
            text-anchor="middle" fill="${textColor}" opacity="0.8">
        Formato: ${formato || 'Quadrado'}
      </text>
      <text x="256" y="450" font-family="Arial, sans-serif" font-size="12" 
            text-anchor="middle" fill="${textColor}" opacity="0.6">
        Imagem de Fallback
      </text>
    </svg>
  `;
}

// Função para ajustar cor
function adjustColor(color, amount) {
  const usePound = color[0] === '#';
  const col = usePound ? color.slice(1) : color;
  const num = parseInt(col, 16);
  let r = (num >> 16) + amount;
  let g = (num >> 8 & 0x00FF) + amount;
  let b = (num & 0x0000FF) + amount;
  r = r > 255 ? 255 : r < 0 ? 0 : r;
  g = g > 255 ? 255 : g < 0 ? 0 : g;
  b = b > 255 ? 255 : b < 0 ? 0 : b;
  return (usePound ? '#' : '') + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');
}
