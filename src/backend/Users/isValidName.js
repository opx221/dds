const validNameRegexp = /^[a-z0-9_-]{5,32}$/;

const isValidName = (name) => validNameRegexp.test(name);
export default isValidName;
