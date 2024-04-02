import genPaymentId from '../utils/genPaymentId';

const user = () => async (ctx, next) => {
  const { tgUsers } = ctx.backend;
  const id = `${ctx.from.id}`;
  const { username = null } = ctx.from;

  const tgUser = await tgUsers.get(id);
  if (!tgUser) {
    const paymentId = genPaymentId(id);

    await tgUsers.create({
      id,
      username,
      payment_id: paymentId,
    });
  } else if (tgUser.username !== username) {
    await tgUsers.setUsername(id, username);
  }

  return next();
};

export default user;
