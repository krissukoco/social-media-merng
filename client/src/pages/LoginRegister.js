import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';
import { useMutation, gql } from '@apollo/client';
import ReactHrmlParser from 'react-html-parser';

import Footer from '../components/Footer';
import LoginInput from '../components/loginRegister/LoginInput';
import SignupInput from '../components/loginRegister/SignupInput';
import ErrorCard from '../components/utils/ErrorCard';

import { LOGIN_USER, REGISTER_USER } from '../graphql/mutations';
import {
  getLocalData,
  saveLocalData,
  deleteLocalData,
} from '../utils/handleUserAuth';
import UserContext from '../context/UserContext';
import styles from '../styles/LoginRegister.module.css';
import logo from '../media/logo-horizontal.png';

import texts from '../misc/copywritingLogin';
import spinnerBlue from '../media/loading-spinner-blue.gif';

const LoginRegister = ({ page }) => {
  const getTexts = (type) => {
    return texts.find((t) => {
      return t.type == type;
    });
  };
  let navigate = useNavigate();

  const [pageType, setPageType] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [text, setText] = useState(getTexts(pageType));

  // Initialize page
  useEffect(() => {
    let token = getLocalData().token;
    if (token) {
      window.location.replace('/feed');
    }
    if (!page) {
      setPageType('login');
    } else if (page === 'login' || page === 'signup') {
      setPageType(page);
    } else {
      setPageType('login');
      console.log("page type not supported. Returning 'login'");
    }
  }, [pageType]);

  // When page change from Log In to Sign Up and vv
  useEffect(() => {
    setIsLoading(false);
    setError();
    setText(getTexts(page));
  }, [pageType, text]);

  function onAPIError(err) {
    // let newErrors = [];
    // err.graphQLErrors.map((e) => newErrors.push(e.message));
    setError(err.graphQLErrors[0].message);
  }

  // If login/signup is success
  function onSuccess(result) {
    const { userId, token } = result;
    deleteLocalData();
    saveLocalData(userId, token);
    window.location.replace('/feed');
  }

  // Two utilities to register/login user
  const [
    registerUser,
    { registerData, loading: registerLoading, error: registerError },
  ] = useMutation(REGISTER_USER, {
    update: (_, result) => {
      onSuccess(result.data.registerUser);
    },
    onError: (error) => onAPIError(error),
  });

  const [loginUser, { loginData, loading: loginLoading, error: loginError }] =
    useMutation(LOGIN_USER, {
      update: (_, result) => {
        onSuccess(result.data.loginUser);
      },
      onError: (error) => {
        console.log(error.graphQLErrors);
        onAPIError(error);
      },
    });

  // Handle loading on main button
  useEffect(() => {
    if (registerLoading || loginLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [registerLoading, loginLoading]);

  console.log('GraphQL Register Data: ', registerData);
  console.log('GraphQL Login Data: ', loginData);
  console.log('Error', error);

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
            {error ? <ErrorCard error={error} /> : null}
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
