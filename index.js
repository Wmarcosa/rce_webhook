// index.js
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// token de verificação do WhatsApp (ajuste no Cloud Run > Variáveis)
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'realcity_whats_2025';

// healthcheck (Cloud Run usa para ver se o container subiu)
app.get('/', (req, res) => res.status(200).send('ok'));

// Verificação do webhook (GET)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('WEBHOOK_VERIFIED');
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// Eventos do webhook (POST)
app.post('/webhook', (req, res) => {
  console.log('Evento recebido:', JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

// *** IMPORTANTE ***
// Cloud Run injeta a porta certa em process.env.PORT.
// Precisamos escutar em 0.0.0.0 e exatamente nessa porta.
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log("Servidor ouvindo na porta ${PORT}");
});
