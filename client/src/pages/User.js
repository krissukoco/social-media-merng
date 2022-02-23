import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import { BsGlobe2 } from 'react-icons/bs';
import { HiPlus } from 'react-icons/hi';

import Layout from '../components/MainLayout';
import Navbar from '../components/Navbar';
import FeedItem from '../components/feed/FeedItem';
import { countString } from '../utils/numberToString';
import userDetailDummy from '../misc/dummyUser';
import dummyFeeds from '../misc/dummyFeeds';
import styles from '../styles/User.module.css';
import MainLayout from '../components/MainLayout';

// TODO: Style EmptyPage as placeholder while waiting for data
const EmptyPage = () => {
  return <div>EMPTY</div>;
};

const followButtonHandler = (id) => {
  console.log('HANDLE THIS BUTTON!!!');
  console.log('User id: ', id);
  return;
};

const User = () => {
  const userId = useParams().id;
  const [userDetail, setUserDetail] = useState(null);

  useEffect(() => {
    // TODO: Request GraphQL API to get user details. DELETE CURRENT CODE
    setUserDetail(userDetailDummy);
    // TODO: Something like:
    // useQuery(GET_USER_DETAIL){
    //    $id: userId
    // }
  }, [userDetail]);

  return (
    <MainLayout>
      <div className={styles.page}>
        {userDetail == null ? (
          <EmptyPage />
        ) : (
          <div className={styles.container}>
            <div className={styles.header}>
              <div className={styles.headerImgContainer}>
                <img
                  src={userDetail.headerImageUrl}
                  className={styles.headerImg}
                />
              </div>
              <div className={styles.userContainer}>
                <div className={styles.profilePictureContainer}>
                  <img
                    src={userDetail.profilePictureUrl}
                    className={styles.profilePicture}
                    alt={userDetail.fullname}
                  />
                </div>
                <div className={styles.detailContainer}>
                  <div style={{ minWidth: '420px' }}>
                    <div className={styles.fullname}>{userDetail.fullname}</div>
                    <div className={styles.username}>
                      @{userDetail.username}
                    </div>

                    <p className={styles.bio}>{userDetail.bio}</p>
                    <div
                      style={{ padding: '0.5rem 0' }}
                      className={styles.flexRow}
                    >
                      <div className={styles.miscContainer}>
                        <MdLocationOn />
                        <p className={styles.miscText}>{userDetail.location}</p>
                      </div>
                      {userDetail.url == null ? null : (
                        <div className={styles.miscContainer}>
                          <BsGlobe2 />
                          <a href={`https://${userDetail.url}`} target='_blank'>
                            <p className={styles.miscText}>{userDetail.url}</p>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={styles.headerRightContainer}>
                    <div className={`${styles.flexRow} ${styles.rowCentered}`}>
                      <a className={styles.followContainer}>
                        <h2 className={styles.followText}>Followings</h2>
                        <h2 className={styles.followNumText}>
                          {countString(userDetail.following.length)}
                        </h2>
                      </a>
                      <a className={styles.followContainer}>
                        <h2 className={styles.followText}>Followers</h2>
                        <p className={styles.followNumText}>
                          {countString(userDetail.followers.length)}
                        </p>
                      </a>
                    </div>
                    <div className={`${styles.flexRow} ${styles.rowCentered}`}>
                      {/* TODO: Make button only visible if not the user itself */}
                      {/* TODO: Make "Followed" button if already following this user (and are not themselves) */}
                      <button
                        className={styles.followButton}
                        onClick={() => followButtonHandler(userDetail.id)}
                      >
                        <HiPlus style={{ marginRight: '0.5rem' }} />{' '}
                        <p>Follow</p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.feedContainer}>
              {/* TODO: Change this to posts by the user */}
              {dummyFeeds.map((feed) => (
                <FeedItem feed={feed} />
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default User;
