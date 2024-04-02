import { TelegramUsers } from '../../../backend/TelegramUsers';
import { Drops } from '../../../backend/Drops';

import fetchFiatPrice from '../fetchFiatPrice';
import split from '../split';
import calcPrice from '../calcPrice';
import createDestinations from '../createDestinations';
import getPricePerUnit from '../getPricePerUnit';
import checkEnoughBalance from '../checkEnoughBalance';
import checkEnoughUnlockedBalance from '../checkEnoughUnlockedBalance';

const getSuccessData = async ({
  dropTypes, drops, tgUsers, users, pool,
  dropTypeId, dropId,
  userId,
}) => {
  const drop = await drops.get(dropId);
  const dropType = await dropTypes.get(dropTypeId);
  if (!drop || !dropType) {
    console.log('Unexpected behaviour: no drop or dropType');
    return;
  }

  const pricePerUnit = getPricePerUnit(dropType.amount_price_pairs, drop.amount);
  if (!pricePerUnit) {
    console.log('Unexpected behaviour: missing pricePerUnit');
    return;
  }

  const fiatPrice = await fetchFiatPrice();
  if (!fiatPrice) { return; }

  const price = calcPrice({ amount: drop.amount, pricePerUnit, fiatPrice });
  if (price <= 0) {
    console.log('Unexpected behaviour: price is less or equal to zero');
    return;
  }

  const balance = BigInt((await tgUsers.get(userId)).balance[1]);
  if (price > balance) { return { lowUserBalance: true, price }; }

  const destinations = await createDestinations({
    vendorId: dropType.vendor_id,
    split: dropType.split,
    floorPrice: dropType.floor_price,
    pricePerUnit,
    users,
  });
  if (!destinations) { return; }

  if (!await checkEnoughBalance(price)) { return; }
  if (!await checkEnoughUnlockedBalance(price)) {
    return { lowWalletUnlockedBalance: true };
  }

  const { txid, relay } = await split(price, destinations);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await TelegramUsers.addBalance(client, userId, [0, -price]);
    await Drops.setBuyerId(client, dropId, userId);
    await Drops.setTXID(client, dropId, txid);
    await relay();

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    console.log('Shop transaction failed:', err);
    return;
  } finally {
    client.release();
  }

  return { drop };
};

export default getSuccessData;
