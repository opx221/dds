/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { DEFAULT_MARKUP } from '../const';
import successPage from '../pages/success';

const replySuccess = (
  async (ctx, { photoContents, drop }) => {
    for (const content of photoContents) {
      await ctx.replyWithPhoto({ source: content });
    }
    return ctx.reply(
      successPage({ drop }),
      DEFAULT_MARKUP,
    );
  }
);

export default replySuccess;
