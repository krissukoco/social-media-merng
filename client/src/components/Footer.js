import React from 'react';

import styles from '../styles/Layout.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
        Sportify - Social Media for Sport Enthusiasts
      </h3>
      <h4>With MERNG: MongoDB, Express, React, Node, and GraphQL</h4>
      <h4 style={{ fontWeight: 'bold', marginTop: '1rem' }}>
        Developed by Robertus Kristianto Sukoco
      </h4>
    </footer>
  );
};

export default Footer;
