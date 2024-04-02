import crypto from 'node:crypto';
import { PID_DERIVATION_SALT } from '../../const';

export default (id) => (
  crypto
    .createHash('sha1')
    .update(PID_DERIVATION_SALT)
    .update(id)
    .digest()
    .subarray(0, 8)
    .toString('hex')
);
