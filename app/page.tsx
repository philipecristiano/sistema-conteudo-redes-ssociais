'use client';

import { useState } from 'react';

export default function PesquisaPage() {
  const [tema, setTema] = useState('');
  const [nicho, setNicho] = useState('');
  const [plataforma, setPlataforma] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!tema) {
      setError('Por favor, informe um tema para pesquisar');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(tema)}&nicho=${encodeURIComponent(nicho)}&plataforma=${encodeURIComponent(plataforma)}`);
      
      if (!response.ok) {
        throw new Error('Erro ao realizar a pesquisa');
      }
      
      const data = await response.json();
      setResults(data.results || []);
    } catch (err) {
      setError('Ocorreu um erro ao realizar a pesquisa. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-8">Pesquisa de Fontes Confiáveis</h1>
      
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <form className="space-y-4" onSubmit={handleSearch}>
          <div>
            <label htmlFor="tema" className="block text-sm font-medium mb-1">
              Tema da Pesquisa
            </label>
            <input
              type="text"
              id="tema"
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              placeholder="Ex: Benefícios do exercício físico"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label htmlFor="nicho" className="block text-sm font-medium mb-1">
              Nicho
            </label>
            <select
              id="nicho"
              value={nicho}
              onChange={(e) => setNicho(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Selecione um nicho</option>
              <option value="saude">Saúde e Bem-estar</option>
              <option value="financas">Finanças Pessoais</option>
              <option value="tecnologia">Tecnologia</option>
              <option value="educacao">Educação</option>
              <option value="entretenimento">Entretenimento</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="plataforma" className="block text-sm font-medium mb-1">
              Plataforma
            </label>
            <select
              id="plataforma"
              value={plataforma}
              onChange={(e) => setPlataforma(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Selecione uma plataforma</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="tiktok">TikTok</option>
              <option value="linkedin">LinkedIn</option>
              <option value="youtube">YouTube</option>
            </select>
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            disabled={isLoading}
          >
            {isLoading ? 'Pesquisando...' : 'Pesquisar Fontes'}
          </button>
          
          {error && (
            <div className="p-2 text-red-600 bg-red-50 rounded-md">
              {error}
            </div>
          )}
        </form>
      </div>
      
      <div className="w-full max-w-2xl mt-8">
        <h2 className="text-xl font-semibold mb-4">Resultados da Pesquisa</h2>
        
        {results.length === 0 && !isLoading ? (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-gray-500">
              Realize uma pesquisa para ver os resultados de fontes confiáveis.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-medium">
                  <a href={result.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {result.title}
                  </a>
                </h3>
                <p className="text-sm text-gray-600">Fonte: {result.source}</p>
                <p className="mt-2">{result.snippet}</p>
                <div className="mt-2 flex justify-end">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    result.credibility === 'Alta' 
                      ? 'bg-green-100 text-green-800' 
                      : result.credibility === 'Média'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    Credibilidade: {result.credibility}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
