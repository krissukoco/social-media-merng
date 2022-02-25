import { useEffect, useState } from 'react';

import styles from '../../styles/LoginRegister.module.css';

const LoginInput = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');

  const onValueChange = (ev, setter) => {
    ev.preventDefault();
    setter(ev.target.value);
  };

  return (
    <>
      <input
        type='text'
        placeholder='Email or username'
        name='emailOrUsername'
        className={styles.input}
        value={emailOrUsername}
        onChange={(e) => onValueChange(e, setEmailOrUsername)}
      />
      <input
        type='password'
        placeholder='Password'
        name='password'
        className={styles.input}
        value={password}
        onChange={(e) => onValueChange(e, setPassword)}
      />
    </>
  );
};

export default LoginInput;
