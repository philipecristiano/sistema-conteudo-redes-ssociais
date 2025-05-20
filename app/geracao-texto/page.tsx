export default function GeracaoTextoPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-8">Geração de Texto com IA</h1>
      
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <form className="space-y-4">
          <div>
            <label htmlFor="tema" className="block text-sm font-medium mb-1">
              Tema do Conteúdo
            </label>
            <input
              type="text"
              id="tema"
              placeholder="Ex: Dicas de alimentação saudável"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label htmlFor="formato" className="block text-sm font-medium mb-1">
              Formato do Conteúdo
            </label>
            <select
              id="formato"
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Selecione um formato</option>
              <option value="post">Post para Feed</option>
              <option value="carrossel">Carrossel</option>
              <option value="reels">Roteiro para Reels</option>
              <option value="stories">Stories</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="tom" className="block text-sm font-medium mb-1">
              Tom da Comunicação
            </label>
            <select
              id="tom"
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Selecione um tom</option>
              <option value="informal">Informal e Amigável</option>
              <option value="profissional">Profissional</option>
              <option value="educativo">Educativo</option>
              <option value="humoristico">Humorístico</option>
              <option value="inspirador">Inspirador</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="fontes" className="block text-sm font-medium mb-1">
              Fontes de Referência (opcional)
            </label>
            <textarea
              id="fontes"
              rows={3}
              placeholder="Cole aqui links ou informações de fontes confiáveis"
              className="w-full p-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Gerar Texto
          </button>
        </form>
      </div>
      
      <div className="w-full max-w-2xl mt-8">
        <h2 className="text-xl font-semibold mb-4">Texto Gerado</h2>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Exemplo de Texto Gerado</h3>
            <button className="text-sm text-blue-600 hover:underline">Copiar</button>
          </div>
          <div className="prose">
            <p>
              Este é um exemplo de como o texto gerado pela IA aparecerá após você preencher o formulário.
              O texto real será baseado no tema, formato e tom selecionados, além das fontes de referência fornecidas.
            </p>
            <p>
              A IA criará conteúdo otimizado para o formato escolhido, seguindo as melhores práticas
              para engajamento nas redes sociais e mantendo o tom de comunicação solicitado.
            </p>
            <p>
              Você poderá editar o texto gerado conforme necessário antes de publicá-lo em suas redes sociais.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
