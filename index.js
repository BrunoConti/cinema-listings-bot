const express = require('express');
const cors = require('cors');
const bot = require('./src/bot');

require('dotenv').config();
const PORT = process.env.PORT || 8000;

if(process.env.ENVIRONMENT === 'Production') {
  const app = express();
  app.use(cors());
  
  bot.telegram.setWebhook(`${process.env.DOMAIN}/`);
  app.use(bot.webhookCallback('/'));

  app.get('/', (_req, res) => {
    res.send('🎬 CARTELERA BOT 🎬')
  });

  app.post(`/`, async (req, res) => await bot.handleUpdate(req.body, res));

  app.listen(PORT, () => {
    console.log('listening on port', PORT);
  });

} else {
  bot.launch();
}
