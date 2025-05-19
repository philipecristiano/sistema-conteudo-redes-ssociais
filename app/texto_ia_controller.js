// Implementação do Controlador de Entrada para o Módulo de Geração de Texto por IA

/**
 * Controlador principal para o módulo de geração de texto por IA
 * Responsável por gerenciar o fluxo de entrada, processamento e saída
 */
class TextoIAController {
  constructor() {
    this.pesquisaService = new PesquisaService();
    this.geradorTextoService = new GeradorTextoService();
    this.formatadorService = new FormatadorService();
    
    // Opções de tom disponíveis
    this.opcoesDeTom = [
      { id: 'amigavel', nome: 'Amigável', descricao: 'Tom casual e conversacional, com emojis ocasionais' },
      { id: 'profissional', nome: 'Profissional', descricao: 'Tom formal e objetivo, com foco em credibilidade' },
      { id: 'informativo', nome: 'Informativo', descricao: 'Foco em fatos e dados, tom educativo' },
      { id: 'inspirador', nome: 'Inspirador', descricao: 'Tom motivacional e encorajador' },
      { id: 'persuasivo', nome: 'Persuasivo', descricao: 'Tom convincente com chamadas à ação' }
    ];
    
    // Formatos de postagem disponíveis
    this.opcoesDeFormato = [
      { id: 'feed', nome: 'Feed', descricao: 'Postagem padrão para feed do Instagram' },
      { id: 'carrossel', nome: 'Carrossel', descricao: 'Série de slides para postagem múltipla' },
      { id: 'reels', nome: 'Reels', descricao: 'Roteiro para vídeo curto vertical' }
    ];
  }
  
  /**
   * Retorna as opções de tom disponíveis para seleção
   * @returns {Array} Lista de opções de tom
   */
  getOpcoesDeTom() {
    return this.opcoesDeTom;
  }
  
  /**
   * Retorna as opções de formato disponíveis para seleção
   * @returns {Array} Lista de opções de formato
   */
  getOpcoesDeFormato() {
    return this.opcoesDeFormato;
  }
  
  /**
   * Processa a solicitação de geração de texto
   * @param {string} tema - O tema fornecido pelo usuário
   * @param {string} tomId - O ID do tom selecionado
   * @param {string} formatoId - O ID do formato selecionado
   * @returns {Promise<Object>} Resultado da geração de texto
   */
  async processarSolicitacao(tema, tomId, formatoId) {
    try {
      // Validar entrada
      this.validarEntrada(tema, tomId, formatoId);
      
      // Buscar informações confiáveis sobre o tema
      const resultadoPesquisa = await this.pesquisaService.pesquisarFontesConfiaveis(tema);
      
      // Gerar texto com o tom selecionado
      const textoGerado = await this.geradorTextoService.gerarTextoComTom(
        resultadoPesquisa,
        tomId,
        formatoId
      );
      
      // Formatar o texto para o formato selecionado
      const textoFormatado = this.formatadorService.formatarParaInstagram(textoGerado, formatoId);
      
      // Retornar resultado completo
      return {
        tema: tema,
        tom: this.getTomPorId(tomId),
        formato: this.getFormatoPorId(formatoId),
        fontes: resultadoPesquisa.fontes,
        texto: textoFormatado,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error("Erro ao processar solicitação:", error);
      throw new Error(`Falha ao gerar texto: ${error.message}`);
    }
  }
  
  /**
   * Valida os parâmetros de entrada
   * @param {string} tema - O tema fornecido
   * @param {string} tomId - O ID do tom
   * @param {string} formatoId - O ID do formato
   * @throws {Error} Se algum parâmetro for inválido
   */
  validarEntrada(tema, tomId, formatoId) {
    if (!tema || tema.trim().length < 3) {
      throw new Error("O tema deve ter pelo menos 3 caracteres");
    }
    
    if (!this.opcoesDeTom.some(tom => tom.id === tomId)) {
      throw new Error("Tom selecionado inválido");
    }
    
    if (!this.opcoesDeFormato.some(formato => formato.id === formatoId)) {
      throw new Error("Formato selecionado inválido");
    }
  }
  
  /**
   * Obtém detalhes de um tom pelo ID
   * @param {string} id - ID do tom
   * @returns {Object} Detalhes do tom
   */
  getTomPorId(id) {
    return this.opcoesDeTom.find(tom => tom.id === id);
  }
  
  /**
   * Obtém detalhes de um formato pelo ID
   * @param {string} id - ID do formato
   * @returns {Object} Detalhes do formato
   */
  getFormatoPorId(id) {
    return this.opcoesDeFormato.find(formato => formato.id === id);
  }
}

/**
 * Serviço responsável pela pesquisa de fontes confiáveis
 */
class PesquisaService {
  constructor() {
    this.openaiClient = new OpenAIClient();
    this.cacheService = new CacheService();
  }
  
  /**
   * Pesquisa informações confiáveis sobre um tema
   * @param {string} tema - O tema a ser pesquisado
   * @returns {Promise<Object>} Resultado da pesquisa
   */
  async pesquisarFontesConfiaveis(tema) {
    // Verificar cache primeiro
    const cacheKey = `pesquisa_${tema.toLowerCase().replace(/\s+/g, '_')}`;
    const cachedResult = this.cacheService.get(cacheKey);
    
    if (cachedResult) {
      console.log(`Usando resultado em cache para tema: ${tema}`);
      return cachedResult;
    }
    
    console.log(`Realizando nova pesquisa para tema: ${tema}`);
    
    const prompt = `Pesquise informações confiáveis sobre "${tema}". 
    Forneça dados de fontes verificáveis, incluindo estatísticas recentes, 
    estudos científicos e opiniões de especialistas. 
    Organize as informações por relevância e inclua as fontes para cada informação.
    Retorne o resultado no formato JSON com os campos: 
    informacoes (array de objetos com texto e importancia), 
    fontes (array de objetos com nome, url e credibilidade).`;
    
    try {
      const response = await this.openaiClient.createCompletion({
        model: "gpt-4",
        prompt: prompt,
        max_tokens: 1000,
        temperature: 0.3
      });
      
      const resultado = this.processarResultadoPesquisa(response.data.choices[0].text);
      
      // Armazenar em cache
      this.cacheService.set(cacheKey, resultado, 3600); // Cache por 1 hora
      
      return resultado;
    } catch (error) {
      console.error("Erro na pesquisa:", error);
      throw new Error("Falha ao pesquisar informações confiáveis");
    }
  }
  
  /**
   * Processa o resultado bruto da pesquisa
   * @param {string} textoResultado - Texto retornado pela API
   * @returns {Object} Resultado processado
   */
  processarResultadoPesquisa(textoResultado) {
    try {
      // Tentar fazer parse do JSON
      const jsonResult = JSON.parse(textoResultado);
      return jsonResult;
    } catch (error) {
      // Se não for JSON válido, fazer processamento manual
      console.warn("Resultado não é JSON válido, processando manualmente");
      
      // Implementação simplificada de extração de informações
      const informacoes = [];
      const fontes = [];
      
      // Dividir por linhas e processar
      const linhas = textoResultado.split('\n');
      let informacaoAtual = null;
      
      for (const linha of linhas) {
        if (linha.includes('Fonte:')) {
          const fonteParts = linha.split('Fonte:');
          if (fonteParts.length > 1) {
            const fonte = fonteParts[1].trim();
            fontes.push({
              nome: fonte,
              url: this.extrairUrl(fonte),
              credibilidade: 'alta' // Valor padrão
            });
          }
        } else if (linha.trim().length > 0) {
          informacoes.push({
            texto: linha.trim(),
            importancia: this.avaliarImportancia(linha)
          });
        }
      }
      
      return {
        informacoes: informacoes,
        fontes: fontes
      };
    }
  }
  
  /**
   * Extrai URL de um texto
   * @param {string} texto - Texto contendo possível URL
   * @returns {string} URL extraída ou string vazia
   */
  extrairUrl(texto) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = texto.match(urlRegex);
    return matches ? matches[0] : '';
  }
  
  /**
   * Avalia a importância de uma informação
   * @param {string} texto - Texto da informação
   * @returns {number} Nível de importância (1-5)
   */
  avaliarImportancia(texto) {
    // Implementação simplificada
    if (texto.includes('estudo') || texto.includes('pesquisa')) {
      return 5;
    } else if (texto.includes('estatística') || texto.includes('dados')) {
      return 4;
    } else if (texto.includes('especialista') || texto.includes('expert')) {
      return 3;
    } else {
      return 2;
    }
  }
}

/**
 * Serviço responsável pela geração de texto
 */
class GeradorTextoService {
  constructor() {
    this.openaiClient = new OpenAIClient();
    this.copyaiClient = new CopyAIClient();
  }
  
  /**
   * Gera texto com tom personalizado
   * @param {Object} informacoes - Informações da pesquisa
   * @param {string} tomId - ID do tom selecionado
   * @param {string} formatoId - ID do formato selecionado
   * @returns {Promise<string>} Texto gerado
   */
  async gerarTextoComTom(informacoes, tomId, formatoId) {
    // Mapeamento de tons para instruções específicas
    const instrucoesTom = {
      amigavel: "Use linguagem casual, emojis ocasionais e um tom conversacional. Seja acolhedor e empático.",
      profissional: "Use linguagem formal, dados precisos e um tom objetivo. Evite gírias e mantenha credibilidade.",
      informativo: "Foque em fatos e dados. Apresente informações de forma clara e direta. Seja educativo.",
      inspirador: "Use linguagem motivacional, histórias de superação e um tom encorajador. Inspire ação.",
      persuasivo: "Use argumentos convincentes, perguntas retóricas e chamadas à ação. Seja persuasivo sem ser agressivo."
    };
    
    // Mapeamento de formatos para instruções específicas
    const instrucoesFormato = {
      feed: "Crie um texto conciso com até 2200 caracteres, com introdução impactante e conclusão com chamada para ação.",
      carrossel: "Divida o conteúdo em 5-10 slides lógicos, cada um com um título curto e 1-2 parágrafos explicativos.",
      reels: "Crie um roteiro curto e dinâmico, com frases de impacto e instruções para transições visuais."
    };
    
    const prompt = `Com base nas seguintes informações:
    ${JSON.stringify(informacoes)}
    
    Crie um texto para Instagram no formato ${formatoId} sobre este tema.
    ${instrucoesTom[tomId]}
    ${instrucoesFormato[formatoId]}
    
    Inclua hashtags relevantes ao final.`;
    
    try {
      // Primeiro usamos ChatGPT para estruturar o conteúdo baseado em evidências
      const estruturaBase = await this.openaiClient.createCompletion({
        model: "gpt-4",
        prompt: prompt,
        max_tokens: 1500,
        temperature: 0.7
      });
      
      // Depois refinamos com Copy.ai para otimizar o tom e engajamento
      const textoRefinado = await this.copyaiClient.refineText({
        text: estruturaBase.data.choices[0].text,
        tone: tomId,
        platform: "instagram",
        format: formatoId
      });
      
      return textoRefinado;
    } catch (error) {
      console.error("Erro na geração de texto:", error);
      throw new Error("Falha ao gerar texto personalizado");
    }
  }
}

/**
 * Serviço responsável pela formatação do texto para Instagram
 */
class FormatadorService {
  /**
   * Formata texto para Instagram
   * @param {string} texto - Texto a ser formatado
   * @param {string} formatoId - ID do formato
   * @returns {Object} Texto formatado
   */
  formatarParaInstagram(texto, formatoId) {
    switch(formatoId) {
      case 'feed':
        return this.formatarParaFeed(texto);
      case 'carrossel':
        return this.formatarParaCarrossel(texto);
      case 'reels':
        return this.formatarParaReels(texto);
      default:
        return { conteudo: texto };
    }
  }
  
  /**
   * Formata texto para feed do Instagram
   * @param {string} texto - Texto a ser formatado
   * @returns {Object} Texto formatado
   */
  formatarParaFeed(texto) {
    // Limitar a 2200 caracteres
    let textoFormatado = texto.substring(0, 2200);
    
    // Adicionar quebras de linha estratégicas
    textoFormatado = this.adicionarQuebrasLinha(textoFormatado);
    
    // Garantir que hashtags estejam no final
    textoFormatado = this.organizarHashtags(textoFormatado);
    
    return {
      conteudo: textoFormatado,
      tipo: 'feed'
    };
  }
  
  /**
   * Formata texto para carrossel do Instagram
   * @param {string} texto - Texto a ser formatado
   * @returns {Object} Texto formatado em slides
   */
  formatarParaCarrossel(texto) {
    // Dividir em seções para slides
    const slides = this.dividirEmSlides(texto);
    
    return {
      conteudo: slides,
      tipo: 'carrossel'
    };
  }
  
  /**
   * Formata texto para Reels do Instagram
   * @param {string} texto - Texto a ser formatado
   * @returns {Object} Texto formatado como roteiro
   */
  formatarParaReels(texto) {
    // Formatar como roteiro com marcações de tempo
    const roteiro = this.converterParaRoteiro(texto);
    
    return {
      conteudo: roteiro,
      tipo: 'reels'
    };
  }
  
  /**
   * Adiciona quebras de linha estratégicas ao texto
   * @param {string} texto - Texto original
   * @returns {string} Texto com quebras de linha
   */
  adicionarQuebrasLinha(texto) {
    // Implementação simplificada
    let resultado = texto;
    
    // Adicionar quebra após parágrafos
    resultado = resultado.replace(/\.\s+/g, '.\n\n');
    
    // Evitar quebras excessivas
    resultado = resultado.replace(/\n{3,}/g, '\n\n');
    
    return resultado;
  }
  
  /**
   * Organiza hashtags para ficarem no final do texto
   * @param {string} texto - Texto original
   * @returns {string} Texto com hashtags organizadas
   */
  organizarHashtags(texto) {
    // Extrair hashtags
    const hashtagRegex = /#[a-zA-Z0-9_]+/g;
    const hashtags = texto.match(hashtagRegex) || [];
    
    // Remover hashtags do texto original
    let textoSemHashtags = texto.replace(hashtagRegex, '');
    
    // Limpar espaços extras
    textoSemHashtags = textoSemHashtags.replace(/\s+/g, ' ').trim();
    
    // Adicionar hashtags no final
    if (hashtags.length > 0) {
      return `${textoSemHashtags}\n\n${hashtags.join(' ')}`;
    }
    
    return textoSemHashtags;
  }
  
  /**
   * Divide o texto em slides para carrossel
   * @param {string} texto - Texto original
   * @returns {Array} Lista de slides
   */
  dividirEmSlides(texto) {
    const slides = [];
    
    // Implementação simplificada
    // Dividir por parágrafos
    const paragrafos = texto.split(/\n{2,}/);
    
    // Criar slide de capa
    slides.push({
      titulo: this.extrairTitulo(texto),
      conteudo: ''
    });
    
    // Processar parágrafos em slides
    let slideAtual = { titulo: '', conteudo: '' };
    
    for (const paragrafo of paragrafos) {
      // Se parece um título
      if (paragrafo.length < 60 && !paragrafo.endsWith('.')) {
        // Se já temos conteúdo, salvar slide atual
        if (slideAtual.conteudo) {
          slides.push(slideAtual);
        }
        
        // Iniciar novo slide
        slideAtual = {
          titulo: paragrafo,
          conteudo: ''
        };
      } else {
        // É conteúdo
        if (!slideAtual.titulo) {
          slideAtual.titulo = 'Continuação';
        }
        
        if (slideAtual.conteudo) {
          slideAtual.conteudo += '\n\n';
        }
        
        slideAtual.conteudo += paragrafo;
        
        // Se o slide está ficando muito grande, cortar
        if (slideAtual.conteudo.length > 300) {
          slides.push(slideAtual);
          slideAtual = { titulo: 'Continuação', conteudo: '' };
        }
      }
    }
    
    // Adicionar último slide se tiver conteúdo
    if (slideAtual.conteudo) {
      slides.push(slideAtual);
    }
    
    // Extrair hashtags para o último slide
    const hashtagRegex = /#[a-zA-Z0-9_]+/g;
    const hashtags = texto.match(hashtagRegex) || [];
    
    if (hashtags.length > 0) {
      slides.push({
        titulo: 'Hashtags',
        conteudo: hashtags.join(' ')
      });
    }
    
    return slides;
  }
  
  /**
   * Converte texto para formato de roteiro
 
(Content truncated due to size limit. Use line ranges to read in chunks)