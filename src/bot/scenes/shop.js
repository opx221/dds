import { Composer } from 'telegraf';
import { message } from 'telegraf/filters';

import replyLowUserBalance from '../repliers/lowUserBalance';
import replyLowWalletUnlockedBalance from '../repliers/lowWalletUnlockedBalance';
import replyError from '../repliers/error';
import replyInvalidInput from '../repliers/invalidInput';
import replyListings from '../repliers/listings';
import replyAmounts from '../repliers/amounts';
import replyConfirm from '../repliers/confirm';
import replySuccess from '../repliers/success';

import parseIndexAndUnit from '../utils/parseIndexAndUnit';
import { clearSession, prepareSession } from '../utils/shop/session';
import getAmountsData from '../utils/shop/getAmountsData';
import getConfirmData from '../utils/shop/getConfirmData';
import getSuccessData from '../utils/shop/getSuccessData';

export default () => {
  const bot = new Composer();

  bot.command('list', async (ctx) => {
    const { dropTypes } = ctx.backend;
    const allDropTypes = await dropTypes.getAllAvailable();

    prepareSession(ctx.session);
    return replyListings(ctx, { allDropTypes });
  });
  bot.on(message('text'), async (ctx, next) => {
    const { dropTypes, drops, photos } = ctx.backend;
    const { session } = ctx;
    const u_index = ctx.message.text;

    if (!session.expectingNumber) { return next(); }

    const [index, unit] = parseIndexAndUnit(u_index);
    if (index === null) { return next(); }

    if (!unit) {
      const amountsData = await getAmountsData({
        dropTypeIndex: index,
        dropTypes,
        drops,
      });

      if (!amountsData) {
        clearSession(session);
        return replyInvalidInput(ctx);
      }

      const { dropType, amounts } = amountsData;
      session.dropTypeId = dropType.id;

      const photoContents = await photos.getAllContentsByDropTypeId(dropType.id);
      return replyAmounts(ctx, { dropType, amounts, photoContents });
    } if (session.dropTypeId) {
      const confirmData = await getConfirmData({
        dropTypeId: session.dropTypeId,
        amount: index,
        dropTypes,
        drops,
      });

      if (!confirmData) {
        clearSession(session);
        return replyInvalidInput(ctx);
      }

      const { dropTypeIndex, dropType, drop } = confirmData;
      session.dropId = drop.id;
      return replyConfirm(ctx, { dropTypeIndex, dropType, amount: index });
    }

    return next();
  });
  bot.command('confirm', async (ctx, next) => {
    const {
      dropTypes, drops, photos, tgUsers, pool, users,
    } = ctx.backend;
    const { dropTypeId, dropId } = ctx.session;
    const userId = `${ctx.from.id}`;

    if (!dropId) { return next(); }
    clearSession(ctx.session);

    const successData = await getSuccessData({
      dropTypes,
      drops,
      tgUsers,
      users,
      pool,
      dropTypeId,
      dropId,
      userId,
    });

    if (!successData) {
      return replyError(ctx);
    }

    if (successData.lowUserBalance) {
      return replyLowUserBalance(ctx, { price: successData.price });
    }

    if (successData.lowWalletUnlockedBalance) {
      return replyLowWalletUnlockedBalance();
    }

    const { drop } = successData;
    const photoContents = await photos.getAllContentsByDropId(dropId);
    return replySuccess(ctx, { drop, photoContents });
  });

  return bot;
};
