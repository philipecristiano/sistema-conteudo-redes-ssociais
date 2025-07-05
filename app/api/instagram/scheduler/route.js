// API para processar posts agendados do Instagram
import { readFile, writeFile, readdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return new Response(JSON.stringify({ error: 'user_id é obrigatório' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const dataDir = join(process.cwd(), 'data', 'instagram');
    const postsDir = join(dataDir, 'posts');

    if (!existsSync(postsDir)) {
      return new Response(JSON.stringify({ scheduledPosts: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Listar posts agendados do usuário
    const files = await readdir(postsDir);
    const userPosts = files.filter(file => file.startsWith(`${userId}_`) && file.endsWith('.json'));

    const scheduledPosts = [];
    for (const file of userPosts) {
      try {
        const postData = JSON.parse(await readFile(join(postsDir, file), 'utf8'));
        
        if (postData.status === 'scheduled' && postData.scheduledFor) {
          scheduledPosts.push(postData);
        }
      } catch (e) {
        console.warn(`Erro ao ler post ${file}:`, e.message);
      }
    }

    // Ordenar por data de agendamento
    scheduledPosts.sort((a, b) => new Date(a.scheduledFor) - new Date(b.scheduledFor));

    return new Response(JSON.stringify({ scheduledPosts }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro ao listar posts agendados:', error);
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
    const { action = 'process' } = await request.json();

    if (action === 'process') {
      return await processScheduledPosts();
    } else if (action === 'check') {
      return await checkScheduledPosts();
    } else {
      return new Response(JSON.stringify({ error: 'Ação inválida' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('Erro no scheduler:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno do servidor',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function processScheduledPosts() {
  try {
    const dataDir = join(process.cwd(), 'data', 'instagram');
    const postsDir = join(dataDir, 'posts');

    if (!existsSync(postsDir)) {
      return new Response(JSON.stringify({ 
        processed: 0,
        message: 'Nenhum post para processar' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const files = await readdir(postsDir);
    const now = new Date();
    let processed = 0;
    const results = [];

    for (const file of files) {
      if (!file.endsWith('.json')) continue;

      try {
        const postPath = join(postsDir, file);
        const postData = JSON.parse(await readFile(postPath, 'utf8'));

        // Verificar se é um post agendado que deve ser publicado
        if (postData.status === 'scheduled' && postData.scheduledFor) {
          const scheduledTime = new Date(postData.scheduledFor);
          
          if (scheduledTime <= now) {
            // Obter dados da conta
            const accountFile = join(dataDir, `account_${postData.userId}.json`);
            
            if (!existsSync(accountFile)) {
              postData.status = 'failed';
              postData.error = 'Conta não encontrada';
              postData.updatedAt = new Date().toISOString();
              await writeFile(postPath, JSON.stringify(postData, null, 2));
              continue;
            }

            const accountData = JSON.parse(await readFile(accountFile, 'utf8'));

            // Tentar publicar
            const publishResult = await publishPost(postData, accountData.accessToken);
            
            postData.status = publishResult.success ? 'published' : 'failed';
            postData.publishedAt = publishResult.success ? new Date().toISOString() : null;
            postData.instagramPostId = publishResult.instagramPostId || null;
            postData.error = publishResult.error || null;
            postData.updatedAt = new Date().toISOString();

            await writeFile(postPath, JSON.stringify(postData, null, 2));
            
            processed++;
            results.push({
              postId: postData.id,
              success: publishResult.success,
              error: publishResult.error
            });
          }
        }
      } catch (e) {
        console.error(`Erro ao processar post ${file}:`, e.message);
      }
    }

    return new Response(JSON.stringify({ 
      processed,
      results,
      message: `${processed} post(s) processado(s)` 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    throw error;
  }
}

async function checkScheduledPosts() {
  try {
    const dataDir = join(process.cwd(), 'data', 'instagram');
    const postsDir = join(dataDir, 'posts');

    if (!existsSync(postsDir)) {
      return new Response(JSON.stringify({ 
        pending: 0,
        upcoming: [],
        message: 'Nenhum post agendado' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const files = await readdir(postsDir);
    const now = new Date();
    const upcoming = [];
    let pending = 0;

    for (const file of files) {
      if (!file.endsWith('.json')) continue;

      try {
        const postData = JSON.parse(await readFile(join(postsDir, file), 'utf8'));

        if (postData.status === 'scheduled' && postData.scheduledFor) {
          const scheduledTime = new Date(postData.scheduledFor);
          
          if (scheduledTime <= now) {
            pending++;
          } else {
            upcoming.push({
              id: postData.id,
              scheduledFor: postData.scheduledFor,
              caption: postData.caption.substring(0, 100) + (postData.caption.length > 100 ? '...' : ''),
              instagramUsername: postData.instagramUsername
            });
          }
        }
      } catch (e) {
        console.warn(`Erro ao ler post ${file}:`, e.message);
      }
    }

    // Ordenar próximos posts por data
    upcoming.sort((a, b) => new Date(a.scheduledFor) - new Date(b.scheduledFor));

    return new Response(JSON.stringify({ 
      pending,
      upcoming: upcoming.slice(0, 10), // Próximos 10 posts
      message: `${pending} post(s) pendente(s), ${upcoming.length} agendado(s)` 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    throw error;
  }
}

// Função auxiliar para publicar post (reutilizada do posts/route.js)
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

    // Passo 2: Aguardar processamento do container
    let containerReady = false;
    let attempts = 0;
    const maxAttempts = 30;

    while (!containerReady && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      
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
