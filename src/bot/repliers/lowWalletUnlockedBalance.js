import { DEFAULT_MARKUP } from '../const';
import lowWalletUnlockedBalancePage from '../pages/lowWalletUnlockedBalance';

const replyLowWalletUnlockedBalance = (ctx) => (
  ctx.reply(
    lowWalletUnlockedBalancePage(),
    DEFAULT_MARKUP,
  )
);

export default replyLowWalletUnlockedBalance;
