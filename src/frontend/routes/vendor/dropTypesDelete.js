import assertDropTypeOwner from '../../utils/assertDropTypeOwner';

export default async (ctx) => {
  const { id } = ctx.request.body;
  const { dropTypes, drops, photos } = ctx.backend;

  await assertDropTypeOwner(ctx, id);
  const allAssociatedDrops = await drops.getAllByDropType(id);
  if (allAssociatedDrops.length !== 0) {
    ctx.body = 'Please delete all associated drops first';
    return;
  }
  await photos.deleteByDropTypeId(id);
  await dropTypes.delete(id);

  ctx.redirect('/vendor');
};
