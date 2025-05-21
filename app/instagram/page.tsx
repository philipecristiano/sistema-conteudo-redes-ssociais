export default function InstagramPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-8">Integração com Instagram</h1>
      
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-full mx-auto flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <div className="w-14 h-14 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <h2 className="text-xl font-semibold mb-4 text-center">Conecte sua conta do Instagram</h2>
        <p className="text-gray-600 mb-6 text-center">
          Conecte sua conta do Instagram para publicar e agendar conteúdo diretamente do sistema.
        </p>
        
        <div className="space-y-4">
          <button
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-md hover:from-purple-600 hover:to-pink-600"
          >
            Conectar com Instagram
          </button>
          
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-md font-medium mb-2">Status da conexão:</h3>
            <div className="flex items-center text-gray-600">
              <span className="inline-block w-3 h-3 bg-gray-300 rounded-full mr-2"></span>
              Não conectado
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Publicar no Instagram</h2>
        <p className="text-gray-600 mb-6">
          Após conectar sua conta, você poderá publicar conteúdo diretamente no Instagram.
        </p>
        
        <form className="space-y-4">
          <div>
            <label htmlFor="conteudo" className="block text-sm font-medium mb-1">
              Selecione o conteúdo
            </label>
            <select
              id="conteudo"
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled
            >
              <option value="">Selecione um conteúdo gerado</option>
              <option value="1">Dicas de alimentação saudável</option>
              <option value="2">Exercícios para fazer em casa</option>
              <option value="3">Meditação para iniciantes</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="tipo" className="block text-sm font-medium mb-1">
              Tipo de publicação
            </label>
            <select
              id="tipo"
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled
            >
              <option value="">Selecione o tipo</option>
              <option value="feed">Feed</option>
              <option value="reels">Reels</option>
              <option value="story">Story</option>
              <option value="carrossel">Carrossel</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="legenda" className="block text-sm font-medium mb-1">
              Legenda
            </label>
            <textarea
              id="legenda"
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Escreva a legenda para sua publicação..."
              disabled
            ></textarea>
          </div>
          
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 opacity-50 cursor-not-allowed"
              disabled
            >
              Publicar Agora
            </button>
            <button
              type="button"
              className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded-md hover:bg-blue-50 opacity-50 cursor-not-allowed"
              disabled
            >
              Agendar
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
