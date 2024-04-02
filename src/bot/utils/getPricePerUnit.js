export default (amount_price_pairs, amount) => (
  amount_price_pairs.find((pair) => pair[0] === amount)?.[1]
);
