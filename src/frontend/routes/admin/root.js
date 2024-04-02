import adminPage from '../../pages/adminPage';

export default async (ctx) => {
  const { users, tgUsers, dropTypes } = ctx.backend;
  const { userId } = ctx.state.user;

  const allUsers = await users.getAll();
  const allTgUsers = await tgUsers.getAll();
  const withdrawAddress = await users.getWithdrawAddress(userId);
  const allDropTypes = await dropTypes.getAll();

  ctx.body = await adminPage({
    allUsers, allTgUsers, allDropTypes, withdrawAddress,
  });
};
