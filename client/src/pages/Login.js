import { useState } from 'react';

import Footer from '../components/Footer';
import styles from '../styles/LoginRegister.module.css';
import logo from '../media/logo-horizontal.png';

const ErrorCard = (error) => {
  return (
    <div>
      <h3>{error}</h3>
    </div>
  );
};

const Login = () => {
  const [errors, setErrors] = useState([]);
  // TODO: Make function to check errors while login / register
  // .... then call setErrors()

  return (
    <>
      <div className={styles.page}>
        <div className={styles.imgContainer}></div>
        <div className={styles.mainContainer}>
          <div className={styles.logoContainer}>
            <a href='/'>
              <img src={logo} className={styles.logo} href='/' />
            </a>
          </div>
          <div>
            <h1
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                paddingBottom: '0.5rem',
              }}
            >
              Welcome Back, Sport Enthusiasts!
              {/* Share your sports. Let others appreciate. */}
            </h1>
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'rgb(166,166,166)' }}>
              Share pictures and opinions on sports. <br />
              Let other 3 milion users see
              {/* Free to register. <br />
              Join other 3 million users! */}
            </h3>
          </div>
          <div className={styles.inputContainer}>
            {errors.length > 0
              ? errors.map((error) => <ErrorCard error={error} />)
              : null}
            <input
              type='text'
              placeholder='Email or username'
              className={styles.input}
            />
            <input
              type='password'
              placeholder='Password'
              className={styles.input}
            />
            <button className={styles.mainButton}>Log In</button>
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem' }}>No account yet? It's FREE!</h3>
            <button className={styles.secondaryButton}>Sign Up</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
