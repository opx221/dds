import { FIAT_SYMBOL } from '../../const';

export default ({ amounts, unit, amountPricePairs }) => {
  const amountPriceMap = Object.fromEntries(amountPricePairs);

  return (
    amounts
      .filter((amount) => amountPriceMap[amount])
      .map((amount) => {
        const formattedAmount = amount.toString().replace('.', '_');
        const command = `/${formattedAmount}${unit}`;
        const price = `${amount * amountPriceMap[amount]}${FIAT_SYMBOL}`;
        return `${command} - ${price}`;
      })
  );
};
