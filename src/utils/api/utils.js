export const getSecureHeader = token => {
  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};
