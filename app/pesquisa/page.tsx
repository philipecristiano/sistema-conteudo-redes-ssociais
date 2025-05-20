export default function PesquisaPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-8">Pesquisa de Fontes Confiáveis</h1>
      
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <form className="space-y-4">
          <div>
            <label htmlFor="tema" className="block text-sm font-medium mb-1">
              Tema da Pesquisa
            </label>
            <input
              type="text"
              id="tema"
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
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Pesquisar Fontes
          </button>
        </form>
      </div>
      
      <div className="w-full max-w-2xl mt-8">
        <h2 className="text-xl font-semibold mb-4">Resultados da Pesquisa</h2>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-medium">Exemplo de resultado de pesquisa</h3>
            <p className="text-sm text-gray-600">Fonte: exemplo.com.br</p>
            <p className="mt-2">
              Este é um exemplo de como os resultados da pesquisa aparecerão após você realizar uma busca.
              Os resultados reais incluirão informações relevantes sobre o tema pesquisado, com links para as fontes originais.
            </p>
            <div className="mt-2 flex justify-end">
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                Credibilidade Alta
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
