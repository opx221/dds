import calcCut from './calcCut';

export default async ({
  users,
  vendorId,
  split,
  floorPrice,
  pricePerUnit,
}) => {
  const adminId = await users.getIdByName('admin');
  const adminWithdrawAddress = await users.getWithdrawAddress(adminId);
  if (!adminWithdrawAddress) {
    console.log('Unexpected behaviour: missing adminWithdrawAddress');
    return;
  }

  const vendorWithdrawAddress = await users.getWithdrawAddress(vendorId);
  if (!vendorWithdrawAddress) {
    console.log('Unexpected behaviour: missing vendorWithdrawAddress');
    return;
  }

  if (floorPrice >= pricePerUnit) {
    console.log('Unexpected behaviour: floorPrice is greater than or equal to pricePerUnit');
    return;
  }

  const cut = calcCut({ split, floorPrice, pricePerUnit });

  if (cut === 0) {
    console.log('Unexpected behaviour: calcCut returned 0');
    return;
  }

  if (cut === 100) {
    console.log('Unexpected behaviour: calcCut returned 100');
    return;
  }

  return [
    { address: vendorWithdrawAddress, percent: 100 - cut },
    { address: adminWithdrawAddress, percent: cut },
  ];
};
