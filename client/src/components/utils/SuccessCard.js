import styles from '../../styles/Utils.module.css';

const SuccessCard = ({ text }) => {
  return (
    <div className={styles.successCard}>
      <p className={styles.successText}>{text}</p>
    </div>
  );
};

export default SuccessCard;
