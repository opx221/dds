import textInputToNumber from '../../utils/textInputToNumber';

export default async (ctx) => {
  const { id, split, floorPrice } = ctx.request.body;
  const { dropTypes } = ctx.backend;

  await dropTypes.setSplitAndFloorPrice(
    id,
    textInputToNumber(split),
    textInputToNumber(floorPrice),
  );

  ctx.redirect('/admin');
};
