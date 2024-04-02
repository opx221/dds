import createUsers from '../../backend/Users';
import createDropTypes from '../../backend/DropTypes';
import createDrops from '../../backend/Drops';
import createPhotos from '../../backend/Photos';
import createTelegramUsers from '../../backend/TelegramUsers';
import createPool from '../../backend/createPool';

export default async () => {
  const pool = createPool();
  const users = await createUsers(pool);
  const tgUsers = await createTelegramUsers(pool);
  const dropTypes = await createDropTypes(pool);
  const drops = await createDrops(pool);
  const photos = await createPhotos(pool);

  return async (ctx, next) => {
    ctx.backend = {
      users,
      dropTypes,
      drops,
      photos,
      tgUsers,
      pool,
    };

    await next();
  };
};
