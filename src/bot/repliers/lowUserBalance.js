import lowUserBalancePage from '../pages/lowUserBalance';
import { DEFAULT_MARKUP } from '../const';

const replyLowUserBalance = (ctx, { price }) => (
  ctx.reply(
    lowUserBalancePage({ price }),
    {
      link_preview_options: {
        is_disabled: true,
      },
      ...DEFAULT_MARKUP,
    },
  )
);

export default replyLowUserBalance;
