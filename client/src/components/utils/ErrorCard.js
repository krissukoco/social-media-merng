import { useNavigate } from 'react-router-dom';

import styles from '../../styles/Utils.module.css';

// ONLY FOR SINGLE ERROR
const ErrorCard = ({ error }) => {
  let navigate = useNavigate();
  if (error === 'jwt expired') {
    navigate('/login');
  }
  // "ERROR OCCCURED" only when 'error' props not supplied
  let err = error ? error : 'ERROR OCCURED';
  return <div className={styles.errorCard}>{err}</div>;
};

export default ErrorCard;
