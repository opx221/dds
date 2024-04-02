import jwt from 'koa-jwt';
import compose from 'koa-compose';
import { JWT_SECRET } from '../../const';

export default () => compose([
  jwt({
    secret: JWT_SECRET,
    cookie: 'jwt',
    passthrough: true,
  }),
  async (ctx, next) => {
    if (
      ctx.cookies.get('jwt') && ctx.state.jwtOriginalError
    ) {
      const { message } = ctx.state.jwtOriginalError;
      if (message !== 'jwt expired') {
        console.log(`Authenticator got invalid token with error '${message}'`);
      }

      ctx.cookies.set('jwt', null);
      ctx.redirect(ctx.request.href);
    } else {
      await next();
    }
  },
]);
