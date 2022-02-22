import React from 'react';

import styles from '../styles/Layout.module.css';

const Container = ({ children }) => {
  return (
    <div style={{ backgroundColor: '#f8f8f8' }}>
      <div className={styles.container}>{children}</div>
    </div>
  );
};

export default Container;
