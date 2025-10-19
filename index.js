// index.js
const express = require('express');
const app = express();

// Token de verificação do WhatsApp (definido no Cloud Run)
const VERIFY_TOKEN =
  process.env.WHATSAPP_VERIFY_TOKEN || // variável configurada no Cloud Run
  'realcity_whats_2025';               // fallback local (apenas para teste)

// Middleware para JSON
app.use(express.json());

/**
 * Healthcheck — usado pelas sondagens do Cloud Run
 */
app.get('/healthz', (_req, res) => res.status(200).send('ok'));
app.head('/healthz', (_req, res) => res.status(200).send('ok'));

// (opcionais, mas úteis)
app.get('/readyz', (_req, res) => res.status(200).send('ok'));
app.get('/livez',  (_req, res) => res.status(200).send('ok'));

/**
 * Endpoint raiz (opcional)
 */
app.get('/', (_req, res) => res.status(200).send('rce-webhook ativo'));

/**
 * Verificação do webhook (GET)
 * Meta envia: hub.mode, hub.verify_token, hub.challenge
 */
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (!VERIFY_TOKEN) {
    console.error('❌ VERIFY_TOKEN não definido no ambiente.');
    return res.status(500).send('VERIFY_TOKEN ausente');
  }

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ WEBHOOK_VERIFIED com sucesso.');
    return res.status(200).send(challenge);
  }

  console.warn('⚠ Falha na verificação do webhook. Token inválido ou modo incorreto.');
  return res.sendStatus(403);
});

/**
 * Recebimento de eventos (POST)
 */
app.post('/webhook', (req, res) => {
  try {
    console.log('📩 Evento recebido:', JSON.stringify(req.body, null, 2));
    res.sendStatus(200); // Ack rápido exigido pelo Meta
  } catch (err) {
    console.error('💥 Erro no handler /webhook:', err);
    res.sendStatus(500);
  }
});

/**
 * Inicializa o servidor
 */
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});
