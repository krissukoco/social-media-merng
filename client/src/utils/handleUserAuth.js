const TOKEN_KEY = 'token';
const USER_ID_KEY = 'userId';

export const getLocalData = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const userId = localStorage.getItem(USER_ID_KEY);
  return { userId, token };
};

export const saveLocalData = (userId, token) => {
  let tokenString = `Bearer ${token}`;
  localStorage.setItem(TOKEN_KEY, tokenString);
  localStorage.setItem(USER_ID_KEY, userId);
  return;
};

export const deleteLocalData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
  return;
};
