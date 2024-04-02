export default ({
  split: u_split,
  floorPrice: u_floorPrice,
  pricePerUnit: u_pricePerUnit,
}) => {
  const split = Math.min(Math.max(u_split, 0), 100);
  const floorPrice = Math.abs(u_floorPrice);
  const pricePerUnit = Math.abs(u_pricePerUnit);
  if (floorPrice >= pricePerUnit) { return 0; }
  return split * (1 - floorPrice / pricePerUnit);
};
