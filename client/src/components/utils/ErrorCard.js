import styles from '../../styles/Utils.module.css';

const ErrorCard = ({ errors }) => {
  return (
    <div className={styles.errorCard}>
      <ul className={styles.errorList}>
        {errors.map((e, i) => (
          <li key={i}>{e}</li>
        ))}
      </ul>
    </div>
  );
};

export default ErrorCard;
