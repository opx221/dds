/* eslint-disable no-param-reassign */

export const clearSession = (session) => {
  session.dropTypeId = null;
  session.dropId = null;
  session.expectingNumber = false;
};
export const prepareSession = (session) => {
  session.dropTypeId = null;
  session.dropId = null;
  session.expectingNumber = true;
};
