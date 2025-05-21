export default function CriacaoImagensPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-8">Criação de Imagens para Posts</h1>
      
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <form className="space-y-4">
          <div>
            <label htmlFor="descricao" className="block text-sm font-medium mb-1">
              Descrição da Imagem
            </label>
            <textarea
              id="descricao"
              rows={4}
              placeholder="Ex: Uma pessoa praticando yoga ao pôr do sol na praia, com cores vibrantes e atmosfera tranquila"
              className="w-full p-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>
          
          <div>
            <label htmlFor="estilo" className="block text-sm font-medium mb-1">
              Estilo da Imagem
            </label>
            <select
              id="estilo"
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Selecione um estilo</option>
              <option value="fotografico">Fotográfico</option>
              <option value="ilustracao">Ilustração</option>
              <option value="minimalista">Minimalista</option>
              <option value="3d">3D Render</option>
              <option value="cartoon">Cartoon</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="formato" className="block text-sm font-medium mb-1">
              Formato para Rede Social
            </label>
            <select
              id="formato"
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Selecione um formato</option>
              <option value="instagram-feed">Instagram Feed (1:1)</option>
              <option value="instagram-story">Instagram Story (9:16)</option>
              <option value="facebook">Facebook (16:9)</option>
              <option value="linkedin">LinkedIn (1.91:1)</option>
              <option value="twitter">Twitter (16:9)</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="cores" className="block text-sm font-medium mb-1">
              Paleta de Cores (opcional)
            </label>
            <input
              type="text"
              id="cores"
              placeholder="Ex: azul, verde água, branco"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Gerar Imagem
          </button>
        </form>
      </div>
      
      <div className="w-full max-w-2xl mt-8">
        <h2 className="text-xl font-semibold mb-4">Imagem Gerada</h2>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Exemplo de Imagem</h3>
            <button className="text-sm text-blue-600 hover:underline">Download</button>
          </div>
          <div className="aspect-square bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500 text-center p-4">
              A imagem gerada aparecerá aqui após o processamento.<br />
              Você poderá baixá-la e usá-la diretamente em suas redes sociais.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
