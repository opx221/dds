import { expect } from '@jest/globals';
import fs from 'fs';

import createPhotos from '.';
import createUsers from '../Users';
import createTelegramUsers from '../TelegramUsers';
import createDropTypes from '../DropTypes';
import createDrops from '../Drops';
import createPool from '../createPool';

const content1 = fs.readFileSync('src/backend/utils/exif/res/Lake-min.jpg');
const content2 = fs.readFileSync('src/backend/utils/exif/res/Canon-min.jpg');
const purgedContent1 = fs.readFileSync('src/backend/utils/exif/res/Lake-min-purged.jpg');
const purgedContent2 = fs.readFileSync('src/backend/utils/exif/res/Canon-min-purged.jpg');

const createBackend = async () => {
  const pool = createPool();

  const users = await createUsers(pool);
  await createTelegramUsers(pool);
  const dropTypes = await createDropTypes(pool);
  const drops = await createDrops(pool);
  const photos = await createPhotos(pool);

  return {
    pool, users, dropTypes, drops, photos,
  };
};

test('getAllContentsByDropId', async () => {
  const {
    pool, users, dropTypes, drops, photos,
  } = await createBackend();

  const vendor_id = await users.getIdByName('admin');
  const drop_type_id = await dropTypes.create({
    name: 'Apple',
    descr: '3000% PURE !!!',
    unit: 'g',
    vendor_id,
  });

  const descr = 'under the mailbox @ 33.123456, 66.654321';
  const amount = 0.5;
  const drop_id = await drops.create({
    drop_type_id,
    descr,
    amount,
  });

  await photos.create({ drop_id, content: content1 });
  await photos.create({ drop_id, content: content2 });

  expect(
    await photos.getAllContentsByDropId(drop_id),
  ).toEqual([purgedContent1, purgedContent2]);

  await pool.end();
});

test('deleteByDropId', async () => {
  const {
    pool, users, dropTypes, drops, photos,
  } = await createBackend();

  const vendor_id = await users.getIdByName('admin');
  const drop_type_id = await dropTypes.create({
    name: 'Apple',
    descr: '3000% PURE !!!',
    unit: 'g',
    vendor_id,
  });

  const descr = 'under the mailbox @ 33.123456, 66.654321';
  const amount = 0.5;
  const drop_id = await drops.create({
    drop_type_id,
    descr,
    amount,
  });

  await photos.create({ drop_id, content: content1 });
  await photos.create({ drop_id, content: content2 });

  expect(
    await photos.getAllContentsByDropId(drop_id),
  ).toEqual([purgedContent1, purgedContent2]);

  await photos.deleteByDropId(drop_id);

  expect(await photos.getAllContentsByDropId(drop_id)).toEqual([]);

  await pool.end();
});

test('getAllContentsByDropTypeId', async () => {
  const {
    pool, users, dropTypes, photos,
  } = await createBackend();

  const vendor_id = await users.getIdByName('admin');
  const drop_type_id = await dropTypes.create({
    name: 'Apple',
    descr: '3000% PURE !!!',
    unit: 'g',
    vendor_id,
  });

  await photos.create({ drop_type_id, content: content1 });
  await photos.create({ drop_type_id, content: content2 });

  expect(
    await photos.getAllContentsByDropTypeId(drop_type_id),
  ).toEqual([purgedContent1, purgedContent2]);

  await pool.end();
});

test('deleteByDropTypeId', async () => {
  const {
    pool, users, dropTypes, photos,
  } = await createBackend();

  const vendor_id = await users.getIdByName('admin');
  const drop_type_id = await dropTypes.create({
    name: 'Apple',
    descr: '3000% PURE !!!',
    unit: 'g',
    vendor_id,
  });

  await photos.create({ drop_type_id, content: content1 });
  await photos.create({ drop_type_id, content: content2 });

  expect(
    await photos.getAllContentsByDropTypeId(drop_type_id),
  ).toEqual([purgedContent1, purgedContent2]);

  await photos.deleteByDropTypeId(drop_type_id);

  expect(await photos.getAllContentsByDropTypeId(drop_type_id)).toEqual([]);

  await pool.end();
});

test('create errors if drop_id and drop_type_id is false', async () => {
  const {
    pool, photos,
  } = await createBackend();

  expect(photos.create({ content: content1 })).rejects.toThrow();

  await pool.end();
});
