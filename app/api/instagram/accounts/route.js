// API para gerenciar contas Instagram conectadas
import { readFile, readdir } from 'fs/promises';
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
    const accountFile = join(dataDir, `account_${userId}.json`);

    if (!existsSync(accountFile)) {
      return new Response(JSON.stringify({ 
        connected: false,
        accounts: [],
        message: 'Nenhuma conta Instagram conectada' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const accountData = JSON.parse(await readFile(accountFile, 'utf8'));

    // Verificar se o token ainda é válido fazendo uma requisição de teste
    const testResponse = await fetch(`https://graph.facebook.com/v18.0/me?access_token=${accountData.accessToken}` );
    
    if (!testResponse.ok) {
      return new Response(JSON.stringify({ 
        connected: false,
        accounts: [],
        message: 'Token expirado. Reconecte sua conta.',
        expired: true
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      connected: true,
      facebookUser: {
        id: accountData.facebookUserId,
        name: accountData.facebookUserName
      },
      accounts: accountData.instagramAccounts,
      connectedAt: accountData.connectedAt,
      lastUpdated: accountData.lastUpdated
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro ao obter contas Instagram:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno do servidor',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function DELETE(request) {
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
    const accountFile = join(dataDir, `account_${userId}.json`);

    if (existsSync(accountFile)) {
      // Ler dados da conta antes de deletar para revogar o token
      try {
        const accountData = JSON.parse(await readFile(accountFile, 'utf8'));
        
        // Tentar revogar o token no Facebook
        await fetch(`https://graph.facebook.com/v18.0/${accountData.facebookUserId}/permissions?access_token=${accountData.accessToken}`, {
          method: 'DELETE'
        } );
      } catch (e) {
        console.warn('Não foi possível revogar o token:', e.message);
      }

      // Deletar arquivo local
      const { unlink } = await import('fs/promises');
      await unlink(accountFile);
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Conta Instagram desconectada com sucesso' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro ao desconectar conta Instagram:', error);
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
    const { userId } = await request.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: 'userId é obrigatório' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const dataDir = join(process.cwd(), 'data', 'instagram');
    const accountFile = join(dataDir, `account_${userId}.json`);

    if (!existsSync(accountFile)) {
      return new Response(JSON.stringify({ 
        error: 'Conta não encontrada. Conecte sua conta primeiro.' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const accountData = JSON.parse(await readFile(accountFile, 'utf8'));

    // Atualizar informações das contas Instagram
    const userResponse = await fetch(`https://graph.facebook.com/v18.0/me?fields=id,name,accounts{id,name,instagram_business_account{id,name,username}}&access_token=${accountData.accessToken}` );
    const userData = await userResponse.json();

    if (!userResponse.ok || userData.error) {
      return new Response(JSON.stringify({ 
        error: 'Erro ao atualizar dados da conta',
        details: userData.error?.message 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Atualizar lista de contas Instagram
    const instagramAccounts = [];
    if (userData.accounts && userData.accounts.data) {
      for (const page of userData.accounts.data) {
        if (page.instagram_business_account) {
          instagramAccounts.push({
            pageId: page.id,
            pageName: page.name,
            instagramId: page.instagram_business_account.id,
            instagramName: page.instagram_business_account.name,
            instagramUsername: page.instagram_business_account.username
          });
        }
      }
    }

    // Atualizar dados salvos
    accountData.instagramAccounts = instagramAccounts;
    accountData.lastUpdated = new Date().toISOString();

    const { writeFile } = await import('fs/promises');
    await writeFile(accountFile, JSON.stringify(accountData, null, 2));

    return new Response(JSON.stringify({
      success: true,
      accounts: instagramAccounts,
      message: 'Contas atualizadas com sucesso'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro ao atualizar contas Instagram:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno do servidor',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
