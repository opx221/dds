import aboutPage from '../pages/about';

const replyStart = (ctx) => (
  ctx.reply(
    aboutPage(),
    {
      link_preview_options: {
        is_disabled: true,
      },
      reply_markup: {
        keyboard: [
          [
            '/wallet',
            '/list',
          ],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    },
  )
);

export default replyStart;
