import React from 'react';

import MainLayout from '../components/MainLayout';
import LeftBar from '../components/feed/LeftBar';
import RightBar from '../components/feed/RightBar';
import FeedItem from '../components/feed/FeedItem';
import NewPost from '../components/feed/NewPost';
import styles from '../styles/Feed.module.css';

import dummyFeeds from '../misc/dummyFeeds';

// Placeholder, for developing components
const userDetail = {
  id: '00000',
  username: 'leomessi',
  fullname: 'Lionel Messi',
  email: 'leomessi@parisfc.com',
  bio: "<p>Playmaker, Free Kick KING. <br> 7 times Ballon D'Or</p>",
  location: 'Rosario, Argentina',
  followers: ['12345', '23456', '34567', '45678'],
  following: ['11111'],
  profilePictureUrl:
    'https://upload.wikimedia.org/wikipedia/commons/c/c1/Lionel_Messi_20180626.jpg',
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

const Feed = () => {
  return (
    <div>
      <MainLayout>
        <div className={styles.feedContainer}>
          <div className={styles.leftBar}>
            <LeftBar userDetail={userDetail} />
          </div>

          <div className={styles.feed}>
            <NewPost
              userId={userDetail.id}
              profPic={userDetail.profilePictureUrl}
            />
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
