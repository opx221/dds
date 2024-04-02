import { Composer } from 'telegraf';

import start from './start';
import wallet from './wallet';
import shop from './shop';
import unknownCommand from './unknownCommand';

export default () => {
  const bot = new Composer();

  bot.use(start());
  bot.use(wallet());
  bot.use(shop());
  bot.use(unknownCommand());

  return bot;
};
