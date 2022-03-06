import LoadingSpinner from './LoadingSpinner';
import styles from '../../styles/Utils.module.css';

const LoadingButton = () => {
  return (
    <button className={styles.loadingButton}>
      <LoadingSpinner />
    </button>
  );
};

export default LoadingButton;
