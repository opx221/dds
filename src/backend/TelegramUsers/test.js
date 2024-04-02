import createTelegramUsers from '.';
import createPool from '../createPool';

test('get nonexistent user', async () => {
  const tgUsers = await createTelegramUsers();

  const id = '123123123';
  expect(await tgUsers.get(id)).toBeUndefined();

  const paymentId = 'abcdef123456';
  expect(await tgUsers.getIdByPaymentId(paymentId)).toBeUndefined();

  await tgUsers.destroy();
});

test('get existing user', async () => {
  const tgUsers = await createTelegramUsers();

  const id = '123123123';
  const username = 'myuser123';
  const paymentId = 'abcdef123456';
  await tgUsers.create({ id, username, payment_id: paymentId });

  expect(await tgUsers.get(id)).toEqual({
    id,
    username,
    payment_id: paymentId,
    balance: ['0', '0'],
  });

  await tgUsers.destroy();
});

test('get by payment id', async () => {
  const tgUsers = await createTelegramUsers();

  const id = '123123123';
  const username = 'myuser123';
  const paymentId = 'abcdef123456';
  await tgUsers.create({ id, username, payment_id: paymentId });

  expect(await tgUsers.getIdByPaymentId(paymentId)).toBe(id);

  await tgUsers.destroy();
});

test('negative balance', async () => {
  const pool = createPool();
  const client = await pool.connect();
  const tgUsers = await createTelegramUsers(client);
  // we use client to test this comprehensively
  // because erroring will terminate the session and cause
  // temporary tables to vanish

  const id = '123123123';
  const username = 'myuser123';
  const paymentId = 'abcdef123456';
  await tgUsers.create({ id, username, payment_id: paymentId });

  const amount = BigInt(5000);
  expect((await tgUsers.get(id)).balance).toEqual(['0', '0']);
  await expect(tgUsers.addBalance(id, [0, -amount])).rejects.toThrow(
    'new row for relation "telegram_users" violates check constraint "telegram_users_balance_check"',
  );
  expect((await tgUsers.get(id)).balance).toEqual(['0', '0']);

  await client.release();
  await pool.end();
});

test('add balance', async () => {
  const tgUsers = await createTelegramUsers();

  const id = '123123123';
  const username = 'myuser123';
  const paymentId = 'abcdef123456';
  await tgUsers.create({ id, username, payment_id: paymentId });

  const amount = BigInt(5000);
  await tgUsers.addBalance(id, [amount, 0]);
  expect((await tgUsers.get(id)).balance).toEqual(['5000', '0']);
  await tgUsers.addBalance(id, [-amount, amount]);
  expect((await tgUsers.get(id)).balance).toEqual(['0', '5000']);
  await tgUsers.addBalance(id, [0, -amount]);
  expect((await tgUsers.get(id)).balance).toEqual(['0', '0']);

  await tgUsers.destroy();
});

test('get all', async () => {
  const tgUsers = await createTelegramUsers();

  const id = '123123123';
  const username = 'myuser123';
  const paymentId = 'abcdef123456';
  await tgUsers.create({ id, username, payment_id: paymentId });

  expect(await tgUsers.getAll()).toEqual([{
    id,
    username,
    payment_id: paymentId,
    balance: ['0', '0'],
  }]);

  await tgUsers.destroy();
});

test('set username', async () => {
  const tgUsers = await createTelegramUsers();

  const id = '123123123';
  const username = 'myuser123';
  const paymentId = 'abcdef123456';
  await tgUsers.create({ id, username, payment_id: paymentId });

  const newUsername = 'myuser321';
  await tgUsers.setUsername(id, newUsername);
  expect((await tgUsers.get(id)).username).toEqual(newUsername);

  await tgUsers.destroy();
});
