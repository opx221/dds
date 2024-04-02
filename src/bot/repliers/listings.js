import listingsPage from '../pages/listings';

const replyListings = (
  (ctx, { allDropTypes }) => (
    ctx.reply(
      listingsPage({ allDropTypes }),
      {
        reply_markup: {
          keyboard: [
            ...(
              allDropTypes
                .map(
                  ({ name, vendor_name }, i) => (
                    `/${i + 1} ${name} by ${vendor_name}`
                  ),
                )
                .map((text) => [text])
            ),
            ['/start - back'],
          ],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      },
    )
  )
);

export default replyListings;
