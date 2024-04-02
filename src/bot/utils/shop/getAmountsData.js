const getAmountsData = async ({ dropTypeIndex, dropTypes, drops }) => {
  const allDropTypes = await dropTypes.getAllAvailable();
  const dropType = allDropTypes[dropTypeIndex - 1];
  if (!dropType) { return; }

  const amounts = await drops.getAllAvailableDropTypeAmounts(dropType.id);
  return { dropType, amounts };
};

export default getAmountsData;
