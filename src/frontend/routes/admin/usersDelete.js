export default async (ctx) => {
  const { id } = ctx.request.body;
  const { users } = ctx.backend;

  await users.delete(id);

  ctx.redirect('/admin');
};
