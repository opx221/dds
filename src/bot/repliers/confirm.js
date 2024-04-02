import confirmPage from '../pages/confirm';

const replyConfirm = (
  (ctx, { dropTypeIndex, dropType, amount }) => (
    ctx.reply(
      confirmPage({ dropType, amount }),
      {
        reply_markup: {
          keyboard: [
            ['/confirm'],
            [`/${dropTypeIndex} - back`],
          ],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      },
    )
  )
);

export default replyConfirm;
