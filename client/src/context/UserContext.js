import { createContext } from 'react';

const UserContext = createContext({
  userDetail: null,
  setUserDetail: () => {},
});

export default UserContext;
