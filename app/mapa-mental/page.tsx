export default function MapaMental() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            🧠 Mapa Mental de Temas
          </h1>
          <p className="text-gray-600 text-lg">
            Organize e visualize seus temas de conteúdo de forma estratégica
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-purple-100">
            <div className="text-2xl font-bold text-purple-600">5</div>
            <div className="text-sm text-gray-600">Temas Criados</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-pink-100">
            <div className="text-2xl font-bold text-pink-600">12</div>
            <div className="text-sm text-gray-600">Conexões</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-indigo-100">
            <div className="text-2xl font-bold text-indigo-600">3</div>
            <div className="text-sm text-gray-600">Categorias Ativas</div>
          </div>
        </div>

        {/* Controles */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4">
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium">
                ➕ Adicionar Tema
              </button>
              <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium">
                📸 Exportar Imagem
              </button>
            </div>
            <div className="text-sm text-gray-500">
              💡 Versão simplificada - funcionando!
            </div>
          </div>
        </div>

        {/* Área do Mapa Mental */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
          <div className="text-center">
            <div className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-purple-700">Temas de Conteúdo</h3>
              <p className="text-purple-600">Nó Central</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {/* Temas de exemplo */}
              <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                <h4 className="font-semibold text-green-700">Saúde</h4>
                <p className="text-sm text-green-600">Alimentação, exercícios</p>
              </div>
              
              <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
                <h4 className="font-semibold text-blue-700">Tecnologia</h4>
                <p className="text-sm text-blue-600">IA, apps, gadgets</p>
              </div>
              
              <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4">
                <h4 className="font-semibold text-purple-700">Lifestyle</h4>
                <p className="text-sm text-purple-600">Viagens, hobbies</p>
              </div>
              
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-700">Negócios</h4>
                <p className="text-sm text-yellow-600">Empreendedorismo</p>
              </div>
              
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                <h4 className="font-semibold text-red-700">Educação</h4>
                <p className="text-sm text-red-600">Cursos, livros</p>
              </div>
              
              <div className="bg-pink-50 border-2 border-pink-300 rounded-lg p-4">
                <h4 className="font-semibold text-pink-700">Entretenimento</h4>
                <p className="text-sm text-pink-600">Filmes, música</p>
              </div>
            </div>
          </div>
        </div>

        {/* Legenda */}
        <div className="mt-6 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">📋 Status</h3>
          <div className="text-sm text-gray-600">
            ✅ Versão simplificada funcionando  

            🎯 Depois podemos adicionar funcionalidades interativas  

            🚀 Sistema otimizado e estável
          </div>
        </div>
      </div>
    </div>
  );
}
