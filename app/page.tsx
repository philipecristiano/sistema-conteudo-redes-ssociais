export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Sistema de Criação de Conteúdo para Redes Sociais
        </h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-4">Principais Funcionalidades:</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <a href="/pesquisa" className="text-blue-600 hover:underline">
                Pesquisa em fontes confiáveis
              </a>
            </li>
            <li>
              <a href="/geracao-texto" className="text-blue-600 hover:underline">
                Geração de texto com IA
              </a>
            </li>
            <li>
              <a href="/criacao-imagens" className="text-blue-600 hover:underline">
                Criação de imagens para posts
              </a>
            </li>
            <li>Integração com Instagram</li>
            <li>Agendamento de publicações</li>
          </ul>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-gray-500">
            Desenvolvido para ajudar a alavancar suas redes sociais com conteúdo de qualidade.
          </p>
        </div>
      </div>
    </main>
  );
}
