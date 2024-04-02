import formatPiconero from '../../utils/formatPiconero';

const lowUserBalancePage = ({ price }) =>
`Balance too low, required ${formatPiconero(price)} XMR
XMR can be bought from agoradesk.com/?rc=sa95`;

export default lowUserBalancePage;
