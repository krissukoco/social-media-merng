import { useNavigate } from 'react-router-dom';

import 'bulma/css/bulma.min.css';

import UserIcon from '../components/navbar/UserIcon';

import styles from '../styles/Navbar.module.css';
import logo from '../media/logo-horizontal.png';

export default function Navbar({ userDetail }) {
  let navigate = useNavigate();

  return (
    <>
      <div className={styles.navContainer}>
        <nav className={styles.navbar}>
          <div>
            <a href='/'>
              <img
                src={logo}
                alt='sportify logo'
                width='180'
                className={styles.logo}
              />
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
