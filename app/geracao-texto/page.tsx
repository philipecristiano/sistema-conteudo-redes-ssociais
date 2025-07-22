'use client';

import { useState } from 'react';

export default function ResumoRedesSociais() {
  const [conteudoOriginal, setConteudoOriginal] = useState('');
  const [resumoGerado, setResumoGerado] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const gerarResumo = () => {
    if (!conteudoOriginal.trim()) {
      alert('Por favor, cole o conteúdo do artigo primeiro!');
      return;
    }

    setIsProcessing(true);
    
    // Simular processamento (para dar feedback visual)
    setTimeout(() => {
      const resumo = criarResumoInteligente(conteudoOriginal);
      setResumoGerado(resumo);
      setIsProcessing(false);
    }, 1000);
  };

  const criarResumoInteligente = (texto) => {
    // Limpar e preparar o texto
    const textoLimpo = texto
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s.,!?;:()\-áàâãéèêíìîóòôõúùûçÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÇ]/g, '')
      .trim();

    // Dividir em sentenças
    const sentencas = textoLimpo
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 20);

    // Extrair pontos principais (primeiras sentenças e sentenças com palavras-chave)
    const palavrasChave = [
      'importante', 'principal', 'essencial', 'fundamental', 'crucial',
      'benefício', 'vantagem', 'resultado', 'impacto', 'efeito',
      'dica', 'estratégia', 'método', 'técnica', 'solução',
      'descoberta', 'pesquisa', 'estudo', 'dados', 'evidência'
    ];

    let pontosPrincipais = [];
    
    // Adicionar primeira sentença (introdução)
    if (sentencas.length > 0) {
      pontosPrincipais.push(sentencas[0]);
    }

    // Adicionar sentenças com palavras-chave
    sentencas.forEach(sentenca => {
      const temPalavraChave = palavrasChave.some(palavra => 
        sentenca.toLowerCase().includes(palavra)
      );
      if (temPalavraChave && pontosPrincipais.length < 4) {
        pontosPrincipais.push(sentenca);
      }
    });

    // Se não temos pontos suficientes, adicionar sentenças do meio e fim
    if (pontosPrincipais.length < 3 && sentencas.length > 2) {
      const meio = Math.floor(sentencas.length / 2);
      pontosPrincipais.push(sentencas[meio]);
      
      if (sentencas.length > 3) {
        pontosPrincipais.push(sentencas[sentencas.length - 2]);
      }
    }

    // Remover duplicatas e limitar
    pontosPrincipais = [...new Set(pontosPrincipais)].slice(0, 4);

    // Criar resumo formatado para Instagram
    let resumo = "✨ Principais pontos do artigo:\n\n";
    
    pontosPrincipais.forEach((ponto, index) => {
      const emoji = ['🔹', '💡', '⭐', '🎯'][index] || '📌';
      resumo += `${emoji} ${ponto.charAt(0).toUpperCase() + ponto.slice(1)}\n\n`;
    });

    // Adicionar call-to-action
    resumo += "💬 O que você achou desses pontos? Comenta aí!\n\n";

    // Adicionar hashtags baseadas no conteúdo
    const hashtags = gerarHashtags(textoLimpo);
    resumo += hashtags;

    return resumo;
  };

  const gerarHashtags = (texto) => {
    const palavrasComuns = [
      'saúde', 'bem-estar', 'produtividade', 'tecnologia', 'inovação',
      'educação', 'aprendizado', 'desenvolvimento', 'crescimento', 'sucesso',
      'motivação', 'inspiração', 'lifestyle', 'qualidade', 'vida',
      'trabalho', 'carreira', 'negócios', 'empreendedorismo', 'marketing',
      'digital', 'online', 'internet', 'redes', 'sociais', 'conteúdo'
    ];

    const hashtagsEncontradas = [];
    
    palavrasComuns.forEach(palavra => {
      if (texto.toLowerCase().includes(palavra) && hashtagsEncontradas.length < 8) {
        hashtagsEncontradas.push(`#${palavra}`);
      }
    });

    // Adicionar hashtags genéricas se não encontrou suficientes
    const hashtagsGenericas = [
      '#dicasúteis', '#conhecimento', '#informação', '#aprendizado',
      '#crescimentopessoal', '#desenvolvimento', '#inspiração', '#motivação'
    ];

    hashtagsGenericas.forEach(tag => {
      if (hashtagsEncontradas.length < 10 && !hashtagsEncontradas.includes(tag)) {
        hashtagsEncontradas.push(tag);
      }
    });

    return hashtagsEncontradas.join(' ');
  };

  const copiarResumo = async () => {
    try {
      await navigator.clipboard.writeText(resumoGerado);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (err) {
      // Fallback para navegadores mais antigos
      const textArea = document.createElement('textarea');
      textArea.value = resumoGerado;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  const limparCampos = () => {
    setConteudoOriginal('');
    setResumoGerado('');
    setCopiado(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            📱 Resumo para Redes Sociais
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Cole o conteúdo do seu artigo e gere um resumo otimizado para Instagram com os pontos principais, 
            formatação adequada e hashtags relevantes.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Coluna Esquerda - Input */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Conteúdo Original</h2>
            </div>
            
            <textarea
              value={conteudoOriginal}
              onChange={(e) => setConteudoOriginal(e.target.value)}
              placeholder="Cole aqui o artigo ou conteúdo que você quer resumir para redes sociais...

Exemplo: Cole um artigo sobre produtividade, saúde, tecnologia, ou qualquer tema que você pesquisou e quer compartilhar no Instagram de forma resumida e atrativa."
              className="w-full h-80 p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700"
            />
            
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-500">
                {conteudoOriginal.length} caracteres
              </span>
              <div className="flex gap-2">
                <button
                  onClick={limparCampos}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Limpar
                </button>
                <button
                  onClick={gerarResumo}
                  disabled={isProcessing || !conteudoOriginal.trim()}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processando...
                    </>
                  ) : (
                    <>
                      ✨ Gerar Resumo
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Coluna Direita - Output */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Resumo para Instagram</h2>
            </div>

            {resumoGerado ? (
              <>
                <div className="bg-gray-50 rounded-xl p-4 h-80 overflow-y-auto border">
                  <pre className="whitespace-pre-wrap text-gray-700 font-sans text-sm leading-relaxed">
                    {resumoGerado}
                  </pre>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                      {resumoGerado.length}/2200 caracteres
                    </span>
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      resumoGerado.length <= 2200 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {resumoGerado.length <= 2200 ? '✓ Tamanho ideal' : '⚠ Muito longo'}
                    </div>
                  </div>
                  
                  <button
                    onClick={copiarResumo}
                    className={`px-6 py-2 rounded-lg transition-all flex items-center gap-2 ${
                      copiado
                        ? 'bg-green-500 text-white'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                    }`}
                  >
                    {copiado ? (
                      <>
                        ✓ Copiado!
                      </>
                    ) : (
                      <>
                        📋 Copiar para Instagram
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                <div className="text-center">
                  <div className="text-4xl mb-4">📝</div>
                  <p className="text-lg">Seu resumo aparecerá aqui</p>
                  <p className="text-sm mt-2">Cole um conteúdo e clique em "Gerar Resumo"</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dicas de Uso */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            💡 Dicas para Melhores Resultados
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-purple-50 p-4 rounded-xl">
              <div className="text-purple-600 font-semibold mb-2">📰 Conteúdo Ideal</div>
              <p className="text-sm text-gray-600">
                Artigos com 300+ palavras geram resumos mais ricos e informativos.
              </p>
            </div>
            <div className="bg-pink-50 p-4 rounded-xl">
              <div className="text-pink-600 font-semibold mb-2">🎯 Pontos Principais</div>
              <p className="text-sm text-gray-600">
                O algoritmo identifica automaticamente as informações mais relevantes.
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="text-blue-600 font-semibold mb-2">📱 Formato Instagram</div>
              <p className="text-sm text-gray-600">
                Resumo otimizado com emojis, quebras de linha e hashtags.
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl">
              <div className="text-green-600 font-semibold mb-2">⚡ Instantâneo</div>
              <p className="text-sm text-gray-600">
                Processamento local, rápido e sem dependência de APIs externas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

