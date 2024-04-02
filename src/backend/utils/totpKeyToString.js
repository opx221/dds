import qrcode from 'qrcode';
import { authenticator } from 'otplib';

export default async (totpKey) => {
  const user = 'A user name, possibly an email';
  const service = 'A service name';
  const otpauth = authenticator.keyuri(user, service, totpKey);

  return qrcode.toString(otpauth, { type: 'terminal', small: true });
};
