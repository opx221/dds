import calcPrice from './calcPrice';

test('calcPrice', async () => {
  expect(calcPrice({
    amount: 2,
    pricePerUnit: 100,
    fiatPrice: 1000,
  })).toBe(BigInt(0.2 * 1e12));
  expect(calcPrice({
    amount: 2,
    pricePerUnit: 200,
    fiatPrice: 500,
  })).toBe(BigInt(0.8 * 1e12));
  expect(calcPrice({
    amount: 5,
    pricePerUnit: 133,
    fiatPrice: 123.45,
  })).toBe(5386796270000n);
});
