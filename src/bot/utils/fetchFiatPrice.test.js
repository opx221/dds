import fetchFiatPrice from './fetchFiatPrice';

test('fetchFiatPrice', async () => {
  expect(await fetchFiatPrice()).toBeGreaterThan(0);
});
