import loginPage from '../../pages/loginPage';

export default ({ title, action }) => async (ctx) => {
  const captcha = await ctx.captchaPool.request();
  const { session } = ctx;
  const { form, message } = session;
  delete session.form;
  delete session.message;

  ctx.body = loginPage({
    title,
    action,
    message,
    form,
    captcha,
  });
};
