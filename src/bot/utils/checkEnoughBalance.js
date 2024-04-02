import createWalletRpc from '../../utils/createWalletRpc';

export default async (amount) => {
  const walletRpc = await createWalletRpc();
  const balance = await walletRpc.getBalance();

  if (amount > balance) {
    console.log('Unexpected behaviour: not enough wallet balance');
    return false;
  }

  return true;
};
