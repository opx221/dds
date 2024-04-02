/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import amountsPage from '../pages/amounts';
import formatAmounts from '../utils/formatAmounts';

const replyAmounts = (
  async (ctx, { dropType, amounts, photoContents }) => {
    for (const content of photoContents) {
      await ctx.replyWithPhoto({ source: content });
    }
    return ctx.reply(
      amountsPage({ dropType, amounts }),
      {
        reply_markup: {
          keyboard: [
            ...(
              formatAmounts({
                amounts,
                amountPricePairs: dropType.amount_price_pairs,
                unit: dropType.unit,
              }).map((text) => [text])
            ),
            ['/list - back'],
          ],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      },
    );
  }
);

export default replyAmounts;
