import assertDropOwner from '../../utils/assertDropOwner';

export default async (ctx) => {
  const { id } = ctx.request.body;
  const { drops, photos } = ctx.backend;

  await assertDropOwner(ctx, id);
  await photos.deleteByDropId(id);
  await drops.delete(id);

  ctx.redirect('/vendor');
};
