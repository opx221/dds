/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { Photos } from '../../../backend/Photos';
import { DropTypes } from '../../../backend/DropTypes';

export default async (ctx) => {
  const { files } = ctx.request;
  const { name, descr, unit: u_unit } = ctx.request.body;
  const { userId } = ctx.state.user;
  const { pool } = ctx.backend;

  const unit = u_unit.trim();
  if (!unit) { throw new Error('Invalid unit'); }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const dropTypeId = await DropTypes.create(
      client,
      {
        vendor_id: userId, name, unit, descr,
      },
    );

    for (const photo of files.photos) {
      await Photos.create(
        client,
        { drop_type_id: dropTypeId, content: photo.buffer },
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
