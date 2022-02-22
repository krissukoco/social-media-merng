import React from 'react';

import 'bulma/css/bulma.min.css';

import styles from '../styles/Layout.module.css';
import logo from '../logo-horizontal.png';

export default function Navbar() {
  return (
    <div className={styles.navContainer}>
      <nav className={styles.navbar}>
        <div className='navbar-brand'>
          <a>
            <img src={logo} alt='sportify logo' width='210' />
          </a>
        </div>
        <div className={styles.navMenu}>
          <a className='navbar-item'>Feed</a>
          <a className='navbar-item'>About</a>
          <button className='button is-light is-responsive'>Login</button>
          <button className='button is-primary is-responsive'>Sign Up</button>
        </div>
      </nav>
    </div>
  );
}
