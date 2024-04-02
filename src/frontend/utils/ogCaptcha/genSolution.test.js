import genSolution from './genSolution';

test('genSolution', async () => {
  expect(genSolution()).toMatch(/^.{6}$/);
});
