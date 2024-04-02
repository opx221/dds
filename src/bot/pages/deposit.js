import formatPiconero from '../../utils/formatPiconero';

const depositPage = ({ amount }) =>
`Confirmed deposit of ${formatPiconero(amount)} XMR`;

export default depositPage;
