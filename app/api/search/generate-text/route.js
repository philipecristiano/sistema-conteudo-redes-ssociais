import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

    // Verificar se a chave do Gemini está configurada
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Chave de API do Gemini não configurada.' },
        { status: 500 }
      );
    }

    // Inicializar o Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Criar prompt personalizado baseado nos parâmetros
    const prompt = criarPrompt(tema, formato, tom);

    // Fazer chamada para a API do Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textoGerado = response.text();

    if (!textoGerado || textoGerado.trim() === '') {
      return NextResponse.json(
        { error: 'Não foi possível gerar o texto. Tente novamente.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      texto: textoGerado.trim(),
      parametros: { tema, formato, tom }
    });

  } catch (error) {
    console.error('Erro na API de geração de texto:', error);
    
    // Tratamento específico para erros do Gemini
    if (error.message?.includes('API_KEY_INVALID')) {
      return NextResponse.json(
        { error: 'Chave de API do Gemini inválida. Verifique sua configuração.' },
        { status: 401 }
      );
    }
    
    if (error.message?.includes('QUOTA_EXCEEDED')) {
      return NextResponse.json(
        { error: 'Limite de uso do Gemini excedido. Tente novamente mais tarde.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao gerar texto com IA. Verifique sua chave de API ou tente novamente mais tarde.' },
      { status: 500 }
    );
  }
}

function criarPrompt(tema, formato, tom) {
  const prompts = {
    'post de blog': `Escreva um post de blog sobre "${tema}" com tom ${tom}. 

Estrutura:
- Introdução cativante que desperte interesse
- Desenvolvimento com 3-4 pontos principais bem explicados
- Conclusão que incentive engajamento e ação
- Use parágrafos curtos e linguagem acessível
- Inclua exemplos práticos quando possível

Tom: ${tom}`,
    
    'legenda para instagram': `Crie uma legenda para Instagram sobre "${tema}" com tom ${tom}.

Requisitos:
- Texto engajador e autêntico (máximo 2200 caracteres)
- Hook inicial que prenda a atenção
- Call-to-action no final
- 8-12 hashtags relevantes e populares
- Emojis apropriados (mas sem exagerar)
- Quebras de linha para facilitar leitura
- Incentive comentários e interação

Tom: ${tom}`,
    
    'roteiro de vídeo curto': `Crie um roteiro para vídeo curto (30-60 segundos) sobre "${tema}" com tom ${tom}.

Estrutura:
- HOOK (0-3s): Frase impactante para prender atenção
- DESENVOLVIMENTO (3-45s): Conteúdo principal dividido em 3-4 pontos rápidos
- CTA (45-60s): Call-to-action claro e direto
- Indicações de cenas/transições
- Linguagem dinâmica e visual

Tom: ${tom}`,
    
    'email marketing': `Escreva um email marketing sobre "${tema}" com tom ${tom}.

Estrutura:
- Assunto: Atrativo e direto (máximo 50 caracteres)
- Abertura: Personalizada e amigável
- Corpo: Valor claro e benefícios específicos
- Call-to-action: Botão/link destacado
- Fechamento: Profissional mas caloroso
- PS: Informação adicional ou urgência

Tom: ${tom}`,
    
    'tweet': `Crie um tweet sobre "${tema}" com tom ${tom}.

Requisitos:
- Máximo 280 caracteres
- Mensagem clara e impactante
- 2-3 hashtags relevantes
- Incentive interação (RT, curtir, comentar)
- Use linguagem direta e envolvente
- Pode incluir emoji estratégico

Tom: ${tom}`
  };

  const promptBase = prompts[formato.toLowerCase()] || prompts['legenda para instagram'];
  
  return `${promptBase}

IMPORTANTE: Responda APENAS com o conteúdo solicitado, sem explicações adicionais ou comentários sobre o processo de criação.`;
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'API de geração de texto funcionando com Gemini.',
      status: 'online',
      model: 'gemini-pro'
    },
    { status: 200 }
  );
}

