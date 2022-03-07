import { useState } from 'react';
import { useNavigate } from 'react-router';

import useOutsideClick from '../../utils/useOutsideClick';
import onLogout from '../../utils/onLogout';
import styles from '../../styles/Navbar.module.css';
import noProfpic from '../../media/no-profpic.png';

const Option = ({ children, onClick, style }) => {
  return (
    <a className={styles.navbarIconOption} style={style} onClick={onClick}>
      {children}
    </a>
  );
};

const Dropdown = ({ userDetail }) => {
  let navigate = useNavigate();

  const profpic = userDetail.profilePictureUrl || noProfpic;
  return (
    <div className={styles.dropdown}>
      <a href={`/user/${userDetail.id}`} className={styles.dropdownUser}>
        <img src={profpic} className={styles.dropdownUserImg} />
        <div className={styles.dropdownName}>
          <h3>@{userDetail.username}</h3>
          <h4>{userDetail.fullname}</h4>
        </div>
      </a>
      <div className={styles.dropPlaceholder}></div>
      <Option onClick={() => navigate('/settings')}>Settings</Option>
      <Option onClick={onLogout} style={{ color: 'red' }}>
        Log Out
      </Option>
    </div>
  );
};

const UserIcon = ({ userDetail }) => {
  const [isOpen, setiIsOpen] = useState(false);
  const ref = useOutsideClick(setiIsOpen);

  const profpic = userDetail.profilePictureUrl || noProfpic;

  return (
    <div
      onClick={() => setiIsOpen(!isOpen)}
      ref={ref}
      style={{
        cursor: 'pointer',
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center',
      }}
    >
      <img
        src={profpic}
        style={{
          width: '45px',
          height: '45px',
          objectFit: 'cover',
          borderRadius: '50%',
          alignContent: 'center',
        }}
      />
      {isOpen && <Dropdown userDetail={userDetail} />}
    </div>
  );
};

export default UserIcon;
