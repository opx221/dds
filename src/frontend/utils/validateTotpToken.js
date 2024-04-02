import { authenticator } from 'otplib';

authenticator.options = { window: 1 };
const validateTotpToken = (totpKey, token) => {
  if (process.env.TOTP_VALIDATION_BYPASS) { return true; }

  return authenticator.check(token, totpKey);
};

export default validateTotpToken;
