import isValidName from './isValidName';

test('isValidName', () => {
  expect(isValidName('')).toBeFalsy();
  expect(isValidName('a'.repeat(33))).toBeFalsy();
  expect(isValidName('a'.repeat(4))).toBeFalsy();
  expect(isValidName('a'.repeat(5))).toBeTruthy();
  expect(isValidName('a'.repeat(32))).toBeTruthy();
  expect(isValidName('A'.repeat(5))).toBeFalsy();
  expect(isValidName('_!@#$%^&*><>?')).toBeFalsy();
  expect(isValidName('       ')).toBeFalsy();

  expect(isValidName('mrjosh123')).toBeTruthy();
  expect(isValidName('mrjosh1234')).toBeTruthy();
});
