import { MoneroUtils, MoneroNetworkType } from 'monero-ts';
import createWalletRpc from './createWalletRpc';

export default async (paymentId) => {
  const walletRpc = await createWalletRpc();

  return (
    (
      await MoneroUtils.getIntegratedAddress(
        MoneroNetworkType.MAINNET,
        await walletRpc.getPrimaryAddress(),
        paymentId,
      )
    ).toString()
  );
};
