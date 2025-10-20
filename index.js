// index.js
const express = require('express');
const app = express();

// Token de verificação do WhatsApp
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'realcity_whats_2025';
app.use(express.json());

// Healthchecks
app.get('/', (_req, res) => res.status(200).send('ok'));
app.get('/healthz', (_req, res) => res.status(200).send('ok'));
app.head('/healthz', (_req, res) => res.status(200).send('ok'));
app.get('/readyz', (_req, res) => res.status(200).send('ok'));
app.get('/livez', (_req, res) => res.status(200).send('ok'));

// Verificação do webhook (GET)
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
  } else {
    console.warn('❌ Verificação falhou.', { mode, token });
    return res.sendStatus(403);
  }
});

// Eventos do webhook (POST)
app.post('/webhook', (req, res) => {
  try {
    console.log('📩 Evento recebido:', JSON.stringify(req.body, null, 2));
    res.sendStatus(200);
  } catch (err) {
    console.error('💥 Erro no handler /webhook:', err);
    res.sendStatus(500);
  }
});

// Inicializa servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => console.log(`Servidor ouvindo na porta ${PORT}`));
