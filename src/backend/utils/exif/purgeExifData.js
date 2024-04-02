/* eslint-disable import/no-unresolved */
import { spawn } from 'node:child_process';
import getStream, { getStreamAsBuffer } from 'get-stream';

const promisifyClose = (cp) => new Promise((resolve) => {
  cp.on('close', resolve);
});

const purgeExifData = async (imageData) => {
  const cp = spawn(
    'exiftool',
    '-all= -'.split(' '),
  );
  cp.stdin.end(imageData);

  const [out, err, code] = await Promise.all([
    getStreamAsBuffer(cp.stdout),
    getStream(cp.stderr),
    promisifyClose(cp),
  ]);

  if (code !== 0) {
    throw new Error(
      `purgeExifData failed with ${code} and '${err.replace(/\n$/, '')}'`,
    );
  }

  return out;
};
export default purgeExifData;
