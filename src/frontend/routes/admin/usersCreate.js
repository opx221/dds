import Role from '../../../backend/Users/Role';
import isValidName from '../../../backend/Users/isValidName';

export default async (ctx) => {
  const { name, role } = ctx.request.body;
  const { users } = ctx.backend;

  if (![Role.Admin, Role.Vendor].includes(role)) {
    throw new Error('Invalid role');
  }

  if (!isValidName(name)) {
    ctx.body = 'Invalid name';
    return;
  }

  await users.create({ name, role });

  ctx.redirect('/admin');
};
