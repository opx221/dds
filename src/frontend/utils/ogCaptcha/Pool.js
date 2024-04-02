import { randomUUID } from 'node:crypto';
import ExpiryMap from 'expiry-map';
import genCaptcha from './genCaptcha';
import genSolution from './genSolution';

const TTL = 2.5 * 60 * 1000;
class CaptchaPool {
  constructor(ttl) {
    this.solutionMap = new ExpiryMap(ttl || TTL);
  }

  check(id, solution) {
    if (process.env.CAPTCHA_POOL_BYPASS) { return true; }

    const result = solution && this.solutionMap.get(id) === solution.toLowerCase();
    this.solutionMap.delete(id);
    return result;
  }

  async request(presetSolution) {
    const id = randomUUID();
    const solution = presetSolution ?? genSolution();
    const image = await genCaptcha(solution);
    this.solutionMap.set(id, solution);
    return { id, image };
  }
}

export default CaptchaPool;
