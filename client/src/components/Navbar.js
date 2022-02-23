import React from 'react';
import { useNavigate } from 'react-router-dom';

import 'bulma/css/bulma.min.css';

import UserIcon from '../components/navbar/UserIcon';
import dummyUser from '../misc/dummyUser';
// TODO: Change dummyUser with GET_USER_DETAIL from JWT on http header

import styles from '../styles/Navbar.module.css';
import logo from '../logo-horizontal.png';

export default function Navbar({ userDetail }) {
  let navigate = useNavigate();

  return (
    <>
      <div className={styles.navContainer}>
        <nav className={styles.navbar}>
          <div className='navbar-brand'>
            <a href='/'>
              <img src={logo} alt='sportify logo' width='210' />
            </a>
          </div>
          <div className={styles.navMenu}>
            {/* <a className='navbar-item'>Feed</a>
            <a className='navbar-item'>About</a> */}
            {userDetail == null ? (
              <UserIcon userDetail={dummyUser} />
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className='button is-light is-responsive'
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className='button is-primary is-responsive'
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </nav>
      </div>
      <div style={{ minHeight: '6.5rem' }}></div>
    </>
  );
}
