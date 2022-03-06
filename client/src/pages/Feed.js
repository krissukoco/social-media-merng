import { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLazyQuery, useQuery } from '@apollo/client';
import { AiOutlineReload } from 'react-icons/ai';

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
import LoadingSpinner from '../components/utils/LoadingSpinner';

const EmptyDiv = () => {
  return <div style={{ minHeight: '2rem' }}></div>;
};

const Feed = ({ limit }) => {
  const [searchParams] = useSearchParams();
  let l = searchParams.get('limit');
  if (!(l && Number.isInteger(l) && l > 0)) {
    l = 10;
  }
  const [postLimit, setPostLimit] = useState(l);
  const {
    posts: postsData,
    loading,
    activeTab,
    setActiveTab,
  } = useFeed(postLimit);
  const [posts, setPosts] = useState(postsData);
  const { userDetail, _ } = useContext(UserContext);

  console.log('isLoading: ', loading);
  console.log('posts: ', posts);

  useEffect(() => {
    if (postsData && !loading) {
      setPosts(postsData);
    }
  }, [postsData]);

  const onTabClick = (tab) => {
    if (activeTab != tab) {
      setActiveTab(tab);
    }
  };

  const onLoadMore = (e) => {
    e.preventDefault();
    setPostLimit(postLimit + 10);
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
            {posts && posts.length !== 0 ? (
              <div
                style={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'center',
                }}
              >
                <button onClick={onLoadMore} className={styles.loadMoreButton}>
                  {posts.length > 0 && loading ? (
                    <LoadingSpinner />
                  ) : (
                    <>
                      <AiOutlineReload
                        style={{
                          fontSize: '1.3rem',
                          margin: 'auto',
                          marginRight: '0.5rem',
                        }}
                      />
                      <p>Load More</p>
                    </>
                  )}
                </button>
              </div>
            ) : null}
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
