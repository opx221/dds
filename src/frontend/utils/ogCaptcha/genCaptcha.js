/* eslint-disable import/no-unresolved */
import { spawn } from 'node:child_process';
import { getStreamAsBuffer } from 'get-stream';
import bufferToDataURI from '../bufferToDataURI';

const genCaptchaBuffer = async (solution) => {
  const cp = spawn('.bin/og-captcha', [solution, 'png:-']);
  return getStreamAsBuffer(cp.stdout);
};

const genCaptcha = async (solution) => {
  const buffer = await genCaptchaBuffer(solution);
  return bufferToDataURI('image/png', buffer);
};

export default genCaptcha;
