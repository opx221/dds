export default (v) => {
  const w = v.replace(',', '.');

  return (
    (w === '' || Number.isNaN(+w) ? null : +w)
  );
};
