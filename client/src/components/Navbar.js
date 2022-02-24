import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import 'bulma/css/bulma.min.css';

import UserIcon from '../components/navbar/UserIcon';
import dummyUser from '../misc/dummyUser';

import styles from '../styles/Navbar.module.css';
import logo from '../media/logo-horizontal.png';

export default function Navbar() {
  const [userDetail, setUserDetail] = useState(null);

  useEffect(() => {
    // TODO: Change dummyUser with GET_USER_DETAIL from JWT on http header
    // setUserDetail(dummyUser);
    setUserDetail(null);
  });
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
            {userDetail != null ? (
              <UserIcon userDetail={dummyUser} />
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className={`${styles.login} ${styles.myButton}`}
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className={`${styles.signup} ${styles.myButton}`}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </nav>
      </div>
      <div style={{ minHeight: '5.7rem' }}></div>
    </>
  );
}
