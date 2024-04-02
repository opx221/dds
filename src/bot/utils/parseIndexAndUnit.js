/* eslint-disable no-useless-escape */

export default (v) => {
  const matches = (
    v
      .replace(/^\//, '')
      .replace(/,|_/, '.')
      .match(/^([\d\.]+)(\w+)?/)
  );

  if (!matches) { return [null]; }

  const [index, unit] = matches.slice(1);
  return [+index, unit];
};
