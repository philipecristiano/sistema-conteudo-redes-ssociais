'use client';

import { useState, useEffect, useRef } from 'react';

interface Node {
  id: string;
  text: string;
  x: number;
  y: number;
  category: string;
  isCenter: boolean;
  connections: string[];
}

interface Category {
  name: string;
  color: string;
  bgColor: string;
}

export default function MapaMental() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [categories] = useState<Category[]>([
    { name: 'Saúde', color: '#10B981', bgColor: '#D1FAE5' },
    { name: 'Tecnologia', color: '#3B82F6', bgColor: '#DBEAFE' },
    { name: 'Lifestyle', color: '#8B5CF6', bgColor: '#EDE9FE' },
    { name: 'Negócios', color: '#F59E0B', bgColor: '#FEF3C7' },
    { name: 'Educação', color: '#EF4444', bgColor: '#FEE2E2' },
    { name: 'Entretenimento', color: '#EC4899', bgColor: '#FCE7F3' }
  ]);
  
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [newNodeText, setNewNodeText] = useState('');
  const [newNodeCategory, setNewNodeCategory] = useState('Saúde');
  const [showAddForm, setShowAddForm] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Carregar dados salvos
  useEffect(() => {
    const savedNodes = localStorage.getItem('mapaMentalNodes');
    if (savedNodes) {
      setNodes(JSON.parse(savedNodes));
    } else {
      // Criar nó central inicial
      const centerNode: Node = {
        id: 'center',
        text: 'Meus Temas de Conteúdo',
        x: 400,
        y: 300,
        category: 'Lifestyle',
        isCenter: true,
        connections: []
      };
      setNodes([centerNode]);
    }
  }, []);

  // Salvar automaticamente
  useEffect(() => {
    if (nodes.length > 0) {
      localStorage.setItem('mapaMentalNodes', JSON.stringify(nodes));
    }
  }, [nodes]);

  // Desenhar canvas
  useEffect(() => {
    drawCanvas();
  }, [nodes, selectedNode]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar conexões
    nodes.forEach(node => {
      node.connections.forEach(connectionId => {
        const connectedNode = nodes.find(n => n.id === connectionId);
        if (connectedNode) {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(connectedNode.x, connectedNode.y);
          ctx.strokeStyle = '#E5E7EB';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });
    });

    // Desenhar nós
    nodes.forEach(node => {
      const category = categories.find(c => c.name === node.category);
      const isSelected = selectedNode === node.id;
      
      // Sombra
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      // Círculo do nó
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.isCenter ? 60 : 40, 0, 2 * Math.PI);
      ctx.fillStyle = category?.bgColor || '#F3F4F6';
      ctx.fill();
      
      // Borda
      ctx.strokeStyle = isSelected ? '#8B5CF6' : (category?.color || '#6B7280');
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.stroke();

      // Reset shadow
      ctx.shadowColor = 'transparent';

      // Texto
      ctx.fillStyle = category?.color || '#374151';
      ctx.font = node.isCenter ? 'bold 14px Arial' : '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Quebrar texto em múltiplas linhas se necessário
      const words = node.text.split(' ');
      const maxWidth = node.isCenter ? 100 : 70;
      let lines: string[] = [];
      let currentLine = '';

      words.forEach(word => {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });
      lines.push(currentLine);

      // Desenhar linhas de texto
      const lineHeight = node.isCenter ? 16 : 14;
      const startY = node.y - ((lines.length - 1) * lineHeight) / 2;
      
      lines.forEach((line, index) => {
        ctx.fillText(line, node.x, startY + (index * lineHeight));
      });
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Verificar se clicou em algum nó
    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      return distance <= (node.isCenter ? 60 : 40);
    });

    if (clickedNode) {
      setSelectedNode(clickedNode.id);
    } else {
      setSelectedNode(null);
      // Mostrar formulário para adicionar novo nó
      setMousePos({ x, y });
      setShowAddForm(true);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      return distance <= (node.isCenter ? 60 : 40);
    });

    if (clickedNode && !clickedNode.isCenter) {
      setDraggedNode(clickedNode.id);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggedNode) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setNodes(prev => prev.map(node => 
      node.id === draggedNode ? { ...node, x, y } : node
    ));
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
  };

  const addNode = () => {
    if (!newNodeText.trim()) return;

    const newNode: Node = {
      id: Date.now().toString(),
      text: newNodeText,
      x: mousePos.x,
      y: mousePos.y,
      category: newNodeCategory,
      isCenter: false,
      connections: ['center'] // Conectar ao nó central por padrão
    };

    // Adicionar conexão do nó central para o novo nó
    setNodes(prev => [
      ...prev,
      newNode
    ].map(node => 
      node.id === 'center' 
        ? { ...node, connections: [...node.connections, newNode.id] }
        : node
    ));

    setNewNodeText('');
    setShowAddForm(false);
  };

  const deleteSelectedNode = () => {
    if (!selectedNode || selectedNode === 'center') return;

    setNodes(prev => prev
      .filter(node => node.id !== selectedNode)
      .map(node => ({
        ...node,
        connections: node.connections.filter(id => id !== selectedNode)
      }))
    );
    setSelectedNode(null);
  };

  const exportAsImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'mapa-mental-temas.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const clearMap = () => {
    if (confirm('Tem certeza que deseja limpar todo o mapa mental?')) {
      const centerNode: Node = {
        id: 'center',
        text: 'Meus Temas de Conteúdo',
        x: 400,
        y: 300,
        category: 'Lifestyle',
        isCenter: true,
        connections: []
      };
      setNodes([centerNode]);
      setSelectedNode(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            🧠 Mapa Mental de Temas
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Organize visualmente seus temas de conteúdo, crie conexões entre ideias e planeje sua estratégia de publicações de forma intuitiva.
          </p>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-2xl shadow-xl p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium text-gray-700">Categorias:</div>
              <div className="flex gap-2">
                {categories.map(category => (
                  <div key={category.name} className="flex items-center gap-1">
                    <div 
                      className="w-4 h-4 rounded-full border-2"
                      style={{ backgroundColor: category.bgColor, borderColor: category.color }}
                    ></div>
                    <span className="text-xs text-gray-600">{category.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={exportAsImage}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                📸 Exportar Imagem
              </button>
              <button
                onClick={clearMap}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                🗑️ Limpar Tudo
              </button>
              {selectedNode && selectedNode !== 'center' && (
                <button
                  onClick={deleteSelectedNode}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                  ❌ Deletar Selecionado
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className="border border-gray-200 rounded-xl cursor-pointer w-full"
              onClick={handleCanvasClick}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
            
            {/* Instruções */}
            <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 text-sm text-gray-600">
              <div className="font-semibold mb-2">💡 Como usar:</div>
              <div>• Clique em área vazia para adicionar tema</div>
              <div>• Arraste nós para reorganizar</div>
              <div>• Clique em nó para selecionar</div>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">📊</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{nodes.length - 1}</div>
                <div className="text-gray-600">Temas Criados</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">🔗</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {nodes.reduce((acc, node) => acc + node.connections.length, 0)}
                </div>
                <div className="text-gray-600">Conexões</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">🎯</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {new Set(nodes.map(n => n.category)).size}
                </div>
                <div className="text-gray-600">Categorias Usadas</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para adicionar novo nó */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96 max-w-90vw">
            <h3 className="text-xl font-semibold mb-4">➕ Adicionar Novo Tema</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Tema
                </label>
                <input
                  type="text"
                  value={newNodeText}
                  onChange={(e) => setNewNodeText(e.target.value)}
                  placeholder="Ex: Receitas Saudáveis, Dicas de Produtividade..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria
                </label>
                <select
                  value={newNodeCategory}
                  onChange={(e) => setNewNodeCategory(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.name} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={addNode}
                disabled={!newNodeText.trim()}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

