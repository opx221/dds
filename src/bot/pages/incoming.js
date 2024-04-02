import formatPiconero from '../../utils/formatPiconero';

const incomingPage = ({ amount }) =>
`Incoming deposit of ${formatPiconero(amount)} XMR
Your balance will be available in about 20 minutes`;

export default incomingPage;
