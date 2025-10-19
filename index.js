// index.js
const express = require('express');

const app = express();
app.use(express.json());

// Leia da variável de ambiente VERIFY_TOKEN
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || '';

/**
 * Healthcheck para passar no startup probe do Cloud Run
 */
app.get('/healthz', (_req, res) => {
  res.status(200).send('ok');
});

/**
 * Endpoint básico raiz (opcional)
 */
app.get('/', (_req, res) => {
  res.status(200).send('rce-webhook up');
});

/**
 * Verificação do Webhook do WhatsApp (GET)
 * Meta/Facebook envia: hub.mode, hub.verify_token, hub.challenge
 */
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (!VERIFY_TOKEN) {
    console.error('VERIFY_TOKEN não definido no ambiente.');
    return res.status(500).send('VERIFY_TOKEN ausente');
  }

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verificado com sucesso.');
    return res.status(200).send(challenge);
  } else {
    console.warn('Falha na verificação do webhook.');
    return res.sendStatus(403);
  }
});

/**
 * Recebimento de eventos do WhatsApp (POST)
 */
app.post('/webhook', (req, res) => {
  try {
    const body = req.body;
    console.log('Evento recebido:', JSON.stringify(body));

    // TODO: trate mensagens aqui (messages, statuses, etc.)

    // Confirme recebimento
    res.sendStatus(200);
  } catch (e) {
    console.error('Erro no handler /webhook:', e);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`rce-webhook rodando na porta ${PORT}`);
});
