const getConfirmData = async ({
  dropTypeId, amount, dropTypes, drops,
}) => {
  const drop = await drops.getAvailableByAmountAndDropType({
    drop_type_id: dropTypeId,
    amount,
  });
  if (!drop) { return; }

  const allDropTypes = await dropTypes.getAllAvailable();
  const dropType = allDropTypes.find(
    (aDropType) => aDropType.id === dropTypeId,
  );
  if (!dropType) { return; }
  const dropTypeIndex = allDropTypes.indexOf(dropType) + 1;

  return { dropTypeIndex, dropType, drop };
};

export default getConfirmData;
