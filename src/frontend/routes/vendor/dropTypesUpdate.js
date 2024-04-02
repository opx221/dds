import assertDropTypeOwner from '../../utils/assertDropTypeOwner';
import textInputToNumber from '../../utils/textInputToNumber';

export default async (ctx) => {
  const { amountPricePairs, id } = ctx.request.body;
  const { dropTypes } = ctx.backend;

  await assertDropTypeOwner(ctx, id);
  await dropTypes.setAmountPricePairs(
    id,
    amountPricePairs.map((pair) => pair.map(textInputToNumber)),
  );

  ctx.redirect('/vendor');
};
