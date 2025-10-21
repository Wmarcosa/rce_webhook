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

// Envio de mensagens pelo WhatsApp API
import fetch from 'node-fetch'; // se estiver usando ESModules (ou: const fetch = require('node-fetch'); se CommonJS)

// Configurações fixas da API
const TOKEN = 'EAAT7KeHQ3H8BP0GI0KDnqWIxPCYggBw2BYAiI43RUBuQNY9bpy2a8gND0rprMyutdCHKcseACoskci7LxFXk6CHMBmgYx0DkpNKZAqJo2q0zR0f8yIZ6I7yPUL6tnGY7kGkX1vQZItX8qlxs5MYsX0E4t28DQmIflAyBWyyQGDblmV5kE55NTO4IzoXZeyZAQue8KVlraM43AxmDY7AMcKzwz7E6DFQ';
const PHONE_ID = '761494477057382';

// Endpoint para enviar mensagens
app.post('/send-message', async (req, res) => {
  const { to, message } = req.body;

  try {
    const response = await fetch(https://graph.facebook.com/v19.0/${PHONE_ID}/messages, {
      method: 'POST',
      headers: {
        'Authorization': Bearer ${TOKEN},
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: to || '5511988111435', // destino padrão, pode trocar
        type: 'template',
        template: {
          name: 'hello_world',
          language: { code: 'pt_BR' }
        }
      })
    });

    const data = await response.json();
    console.log('📤 Resposta do WhatsApp API:', data);

    res.status(200).json(data);
  } catch (error) {
    console.error('💥 Erro ao enviar mensagem:', error);
    res.status(500).send('Erro ao enviar mensagem.');
  }
});
