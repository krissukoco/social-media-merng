import { useEffect, useState } from 'react';

import PasswordTooltip from '../../components/utils/PasswordTooltip';
import styles from '../../styles/LoginRegister.module.css';

const SignupInput = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordTooltip, setShowPasswordTooltip] = useState(false);

  const onValueChange = (ev, setter) => {
    ev.preventDefault();
    setter(ev.target.value);
  };

  const onPasswordFocused = () => {
    setShowPasswordTooltip(true);
  };

  const onPasswordUnfocused = () => {
    setShowPasswordTooltip(false);
  };

  return (
    <>
      <input
        type='text'
        placeholder='Name'
        name='name'
        className={styles.input}
        value={fullname}
        onChange={(e) => onValueChange(e, setFullname)}
      />
      <input
        type='text'
        placeholder='Email (e.g. cristiano@ronaldo.com)'
        name='email'
        className={styles.input}
        value={email}
        onChange={(e) => onValueChange(e, setEmail)}
      />
      <input
        type='text'
        placeholder='Username (e.g. miketyson20_)'
        name='username'
        className={styles.input}
        value={username}
        onChange={(e) => onValueChange(e, setUsername)}
      />
      {showPasswordTooltip ? <PasswordTooltip /> : null}
      <input
        style={{ position: 'relative' }}
        onFocus={onPasswordFocused}
        onBlur={onPasswordUnfocused}
        type='password'
        placeholder='Password'
        className={styles.input}
        name='password'
        value={password}
        onChange={(e) => onValueChange(e, setPassword)}
      />
      <input
        type='password'
        placeholder='Re-type Password'
        className={styles.input}
        name='confirmPassword'
        value={confirmPassword}
        onChange={(e) => onValueChange(e, setConfirmPassword)}
      />
    </>
  );
};

export default SignupInput;
