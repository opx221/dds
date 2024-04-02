import createUsers from '../Users';
import createDropTypes from '.';
import createDrops from '../Drops';
import createPool from '../createPool';
import createTelegramUsers from '../TelegramUsers';
import Role from '../Users/Role';
import { SPLIT_DEFAULT } from '../../const';

const createBackend = async () => {
  const pool = createPool();
  const tgUsers = await createTelegramUsers(pool);
  await tgUsers.create({ id: '123', username: '123', payment_id: '123' });

  const users = await createUsers(pool);
  const dropTypes = await createDropTypes(pool);
  const drops = await createDrops(pool);

  return {
    pool, users, dropTypes, drops,
  };
};

const expectDefaults = {
  amount_price_pairs: [],
  split: SPLIT_DEFAULT,
  floor_price: 0,
};

test('getAllByVendor', async () => {
  const { pool, users, dropTypes } = await createBackend();

  const vendor_id = await users.getIdByName('admin');
  const name = 'Apple';
  const descr = '3000% PURE !!!';
  const unit = 'g';
  const id = await dropTypes.create({
    name,
    vendor_id,
    descr,
    unit,
  });

  expect(await dropTypes.getAllByVendor(vendor_id)).toEqual([
    {
      id,
      name,
      vendor_id,
      descr,
      unit,
      ...expectDefaults,
    },
  ]);

  await pool.end();
});

test('getAllByVendor with 2 vendors', async () => {
  const { pool, users, dropTypes } = await createBackend();

  const vendor_1_id = await users.create({ name: 'vendy1', role: Role.Vendor });
  const drop_type_1 = {
    name: 'Apple',
    descr: '3000% PURE !!!',
    unit: 'g',
  };
  const drop_type_1_id = await dropTypes.create({
    vendor_id: vendor_1_id,
    name: drop_type_1.name,
    descr: drop_type_1.descr,
    unit: drop_type_1.unit,
  });

  const vendor_2_id = await users.create({ name: 'vendy2', role: Role.Vendor });
  const drop_type_2 = {
    name: 'Pear',
    descr: 'lucky lu !!!',
    unit: 'g',
  };
  const drop_type_2_id = await dropTypes.create({
    vendor_id: vendor_2_id,
    name: drop_type_2.name,
    descr: drop_type_2.descr,
    unit: drop_type_2.unit,
  });

  expect(await dropTypes.getAllByVendor(vendor_1_id)).toEqual([
    {
      id: drop_type_1_id,
      name: drop_type_1.name,
      vendor_id: vendor_1_id,
      descr: drop_type_1.descr,
      unit: drop_type_1.unit,
      ...expectDefaults,
    },
  ]);
  expect(await dropTypes.getAllByVendor(vendor_2_id)).toEqual([
    {
      id: drop_type_2_id,
      name: drop_type_2.name,
      vendor_id: vendor_2_id,
      descr: drop_type_2.descr,
      unit: drop_type_2.unit,
      ...expectDefaults,
    },
  ]);

  await pool.end();
});

test('getAllByVendor empty', async () => {
  const { pool, dropTypes } = await createBackend();

  const vendor_id = '221fd438-ba70-4927-ac3c-9fb00c8dfb43';
  expect(await dropTypes.getAllByVendor(vendor_id)).toEqual([]);

  await pool.end();
});

test('delete', async () => {
  const { pool, users, dropTypes } = await createBackend();

  const vendor_id = await users.getIdByName('admin');
  const name = 'Apple';
  const descr = '3000% PURE !!!';
  const unit = 'g';
  const id = await dropTypes.create({
    name,
    vendor_id,
    descr,
    unit,
  });

  expect(await dropTypes.getAllByVendor(vendor_id)).toEqual([
    {
      id,
      name,
      vendor_id,
      descr,
      unit,
      ...expectDefaults,
    },
  ]);

  await dropTypes.delete(id);

  expect(await dropTypes.getAllByVendor(vendor_id)).toEqual([]);

  await pool.end();
});

test('setAmountPricePairs', async () => {
  const { pool, users, dropTypes } = await createBackend();

  const vendor_id = await users.getIdByName('admin');
  const name = 'Apple';
  const descr = '3000% PURE !!!';
  const unit = 'g';
  const id = await dropTypes.create({
    name,
    vendor_id,
    descr,
    unit,
  });

  const amountPricePairs = [
    [0.5, 75],
    [1, 100],
    [2, 180],
    [5, 300],
  ];
  await dropTypes.setAmountPricePairs(id, amountPricePairs);

  expect(await dropTypes.getAllByVendor(vendor_id)).toEqual([
    {
      id,
      name,
      vendor_id,
      descr,
      unit,
      amount_price_pairs: amountPricePairs,
      split: SPLIT_DEFAULT,
      floor_price: 0,
    },
  ]);

  await pool.end();
});

test('get', async () => {
  const { pool, users, dropTypes } = await createBackend();

  const vendor_id = await users.getIdByName('admin');
  const name = 'Apple';
  const descr = '3000% PURE !!!';
  const unit = 'g';
  const id = await dropTypes.create({
    name,
    vendor_id,
    descr,
    unit,
  });

  expect(await dropTypes.get(id)).toEqual({
    id,
    name,
    vendor_id,
    descr,
    unit,
    ...expectDefaults,
  });

  await dropTypes.delete(id);

  expect(await dropTypes.getAllByVendor(vendor_id)).toEqual([]);

  await pool.end();
});

test('getAll', async () => {
  const {
    pool, users, dropTypes, drops,
  } = await createBackend();

  const vendor_id = await users.getIdByName('admin');
  const name = 'Apple';
  const descr = '3000% PURE !!!';
  const unit = 'g';
  const drop_type_id = await dropTypes.create({
    name,
    vendor_id,
    descr,
    unit,
  });

  const amountPricePairs = [
    [0.5, 75],
    [1, 100],
    [2, 180],
    [5, 300],
  ];
  await dropTypes.setAmountPricePairs(drop_type_id, amountPricePairs);

  await drops.create({
    descr: 'under the mailbox @ 33.123456, 66.654321',
    amount: 0.5,
    drop_type_id,
  });
  await drops.create({
    descr: 'under the mailbox @ 33.123456, 66.654321',
    amount: 0.5,
    drop_type_id,
  });

  expect(await dropTypes.getAll()).toEqual([
    {
      id: drop_type_id,
      amount_price_pairs: amountPricePairs,
      vendor_name: 'admin',
      split: SPLIT_DEFAULT,
      floor_price: 0,
      name,
      vendor_id,
      descr,
      unit,
    },
  ]);

  await pool.end();
});

test('setSplitAndFloorPrice', async () => {
  const { pool, users, dropTypes } = await createBackend();

  const vendor_id = await users.getIdByName('admin');
  const name = 'Apple';
  const descr = '3000% PURE !!!';
  const unit = 'g';
  const id = await dropTypes.create({
    name,
    vendor_id,
    descr,
    unit,
  });

  expect(await dropTypes.getAllByVendor(vendor_id)).toEqual([
    {
      id,
      name,
      vendor_id,
      descr,
      unit,
      amount_price_pairs: [],
      split: SPLIT_DEFAULT,
      floor_price: 0,
    },
  ]);

  await dropTypes.setSplitAndFloorPrice(id, 10, 50);
  expect(await dropTypes.getAllByVendor(vendor_id)).toEqual([
    {
      id,
      name,
      vendor_id,
      descr,
      unit,
      amount_price_pairs: [],
      split: 10,
      floor_price: 50,
    },
  ]);

  await dropTypes.setSplitAndFloorPrice(id, 5, 0);
  expect(await dropTypes.getAllByVendor(vendor_id)).toEqual([
    {
      id,
      name,
      vendor_id,
      descr,
      unit,
      amount_price_pairs: [],
      split: 5,
      floor_price: 0,
    },
  ]);

  await pool.end();
});

test('getAllAvailable', async () => {
  const {
    pool, users, dropTypes, drops,
  } = await createBackend();

  const vendor_name = 'admin';
  const vendor_id = await users.getIdByName(vendor_name);
  const name = 'Apple';
  const descr = '3000% PURE !!!';
  const unit = 'g';
  const drop_type_id = await dropTypes.create({
    name,
    vendor_id,
    descr,
    unit,
  });

  const amountPricePairs = [
    [0.5, 75],
    [1, 100],
    [2, 180],
    [5, 300],
  ];
  await dropTypes.setAmountPricePairs(drop_type_id, amountPricePairs);

  await drops.create({
    descr: 'under the mailbox @ 33.123456, 66.654321',
    amount: 0.5,
    drop_type_id,
  });
  await drops.create({
    descr: 'under the mailbox @ 33.123456, 66.654321',
    amount: 0.5,
    drop_type_id,
  });

  expect(await dropTypes.getAllAvailable()).toEqual([
    {
      id: drop_type_id,
      amount_price_pairs: amountPricePairs,
      split: SPLIT_DEFAULT,
      floor_price: 0,
      name,
      vendor_id,
      vendor_name,
      descr,
      unit,
    },
  ]);

  await pool.end();
});

test('getAllAvailable with an unavailable drop', async () => {
  const {
    pool, users, dropTypes, drops,
  } = await createBackend();

  const vendor_name = 'admin';
  const vendor_id = await users.getIdByName(vendor_name);
  const name = 'Apple';
  const descr = '3000% PURE !!!';
  const unit = 'g';
  const drop_type_id = await dropTypes.create({
    name,
    vendor_id,
    descr,
    unit,
  });

  const amountPricePairs = [
    [0.5, 75],
    [1, 100],
    [2, 180],
    [5, 300],
  ];
  await dropTypes.setAmountPricePairs(drop_type_id, amountPricePairs);

  const dropId = await drops.create({
    descr: 'under the mailbox @ 33.123456, 66.654321',
    amount: 0.5,
    drop_type_id,
  });

  expect(await dropTypes.getAllAvailable()).toEqual([
    {
      id: drop_type_id,
      amount_price_pairs: amountPricePairs,
      split: SPLIT_DEFAULT,
      floor_price: 0,
      name,
      vendor_id,
      vendor_name,
      descr,
      unit,
    },
  ]);

  await drops.setBuyerId(dropId, '123');

  expect(await dropTypes.getAllAvailable()).toEqual([]);

  await pool.end();
});
