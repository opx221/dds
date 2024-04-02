/* eslint-disable class-methods-use-this */
import { MoneroWalletListener } from 'monero-ts';
import createWalletRpc from '../utils/createWalletRpc';

const listenDeposits = async (listener) => {
  const walletRpc = await createWalletRpc();

  await walletRpc.addListener(new class extends MoneroWalletListener {
    async onOutputReceived(output) {
      const amount = output.getAmount();
      const tx = output.getTx();
      const isConfirmed = tx.getIsConfirmed();
      const isLocked = tx.getIsLocked();
      const paymentId = tx.getPaymentId();
      const txid = tx.getHash();
      const isIncoming = tx.getIsIncoming();
      const isOutgoing = tx.getIsOutgoing();

      await listener({
        amount,
        paymentId,
        isConfirmed,
        isLocked,
        txid,
        isIncoming,
        isOutgoing,
      });
    }
  }());
};

export default listenDeposits;
