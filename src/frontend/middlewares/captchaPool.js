import CaptchaPool from '../utils/ogCaptcha/Pool';

export default () => {
  const pool = new CaptchaPool();

  return async (ctx, next) => {
    ctx.captchaPool = pool;

    await next();
  };
};
