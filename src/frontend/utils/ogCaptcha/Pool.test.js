import { randomUUID } from 'node:crypto';
import sleep from 'sleep-promise';
import Pool from './Pool';

test('check returns correct', async () => {
  const pool = new Pool();
  const solution = 'abc234';
  const { id } = await pool.request(solution);
  expect(pool.check(id, solution)).toBeTruthy();
});

test('check returns correct with wrong case', async () => {
  const pool = new Pool();
  const solution = 'abc234';
  const { id } = await pool.request(solution);
  expect(pool.check(id, solution.toUpperCase())).toBeTruthy();
});

test('check returns incorrect on correct retry', async () => {
  const pool = new Pool();
  const wrong_solution = 'xxxxxx';
  const solution = 'abc234';
  const { id } = await pool.request(solution);
  expect(pool.check(id, wrong_solution)).toBeFalsy();
  expect(pool.check(id, solution)).toBeFalsy();
});

test('check returns incorrect after ttl', async () => {
  const pool = new Pool(900);
  const solution = 'abc234';
  const { id } = await pool.request(solution);

  await sleep(1000);

  expect(pool.check(id, solution)).toBeFalsy();
});

test('check returns incorrect on undefined solution', async () => {
  const pool = new Pool();
  const id = randomUUID();
  const solution = undefined;
  expect(pool.check(id, solution)).toBeFalsy();
});
