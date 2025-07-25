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
  const [showModal, setShowModal] = useState(false);
  const [newNodeText, setNewNodeText] = useState('');
  const [newNodeCategory, setNewNodeCategory] = useState('Saúde');
  const [stats, setStats] = useState({ temas: 0, conexoes: 0, categorias: 0 });

  // Inicializar com nó central
  useEffect(() => {
    const savedNodes = localStorage.getItem('mapaMentalNodes');
    if (savedNodes) {
      setNodes(JSON.parse(savedNodes));
    } else {
      const centerNode: Node = {
        id: 'center',
        text: 'Temas de\nConteúdo',
        x: 400,
        y: 300,
        category: 'Centro',
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
      updateStats();
    }
  }, [nodes]);

  const updateStats = () => {
    const temas = nodes.filter(n => !n.isCenter).length;
    const conexoes = nodes.reduce((acc, node) => acc + node.connections.length, 0);
    const categorias = new Set(nodes.filter(n => !n.isCenter).map(n => n.category)).size;
    setStats({ temas, conexoes, categorias });
  };

  const getCategoryStyle = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    return category || { color: '#6B7280', bgColor: '#F3F4F6' };
  };

  const addNode = () => {
    if (!newNodeText.trim()) return;

    const newNode: Node = {
      id: Date.now().toString(),
      text: newNodeText,
      x: Math.random() * 600 + 100,
      y: Math.random() * 400 + 100,
      category: newNodeCategory,
      isCenter: false,
      connections: ['center']
    };

    // Conectar ao nó central
    setNodes(prev => prev.map(node => 
      node.id === 'center' 
        ? { ...node, connections: [...node.connections, newNode.id] }
        : node
    ).concat(newNode));

    setNewNodeText('');
    setShowModal(false);
  };

  const deleteNode = (nodeId: string) => {
    if (nodeId === 'center') return;
    
    setNodes(prev => prev
      .filter(node => node.id !== nodeId)
      .map(node => ({
        ...node,
        connections: node.connections.filter(id => id !== nodeId)
      }))
    );
  };

  const exportAsImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'mapa-mental.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  // Renderização do canvas
  useEffect(() => {
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
      const style = node.isCenter 
        ? { color: '#8B5CF6', bgColor: '#EDE9FE' }
        : getCategoryStyle(node.category);

      // Sombra
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      // Fundo do nó
      ctx.fillStyle = style.bgColor;
      ctx.fillRect(node.x - 60, node.y - 30, 120, 60);

      // Borda
      ctx.strokeStyle = style.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(node.x - 60, node.y - 30, 120, 60);

      // Remover sombra para texto
      ctx.shadowColor = 'transparent';

      // Texto
      ctx.fillStyle = style.color;
      ctx.font = node.isCenter ? 'bold 14px Arial' : '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Quebrar texto em linhas
      const lines = node.text.split('\n');
      lines.forEach((line, index) => {
        ctx.fillText(line, node.x, node.y + (index - lines.length/2 + 0.5) * 16);
      });
    });
  }, [nodes, categories]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
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
            <div className="text-2xl font-bold text-purple-600">{stats.temas}</div>
            <div className="text-sm text-gray-600">Temas Criados</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-pink-100">
            <div className="text-2xl font-bold text-pink-600">{stats.conexoes}</div>
            <div className="text-sm text-gray-600">Conexões</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-indigo-100">
            <div className="text-2xl font-bold text-indigo-600">{stats.categorias}</div>
            <div className="text-sm text-gray-600">Categorias Ativas</div>
          </div>
        </div>

        {/* Controles */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4">
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium"
              >
                ➕ Adicionar Tema
              </button>
              <button
                onClick={exportAsImage}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium"
              >
                📸 Exportar Imagem
              </button>
            </div>
            <div className="text-sm text-gray-500">
              💡 Clique nos nós para selecioná-los • Arraste para mover • Delete para remover
            </div>
          </div>
        </div>

        {/* Canvas do Mapa Mental */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = (e.clientX - rect.left) * (800 / rect.width);
              const y = (e.clientY - rect.top) * (600 / rect.height);
              
              // Verificar se clicou em algum nó
              const clickedNode = nodes.find(node => 
                x >= node.x - 60 && x <= node.x + 60 &&
                y >= node.y - 30 && y <= node.y + 30
              );
              
              if (clickedNode) {
                setSelectedNode(clickedNode.id === selectedNode ? null : clickedNode.id);
              } else {
                setSelectedNode(null);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Delete' && selectedNode && selectedNode !== 'center') {
                deleteNode(selectedNode);
                setSelectedNode(null);
              }
            }}
            tabIndex={0}
          />
        </div>

        {/* Legenda de Categorias */}
        <div className="mt-6 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">📋 Categorias</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map(category => (
              <div key={category.name} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded border-2"
                  style={{ 
                    backgroundColor: category.bgColor,
                    borderColor: category.color 
                  }}
                />
                <span className="text-sm text-gray-700">{category.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal para Adicionar Tema */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">➕ Adicionar Novo Tema</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Texto do Tema
                </label>
                <textarea
                  value={newNodeText}
                  onChange={(e) => setNewNodeText(e.target.value)}
                  placeholder="Digite o tema (use \n para quebrar linha)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
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
                onClick={addNode}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium"
              >
                Adicionar
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setNewNodeText('');
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-all duration-200 font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

