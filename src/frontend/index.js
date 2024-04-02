import Koa from 'koa';

import createBackend from './middlewares/backend';
import authenticator from './middlewares/authenticator';
import captchaPool from './middlewares/captchaPool';
import body from './middlewares/body';

import admin from './routes/admin';
import vendor from './routes/vendor';
import session from './middlewares/session';

const backend = await createBackend();
const app = new Koa();

app
  .use(backend)
  .use(session(app))
  .use(captchaPool())
  .use(authenticator())
  .use(body())
  .use(admin)
  .use(vendor)
  .listen(8080, () => {
    console.log('Started!');
  });
