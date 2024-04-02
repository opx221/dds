import { connectToWalletRpc, MoneroUtils } from 'monero-ts';
import createCached from './createCached';

MoneroUtils.setProxyToWorker(false);

const createWalletRpc = () => (
  connectToWalletRpc('http://localhost:28082')
);

export default createCached(createWalletRpc);
