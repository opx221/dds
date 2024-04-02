import formatAmounts from '../utils/formatAmounts';

const amountsPage = ({
  amounts,
  dropType: {
    unit,
    amount_price_pairs,
    name,
    descr,
  }
}) =>
`Selected ${name}
${descr}

Available amounts
${
  formatAmounts({
    amounts,
    amountPricePairs: amount_price_pairs,
    unit,
  }).join('\n')
}

Select amount to buy`;

export default amountsPage;
