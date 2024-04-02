import session from 'koa-session';

const CONFIG = {
  key: 'session',
  signed: false,
};

export default (app) => session(CONFIG, app);
