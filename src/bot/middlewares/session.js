import { Composer, session } from 'telegraf';

import ExpiryMap from 'expiry-map';

const TTL = 2 * 60 * 60 * 1000;
export default () => {
  const bot = new Composer();

  bot.use(session({
    store: new ExpiryMap(TTL),
  }));
  bot.use((ctx, next) => {
    ctx.session ??= {};
    return next();
  });

  return bot;
};
