/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { Photos } from '../../../backend/Photos';
import { Drops } from '../../../backend/Drops';
import assertDropTypeOwner from '../../utils/assertDropTypeOwner';
import textInputToNumber from '../../utils/textInputToNumber';

export default async (ctx) => {
  const { files } = ctx.request;
  const { dropTypeId, descr, amount: u_amount } = ctx.request.body;
  const { pool } = ctx.backend;

  await assertDropTypeOwner(ctx, dropTypeId);

  const amount = textInputToNumber(u_amount);
  if (amount === null) {
    ctx.body = 'Amount is not a valid number';
    return;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const dropId = await Drops.create(
      client,
      { drop_type_id: dropTypeId, amount, descr },
    );

    for (const photo of files.photos) {
      await Photos.create(
        client,
        { drop_id: dropId, content: photo.buffer },
      );
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  ctx.redirect('/vendor');
};
