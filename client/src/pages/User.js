import { useState, useEffect, useContext } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useParams, useSearchParams } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import { BsGlobe2 } from 'react-icons/bs';
import { HiPlus, HiCheck } from 'react-icons/hi';
import { AiFillEdit } from 'react-icons/ai';

import Layout from '../components/MainLayout';
import Navbar from '../components/Navbar';
import FeedItem from '../components/feed/FeedItem';

import MainLayout from '../components/MainLayout';
import useUserDetail from '../hooks/useUserDetail';
import noProfpic from '../media/no-profpic.png';
import noUserBg from '../media/no-background.jpg';
import { countString } from '../utils/numberToString';
import { GET_POSTS_BY_USER } from '../graphql/queries';
import { FOLLOW_USER, UNFOLLOW_USER } from '../graphql/mutations';

import styles from '../styles/User.module.css';
import UserContext from '../context/UserContext';
import { getLocalData } from '../utils/handleUserAuth';
import LoadingButton from '../components/utils/LoadingButton';
import LoadingFull from '../components/utils/LoadingFull';
import LoadingSpinner from '../components/utils/LoadingSpinner';

// EmptyPage as placeholder while waiting for data
const EmptyPage = () => {
  return (
    <div>
      <LoadingFull />
    </div>
  );
};

const FollowButton = ({ handler }) => {
  return (
    <button className={styles.followButton} onClick={handler}>
      <HiPlus style={{ marginRight: '0.5rem' }} /> <p>Follow</p>
    </button>
  );
};

const FollowedButton = ({ handler }) => {
  return (
    <button className={styles.followedButton} onClick={handler}>
      <HiCheck style={{ marginRight: '0.5rem' }} />
      <p>Followed</p>
    </button>
  );
};

const getQueryParams = (key) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(key);
};

const User = () => {
  const l = getQueryParams('limit') ? getQueryParams('limit') : 10;
  const [limit, setLimit] = useState(l);

  const userId = useParams().id;
  const [userDetail, setUserDetail] = useUserDetail(userId);
  const { userDetail: clientDetail, setUserDetail: setClientDetail } =
    useContext(UserContext);
  const [isFollowing, setIsFollowing] = useState(false);

  const [numFollowings, setNumFollowings] = useState(0);
  const [numFollowers, setNumFollowers] = useState(0);
  const [posts, setPosts] = useState([]);
  const [token, setToken] = useState();

  useEffect(() => {
    const { _, token: t } = getLocalData();
    setToken(t);
  }, []);

  useEffect(() => {
    let clientFollowing = clientDetail && clientDetail.following;
    if (clientFollowing && clientFollowing.includes(userId)) {
      setIsFollowing(true);
    }
  }, [clientDetail]);

  useEffect(() => {
    if (userDetail && userDetail.following !== undefined) {
      setNumFollowings(userDetail.following.length);
    }
    if (userDetail && userDetail.followers !== undefined) {
      setNumFollowers(userDetail.followers.length);
    }
  }, [userDetail]);

  const profpic =
    userDetail && userDetail.profilePictureUrl
      ? userDetail.profilePictureUrl
      : noProfpic;
  const bg =
    userDetail && userDetail.bgPictureUrl ? userDetail.bgPictureUrl : noUserBg;

  const EditProfileButton = () => {
    return (
      <button
        className={styles.editProfileButton}
        onClick={(e) => {
          window.location.replace('/settings');
        }}
      >
        <AiFillEdit style={{ marginRight: '0.5rem' }} />
        <p>Edit Profile</p>
      </button>
    );
  };

  // Related to Posts by User
  const { data, loading, error } = useQuery(GET_POSTS_BY_USER, {
    variables: {
      userId: userId,
      limit: limit,
    },
    context: {
      authorization: token,
    },
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    if (data) {
      setPosts(data.getPostsByUser);
    }
  }, [data]);

  // ---- Follow User -----
  const [
    followUser,
    { data: followData, loading: followLoading, error: followError },
  ] = useMutation(FOLLOW_USER);

  const onFollow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // setIsFollowing(true);
    followUser({
      variables: { id: userId },
      context: {
        headers: { authorization: token },
      },
      fetchPolicy: 'no-cache',
    });
    setNumFollowers(numFollowers + 1);
  };

  useEffect(() => {
    if (followData) {
      setClientDetail(followData.followUser);
      setIsFollowing(true);
      // window.location.reload();
    }
  }, [followData]);

  // ---- Unfollow User -----
  const [
    unfollowUser,
    { data: unfollowData, loading: unfollowLoading, error: unfollowError },
  ] = useMutation(UNFOLLOW_USER);

  const onUnfollow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // setIsFollowing(false);
    unfollowUser({
      variables: { id: userId },
      context: {
        headers: { authorization: token },
      },
      fetchPolicy: 'no-cache',
    });

    if (numFollowers > 0) {
      setNumFollowers(numFollowers - 1);
    }
  };

  useEffect(() => {
    if (unfollowData) {
      setClientDetail(unfollowData.unfollowUser);
      setIsFollowing(false);
      // window.location.reload();
    }
  }, [unfollowData]);

  if (!userDetail) {
    return null;
  }

  return userDetail ? (
    <MainLayout>
      <div className={styles.page}>
        {userDetail == null ? (
          <EmptyPage />
        ) : (
          <div className={styles.container}>
            <div className={styles.header}>
              <div className={styles.headerImgContainer}>
                <img src={bg} className={styles.headerImg} />
              </div>
              <div className={styles.userContainer}>
                <div className={styles.profilePictureContainer}>
                  <img
                    src={profpic}
                    className={styles.profilePicture}
                    alt={userDetail.fullname}
                  />
                </div>
                <div className={styles.detailContainer}>
                  <div className={styles.detailLeft}>
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
                          {countString(numFollowings)}
                        </h2>
                      </a>
                      <a className={styles.followContainer}>
                        <h2 className={styles.followText}>Followers</h2>
                        <p className={styles.followNumText}>
                          {countString(numFollowers)}
                        </p>
                      </a>
                    </div>
                    <div className={`${styles.rowCentered} ${styles.flexRow}`}>
                      {/* Button types: Follow, Followed, Edit Profile */}
                      {clientDetail ? (
                        followLoading || unfollowLoading ? (
                          <LoadingButton />
                        ) : clientDetail.id == userId ? (
                          <EditProfileButton />
                        ) : !clientDetail ? null : !isFollowing ? (
                          <FollowButton handler={onFollow} />
                        ) : (
                          <FollowedButton handler={onUnfollow} />
                        )
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.feedContainer}>
              {loading ? <LoadingFull /> : null}
              {posts.map((feed, i) => (
                <FeedItem key={i} feed={feed} />
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  ) : null;
};

export default User;
