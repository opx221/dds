import { DEFAULT_MARKUP } from '../const';
import errorPage from '../pages/error';

const replyError = (ctx) => (
  ctx.reply(
    errorPage(),
    DEFAULT_MARKUP,
  )
);

export default replyError;
