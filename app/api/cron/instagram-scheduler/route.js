// Endpoint para execução automática do agendamento (cron job)
export async function GET(request) {
  try {
    // Verificar se a requisição vem de uma fonte autorizada
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'default-secret-change-me';
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Processar posts agendados
    const schedulerResponse = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/instagram/scheduler`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action: 'process' } )
    });

    const result = await schedulerResponse.json();

    return new Response(JSON.stringify({
      success: true,
      timestamp: new Date().toISOString(),
      processed: result.processed || 0,
      message: result.message || 'Agendamento executado',
      details: result.results || []
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro no cron job do Instagram:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST(request) {
  // Permitir POST também para flexibilidade
  return GET(request);
}
