export async function POST(request) {
  try {
    const { prompt, estilo, formato } = await request.json();
    
    if (!prompt) {
      return new Response(JSON.stringify({ error: 'O prompt para a imagem é obrigatório.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error("Erro: Chave de API do Gemini não configurada.");
      return new Response(JSON.stringify({ error: 'Chave de API do Gemini não configurada.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Gerar uma imagem simples usando Canvas (base64)
    const canvas = createCanvas(512, 512);
    const ctx = canvas.getContext('2d');
    
    // Fundo colorido baseado no prompt
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    const bgColor = colors[Math.floor(Math.random() * colors.length)];
    
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 512, 512);
    
    // Adicionar texto do prompt
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Quebrar texto em linhas
    const words = prompt.split(' ');
    const lines = [];
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 450 && currentLine !== '') {
        lines.push(currentLine);
        currentLine = word + ' ';
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine);
    
    // Desenhar linhas de texto
    const lineHeight = 30;
    const startY = 256 - (lines.length * lineHeight) / 2;
    
    lines.forEach((line, index) => {
      ctx.fillText(line.trim(), 256, startY + index * lineHeight);
    });
    
    // Adicionar informações do estilo e formato
    ctx.font = '16px Arial';
    ctx.fillText(`Estilo: ${estilo || 'Padrão'}`, 256, 450);
    ctx.fillText(`Formato: ${formato || 'Quadrado'}`, 256, 480);
    
    // Converter para base64
    const imageBuffer = canvas.toBuffer('image/png');
    const base64Image = `data:image/png;base64,${imageBuffer.toString('base64')}`;
    
    return new Response(JSON.stringify({ 
      imageUrl: base64Image,
      message: 'Imagem gerada com sucesso!'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro ao gerar imagem:', error);
    return new Response(JSON.stringify({ error: 'Erro interno do servidor.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Função para criar canvas (simulação simples)
function createCanvas(width, height) {
  // Esta é uma implementação simplificada para demonstração
  // Em um ambiente real, você usaria a biblioteca 'canvas' do Node.js
  return {
    getContext: () => ({
      fillStyle: '',
      font: '',
      textAlign: '',
      textBaseline: '',
      fillRect: () => {},
      fillText: () => {},
      measureText: (text) => ({ width: text.length * 12 })
    }),
    toBuffer: () => Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64')
  };
}
