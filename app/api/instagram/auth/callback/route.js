// API para processar o callback da autenticação OAuth
import { writeFile, readFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Verificar se houve erro na autorização
    if (error) {
      return new Response(JSON.stringify({ 
        error: 'Autorização negada pelo usuário',
        details: error 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!code || !state) {
      return new Response(JSON.stringify({ 
        error: 'Parâmetros de autorização inválidos' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Decodificar e verificar o state
    let stateData;
    try {
      stateData = JSON.parse(Buffer.from(state, 'base64').toString());
    } catch (e) {
      return new Response(JSON.stringify({ 
        error: 'State inválido' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { userId, timestamp } = stateData;

    // Verificar se o state não expirou (24 horas)
    if (Date.now() - timestamp > 24 * 60 * 60 * 1000) {
      return new Response(JSON.stringify({ 
        error: 'Autorização expirada. Tente novamente.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const facebookAppId = process.env.FACEBOOK_APP_ID;
    const facebookAppSecret = process.env.FACEBOOK_APP_SECRET;
    const redirectUri = process.env.INSTAGRAM_REDIRECT_URI || `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/instagram/auth/callback`;

    if (!facebookAppId || !facebookAppSecret ) {
      return new Response(JSON.stringify({ 
        error: 'Credenciais do Facebook não configuradas' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Trocar o código por um token de acesso
    const tokenUrl = new URL('https://graph.facebook.com/v18.0/oauth/access_token' );
    tokenUrl.searchParams.set('client_id', facebookAppId);
    tokenUrl.searchParams.set('client_secret', facebookAppSecret);
    tokenUrl.searchParams.set('redirect_uri', redirectUri);
    tokenUrl.searchParams.set('code', code);

    const tokenResponse = await fetch(tokenUrl.toString());
    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || tokenData.error) {
      console.error('Erro ao obter token:', tokenData);
      return new Response(JSON.stringify({ 
        error: 'Erro ao obter token de acesso',
        details: tokenData.error?.message 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const accessToken = tokenData.access_token;

    // Obter informações do usuário e páginas do Facebook
    const userResponse = await fetch(`https://graph.facebook.com/v18.0/me?fields=id,name,accounts{id,name,instagram_business_account{id,name,username}}&access_token=${accessToken}` );
    const userData = await userResponse.json();

    if (!userResponse.ok || userData.error) {
      console.error('Erro ao obter dados do usuário:', userData);
      return new Response(JSON.stringify({ 
        error: 'Erro ao obter dados do usuário',
        details: userData.error?.message 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Filtrar apenas páginas que têm conta do Instagram Business conectada
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

    // Salvar dados da conta
    const accountData = {
      userId,
      facebookUserId: userData.id,
      facebookUserName: userData.name,
      accessToken,
      instagramAccounts,
      connectedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    // Criar diretório de dados se não existir
    const dataDir = join(process.cwd(), 'data', 'instagram');
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true });
    }

    // Salvar dados da conta
    const accountFile = join(dataDir, `account_${userId}.json`);
    await writeFile(accountFile, JSON.stringify(accountData, null, 2));

    // Retornar sucesso com redirecionamento
    const successUrl = `/instagram?connected=true&accounts=${instagramAccounts.length}`;
    
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Instagram Conectado</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .success { color: #28a745; }
            .info { color: #6c757d; margin: 20px 0; }
          </style>
        </head>
        <body>
          <h1 class="success">✅ Instagram Conectado com Sucesso!</h1>
          <p class="info">Encontramos ${instagramAccounts.length} conta(s) do Instagram Business.</p>
          <p>Redirecionando...</p>
          <script>
            setTimeout(() => {
              window.location.href = '${successUrl}';
            }, 3000);
          </script>
        </body>
      </html>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });

  } catch (error) {
    console.error('Erro no callback de autenticação:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno do servidor',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
