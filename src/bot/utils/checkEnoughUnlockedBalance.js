import createWalletRpc from '../../utils/createWalletRpc';

export default async (amount) => {
  const walletRpc = await createWalletRpc();
  const unlockedBalance = await walletRpc.getUnlockedBalance();

  return amount <= unlockedBalance;
};
