// API para iniciar o processo de autenticação OAuth com Facebook/Instagram
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

    const facebookAppId = process.env.FACEBOOK_APP_ID;
    const redirectUri = process.env.INSTAGRAM_REDIRECT_URI || `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/instagram/auth/callback`;
    
    if (!facebookAppId ) {
      return new Response(JSON.stringify({ error: 'FACEBOOK_APP_ID não configurado' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Escopo de permissões necessárias para Instagram Business
    const scope = [
      'instagram_basic',
      'instagram_content_publish',
      'pages_read_engagement',
      'pages_show_list'
    ].join(',');

    // Estado para verificação de segurança (inclui user_id)
    const state = Buffer.from(JSON.stringify({ 
      userId, 
      timestamp: Date.now() 
    })).toString('base64');

    // URL de autorização do Facebook
    const authUrl = new URL('https://www.facebook.com/v18.0/dialog/oauth' );
    authUrl.searchParams.set('client_id', facebookAppId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', scope);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('state', state);

    return new Response(JSON.stringify({ 
      authUrl: authUrl.toString(),
      message: 'Redirecione o usuário para esta URL para autorizar o acesso ao Instagram'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro ao iniciar autenticação Instagram:', error);
    return new Response(JSON.stringify({ error: 'Erro interno do servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
