import child_process from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(child_process.exec);

export default async (fileName) => {
  if (![
    '.pm2/logs/bot-out.log',
    '.pm2/logs/bot-error.log',
    '.pm2/logs/frontend-out.log',
    '.pm2/logs/frontend-error.log',
    '.pm2/logs/deposit-listener-out.log',
    '.pm2/logs/deposit-listener-error.log',
  ].includes(fileName)) { return ''; }

  try {
    const out = await exec(`tail -n 1024 ${fileName}`);
    return out.stdout;
  } catch (e) {
    return e.stderr;
  }
};
