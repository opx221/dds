import calcCut from './calcCut';

test('calcCut', async () => {
  expect(calcCut({
    split: 50,
    floorPrice: 65,
    pricePerUnit: 100,
  })).toBe(17.5);
  expect(calcCut({
    split: 5,
    floorPrice: 0,
    pricePerUnit: 100,
  })).toBe(5);
  expect(calcCut({
    split: 5,
    floorPrice: 65,
    pricePerUnit: 0.01,
  })).toBe(0);
});
