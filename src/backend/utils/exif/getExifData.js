/* eslint-disable import/no-unresolved */
import { spawn } from 'node:child_process';
import getStream from 'get-stream';

export default async (imageData) => {
  const cp = spawn(
    'identify',
    '-format %[EXIF:*] -'.split(' '),
  );
  cp.stdin.end(imageData);
  return getStream(cp.stdout);
};
