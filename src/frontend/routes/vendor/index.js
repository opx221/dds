import Router from '@koa/router';
import Role from '../../../backend/Users/Role';

import authorizer from '../../middlewares/authorizer';

import loginRoot from '../login/root';
import loginAuthenticate from '../login/authenticate';

import root from './root';
import dropsCreate from './dropsCreate';
import dropsDelete from './dropsDelete';
import dropsPhotos from './dropsPhotos';
import dropTypesCreate from './dropTypesCreate';
import dropTypesUpdate from './dropTypesUpdate';
import dropTypesDelete from './dropTypesDelete';
import dropTypesPhotos from './dropTypesPhotos';
import setWithdrawAddress from '../setWithdrawAddress';

const loggedInRouter = new Router();
loggedInRouter
  .get('/vendor', root)
  .post('/vendor/drops/create', dropsCreate)
  .post('/vendor/drops/delete', dropsDelete)
  .get('/vendor/drops/photos', dropsPhotos)
  .post('/vendor/dropTypes/create', dropTypesCreate)
  .post('/vendor/dropTypes/update', dropTypesUpdate)
  .post('/vendor/dropTypes/delete', dropTypesDelete)
  .get('/vendor/dropTypes/photos', dropTypesPhotos)
  .post('/vendor/settings/withdrawAddress', setWithdrawAddress);

const notLoggedInRouter = new Router();
notLoggedInRouter
  .get('/vendor', loginRoot({ title: 'Vendor', action: '/vendor/login' }))
  .post('/vendor/login', loginAuthenticate({ requiredRole: Role.Vendor }));

const router = new Router();
router.all(
  /\/vendor.*/i,
  authorizer({
    requiredRole: Role.Vendor,
    loggedIn: loggedInRouter.routes(),
    notLoggedIn: notLoggedInRouter.routes(),
  }),
);

export default router.routes();
