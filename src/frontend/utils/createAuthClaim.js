import isDev from '../../utils/isDev';
import { AUTH_CLAIM_TYPE } from '../const';
import sign from './sign';

export default ({ userId, role }) => (
  sign(
    {
      type: AUTH_CLAIM_TYPE,
      role,
      userId,
    },
    isDev ? {} : { expiresIn: '90m' },
  )
);
