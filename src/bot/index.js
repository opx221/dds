import createBackend from './middlewares/backend';
import user from './middlewares/user';
import session from './middlewares/session';
import createBot from './createBot';

import scenes from './scenes';
import replyError from './repliers/error';

const backend = await createBackend();
const bot = await createBot();

bot
  .use(backend)
  .use(user())
  .use(session())
  .use(scenes())
  .catch(async (err, ctx) => {
    await replyError(ctx);
    console.log('failed with', err);
    throw err;
  })
  .launch();

console.log('Started!');
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
