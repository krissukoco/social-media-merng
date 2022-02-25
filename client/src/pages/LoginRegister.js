import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useMutation, gql } from '@apollo/client';
import ReactHrmlParser from 'react-html-parser';

import Footer from '../components/Footer';
import LoginInput from '../components/loginRegister/LoginInput';
import SignupInput from '../components/loginRegister/SignupInput';
import { LOGIN_USER, REGISTER_USER } from '../graphql/mutations';
import styles from '../styles/LoginRegister.module.css';
import logo from '../media/logo-horizontal.png';

import texts from '../misc/copywritingLogin';
import spinnerWhite from '../media/loading-spinner-white.gif';
import spinnerBlue from '../media/loading-spinner-blue.gif';

const ErrorCard = ({ errors }) => {
  return (
    <div className={styles.errorCard}>
      {/* <h2
        style={{
          textAlign: 'left',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
        }}
      >
        Please fix following inputs:{' '}
      </h2> */}
      <ul className={styles.errorList}>
        {errors.map((e, i) => (
          <li key={i}>{e}</li>
        ))}
      </ul>
    </div>
  );
};

const LoginRegister = ({ page }) => {
  const getTexts = (type) => {
    return texts.find((t) => {
      return t.type == type;
    });
  };
  let navigate = useNavigate();

  const [pageType, setPageType] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [text, setText] = useState(getTexts(pageType));
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // TODO: CHANGE to check token in localStorage instead
  if (isLoggedIn) {
    navigate('/feed');
  }

  useEffect(() => {
    if (!page) {
      setPageType('login');
    } else if (page === 'login' || page === 'signup') {
      setPageType(page);
    } else {
      setPageType('login');
      console.log("page type not supported. Returning 'login'");
    }
  }, []);

  // When page change from Log In to Sign Up and vv
  useEffect(() => {
    setIsLoading(false);
    setErrors([]);
    setText(getTexts(page));
  }, [pageType]);

  function onAPIErrors(err) {
    let newErrors = [];
    err.graphQLErrors.map((e) => newErrors.push(e.message));
    setErrors(newErrors);
  }

  // TODO: CHANGE to save token to localStorage
  function onSuccess(result) {
    const { userId, token } = result;

    // SAVE TOKEN HERE
    // setToken(`Bearer ${token}`);

    setIsLoggedIn(true);
  }

  const [
    registerUser,
    { registerData, loading: registerLoading, error: registerError },
  ] = useMutation(REGISTER_USER, {
    update: (_, result) => {
      onSuccess(result.data.registerUser);
    },
    onError: (error) => onAPIErrors(error),
  });

  const [loginUser, { loginData, loading: loginLoading, error: loginError }] =
    useMutation(LOGIN_USER, {
      update: (_, result) => {
        onSuccess(result.data.loginUser);
      },
      onError: (error) => {
        console.log(error.graphQLErrors);
        onAPIErrors(error);
      },
    });

  console.log('GraphQL Register Data: ', registerData);
  console.log('GraphQL Login Data: ', loginData);
  console.log('Errors', errors, 'length', errors.length);

  // TODO: Make mutation to GraphQL endpoint
  const onSubmit = (ev) => {
    ev.preventDefault();
    let variables = {};
    switch (pageType) {
      case 'signup':
        variables = {
          input: {
            fullname: ev.target.name.value,
            email: ev.target.email.value,
            username: ev.target.username.value,
            password: ev.target.password.value,
            confirmPassword: ev.target.confirmPassword.value,
          },
        };
        registerUser({ variables });
        break;
      case 'login':
        variables = {
          input: {
            emailOrUsername: ev.target.emailOrUsername.value,
            password: ev.target.password.value,
          },
        };
        loginUser({ variables });
      default:
        break;
    }
  };

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
              {ReactHrmlParser(text.heading)}
              {/* Share your sports. Let others appreciate. */}
            </h1>
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'rgb(166,166,166)' }}>
              {ReactHrmlParser(text.secondary)}
              {/* Free to register. <br />
              Join other 3 million users! */}
            </h3>
          </div>
          <form
            onSubmit={onSubmit}
            className={styles.inputContainer}
            method='post'
            noValidate
          >
            {pageType == 'login' ? <LoginInput /> : <SignupInput />}
            {errors.length > 0 ? <ErrorCard errors={errors} /> : null}
            <button className={styles.mainButton} type='submit'>
              {isLoading ? (
                <img src={spinnerBlue} width='20px' />
              ) : (
                text.mainButton
              )}
            </button>
          </form>
          <div>
            <h3 style={{ fontSize: '1.1rem' }}>{text.changePage}</h3>
            <button
              onClick={(e) => {
                if (pageType === 'login') {
                  e.preventDefault();
                  navigate('/signup');
                  setPageType('signup');
                } else {
                  e.preventDefault();
                  navigate('/login');
                  setPageType('login');
                }
              }}
              className={styles.secondaryButton}
            >
              {text.secondaryButton}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginRegister;