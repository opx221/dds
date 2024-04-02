export default async (ctx, dropId) => {
  const { userId } = ctx.state.user;
  const { drops, dropTypes } = ctx.backend;

  const drop = await drops.get(dropId);
  if (!drop) {
    throw new Error('dropId is invalid');
  }
  const dropType = await dropTypes.get(drop.drop_type_id);
  if (dropType.vendor_id !== userId) {
    throw new Error(`dropTypeId does not belong to ${userId}`);
  }
};
