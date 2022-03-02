import { useState, useEffect, useContext } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';

import MainLayout from '../components/MainLayout';
import LeftBar from '../components/feed/LeftBar';
import RightBar from '../components/feed/RightBar';
import FeedItem from '../components/feed/FeedItem';
import NewPost from '../components/feed/NewPost';

import useFeed from '../hooks/useFeed';
import UserContext from '../context/UserContext';
import styles from '../styles/Feed.module.css';
import { getLocalData } from '../utils/handleUserAuth';
import { GET_FEED_FOLLOWING, GET_FEED_LATEST } from '../graphql/queries';
import LoadingFull from '../components/utils/LoadingFull';

const EmptyDiv = () => {
  return <div style={{ minHeight: '2rem' }}></div>;
};

const Feed = () => {
  // const [activeTab, setActiveTab] = useState('latest');
  // const [posts, setPosts] = useState([]);
  const [posts, activeTab, setActiveTab] = useFeed(10);
  const [error, setError] = useState();

  const { userDetail, _ } = useContext(UserContext);

  const onTabClick = (tab) => {
    if (activeTab != tab) {
      setActiveTab(tab);
    }
  };

  return (
    <div>
      <MainLayout>
        <div className={styles.feedContainer}>
          <div className={styles.leftBar}>
            <LeftBar userDetail={userDetail} />
          </div>

          <div className={styles.feed}>
            {userDetail == null ? (
              <EmptyDiv />
            ) : (
              <NewPost userDetail={userDetail} />
            )}
            <span className={styles.feedTab}>
              <a
                className={`${activeTab == 'latest' ? styles.tabActive : null}`}
                onClick={() => onTabClick('latest')}
              >
                Latest
              </a>
              {userDetail ? (
                <a
                  className={
                    activeTab == 'followings' ? styles.tabActive : null
                  }
                  onClick={() => onTabClick('followings')}
                >
                  Followings
                </a>
              ) : null}
            </span>
            {posts.length > 0 ? (
              posts.map((feed) => (
                <FeedItem key={feed.id} feed={feed} alwaysOpen={false} />
              ))
            ) : (
              <div className={styles.noPosts}>
                Currently no posts are available
              </div>
            )}
          </div>

          <div className={styles.rightBar}>
            <RightBar />
          </div>
        </div>
      </MainLayout>
    </div>
  );
};

export default Feed;
