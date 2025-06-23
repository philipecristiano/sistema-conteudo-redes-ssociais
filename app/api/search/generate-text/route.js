import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request) {
  console.log("Requisição recebida para /api/generate-text!"); // ADICIONE ESTA LINHA

  const { tema, formato, tom } = await request.json();

  if (!tema) {
    return new Response(JSON.stringify({ error: 'O tema é obrigatório para a geração de texto.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("Erro: Chave de API do Gemini não configurada."); // ADICIONE ESTA LINHA
    return new Response(JSON.stringify({ error: 'Chave de API do Gemini não configurada.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  // Construção do prompt para a IA
  const prompt = `Crie um conteúdo para redes sociais com o tema "${tema}".
  O formato desejado é "${formato}".
  O tom de comunicação deve ser "${tom}".
  Seja criativo e direto. Inclua emojis relevantes.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("Texto gerado com sucesso!"); // ADICIONE ESTA LINHA

    return new Response(JSON.stringify({ generatedText: text }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Erro ao chamar a API do Gemini:", error); // ADICIONE ESTA LINHA
    return new Response(JSON.stringify({ error: 'Erro ao gerar texto com IA. Verifique sua chave de API ou tente novamente mais tarde.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
