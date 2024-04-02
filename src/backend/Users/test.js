import createUsers from '.';
import Role from './Role';

test('get nonexistent user', async () => {
  const users = await createUsers();

  expect(await users.getIdByName('sometnonexistent')).toBeUndefined();
  expect(await users.getTotpKey('221fd438-ba70-4927-ac3c-9fb00c8dfb43')).toBeUndefined();

  await users.destroy();
});

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
test('get admin', async () => {
  const users = await createUsers();

  const id = await users.getIdByName('admin');

  expect(id).toMatch(uuidRegex);
  expect(await users.getTotpKey(id)).toBeTruthy();
  expect(await users.getRole(id)).toBe(Role.Admin);
  expect(await users.getAll()).toEqual([{
    id,
    name: 'admin',
    role: Role.Admin,
    totp_key: await users.getTotpKey(id),
    withdraw_address: '',
  }]);

  await users.destroy();
});

test('create vendor and perform gets', async () => {
  const users = await createUsers();

  const adminId = await users.getIdByName('admin');
  const id = await users.create({ name: 'alfadropper123', role: Role.Vendor });

  expect(id).toMatch(uuidRegex);
  expect(await users.getIdByName('alfadropper123')).toBe(id);
  expect(await users.getTotpKey(id)).toBeTruthy();
  expect(await users.getRole(id)).toBe(Role.Vendor);
  expect(await users.getAll()).toEqual([
    {
      id: adminId,
      name: 'admin',
      role: Role.Admin,
      totp_key: await users.getTotpKey(adminId),
      withdraw_address: '',
    },
    {
      id,
      name: 'alfadropper123',
      role: Role.Vendor,
      totp_key: await users.getTotpKey(id),
      withdraw_address: '',
    },
  ]);

  await users.destroy();
});

test('delete', async () => {
  const users = await createUsers();

  const adminId = await users.getIdByName('admin');
  const id = await users.create({ name: 'alfadropper123', role: Role.Vendor });

  expect(id).toMatch(uuidRegex);
  expect(await users.getIdByName('alfadropper123')).toBe(id);
  expect(await users.getTotpKey(id)).toBeTruthy();
  expect(await users.getRole(id)).toBe(Role.Vendor);
  expect(await users.getAll()).toEqual([
    {
      id: adminId,
      name: 'admin',
      role: Role.Admin,
      totp_key: await users.getTotpKey(adminId),
      withdraw_address: '',
    },
    {
      id,
      name: 'alfadropper123',
      role: Role.Vendor,
      totp_key: await users.getTotpKey(id),
      withdraw_address: '',
    },
  ]);

  await users.delete(id);

  expect(await users.getIdByName('alfadropper123')).toBeUndefined();
  expect(await users.getTotpKey(id)).toBeUndefined();
  expect(await users.getRole(id)).toBeUndefined();
  expect(await users.getAll()).toEqual([
    {
      id: adminId,
      name: 'admin',
      role: Role.Admin,
      totp_key: await users.getTotpKey(adminId),
      withdraw_address: '',
    },
  ]);

  await users.destroy();
});

test('set withdraw addres', async () => {
  const users = await createUsers();
  const id = await users.getIdByName('admin');
  const withdraw_address = 'abc123';

  expect(await users.getWithdrawAddress(id)).toBe('');
  await users.setWithdrawAddress(id, withdraw_address);
  expect(await users.getWithdrawAddress(id)).toBe(withdraw_address);

  await users.destroy();
});
