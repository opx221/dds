export default (func) => {
  let lastResult;

  return async () => {
    if (!lastResult) {
      lastResult = await func();
    }

    return lastResult;
  };
};
