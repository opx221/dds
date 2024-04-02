import { MoneroUtils, MoneroNetworkType } from 'monero-ts';

MoneroUtils.setProxyToWorker(false);

const checkAddress = (address) => (
  MoneroUtils.isValidAddress(address, MoneroNetworkType.MAINNET)
);
export default async (ctx) => {
  const { users } = ctx.backend;
  const { userId } = ctx.state.user;
  const { withdrawAddress } = ctx.request.body;

  if (!await checkAddress(withdrawAddress)) {
    ctx.body = 'Invalid withdraw address';
    return;
  }
  await users.setWithdrawAddress(userId, withdrawAddress);

  ctx.redirect(ctx.request.get('referer'));
};
