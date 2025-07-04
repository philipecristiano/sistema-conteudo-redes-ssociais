'use client';

import { useState } from 'react';

export default function GeracaoImagemPage() {
  const [prompt, setPrompt] = useState('');
  const [estilo, setEstilo] = useState('realista'); // Valor padrão
  const [tamanho, setTamanho] = useState('quadrado'); // Valor padrão
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setGeneratedImageUrl(''); // Limpa imagem gerada anteriormente
    setError(''); // Limpa erros anteriores

    if (!prompt) {
      setError('Por favor, informe uma descrição para gerar a imagem.');
      return;
    }

    setIsLoading(true);

    try {
      // Construção do prompt completo com estilo e tamanho
      const fullPrompt = `${prompt}, estilo ${estilo}, formato ${tamanho}`;
      
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: fullPrompt }),
      });
      
      if (!response.ok) {
        let errorMsg = 'Erro ao gerar imagem com IA.';
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
        } catch (parseError) {
          // Ignora erro de parse, mantém a mensagem genérica
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      setGeneratedImageUrl(data.imageUrl);
      
    } catch (err) {
      setError((err instanceof Error ? err.message : 'Ocorreu um erro inesperado.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-8">Geração de Imagem com IA</h1>
      
      {/* Formulário de Geração de Imagem */}
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md mb-8">
        <form className="space-y-4" onSubmit={handleGenerateImage}>
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium mb-1">
              Descrição da Imagem
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Um gato laranja dormindo em uma poltrona azul, luz suave da manhã"
              className="w-full p-2 border border-gray-300 rounded-md h-24 resize-none"
              required
            />
          </div>
          
          <div>
            <label htmlFor="estilo" className="block text-sm font-medium mb-1">
              Estilo da Imagem
            </label>
            <select
              id="estilo"
              value={estilo}
              onChange={(e) => setEstilo(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="realista">Realista</option>
              <option value="cartoon">Cartoon</option>
              <option value="aquarela">Aquarela</option>
              <option value="digital art">Arte Digital</option>
              <option value="minimalista">Minimalista</option>
            </select>
          </div>

          <div>
            <label htmlFor="tamanho" className="block text-sm font-medium mb-1">
              Formato da Imagem
            </label>
            <select
              id="tamanho"
              value={tamanho}
              onChange={(e) => setTamanho(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="quadrado">Quadrado (1:1)</option>
              <option value="paisagem">Paisagem (16:9)</option>
              <option value="retrato">Retrato (9:16)</option>
              <option value="banner">Banner (3:1)</option>
            </select>
          </div>
          
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Gerando...' : 'Gerar Imagem'} 
          </button>
          
          {/* Mostra a mensagem de erro, se houver */}
          {error && (
            <div className="mt-4 p-3 text-red-700 bg-red-100 border border-red-300 rounded-md">
              {error}
            </div>
          )}
        </form>
      </div>
      
      {/* Área de Resultados da Geração de Imagem */}
      <div className="w-full max-w-2xl mt-8">
        <h2 className="text-xl font-semibold mb-4">Imagem Gerada</h2>
        
        {!isLoading && !generatedImageUrl && !error && (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-gray-500">
              Preencha o formulário acima e clique em "Gerar Imagem" para criar sua imagem.
            </p>
          </div>
        )}
        {isLoading && (
           <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <p className="text-blue-600">Gerando imagem...</p>
          </div>
        )}
        
        {generatedImageUrl && (
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <img 
              src={generatedImageUrl} 
              alt="Imagem gerada pela IA" 
              className="w-full h-auto rounded-md"
            />
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">Imagem gerada com sucesso!</p>
              <a 
                href={generatedImageUrl} 
                download="imagem-gerada.png"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
              >
                Baixar Imagem
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
