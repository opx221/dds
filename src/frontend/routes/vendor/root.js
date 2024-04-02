import vendorPage from '../../pages/vendorPage';

export default async (ctx) => {
  const { userId } = ctx.state.user;
  const { dropTypes, drops, users } = ctx.backend;

  const allDropTypes = await dropTypes.getAllByVendor(userId);
  const allDrops = await drops.getAllByVendor(userId);
  const withdrawAddress = await users.getWithdrawAddress(userId);

  ctx.body = await vendorPage({ allDropTypes, allDrops, withdrawAddress });
};
