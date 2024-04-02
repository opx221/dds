import { DEFAULT_MARKUP } from '../const';
import invalidInputPage from '../pages/invalidInput';

const replyInvalidInput = (ctx) => (
  ctx.reply(
    invalidInputPage(),
    DEFAULT_MARKUP,
  )
);

export default replyInvalidInput;
