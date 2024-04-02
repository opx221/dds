export default async (ctx, dropTypeId) => {
  const { userId } = ctx.state.user;
  const { dropTypes } = ctx.backend;

  const dropType = await dropTypes.get(dropTypeId);
  if (!dropType) {
    throw new Error('dropTypeId is invalid');
  }
  if (dropType.vendor_id !== userId) {
    throw new Error(`dropTypeId does not belong to ${userId}`);
  }
};
