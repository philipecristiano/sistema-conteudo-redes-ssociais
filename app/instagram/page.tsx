'use client';

import { useState } from 'react';

export default function InstagramPage() {
  const [selectedContent, setSelectedContent] = useState('');
  const [summary, setSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Conteúdos de exemplo (em um sistema real, viriam de uma API)
  const availableContent = [
    {
      id: 1,
      title: "Benefícios da Atividade Física para Saúde Mental",
      content: `A prática regular de exercícios físicos traz benefícios extraordinários para a saúde mental. Estudos comprovam que a atividade física libera endorfinas, conhecidas como "hormônios da felicidade", que ajudam a reduzir o estresse e a ansiedade.

Além disso, o exercício melhora a qualidade do sono, aumenta a autoestima e proporciona uma sensação de conquista pessoal. Mesmo 30 minutos de caminhada diária podem fazer uma diferença significativa no seu bem-estar mental.

Outras vantagens incluem:
- Redução dos sintomas de depressão
- Melhora da concentração e memória
- Aumento da energia e disposição
- Fortalecimento da resiliência emocional

Comece devagar e seja consistente. Seu corpo e mente agradecerão!`
    },
    {
      id: 2,
      title: "Dicas de Alimentação Saudável",
      content: `Uma alimentação equilibrada é fundamental para manter a saúde e o bem-estar. Pequenas mudanças nos hábitos alimentares podem trazer grandes benefícios para sua qualidade de vida.

Priorize alimentos naturais e minimamente processados. Inclua frutas, verduras, legumes, grãos integrais e proteínas magras em suas refeições. Beba bastante água ao longo do dia e evite açúcares refinados e gorduras trans.

Dicas práticas:
- Faça 5-6 refeições menores por dia
- Mastigue bem os alimentos
- Prepare suas refeições com antecedência
- Leia os rótulos dos produtos
- Modere o consumo de sal

Lembre-se: não existem alimentos proibidos, mas sim escolhas mais saudáveis. O equilíbrio é a chave!`
    },
    {
      id: 3,
      title: "Meditação para Iniciantes",
      content: `A meditação é uma prática milenar que pode transformar sua vida, reduzindo o estresse e aumentando o foco e a clareza mental. Não é preciso ser um monge para meditar - qualquer pessoa pode começar hoje mesmo.

Para iniciantes, recomenda-se começar com apenas 5-10 minutos por dia. Encontre um local tranquilo, sente-se confortavelmente e foque na sua respiração. Quando a mente divagar (e ela vai!), gentilmente traga a atenção de volta para a respiração.

Benefícios da meditação:
- Redução do estresse e ansiedade
- Melhora da concentração
- Aumento da autoconsciência
- Melhor qualidade do sono
- Fortalecimento do sistema imunológico

Existem vários tipos de meditação: mindfulness, transcendental, caminhada meditativa. Experimente e encontre o que funciona melhor para você!`
    }
  ];

  const generateSummary = async () => {
    if (!selectedContent) return;

    setIsGenerating(true);
    try {
      const content = availableContent.find(item => item.id === parseInt(selectedContent));
      
      // Simular chamada para API de IA (Gemini)
      const response = await fetch('/api/search/generate-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tema: `Criar um resumo para Instagram do seguinte conteúdo: ${content.title}`,
          formato: 'legenda para Instagram',
          tom: 'engajador'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSummary(data.generatedText);
      } else {
        // Fallback: criar resumo manual se a API falhar
        const fallbackSummary = createFallbackSummary(content);
        setSummary(fallbackSummary);
      }
    } catch (error) {
      // Fallback: criar resumo manual se houver erro
      const content = availableContent.find(item => item.id === parseInt(selectedContent));
      const fallbackSummary = createFallbackSummary(content);
      setSummary(fallbackSummary);
    } finally {
      setIsGenerating(false);
    }
  };

  const createFallbackSummary = (content) => {
    const summaries = {
      1: `💪 Exercitar-se é cuidar da mente! 🧠✨

A atividade física não só fortalece o corpo, mas também libera endorfinas - os famosos "hormônios da felicidade"! 

🌟 Benefícios para sua saúde mental:
• Reduz estresse e ansiedade
• Melhora o sono e autoestima  
• Aumenta concentração e energia
• Fortalece a resiliência emocional

Que tal começar com 30min de caminhada hoje? Seu corpo e mente vão agradecer! 💚

#SaudeMental #AtividadeFisica #BemEstar #Endorfinas #VidaSaudavel #Exercicios #Mindfulness`,

      2: `🥗 Alimentação saudável = vida mais plena! ✨

Pequenas mudanças nos hábitos alimentares podem transformar sua qualidade de vida! 

🌱 Dicas que fazem a diferença:
• Priorize alimentos naturais
• 5-6 refeições menores por dia
• Beba bastante água 💧
• Leia os rótulos
• Equilibrio é a chave! ⚖️

Lembre-se: não existem alimentos proibidos, mas sim escolhas mais conscientes! 

#AlimentacaoSaudavel #VidaSaudavel #BemEstar #Nutricao #Equilibrio #SaudeIntegral`,

      3: `🧘‍♀️ Meditação: sua mente merece essa pausa! ✨

Apenas 5-10 minutos por dia podem transformar sua vida! A meditação é um presente que você dá para si mesmo 💝

🌟 Benefícios incríveis:
• Reduz estresse e ansiedade
• Melhora foco e concentração  
• Aumenta autoconsciência
• Fortalece o sistema imunológico
• Melhora a qualidade do sono 😴

Comece hoje: encontre um cantinho tranquilo, respire fundo e simplesmente SEJA. 

#Meditacao #Mindfulness #BemEstar #SaudeMental #Paz #Equilibrio #VidaPlena`
    };

    return summaries[content.id] || "Resumo não disponível.";
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Resumo para Instagram
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Transforme seu conteúdo em posts otimizados para Instagram com IA
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Seleção de Conteúdo */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm mr-3">1</span>
              Selecione o Conteúdo
            </h2>
            
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Conteúdo Disponível
              </label>
              <select
                value={selectedContent}
                onChange={(e) => setSelectedContent(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Selecione um conteúdo...</option>
                {availableContent.map((content) => (
                  <option key={content.id} value={content.id}>
                    {content.title}
                  </option>
                ))}
              </select>

              {selectedContent && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Preview do Conteúdo:</h3>
                  <p className="text-sm text-gray-600 line-clamp-4">
                    {availableContent.find(item => item.id === parseInt(selectedContent))?.content.substring(0, 200)}...
                  </p>
                </div>
              )}

              <button
                onClick={generateSummary}
                disabled={!selectedContent || isGenerating}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Gerando Resumo...
                  </span>
                ) : (
                  '✨ Gerar Resumo com IA'
                )}
              </button>
            </div>
          </div>

          {/* Resultado */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm mr-3">2</span>
              Resumo para Instagram
            </h2>

            {!summary ? (
              <div className="text-center py-12 text-gray-500">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z"></path>
                  </svg>
                </div>
                <p>Selecione um conteúdo e clique em "Gerar Resumo" para ver o resultado aqui!</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-purple-700">Pronto para Instagram!</span>
                    <span className="text-xs text-gray-500">{summary.length} caracteres</span>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                      {summary}
                    </pre>
                  </div>
                </div>

                <button
                  onClick={copyToClipboard}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                  }`}
                >
                  {copied ? (
                    <span className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Copiado!
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                      </svg>
                      📱 Copiar para Instagram
                    </span>
                  )}
                </button>

                <div className="text-xs text-gray-500 text-center">
                  Agora é só colar no seu Instagram! 🚀
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dicas */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-purple-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="text-2xl mr-2">💡</span>
            Dicas para Maximizar o Engajamento
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start space-x-2">
              <span className="text-purple-500">📸</span>
              <div>
                <p className="font-medium text-gray-700">Use imagens atrativas</p>
                <p className="text-gray-600">Combine o texto com visuais impactantes</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-pink-500">⏰</span>
              <div>
                <p className="font-medium text-gray-700">Poste no horário certo</p>
                <p className="text-gray-600">Entre 18h-21h tem mais engajamento</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-500">💬</span>
              <div>
                <p className="font-medium text-gray-700">Interaja com seguidores</p>
                <p className="text-gray-600">Responda comentários rapidamente</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
