import Router from '@koa/router';
import Role from '../../../backend/Users/Role';

import authorizer from '../../middlewares/authorizer';

import loginRoot from '../login/root';
import loginAuthenticate from '../login/authenticate';

import root from './root';
import usersCreate from './usersCreate';
import usersDelete from './usersDelete';
import dropTypesUpdate from './dropTypesUpdate';
import logs from './logs';
import setWithdrawAddress from '../setWithdrawAddress';

const loggedInRouter = new Router();
loggedInRouter
  .get('/admin', root)
  .post('/admin/users/create', usersCreate)
  .post('/admin/users/delete', usersDelete)
  .post('/admin/dropTypes/update', dropTypesUpdate)
  .get('/admin/logs', logs)
  .post('/admin/settings/withdrawAddress', setWithdrawAddress);

const notLoggedInRouter = new Router();
notLoggedInRouter
  .get('/admin', loginRoot({ title: 'Admin', action: '/admin/login' }))
  .post('/admin/login', loginAuthenticate({ requiredRole: Role.Admin }));

const router = new Router();
router.all(
  /\/admin.*/i,
  authorizer({
    requiredRole: Role.Admin,
    loggedIn: loggedInRouter.routes(),
    notLoggedIn: notLoggedInRouter.routes(),
  }),
);

export default router.routes();
