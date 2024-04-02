import { Composer } from 'telegraf';
import walletPage from '../pages/wallet';
import getWalletData from '../utils/getWalletData';
import createQr from '../utils/createQr';
import { DEFAULT_MARKUP } from '../const';

export default () => {
  const bot = new Composer();

  bot.command('wallet', async (ctx) => {
    const { tgUsers } = ctx.backend;
    const id = `${ctx.from.id}`;

    const { balance, address } = await getWalletData({ tgUsers, id });

    await ctx.replyWithPhoto({ source: createQr(address) });
    await ctx.reply(
      walletPage({ balance, address }),
      DEFAULT_MARKUP,
    );
  });

  return bot;
};
