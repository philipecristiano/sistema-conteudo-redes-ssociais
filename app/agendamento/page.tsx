export default function AgendamentoPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-8">Agendamento de Publicações</h1>
      
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Calendário Editorial</h2>
        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-7 bg-gray-100">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, i) => (
              <div key={i} className="p-2 text-center font-medium border-b">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {Array.from({ length: 35 }).map((_, i) => {
              const day = i % 31 + 1;
              const isCurrentMonth = day <= 31;
              return (
                <div 
                  key={i} 
                  className={`bg-white p-2 h-24 ${isCurrentMonth ? '' : 'text-gray-400'}`}
                >
                  <div className="font-medium">{isCurrentMonth ? day : day - 31}</div>
                  {isCurrentMonth && day === 15 && (
                    <div className="mt-1 p-1 text-xs bg-blue-100 text-blue-800 rounded">
                      Post: Dicas de saúde
                    </div>
                  )}
                  {isCurrentMonth && day === 22 && (
                    <div className="mt-1 p-1 text-xs bg-purple-100 text-purple-800 rounded">
                      Reels: Exercícios
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Agendar Nova Publicação</h2>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="conteudo" className="block text-sm font-medium mb-1">
                Selecione o conteúdo
              </label>
              <select
                id="conteudo"
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Selecione um conteúdo gerado</option>
                <option value="1">Dicas de alimentação saudável</option>
                <option value="2">Exercícios para fazer em casa</option>
                <option value="3">Meditação para iniciantes</option>
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
                <option value="linkedin">LinkedIn</option>
                <option value="twitter">Twitter</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="data" className="block text-sm font-medium mb-1">
                Data
              </label>
              <input
                type="date"
                id="data"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="hora" className="block text-sm font-medium mb-1">
                Hora
              </label>
              <input
                type="time"
                id="hora"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="notas" className="block text-sm font-medium mb-1">
              Notas adicionais
            </label>
            <textarea
              id="notas"
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Adicione notas ou lembretes sobre esta publicação..."
            ></textarea>
          </div>
          
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Agendar Publicação
          </button>
        </form>
      </div>
      
      <div className="w-full max-w-4xl mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Publicações Agendadas</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conteúdo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plataforma
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data e Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Dicas de alimentação saudável</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">Instagram</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">15/06/2025 às 10:00</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Agendado
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">Editar</button>
                  <button className="text-red-600 hover:text-red-900">Cancelar</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Exercícios para fazer em casa</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">Instagram</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">22/06/2025 às 18:30</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Agendado
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">Editar</button>
                  <button className="text-red-600 hover:text-red-900">Cancelar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
