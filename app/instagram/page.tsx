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

export default function MapaMental( ) {
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
