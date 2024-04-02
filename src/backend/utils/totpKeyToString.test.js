import totpKeyToString from './totpKeyToString';

test('totpKeyToString', async () => {
  const totpKey = 'GU4VAWKCPITAGT2C';
  expect(await totpKeyToString(totpKey)).toBeTruthy();
});
