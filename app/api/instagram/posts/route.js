// API para gerenciar posts do Instagram
import { readFile, writeFile, readdir, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const instagramId = searchParams.get('instagram_id');

    if (!userId) {
      return new Response(JSON.stringify({ error: 'user_id é obrigatório' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const dataDir = join(process.cwd(), 'data', 'instagram');
    const postsDir = join(dataDir, 'posts');

    if (!existsSync(postsDir)) {
      return new Response(JSON.stringify({ posts: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Listar todos os arquivos de posts do usuário
    const files = await readdir(postsDir);
    const userPosts = files.filter(file => file.startsWith(`${userId}_`) && file.endsWith('.json'));

    const posts = [];
    for (const file of userPosts) {
      try {
        const postData = JSON.parse(await readFile(join(postsDir, file), 'utf8'));
        
        // Filtrar por conta Instagram se especificado
        if (!instagramId || postData.instagramId === instagramId) {
          posts.push(postData);
        }
      } catch (e) {
        console.warn(`Erro ao ler post ${file}:`, e.message);
      }
    }

    // Ordenar por data de criação (mais recente primeiro)
    posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return new Response(JSON.stringify({ posts }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro ao listar posts:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno do servidor',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST(request) {
  try {
    const { 
      userId, 
      instagramId, 
      caption, 
      mediaUrl, 
      mediaType = 'IMAGE',
      scheduledFor = null 
    } = await request.json();

    if (!userId || !instagramId || !caption || !mediaUrl) {
      return new Response(JSON.stringify({ 
        error: 'userId, instagramId, caption e mediaUrl são obrigatórios' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verificar se a conta está conectada
    const dataDir = join(process.cwd(), 'data', 'instagram');
    const accountFile = join(dataDir, `account_${userId}.json`);

    if (!existsSync(accountFile)) {
      return new Response(JSON.stringify({ 
        error: 'Conta Instagram não conectada' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const accountData = JSON.parse(await readFile(accountFile, 'utf8'));
    
    // Verificar se a conta Instagram especificada existe
    const instagramAccount = accountData.instagramAccounts.find(acc => acc.instagramId === instagramId);
    if (!instagramAccount) {
      return new Response(JSON.stringify({ 
        error: 'Conta Instagram não encontrada' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Gerar ID único para o post
    const postId = `${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Criar objeto do post
    const postData = {
      id: postId,
      userId,
      instagramId,
      instagramUsername: instagramAccount.instagramUsername,
      caption,
      mediaUrl,
      mediaType: mediaType.toUpperCase(),
      status: scheduledFor ? 'scheduled' : 'draft',
      scheduledFor,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: null,
      instagramPostId: null,
      error: null
    };

    // Criar diretório de posts se não existir
    const postsDir = join(dataDir, 'posts');
    if (!existsSync(postsDir)) {
      await mkdir(postsDir, { recursive: true });
    }

    // Salvar post
    const postFile = join(postsDir, `${postId}.json`);
    await writeFile(postFile, JSON.stringify(postData, null, 2));

    // Se for para publicar imediatamente, processar agora
    if (!scheduledFor) {
      try {
        const publishResult = await publishPost(postData, accountData.accessToken);
        postData.status = publishResult.success ? 'published' : 'failed';
        postData.publishedAt = publishResult.success ? new Date().toISOString() : null;
        postData.instagramPostId = publishResult.instagramPostId || null;
        postData.error = publishResult.error || null;
        postData.updatedAt = new Date().toISOString();

        // Atualizar arquivo do post
        await writeFile(postFile, JSON.stringify(postData, null, 2));
      } catch (publishError) {
        console.error('Erro ao publicar post:', publishError);
        postData.status = 'failed';
        postData.error = publishError.message;
        postData.updatedAt = new Date().toISOString();
        await writeFile(postFile, JSON.stringify(postData, null, 2));
      }
    }

    return new Response(JSON.stringify({
      success: true,
      post: postData,
      message: scheduledFor ? 'Post agendado com sucesso' : 'Post criado com sucesso'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro ao criar post:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno do servidor',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Função auxiliar para publicar post no Instagram
async function publishPost(postData, accessToken) {
  try {
    // Passo 1: Criar container de mídia
    const containerUrl = `https://graph.facebook.com/v18.0/${postData.instagramId}/media`;
    const containerParams = new URLSearchParams({
      image_url: postData.mediaUrl,
      caption: postData.caption,
      access_token: accessToken
    } );

    const containerResponse = await fetch(containerUrl, {
      method: 'POST',
      body: containerParams
    });

    const containerData = await containerResponse.json();

    if (!containerResponse.ok || containerData.error) {
      throw new Error(`Erro ao criar container: ${containerData.error?.message || 'Erro desconhecido'}`);
    }

    const containerId = containerData.id;

    // Passo 2: Aguardar processamento do container (polling)
    let containerReady = false;
    let attempts = 0;
    const maxAttempts = 30; // 30 tentativas = 5 minutos

    while (!containerReady && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 10000)); // Aguardar 10 segundos
      
      const statusResponse = await fetch(`https://graph.facebook.com/v18.0/${containerId}?fields=status_code&access_token=${accessToken}` );
      const statusData = await statusResponse.json();

      if (statusData.status_code === 'FINISHED') {
        containerReady = true;
      } else if (statusData.status_code === 'ERROR') {
        throw new Error('Erro no processamento da mídia');
      }
      
      attempts++;
    }

    if (!containerReady) {
      throw new Error('Timeout no processamento da mídia');
    }

    // Passo 3: Publicar o container
    const publishUrl = `https://graph.facebook.com/v18.0/${postData.instagramId}/media_publish`;
    const publishParams = new URLSearchParams({
      creation_id: containerId,
      access_token: accessToken
    } );

    const publishResponse = await fetch(publishUrl, {
      method: 'POST',
      body: publishParams
    });

    const publishData = await publishResponse.json();

    if (!publishResponse.ok || publishData.error) {
      throw new Error(`Erro ao publicar: ${publishData.error?.message || 'Erro desconhecido'}`);
    }

    return {
      success: true,
      instagramPostId: publishData.id
    };

  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}
