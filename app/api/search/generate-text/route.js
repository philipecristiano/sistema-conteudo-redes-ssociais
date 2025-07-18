import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { tema, formato, tom } = await request.json();

    // Verificar se os parâmetros necessários foram fornecidos
    if (!tema || !formato || !tom) {
      return NextResponse.json(
        { error: 'Parâmetros obrigatórios: tema, formato, tom' },
        { status: 400 }
      );
    }

    // Verificar se a chave da OpenAI está configurada
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Chave de API da OpenAI não configurada.' },
        { status: 500 }
      );
    }

    // Criar prompt personalizado baseado nos parâmetros
    const prompt = criarPrompt(tema, formato, tom);

    // Fazer chamada para a API da OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em criação de conteúdo para redes sociais. Crie conteúdos engajadores, autênticos e otimizados para cada plataforma.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro da OpenAI:', errorData);
      return NextResponse.json(
        { error: 'Erro ao gerar texto com IA. Verifique sua chave de API ou tente novamente mais tarde.' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const textoGerado = data.choices[0]?.message?.content?.trim();

    if (!textoGerado) {
      return NextResponse.json(
        { error: 'Não foi possível gerar o texto. Tente novamente.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      texto: textoGerado,
      parametros: { tema, formato, tom }
    });

  } catch (error) {
    console.error('Erro na API de geração de texto:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor. Tente novamente mais tarde.' },
      { status: 500 }
    );
  }
}

function criarPrompt(tema, formato, tom) {
  const prompts = {
    'post de blog': `Escreva um post de blog sobre "${tema}" com tom ${tom}. Inclua uma introdução cativante, desenvolvimento com pontos principais e uma conclusão que incentive engajamento.`,
    
    'legenda para instagram': `Crie uma legenda para Instagram sobre "${tema}" com tom ${tom}. Inclua:
- Texto engajador e autêntico
- Call-to-action no final
- Hashtags relevantes (máximo 10)
- Emojis apropriados
- Máximo 2200 caracteres`,
    
    'roteiro de vídeo curto': `Crie um roteiro para vídeo curto (30-60 segundos) sobre "${tema}" com tom ${tom}. Inclua:
- Hook inicial (primeiros 3 segundos)
- Desenvolvimento rápido e dinâmico
- Call-to-action final
- Indicações de cenas/transições`,
    
    'email marketing': `Escreva um email marketing sobre "${tema}" com tom ${tom}. Inclua:
- Assunto atrativo
- Abertura personalizada
- Corpo do email com valor
- Call-to-action claro
- Fechamento profissional`,
    
    'tweet': `Crie um tweet sobre "${tema}" com tom ${tom}. Deve ser:
- Máximo 280 caracteres
- Engajador e direto
- Com hashtags relevantes
- Incentive interação (curtir, comentar, compartilhar)`
  };

  return prompts[formato.toLowerCase()] || prompts['legenda para instagram'];
}

export async function GET() {
  return NextResponse.json(
    { message: 'API de geração de texto funcionando. Use POST para gerar conteúdo.' },
    { status: 200 }
  );
}

