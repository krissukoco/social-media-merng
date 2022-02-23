import { useState, useRef, useEffect } from 'react';

import useOutsideClick from '../../utils/useOutsideClick';
import styles from '../../styles/Navbar.module.css';

const Option = ({ text, to, style }) => {
  return (
    <a href={to} className={styles.navbarIconOption} style={style}>
      {text}
    </a>
  );
};

const Dropdown = ({ userDetail }) => {
  return (
    <div className={styles.dropdown}>
      <a href={`/user/${userDetail.id}`} className={styles.dropdownUser}>
        <img
          src={userDetail.profilePictureUrl}
          className={styles.dropdownUserImg}
        />
        <div className={styles.dropdownName}>
          <h3>@{userDetail.username}</h3>
          <h4>{userDetail.fullname}</h4>
        </div>
      </a>
      <div className={styles.dropPlaceholder}></div>
      {/* TODO: CHANGE "to" to the real target/route */}
      <Option text='Log Out' to='#' style={{ color: 'red' }} />
    </div>
  );
};

const UserIcon = ({ userDetail }) => {
  const [isOpen, setiIsOpen] = useState(false);
  const ref = useOutsideClick(setiIsOpen);

  return (
    <a onClick={() => setiIsOpen(!isOpen)} ref={ref}>
      <img
        src={userDetail.profilePictureUrl}
        style={{
          width: '45px',
          height: '45px',
          objectFit: 'cover',
          borderRadius: '50%',
        }}
      />
      {isOpen && <Dropdown userDetail={userDetail} />}
    </a>
  );
};

export default UserIcon;
