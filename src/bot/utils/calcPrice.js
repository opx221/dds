const LOSE_DIGITS = BigInt(1e4);
export default ({
  amount: u_amount,
  pricePerUnit: u_pricePerUnit,
  fiatPrice,
}) => {
  const amount = Math.abs(u_amount);
  const pricePerUnit = Math.abs(u_pricePerUnit);

  return (
    BigInt(Math.round(
      amount * pricePerUnit / fiatPrice * 1e12,
    )) / LOSE_DIGITS * LOSE_DIGITS
  );
};
