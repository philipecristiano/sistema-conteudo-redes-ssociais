'use client';

import { useState } from 'react';

export default function GeracaoTextoPage() {
  const [tema, setTema] = useState('');
  const [formato, setFormato] = useState('post de blog'); // Valor padrão
  const [tom, setTom] = useState('informativo'); // Valor padrão
  const [generatedText, setGeneratedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Log para ver o estado atual na renderização do componente
console.log('Renderizando GeracaoTextoPage. isLoading:', isLoading, 'generatedText.length:', generatedText.length, 'error:', error);
// ...
console.log('handleGenerateText iniciado.'); // Log 1: Início da função
// ...
console.log('handleGenerateText: isLoading definido para true.'); // Log 2: Após setar isLoading
// ...
console.log('handleGenerateText: Iniciando chamada fetch para /api/generate-text.'); // Log 3: Antes do fetch
// ...
console.log('handleGenerateText: Resposta do fetch recebida. Status:', response.status); // Log 4: Após o fetch
// ...
console.log('handleGenerateText: Texto gerado recebido e definido.'); // Log 5: Texto recebido
// ...
console.log('handleGenerateText: Bloco finally executado. isLoading definido para false.'); // Log 6: Final da função

  const handleGenerateText = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleGenerateText iniciado.'); // Log 1: Início da função
    
    setGeneratedText(''); // Limpa texto gerado anteriormente
    setError(''); // Limpa erros anteriores

    if (!tema) {
      setError('Por favor, informe um tema para gerar o texto.');
      console.log('handleGenerateText: Tema vazio. Definindo erro.'); // Log de erro
      return;
    }

    setIsLoading(true);
    console.log('handleGenerateText: isLoading definido para true.'); // Log 2: Após setar isLoading

    try {
      console.log('handleGenerateText: Iniciando chamada fetch para /api/generate-text.'); // Log 3: Antes do fetch
      const response = await fetch('/api/generate-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tema, formato, tom }),
      });
      console.log('handleGenerateText: Resposta do fetch recebida. Status:', response.status); // Log 4: Após o fetch
      
      if (!response.ok) {
        let errorMsg = 'Erro ao gerar texto com IA.';
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
        } catch (parseError) {
          // Ignora erro de parse, mantém a mensagem genérica
        }
        console.log('handleGenerateText: Resposta da API NÃO OK. Erro:', errorMsg); // Log de erro da API
        throw new Error(errorMsg);
      }

      const data = await response.json();
      setGeneratedText(data.generatedText);
      console.log('handleGenerateText: Texto gerado recebido e definido.'); // Log 5: Texto recebido
      
    } catch (err) {
      setError((err instanceof Error ? err.message : 'Ocorreu um erro inesperado.'));
      console.error("handleGenerateText: Erro na requisição ou processamento:", err); // Log de erro geral
    } finally {
      setIsLoading(false);
      console.log('handleGenerateText: Bloco finally executado. isLoading definido para false.'); // Log 6: Final da função
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-8">Geração de Texto com IA</h1>
      
      {/* Formulário de Geração de Texto */}
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md mb-8">
        <form className="space-y-4" onSubmit={handleGenerateText}>
          <div>
            <label htmlFor="tema" className="block text-sm font-medium mb-1">
              Tema do Conteúdo
            </label>
            <input
              type="text"
              id="tema"
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              placeholder="Ex: Benefícios da meditação para a saúde mental"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label htmlFor="formato" className="block text-sm font-medium mb-1">
              Formato
            </label>
            <select
              id="formato"
              value={formato}
              onChange={(e) => setFormato(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="post de blog">Post de Blog</option>
              <option value="legenda para Instagram">Legenda para Instagram</option>
              <option value="roteiro de vídeo curto">Roteiro de Vídeo Curto</option>
              <option value="email marketing">Email Marketing</option>
              <option value="tweet">Tweet</option>
            </select>
          </div>

          <div>
            <label htmlFor="tom" className="block text-sm font-medium mb-1">
              Tom de Comunicação
            </label>
            <select
              id="tom"
              value={tom}
              onChange={(e) => setTom(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="informativo">Informativo</option>
              <option value="engajador">Engajador</option>
              <option value="divertido">Divertido</option>
              <option value="formal">Formal</option>
              <option value="inspirador">Inspirador</option>
            </select>
          </div>
          
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Gerando...' : 'Gerar Texto'} 
          </button>
          
          {/* Mostra a mensagem de erro, se houver */}
          {error && (
            <div className="mt-4 p-3 text-red-700 bg-red-100 border border-red-300 rounded-md">
              {error}
            </div>
          )}
        </form>
      </div>
      
      {/* Área de Resultados da Geração de Texto */}
      <div className="w-full max-w-2xl mt-8">
        <h2 className="text-xl font-semibold mb-4">Texto Gerado</h2>
        
        {!isLoading && !generatedText && !error && (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-gray-500">
              Preencha o formulário acima e clique em "Gerar Texto" para criar seu conteúdo.
            </p>
          </div>
        )}
        {isLoading && (
           <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <p className="text-blue-600">Gerando conteúdo...</p>
          </div>
        )}
        
        {generatedText && (
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 whitespace-pre-wrap">
            {generatedText}
          </div>
        )}
      </div>
    </main>
  );
}
