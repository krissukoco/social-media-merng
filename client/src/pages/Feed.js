import { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLazyQuery, useQuery } from '@apollo/client';
import { AiOutlineReload } from 'react-icons/ai';

import MainLayout from '../components/MainLayout';
import LeftBar from '../components/feed/LeftBar';
import RightBar from '../components/feed/RightBar';
import FeedItem from '../components/feed/FeedItem';
import NewPost from '../components/feed/NewPost';
import ErrorCard from '../components/utils/ErrorCard';

import useFeed from '../hooks/useFeed';
import UserContext from '../context/UserContext';
import styles from '../styles/Feed.module.css';
import { getLocalData } from '../utils/handleUserAuth';
import { GET_FEED_FOLLOWING, GET_FEED_LATEST } from '../graphql/queries';
import LoadingFull from '../components/utils/LoadingFull';
import LoadingSpinner from '../components/utils/LoadingSpinner';
import SuccessCard from '../components/utils/SuccessCard';

const EmptyDiv = () => {
  return <div style={{ minHeight: '2rem' }}></div>;
};

const Feed = () => {
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
    error,
  } = useFeed(postLimit);
  const [posts, setPosts] = useState(postsData);
  const { userDetail, _ } = useContext(UserContext);
  const [successDelete, setSuccessDelete] = useState(false);

  console.log('isLoading: ', loading);
  console.log('posts: ', posts);

  useEffect(() => {
    if (postsData && !loading) {
      setPosts(postsData);
    }
  }, [postsData]);

  const onNewPost = (data) => {
    if (data) {
      const newFeed = [data].concat(postsData);
      setPosts(newFeed);
    }
  };

  const onTabClick = (tab) => {
    if (activeTab != tab) {
      setActiveTab(tab);
    }
  };

  const onLoadMore = (e) => {
    e.preventDefault();
    setPostLimit(postLimit + 10);
  };

  const onFeedDeleted = (id) => {
    const newFeed = posts.filter((post) => post.id != id);
    setPosts(newFeed);
    setSuccessDelete(true);
    setTimeout(() => setSuccessDelete(false), 2000);
  };

  return (
    <div>
      <MainLayout>
        <div className={styles.feedContainer}>
          {/* LEFT BAR */}
          <div className={styles.leftBar}>
            <LeftBar userDetail={userDetail} />
          </div>

          <div className={styles.feed}>
            {userDetail == null ? (
              <EmptyDiv />
            ) : (
              <NewPost userDetail={userDetail} onNewPost={onNewPost} />
            )}

            <span className={styles.feedTab}>
              <a
                className={`${activeTab == 'latest' ? styles.tabActive : null}`}
                style={{ width: userDetail == null ? '100%' : null }}
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

            {error || successDelete ? (
              <div
                style={{
                  minHeight: '2rem',
                  margin: '1rem 0',
                  position: 'relative',
                }}
              >
                {error ? <ErrorCard error={error} /> : null}
                {successDelete ? <SuccessCard text='Post Removed' /> : null}
              </div>
            ) : null}

            {posts.length > 0 ? (
              posts.map((feed) => (
                <FeedItem
                  key={feed.id}
                  feed={feed}
                  alwaysOpen={false}
                  onFeedDeleted={onFeedDeleted}
                />
              ))
            ) : (
              <div className={styles.noPosts}>
                Currently no posts are available
              </div>
            )}
            {posts && posts.length !== 0 && !loading ? (
              <div
                style={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'center',
                }}
              >
                <button onClick={onLoadMore} className={styles.loadMoreButton}>
                  <AiOutlineReload
                    style={{
                      fontSize: '1.3rem',
                      margin: 'auto',
                      marginRight: '0.5rem',
                    }}
                  />
                  <p>Load More</p>
                </button>
              </div>
            ) : null}
            {loading ? (
              <div style={{ padding: '1rem 0' }}>
                <LoadingFull />
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
