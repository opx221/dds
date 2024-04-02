import { Composer } from 'telegraf';
import replyStart from '../repliers/start';

export default () => {
  const bot = new Composer();

  bot.start(replyStart);

  return bot;
};
