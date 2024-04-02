import totpKeyToDataURL from './totpKeyToDataURL';

test('totpKeyToDataURL', async () => {
  const totpKey = 'GU4VAWKCPITAGT2C';
  expect(await totpKeyToDataURL(totpKey)).toBeTruthy();
});
