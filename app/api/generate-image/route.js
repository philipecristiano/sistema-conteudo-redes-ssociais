import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request) {
  try {
    const { prompt } = await request.json();

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

    const genAI = new GoogleGenerativeAI(apiKey);
    // Para geração de imagem, usamos um modelo diferente, como o `gemini-pro-vision` ou `dall-e-3` se disponível e configurado
    // No momento, a API do Gemini Pro Vision é mais para análise de imagem. Para geração, usaremos um placeholder ou uma API dedicada.
    // Para fins de demonstração e teste, vamos simular uma resposta.
    
    // ATENÇÃO: A API do Google Gemini Pro (que você está usando) não gera imagens diretamente.
    // Para geração de imagem, precisaríamos de uma API como DALL-E, Stable Diffusion, ou uma futura API de geração de imagem do Google.
    // Por enquanto, vamos retornar uma URL de imagem de placeholder para que o frontend possa exibir algo.
    
    // Em um cenário real, você integraria aqui uma API de geração de imagem como:
    // const model = genAI.getGenerativeModel({ model: "dall-e-3" }); // Exemplo hipotético
    // const result = await model.generateImage(prompt);

    const placeholderImageUrl = `https://via.placeholder.com/500x300?text=${encodeURIComponent(prompt )}`;

    return new Response(JSON.stringify({ imageUrl: placeholderImageUrl }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Erro na API de geração de imagem:", error);
    return new Response(JSON.stringify({ error: 'Erro ao gerar imagem com IA. Tente novamente mais tarde.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
