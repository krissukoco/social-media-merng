import { useState } from 'react';
import ReactHtmlParser from 'react-html-parser';
import 'bulma/css/bulma.min.css';

import { countString } from '../../utils/numberToString';
import styles from '../../styles/LeftBar.module.css';

const LeftBar = ({ userDetail }) => {
  if (userDetail) {
    return (
      <div className={styles.container}>
        <img
          className={styles.imgUser}
          src={userDetail.profilePictureUrl}
          alt={userDetail.fullname}
        />
        <h3 className={styles.fullname}>{userDetail.fullname}</h3>
        <h3 className={styles.location}>{userDetail.location}</h3>
        <h5 className={styles.bio}>{ReactHtmlParser(userDetail.bio)}</h5>
        <div className={styles.userConnectionContainer}>
          <a className={styles.userConnection}>
            <h1>Followings</h1>
            <h4>{countString(userDetail.following.length)}</h4>
          </a>
          <a className={styles.userConnection}>
            <h1>Followers</h1>
            <h4>{countString(userDetail.followers.length)}</h4>
          </a>
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default LeftBar;