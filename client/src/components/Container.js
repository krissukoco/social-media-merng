import React from 'react';

import styles from '../styles/Layout.module.css';

const Container = ({ children, bgColor }) => {
  let color;
  if (!bgColor || bgColor == 'default') {
    color = '#f8f8f8';
  } else if (bgColor == 'white') {
    color = 'white';
  } else {
    throw new Error(
      "INVALID bgColor option. Only 'default' or 'white' is possible"
    );
  }
  return (
    <div style={{ backgroundColor: color }}>
      <div className={styles.container}>{children}</div>
    </div>
  );
};

export default Container;
