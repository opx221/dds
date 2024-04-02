import { Telegraf } from 'telegraf';
import listenDeposits from './listenDeposits';

import createTelegramUsers from '../backend/TelegramUsers';
import { BOT_TOKEN } from '../const';
import incomingPage from '../bot/pages/incoming';
import depositPage from '../bot/pages/deposit';
import formatPiconero from '../utils/formatPiconero';

const tgUsers = await createTelegramUsers();
const bot = new Telegraf(BOT_TOKEN);

await listenDeposits(
  async ({
    amount,
    paymentId,
    isConfirmed,
    isLocked,
    txid,
    isOutgoing,
  }) => {
    const log = (...args) => {
      console.log(
        ...args,
        `(isConfirmed=${isConfirmed}, isLocked=${isLocked}, txid=${txid})`,
      );
    };

    if (isOutgoing) {
      log('Is outgoing');
      return;
    }
    if (!paymentId) {
      log('No payment id');
      return;
    }

    const id = await tgUsers.getIdByPaymentId(paymentId);
    if (!id) {
      log(`No tg user with payment id '${paymentId}'`);
      return;
    }

    const { username } = await tgUsers.get(id);
    log(`Incoming ${formatPiconero(amount)} XMR for @${username}`);

    if (isConfirmed === false && isLocked === true) {
      tgUsers.addBalance(id, [amount, 0]);
      bot.telegram.sendMessage(id, incomingPage({ amount }));
    } else if (isConfirmed === true && isLocked === false) {
      tgUsers.addBalance(id, [-amount, amount]);
      bot.telegram.sendMessage(id, depositPage({ amount }));
    }
  },
);

console.log('Started!');
