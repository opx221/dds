import { HttpClient } from 'monero-ts';
import getXmrAddress from './getXmrAddress';

HttpClient.DEFAULT_TIMEOUT = 1000;
// but with monero-ts library having unresolved promises

test('getXmrAddress parallel', async () => {
  const [a, b] = await Promise.all([
    getXmrAddress('c548d38bb71b7355'),
    getXmrAddress('0011223344556677'),
  ]);
  expect(a).toBeTruthy();
  expect(b).toBeTruthy();
});
test('getXmrAddress', async () => {
  expect(await getXmrAddress('c548d38bb71b7355')).toBeTruthy();
});
