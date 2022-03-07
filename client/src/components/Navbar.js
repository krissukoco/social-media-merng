import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import 'bulma/css/bulma.min.css';

import UserContext from '../context/UserContext';
import UserIcon from '../components/navbar/UserIcon';
import dummyUser from '../misc/dummyUser';
import useClientDetail from '../hooks/useClientDetail';

import styles from '../styles/Navbar.module.css';
import logo from '../media/logo-horizontal.png';

export default function Navbar({ userDetail }) {
  // TODO: Change dummyUser with GET_USER_DETAIL from JWT on http header

  let navigate = useNavigate();

  return (
    <>
      <div className={styles.navContainer}>
        <nav className={styles.navbar}>
          <div>
            <a href='/'>
              <img src={logo} alt='sportify logo' width='180' />
            </a>
          </div>
          <div className={styles.navMenu}>
            {userDetail != null ? (
              <UserIcon userDetail={userDetail} />
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
      <div style={{ minHeight: '4.5rem', color: 'transparent' }}></div>
    </>
  );
}
