import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import UserContext from '../context/UserContext';
import LeftBar from '../components/feed/LeftBar';
import RightBar from '../components/feed/RightBar';
import MainLayout from '../components/MainLayout';
import FeedItem from '../components/feed/FeedItem';

import ErrorCard from '../components/utils/ErrorCard';
import LoadingFull from '../components/utils/LoadingFull';
import styles from '../styles/Feed.module.css';
import usePost from '../hooks/usePost';

const PostIsDeleted = () => {
  return (
    <div className={styles.postIsDeleted}>
      <h2>
        Post has been deleted. <br></br> Redirecting to{' '}
        <a href='/feed'>Feed page</a>...
      </h2>
    </div>
  );
};

const Post = () => {
  const { id: postId } = useParams();
  const { userDetail, _ } = useContext(UserContext);
  const [error, setError] = useState();
  const [postDeleted, setPostDeleted] = useState(false);

  const { post, loading, error: postError } = usePost(postId);
  useEffect(() => {
    if (postError) {
      setError(postError.message);
    } else {
      setError();
    }
  }, [postError]);
  console.log('Post.js error: ', error);
  console.log('Post.js post: ', post);

  // Show "Post Deleted", then setTimeout to back to feed
  const onFeedDeleted = (id) => {
    setPostDeleted(true);
    setTimeout(() => {
      window.location.replace('/feed');
    }, 2000);
  };

  return (
    <MainLayout>
      <div className={styles.feedContainer}>
        <div className={styles.leftBar}>
          <LeftBar userDetail={userDetail} />
        </div>
        {error ? <ErrorCard error={error} /> : null}
        {loading ? (
          <LoadingFull />
        ) : post ? (
          <div className={styles.feed}>
            <h2
              style={{
                fontSize: '1.2rem',
                color: 'grey',
                width: '100%',
                textAlign: 'center',
                padding: '0.8rem 0',
              }}
            >
              Post
            </h2>
            {postDeleted ? (
              <PostIsDeleted />
            ) : (
              <FeedItem
                feed={post}
                alwaysOpen={true}
                onFeedDeleted={onFeedDeleted}
              />
            )}
          </div>
        ) : null}
        {}
        <div className={styles.rightBar}>
          <RightBar />
        </div>
      </div>
    </MainLayout>
  );
};

export default Post;
