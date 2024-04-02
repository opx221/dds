import { Composer } from 'telegraf';

import unknownCommandPage from '../pages/unknownCommand';
import getMessageOrType from '../utils/getMessageOrType';
import { DEFAULT_MARKUP } from '../const';

export default () => {
  const bot = new Composer();

  bot.on('message', (ctx) => {
    const { message } = ctx;
    console.log(`Unknown command: ${getMessageOrType(message)}`);

    return ctx.reply(
      unknownCommandPage(),
      DEFAULT_MARKUP,
    );
  });

  return bot;
};
