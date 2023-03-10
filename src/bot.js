const { Telegraf } = require('telegraf');
const cron = require('node-cron');
const { Scrapper, URL } = require('./scrapper');

require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.catch((err, ctx) => {
  console.error(`Ooops, encountered an error for ${ctx.updateType}`, err);
});

bot.start(ctx => {
  ctx.reply('Bienvenid@ a CARTELERA-BOT ๐ค\n\nEl bot te enviarรก la cartelera todos los jueves para que no te pierdas ninguna peli\n\nAccionรก /help para obtener el listado de comandos ๐');
  cron.schedule('0 0 12 * * thursday', async () => {
    await Scrapper.getCinemaListing()
    .then(movies => {
      const date = new Date;
      const [month, day] = [date.getMonth(), date.getDate()];
      const formatMovies = movies?.map(movie => `๐๐ป ${movie}\n`);

      ctx.replyWithHTML(`<b> CARTELERA ${day}/${month + 1}</b> \n\n${formatMovies.join('')}`);
    })
    .catch(err => {
      console.error(`Error message: ${err}`);
    });
  });
});

bot.help(ctx => {
  ctx.replyWithHTML(`<b>Comandos</b> \n\n๐๐ป /start - comenzar el bot\n๐๐ป /help - ayuda\n๐๐ป /cartelera - obtener la cartelera actual de los cines`);
});

bot.command('cartelera', async ctx => {
  await Scrapper.getCinemaListing()
  .then(movies => {
    const date = new Date;
    const [month, day] = [date.getMonth(), date.getDate()];

    const formatMovies = movies?.map(movie => `๐๐ป ${movie}\n`);

    ctx.replyWithHTML(`<b> CARTELERA ${day}/${month + 1}</b> \n\n${formatMovies.join('')}`);
  })
  .catch(err => {
    console.error(`Error message: ${err}`);
  });
});

module.exports = bot;
