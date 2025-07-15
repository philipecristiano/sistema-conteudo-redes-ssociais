'use client';

import { useState } from 'react';

export default function GeracaoTextoPage() {
  const [tema, setTema] = useState('');
  const [formato, setFormato] = useState('post de blog');
  const [tom, setTom] = useState('informativo');
  const [generatedText, setGeneratedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerateText = async () => {
    if (!tema.trim()) return;

    setIsLoading(true);
    setError('');
    setGeneratedText('');

    try {
      const response = await fetch('/api/search/generate-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tema,
          formato,
          tom,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedText(data.generatedText || 'Texto gerado com sucesso!');
      } else {
        setError('Erro ao gerar texto com IA. Tente novamente.');
      }
    } catch (error) {
      setError('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Geração de Texto com IA
            </span>
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Crie conteúdo envolvente e personalizado para suas redes sociais, blogs e campanhas. 
            Nossa IA adapta o tom e formato para cada necessidade.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm mr-3">1</span>
              Configure seu Conteúdo
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tema do Conteúdo
                </label>
                <input
                  type="text"
                  value={tema}
                  onChange={(e) => setTema(e.target.value)}
                  placeholder="Ex: Benefícios da meditação para a saúde mental..."
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Formato
                </label>
                <select
                  value={formato}
                  onChange={(e) => setFormato(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="post de blog">Post de Blog</option>
                  <option value="legenda para Instagram">Legenda para Instagram</option>
                  <option value="roteiro de vídeo curto">Roteiro de Vídeo Curto</option>
                  <option value="email marketing">Email Marketing</option>
                  <option value="tweet">Tweet</option>
                  <option value="post LinkedIn">Post LinkedIn</option>
                  <option value="descrição de produto">Descrição de Produto</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tom de Comunicação
                </label>
                <select
                  value={tom}
                  onChange={(e) => setTom(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="informativo">Informativo</option>
                  <option value="engajador">Engajador</option>
                  <option value="divertido">Divertido</option>
                  <option value="formal">Formal</option>
                  <option value="inspirador">Inspirador</option>
                  <option value="persuasivo">Persuasivo</option>
                  <option value="educativo">Educativo</option>
                </select>
              </div>

              <button
                onClick={handleGenerateText}
                disabled={isLoading || !tema.trim()}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-6 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Gerando Texto...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    ✨ Gerar Texto
                  </span>
                )}
              </button>
            </div>

            {/* Tips */}
            <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-2 flex items-center">
                <span className="text-lg mr-2">💡</span>
                Dicas para melhores resultados:
              </h3>
              <div className="space-y-1 text-sm text-purple-700">
                <div>• Seja específico no tema</div>
                <div>• Escolha o formato adequado ao seu objetivo</div>
                <div>• Ajuste o tom conforme sua audiência</div>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm mr-3">2</span>
              Texto Gerado
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-red-700">{error}</span>
                </div>
              </div>
            )}

            {!generatedText && !error && (
              <div className="text-center py-16 text-gray-500">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </div>
                <p>Preencha o formulário ao lado e clique em "Gerar Texto" para criar seu conteúdo!</p>
              </div>
            )}

            {generatedText && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-purple-700">Seu conteúdo está pronto!</span>
                    <span className="text-xs text-gray-500">{generatedText.length} caracteres</span>
                  </div>
                  <div className="bg-white p-4 rounded-lg border max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-gray-700 font-sans leading-relaxed">
                      {generatedText}
                    </pre>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={copyToClipboard}
                    className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
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
                        📋 Copiar Texto
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setGeneratedText('');
                      setTema('');
                    }}
                    className="bg-gray-500 text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-600 transition-all duration-200 transform hover:scale-105"
                  >
                    🔄 Novo Texto
                  </button>
                </div>

                <div className="text-xs text-gray-500 text-center">
                  Gostou do resultado? Use em suas redes sociais! 🚀
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Format Examples */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 border border-purple-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <span className="text-2xl mr-2">📝</span>
            Exemplos de Formatos
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-2">📱 Instagram</h4>
              <p className="text-purple-700">Posts otimizados com hashtags, emojis e call-to-action</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">📧 Email Marketing</h4>
              <p className="text-blue-700">Conteúdo persuasivo com estrutura de conversão</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">📄 Blog Post</h4>
              <p className="text-green-700">Artigos estruturados e informativos</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

