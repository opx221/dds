import { jest } from '@jest/globals';
import { authenticator } from 'otplib';
import validateTotpToken from './validateTotpToken';

const STEP = 30 * 1000;

const now = 1701399510000;
jest
  .useFakeTimers();

test('validateTotpToken', async () => {
  jest.setSystemTime(now);

  const totpKey = 'GU4VAWKCPITAGT2C';
  const token = authenticator.generate(totpKey);
  expect(await validateTotpToken(totpKey, token)).toBeTruthy();
});

test('validateTotpToken window + 1', async () => {
  jest.setSystemTime(now);

  const totpKey = 'GU4VAWKCPITAGT2C';
  const token = authenticator.generate(totpKey);

  jest.setSystemTime(now + STEP * 1);
  expect(await validateTotpToken(totpKey, token)).toBeTruthy();
});

test('validateTotpToken window + 2', async () => {
  jest.setSystemTime(now);

  const totpKey = 'GU4VAWKCPITAGT2C';
  const token = authenticator.generate(totpKey);

  jest.setSystemTime(now + STEP * 2);
  expect(await validateTotpToken(totpKey, token)).toBeFalsy();
});
