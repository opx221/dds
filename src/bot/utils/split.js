import createWalletRpc from '../../utils/createWalletRpc';

const FEE = BigInt(0.0016 * 1e12);
// as monero rpc does not support a subtract-fee-from-destination argument
// we try to use potential maximum flat fee instead

const split = async (amount, destinations) => {
  const walletRpc = await createWalletRpc();

  const txs = await walletRpc.createTxs({
    destinations: destinations.map(({ address, percent }) => {
      const promille = BigInt(percent * 10);

      return {
        address,
        amount: (amount - FEE) / 1000n * promille,
        // fees are paid propertionally relative to amount, not equally
      };
    }),
    accountIndex: 0,
  });

  return {
    txid: txs.map((tx) => tx.getHash()).join(),
    relay: async () => { await walletRpc.relayTxs(txs); },
  };
};

export default split;
