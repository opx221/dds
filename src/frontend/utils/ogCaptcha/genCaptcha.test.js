import genCaptcha from './genCaptcha';

test('genCaptcha', async () => {
  expect(await genCaptcha('abc234')).toBeTruthy();
});
