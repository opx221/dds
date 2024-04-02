import photosPanel from '../../pages/vendorPage/photosPanel';
import assertDropTypeOwner from '../../utils/assertDropTypeOwner';

export default async (ctx) => {
  const { id } = ctx.request.query;
  const { photos } = ctx.backend;

  await assertDropTypeOwner(ctx, id);
  const contents = await photos.getAllContentsByDropTypeId(id);

  ctx.body = photosPanel({ contents });
};
