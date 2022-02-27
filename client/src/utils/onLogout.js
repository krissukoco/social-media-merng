import { Redirect } from 'react-router';
import { deleteLocalData } from './handleUserAuth';

const onLogout = () => {
  deleteLocalData();
  window.location.href = '/login';
};

export default onLogout;
