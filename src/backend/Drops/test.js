import createUsers from '../Users';
import createDropTypes from '../DropTypes';
import createTelegramUsers from '../TelegramUsers';
import createDrops from '.';
import createPool from '../createPool';
import Role from '../Users/Role';

const createBackend = async () => {
  const pool = createPool();
  const tgUsers = await createTelegramUsers(pool);
  await tgUsers.create({ id: '123', username: 'mr_user', payment_id: '123' });

  const users = await createUsers(pool);
  const dropTypes = await createDropTypes(pool);
  const drops = await createDrops(pool);

  return {
    pool, users, dropTypes, drops,
  };
};

test('getAllByVendor', async () => {
  const {
    pool, users, dropTypes, drops,
  } = await createBackend();

  const vendor_id = await users.getIdByName('admin');
  const drop_type_id = await dropTypes.create({
    name: 'Apple',
    unit: 'g',
    descr: '3000% PURE !!!',
    vendor_id,
  });

  const descr = 'under the mailbox @ 33.123456, 66.654321';
  const amount = 0.5;
  const drop_id = await drops.create({
    drop_type_id,
    descr,
    amount,
  });

  expect(await drops.getAllByVendor(vendor_id)).toEqual([
    {
      id: drop_id,
      descr,
      amount,
      buyer_id: null,
      buyer_username: null,
      txid: null,
      drop_type_id,
    },
  ]);

  await pool.end();
});

test('getAllByVendor with 2 vendors', async () => {
  const {
    pool, users, dropTypes, drops,
  } = await createBackend();

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

  const drop_1 = {
    descr: 'under the mailbox @ 33.123456, 66.654321',
    amount: 0.5,
  };
  const drop_1_id = await drops.create({
    drop_type_id: drop_type_1_id,
    descr: drop_1.descr,
    amount: drop_1.amount,
  });
  const drop_2 = {
    descr: 'under the mailbox @ 66.654321, 33.123456',
    amount: 100,
  };
  const drop_2_id = await drops.create({
    drop_type_id: drop_type_2_id,
    descr: drop_2.descr,
    amount: drop_2.amount,
  });

  expect(await drops.getAllByVendor(vendor_1_id)).toEqual([
    {
      id: drop_1_id,
      descr: drop_1.descr,
      amount: drop_1.amount,
      buyer_id: null,
      buyer_username: null,
      txid: null,
      drop_type_id: drop_type_1_id,
    },
  ]);
  expect(await drops.getAllByVendor(vendor_2_id)).toEqual([
    {
      id: drop_2_id,
      descr: drop_2.descr,
      amount: drop_2.amount,
      buyer_id: null,
      buyer_username: null,
      txid: null,
      drop_type_id: drop_type_2_id,
    },
  ]);

  await pool.end();
});

test('getAllByVendor with 2 drops', async () => {
  const {
    pool, users, dropTypes, drops,
  } = await createBackend();

  const vendor_id = await users.getIdByName('admin');
  const drop_type_id = await dropTypes.create({
    name: 'Apple',
    unit: 'g',
    descr: '3000% PURE !!!',
    vendor_id,
  });

  const descr = 'under the mailbox @ 33.123456, 66.654321';
  const amount = 0.5;
  const drop1Id = await drops.create({
    drop_type_id,
    descr,
    amount,
  });
  const drop2Id = await drops.create({
    drop_type_id,
    descr,
    amount,
  });

  expect(await drops.getAllByVendor(vendor_id)).toEqual([
    {
      id: drop1Id,
      descr,
      amount,
      buyer_id: null,
      buyer_username: null,
      txid: null,
      drop_type_id,
    },
    {
      id: drop2Id,
      descr,
      amount,
      buyer_id: null,
      buyer_username: null,
      txid: null,
      drop_type_id,
    },
  ]);

  await pool.end();
});

test('getAllByVendor empty', async () => {
  const { pool, drops } = await createBackend();

  const vendor_id = '221fd438-ba70-4927-ac3c-9fb00c8dfb43';
  expect(await drops.getAllByVendor(vendor_id)).toEqual([]);

  await pool.end();
});

test('delete', async () => {
  const {
    pool, users, dropTypes, drops,
  } = await createBackend();

  const vendor_id = await users.getIdByName('admin');
  const drop_type_id = await dropTypes.create({
    name: 'Apple',
    unit: 'g',
    descr: '3000% PURE !!!',
    vendor_id,
  });

  const descr = 'under the mailbox @ 33.123456, 66.654321';
  const amount = 0.5;
  const drop_id = await drops.create({
    drop_type_id,
    descr,
    amount,
  });

  expect(await drops.getAllByVendor(vendor_id)).toEqual([
    {
      id: drop_id,
      descr,
      amount,
      buyer_id: null,
      buyer_username: null,
      txid: null,
      drop_type_id,
    },
  ]);

  await drops.delete(drop_id);

  expect(await drops.getAllByVendor(vendor_id)).toEqual([]);

  await pool.end();
});

test('setBuyerId', async () => {
  const {
    pool, users, dropTypes, drops,
  } = await createBackend();

  const vendor_id = await users.getIdByName('admin');
  const drop_type_id = await dropTypes.create({
    name: 'Apple',
    unit: 'g',
    descr: '3000% PURE !!!',
    vendor_id,
  });

  const descr = 'under the mailbox @ 33.123456, 66.654321';
  const amount = 0.5;
  const drop_id = await drops.create({
    drop_type_id,
    descr,
    amount,
  });

  expect(await drops.getAllByVendor(vendor_id)).toEqual([
    {
      id: drop_id,
      descr,
      amount,
      buyer_id: null,
      buyer_username: null,
      txid: null,
      drop_type_id,
    },
  ]);

  await drops.setBuyerId(drop_id, '123');

  expect(await drops.getAllByVendor(vendor_id)).toEqual([
    {
      id: drop_id,
      descr,
      amount,
      buyer_id: '123',
      buyer_username: 'mr_user',
      txid: null,
      drop_type_id,
    },
  ]);

  await pool.end();
});

test('setBuyerId throws', async () => {
  const {
    pool, users, dropTypes, drops,
  } = await createBackend();

  const vendor_id = await users.getIdByName('admin');
  const drop_type_id = await dropTypes.create({
    name: 'Apple',
    unit: 'g',
    descr: '3000% PURE !!!',
    vendor_id,
  });

  const descr = 'under the mailbox @ 33.123456, 66.654321';
  const amount = 0.5;
  const drop_id = await drops.create({
    drop_type_id,
    descr,
    amount,
  });

  expect(await drops.getAllByVendor(vendor_id)).toEqual([
    {
      id: drop_id,
      descr,
      amount,
      buyer_id: null,
      buyer_username: null,
      txid: null,
      drop_type_id,
    },
  ]);

  await drops.setBuyerId(drop_id, '123');
  await expect(drops.setBuyerId(drop_id, '123')).rejects.toThrow();

  await pool.end();
});

test('setTXID', async () => {
  const {
    pool, users, dropTypes, drops,
  } = await createBackend();

  const txid = 'abcdef';
  const vendor_id = await users.getIdByName('admin');
  const drop_type_id = await dropTypes.create({
    name: 'Apple',
    unit: 'g',
    descr: '3000% PURE !!!',
    vendor_id,
  });

  const descr = 'under the mailbox @ 33.123456, 66.654321';
  const amount = 0.5;
  const drop_id = await drops.create({
    drop_type_id,
    descr,
    amount,
  });

  expect(await drops.get(drop_id)).toEqual({
    id: drop_id,
    descr,
    amount,
    buyer_id: null,
    txid: null,
    drop_type_id,
  });

  await drops.setTXID(drop_id, txid);

  expect(await drops.get(drop_id)).toEqual({
    id: drop_id,
    descr,
    amount,
    buyer_id: null,
    txid,
    drop_type_id,
  });

  await pool.end();
});

test('get', async () => {
  const {
    pool, users, dropTypes, drops,
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

  expect(await drops.get(drop_id)).toEqual({
    id: drop_id,
    descr,
    amount,
    buyer_id: null,
    txid: null,
    drop_type_id,
  });

  const invalid_drop_id = '000a7369-5d1d-499a-9825-16115342117a';
  expect(await drops.get(invalid_drop_id)).toBeUndefined();

  await pool.end();
});

test('getAvailableByAmountAndDropType', async () => {
  const {
    pool, users, dropTypes, drops,
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

  expect(await drops.getAvailableByAmountAndDropType({ amount, drop_type_id })).toEqual({
    id: drop_id,
    descr,
    amount,
    buyer_id: null,
    txid: null,
    drop_type_id,
  });

  expect(
    await drops.getAvailableByAmountAndDropType({ amount: 4, drop_type_id }),
  ).toBeUndefined();

  await drops.setBuyerId(drop_id, '123');

  expect(
    await drops.getAvailableByAmountAndDropType({ amount, drop_type_id }),
  ).toBeUndefined();

  await pool.end();
});

test('getAllByDropType', async () => {
  const {
    pool, users, dropTypes, drops,
  } = await createBackend();

  const vendor_id = await users.getIdByName('admin');
  const drop_type_id = await dropTypes.create({
    name: 'Apple',
    unit: 'g',
    descr: '3000% PURE !!!',
    vendor_id,
  });

  const descr = 'under the mailbox @ 33.123456, 66.654321';
  const amount = 0.5;
  const drop_id = await drops.create({
    drop_type_id,
    descr,
    amount,
  });

  expect(await drops.getAllByDropType(drop_type_id)).toEqual([
    {
      id: drop_id,
      descr,
      amount,
      buyer_id: null,
      txid: null,
      drop_type_id,
    },
  ]);

  await pool.end();
});

test('getAllAvailableDropTypeAmounts', async () => {
  const {
    pool, users, dropTypes, drops,
  } = await createBackend();

  const vendor_id = await users.getIdByName('admin');
  const drop_type_id = await dropTypes.create({
    name: 'Apple',
    unit: 'g',
    descr: '3000% PURE !!!',
    vendor_id,
  });

  const descr = 'under the mailbox @ 33.123456, 66.654321';
  const amounts = [0.5, 1];
  await drops.create({
    drop_type_id,
    descr,
    amount: amounts[0],
  });
  await drops.create({
    drop_type_id,
    descr,
    amount: amounts[0],
  });
  await drops.create({
    drop_type_id,
    descr,
    amount: amounts[1],
  });

  expect(
    await drops.getAllAvailableDropTypeAmounts(drop_type_id),
  ).toEqual(amounts);

  await pool.end();
});

test('getAllAvailableDropTypeAmounts with unavailable drops', async () => {
  const {
    pool, users, dropTypes, drops,
  } = await createBackend();

  const vendor_id = await users.getIdByName('admin');
  const drop_type_id = await dropTypes.create({
    name: 'Apple',
    unit: 'g',
    descr: '3000% PURE !!!',
    vendor_id,
  });

  const descr = 'under the mailbox @ 33.123456, 66.654321';
  const amounts = [0.5, 1];
  const drop1Id = await drops.create({
    drop_type_id,
    descr,
    amount: amounts[0],
  });
  await drops.create({
    drop_type_id,
    descr,
    amount: amounts[0],
  });
  const drop2Id = await drops.create({
    drop_type_id,
    descr,
    amount: amounts[1],
  });

  await drops.setBuyerId(drop1Id, '123');
  await drops.setBuyerId(drop2Id, '123');

  expect(
    await drops.getAllAvailableDropTypeAmounts(drop_type_id),
  ).toEqual([amounts[0]]);

  await pool.end();
});
