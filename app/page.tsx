export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Sistema de Conteúdo
              </span>
              <br />
              <span className="text-gray-800">para Redes Sociais</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Crie, pesquise e gerencie conteúdo para suas redes sociais com o poder da Inteligência Artificial. 
              Transforme ideias em posts engajadores em segundos!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/pesquisa-fontes"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                🔍 Começar Agora
              </a>
              <a
                href="/agendamento"
                className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold border-2 border-purple-200 hover:border-purple-400 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                📅 Ver Agendamentos
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Tudo que você precisa em um só lugar
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ferramentas poderosas para criadores de conteúdo, influenciadores e agências digitais
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Pesquisa de Fontes */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Pesquisa em fontes confiáveis</h3>
            <p className="text-gray-600 mb-6">
              Encontre informações verificadas e confiáveis para embasar seu conteúdo com credibilidade.
            </p>
            <a
              href="/pesquisa-fontes"
              className="inline-flex items-center text-purple-600 font-medium hover:text-purple-700 transition-colors"
            >
              Explorar fontes
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>

          {/* Geração de Texto */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-2xl">✍️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Geração de texto com IA</h3>
            <p className="text-gray-600 mb-6">
              Crie conteúdo envolvente para diferentes formatos: posts, blogs, emails e muito mais.
            </p>
            <a
              href="/geracao-texto"
              className="inline-flex items-center text-purple-600 font-medium hover:text-purple-700 transition-colors"
            >
              Gerar conteúdo
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>

          {/* Criação de Imagens */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-2xl">🎨</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Criação de imagens</h3>
            <p className="text-gray-600 mb-6">
              Gere imagens únicas e atrativas para acompanhar seus posts e aumentar o engajamento.
            </p>
            <a
              href="/criacao-imagens"
              className="inline-flex items-center text-purple-600 font-medium hover:text-purple-700 transition-colors"
            >
              Criar imagens
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>

          {/* Resumo Instagram */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Resumo para Instagram</h3>
            <p className="text-gray-600 mb-6">
              Transforme conteúdo longo em posts otimizados para Instagram com botão de copiar.
            </p>
            <a
              href="/instagram"
              className="inline-flex items-center text-purple-600 font-medium hover:text-purple-700 transition-colors"
            >
              Criar resumo
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>

          {/* Agendamento */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-2xl">📅</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Agendamento de publicações</h3>
            <p className="text-gray-600 mb-6">
              Organize e agende seus posts com calendário visual para manter consistência.
            </p>
            <a
              href="/agendamento"
              className="inline-flex items-center text-purple-600 font-medium hover:text-purple-700 transition-colors"
            >
              Agendar posts
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>

          {/* Analytics */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Analytics e insights</h3>
            <p className="text-gray-600 mb-6">
              Acompanhe o desempenho do seu conteúdo e otimize sua estratégia digital.
            </p>
            <span className="inline-flex items-center text-gray-400 font-medium">
              Em breve
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </span>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para revolucionar seu conteúdo?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Junte-se a milhares de criadores que já transformaram sua presença digital
          </p>
          <a
            href="/pesquisa-fontes"
            className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-lg inline-block"
          >
            🚀 Começar Gratuitamente
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-purple-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Sistema de Conteúdo
            </h3>
            <p className="text-gray-600 mb-6">
              Criando o futuro do marketing de conteúdo com Inteligência Artificial
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
              <span>© 2025 Sistema de Conteúdo</span>
              <span>•</span>
              <span>Feito com ❤️ e IA</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

