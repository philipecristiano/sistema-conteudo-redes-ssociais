export async function POST(request) {
  try {
    const { prompt, estilo, formato } = await request.json();
    
    if (!prompt) {
      return new Response(JSON.stringify({ error: 'O prompt para a imagem é obrigatório.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const huggingfaceApiKey = process.env.HUGGINGFACE_API_KEY;
    
    if (!huggingfaceApiKey) {
      console.error("Erro: Chave de API do Hugging Face não configurada.");
      return new Response(JSON.stringify({ error: 'Chave de API do Hugging Face não configurada.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Construir o prompt melhorado com estilo e formato
    let enhancedPrompt = prompt;
    
    if (estilo && estilo !== 'Padrão') {
      if (estilo === 'Realista') {
        enhancedPrompt += ', photorealistic, high quality, detailed';
      } else if (estilo === 'Cartoon') {
        enhancedPrompt += ', cartoon style, animated, colorful';
      } else if (estilo === 'Minimalista') {
        enhancedPrompt += ', minimalist style, clean, simple';
      } else {
        enhancedPrompt += `, ${estilo} style`;
      }
    }
    
    if (formato && formato !== 'Quadrado') {
      if (formato === 'Retrato') {
        enhancedPrompt += ', portrait orientation, vertical';
      } else if (formato === 'Paisagem') {
        enhancedPrompt += ', landscape orientation, horizontal';
      }
    }

    // Adicionar qualificadores para melhor qualidade
    enhancedPrompt += ', high quality, 8k, detailed';

    console.log('Prompt enviado para Hugging Face:', enhancedPrompt);

    // Usar a API do Hugging Face com Stable Diffusion
    const huggingfaceUrl = 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1';
    
    try {
      const response = await fetch(huggingfaceUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${huggingfaceApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: enhancedPrompt,
          parameters: {
            num_inference_steps: 20,
            guidance_scale: 7.5,
            width: 512,
            height: 512
          }
        } )
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro da API Hugging Face:', response.status, errorText);
        
        // Se o modelo está carregando, tentar novamente
        if (response.status === 503) {
          throw new Error('Modelo está carregando, tente novamente em alguns segundos');
        }
        
        throw new Error(`Erro da API: ${response.status}`);
      }

      // A resposta do Hugging Face é uma imagem em bytes
      const imageBuffer = await response.arrayBuffer();
      
      // Converter para base64
      const base64Image = `data:image/jpeg;base64,${Buffer.from(imageBuffer).toString('base64')}`;
      
      console.log('Imagem gerada com sucesso via Hugging Face');
      
      return new Response(JSON.stringify({ 
        imageUrl: base64Image,
        message: 'Imagem gerada com sucesso via IA!'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
      
    } catch (huggingfaceError) {
      console.error('Erro ao gerar imagem via Hugging Face:', huggingfaceError);
      
      // Fallback: retornar uma imagem SVG como backup
      const fallbackSvg = createFallbackSVG(prompt, estilo, formato);
      const base64Image = `data:image/svg+xml;base64,${Buffer.from(fallbackSvg).toString('base64')}`;
      
      return new Response(JSON.stringify({ 
        imageUrl: base64Image,
        message: `Imagem gerada com fallback. Erro: ${huggingfaceError.message}`
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('Erro geral ao gerar imagem:', error);
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
      <text x="256" y="200" font-family="Arial, sans-serif" font-size="18" font-weight="bold" 
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
        Fallback - Tente novamente
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
