import styles from '../../styles/Utils.module.css';

// ONLY FOR SINGLE ERROR
const ErrorCard = ({ error }) => {
  return <div className={styles.errorCard}>{error}</div>;
};

export default ErrorCard;
