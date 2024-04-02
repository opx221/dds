import getXmrAddress from '../../utils/getXmrAddress';

const getWalletData = async ({ tgUsers, id }) => {
  const { balance, payment_id } = await tgUsers.get(id);
  const address = await getXmrAddress(payment_id);

  return { balance, address };
};

export default getWalletData;
