import { AUTH_CLAIM_TYPE } from '../const';

export default ({
  loggedIn,
  notLoggedIn,
  requiredRole,
}) => async (ctx, next) => {
  const { user } = ctx.state;

  if (
    user
    && user.type === AUTH_CLAIM_TYPE
    && user.role === requiredRole
  ) {
    await loggedIn(ctx, next);
  } else {
    await notLoggedIn(ctx, next);
  }
};
