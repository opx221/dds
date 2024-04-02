import photosPanel from '../../pages/vendorPage/photosPanel';
import assertDropOwner from '../../utils/assertDropOwner';

export default async (ctx) => {
  const { id } = ctx.request.query;
  const { photos } = ctx.backend;

  await assertDropOwner(ctx, id);
  const contents = await photos.getAllContentsByDropId(id);

  ctx.body = photosPanel({ contents });
};
