const express = require('express');
const app = express();

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'realcity_whats_2025';

// health check
app.get('/', (_req, res) => res.status(200).send('ok'));

// verificação do webhook (GET)
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

// recebimento de eventos (POST)
app.use(express.json());
app.post('/webhook', (req, res) => {
  console.log('Evento recebido:', JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

// Cloud Run precisa escutar process.env.PORT em 0.0.0.0
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(Servidor ouvindo na porta ${PORT});
});
