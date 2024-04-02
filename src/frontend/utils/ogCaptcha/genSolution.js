import { randomInt } from 'node:crypto';

const chars = 'qertypfghcbnm36789';
// removed i j l 1 o 0 d z 2 x k s 5 a 4 u v w

export default () => (
  Array(6).fill().map(() => chars[randomInt(0, chars.length)]).join('')
);
