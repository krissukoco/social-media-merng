import { useState } from 'react';
import { FaRegComment as CommentIcon } from 'react-icons/fa';
import { AiFillLike as LikeIcon } from 'react-icons/ai';

import FeedImage from './FeedImage';
import CommentSection from './CommentSection';
import { timeString } from '../../utils/numberToString';
import styles from '../../styles/Feed.module.css';

// === ONLY FOR DEVELOPMENT. Later from GraphQL API
const userDetail = {
  id: '12345',
  username: 'kylianmbappe',
  fullname: 'Kylian Mbappe',
  profilePictureUrl:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/2019-07-17_SG_Dynamo_Dresden_vs._Paris_Saint-Germain_by_Sandro_Halank%E2%80%93129_%28cropped%29.jpg/800px-2019-07-17_SG_Dynamo_Dresden_vs._Paris_Saint-Germain_by_Sandro_Halank%E2%80%93129_%28cropped%29.jpg',
};
// =====

const FeedItem = ({ feed }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [commentsCount, setCommentsCount] = useState(feed.comments.length);
  const [likesCount, setLikesCount] = useState(feed.likes.length);
  const [openComments, setOpenComments] = useState(false);

  const likeHandler = (e) => {
    e.preventDefault();
    setIsLiked(!isLiked);
    if (!isLiked) {
      setLikesCount(likesCount + 1);
    } else {
      setLikesCount(likesCount - 1);
    }
    // TODO: Sync with DB
  };

  return (
    <a href='#'>
      <div
        className={styles.feedItemContainer}
        style={{
          maxHeight: openComments ? 'fit-content' : 'max-content',
          transition: 'max-height 2s',
        }}
      >
        <div style={{ padding: '0 0rem' }}>
          <img
            src={userDetail.profilePictureUrl}
            alt={userDetail.fullname}
            style={{
              width: '55px',
              height: '50px',
              objectFit: 'cover',
              borderRadius: '50%',
            }}
          />
        </div>

        <div className={styles.itemDetails}>
          <div className={styles.itemUser}>
            <div className='has-text-weight-bold mr-2'>
              {userDetail.fullname}
            </div>
            <div>
              <a className='has-text-info-dark'>@{userDetail.username}</a>
            </div>
          </div>
          <div className='has-text-grey-light'>
            {timeString(new Date(feed.createdAt))}
          </div>
          <div className={styles.feedBody}>
            <h5 style={{ paddingBottom: '1rem' }}>{feed.body}</h5>
            {feed.imgUrls.length > 0 ? (
              <FeedImage imgUrls={feed.imgUrls} />
            ) : null}
          </div>

          {/* Comments & Likes Container */}
          <div
            style={{ width: '100%', justifyContent: 'center', display: 'flex' }}
          >
            <a
              style={{
                display: 'flex',
                alignItems: 'center',
                margin: '0 3rem',
              }}
              onClick={(e) => likeHandler(e)}
            >
              <LikeIcon
                style={{
                  width: '20px',
                  height: '20px',
                  margin: '0 5px',
                  color: isLiked ? '#38B6FF' : 'black',
                  transition: '0.3s',
                }}
              />
              <h6 style={{ fontSize: '1rem', transition: '0.3s' }}>
                {likesCount}
              </h6>
            </a>
            <a
              style={{
                display: 'flex',
                alignItems: 'center',
                margin: '0 3rem',
              }}
              onClick={(e) => {
                e.preventDefault();
                setOpenComments(!openComments);
              }}
            >
              <CommentIcon
                style={{ width: '20px', height: '20px', margin: '0 5px' }}
              />

              <h6 style={{ fontSize: '1rem' }}>{feed.comments.length}</h6>
            </a>
          </div>

          {/* Comments section */}
          <div
            style={{
              visibility: openComments ? 'visible' : 'hidden',
              opacity: openComments ? '1' : '0',
              maxHeight: openComments ? 'max-content' : '0',
              minHeight: openComments ? 'fit-content' : '0',
              transition: 'all 1s',
              overflow: 'hidden',
            }}
          >
            <CommentSection comments={feed.comments} />
          </div>
        </div>
      </div>
    </a>
  );
};

export default FeedItem;
