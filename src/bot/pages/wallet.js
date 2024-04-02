import formatPiconero from '../../utils/formatPiconero';

const formatXmr = (b) => formatPiconero(BigInt(b));

const walletPage = ({ address, balance }) =>
`Your XMR wallet

Address: ${address}
Uncomfirmed balance: ${formatXmr(balance[0])} XMR
Confirmed balance: ${formatXmr(balance[1])} XMR`;

export default walletPage;
