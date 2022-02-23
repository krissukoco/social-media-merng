import { useState, useEffect } from 'react';

import MainLayout from '../components/MainLayout';
import LeftBar from '../components/feed/LeftBar';
import RightBar from '../components/feed/RightBar';
import FeedItem from '../components/feed/FeedItem';
import NewPost from '../components/feed/NewPost';
import styles from '../styles/Feed.module.css';

import dummyFeeds from '../misc/dummyFeeds';
import userDetailDummy from '../misc/dummyUser';

const EmptyDiv = () => {
  return <div style={{ minHeight: '2rem' }}></div>;
};

const Feed = () => {
  const [userDetail, setUserDetail] = useState(null);

  // ------- TODO: DELETE AFTER DEVELOPMENT
  //               Change with getting data from API
  useEffect(() => {
    setUserDetail(userDetailDummy);
  }, [userDetail]);
  // -------

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
              <NewPost
                userId={userDetail.id}
                profPic={userDetail.profilePictureUrl}
              />
            )}
            {dummyFeeds.map((feed) => (
              <FeedItem key={feed.id} feed={feed} />
            ))}
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
