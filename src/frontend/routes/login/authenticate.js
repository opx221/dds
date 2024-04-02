import validateTotpToken from '../../utils/validateTotpToken';
import createAuthClaim from '../../utils/createAuthClaim';

export default ({ requiredRole }) => async (ctx) => {
  const {
    session, captchaPool, backend, request,
  } = ctx;
  const { name, token, captcha } = request.body;
  const { users } = backend;
  const referer = ctx.request.get('referer');

  const fail = (message) => {
    session.form = { name, token };
    session.message = message;
    ctx.redirect(referer);
  };

  if (!captchaPool.check(captcha.id, captcha.solution)) {
    fail('Invalid captcha');
    return;
  }

  const userId = await users.getIdByName(name);
  if (!userId) {
    fail('Invalid name');
    return;
  }

  const role = await users.getRole(userId);
  if (role !== requiredRole) {
    fail('Invalid role');
    return;
  }

  const totpKey = await users.getTotpKey(userId);
  if (!validateTotpToken(totpKey, token)) {
    fail('Invalid token');
    return;
  }

  ctx.cookies.set('jwt', createAuthClaim({ userId, role }));
  ctx.redirect(referer);
};
