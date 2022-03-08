import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useMutation } from '@apollo/client';
import { FaRegComment as CommentIcon } from 'react-icons/fa';
import { AiFillLike as LikeIcon } from 'react-icons/ai';
import { BsFillTrashFill } from 'react-icons/bs';

import FeedImage from './FeedImage';
import CommentSection from './CommentSection';
import ErrorCard from '../utils/ErrorCard';
import SuccessCard from '../utils/SuccessCard';
import useUserDetail from '../../hooks/useUserDetail';
import { onGraphqlError } from '../../utils/handleAPIError';
import { timeString } from '../../utils/numberToString';

import { DELETE_POST, LIKE_POST, UNLIKE_POST } from '../../graphql/mutations';
import NewComment from './NewComment';
import UserContext from '../../context/UserContext';
import { getLocalData } from '../../utils/handleUserAuth';
import { countString } from '../../utils/numberToString';

import styles from '../../styles/Feed.module.css';
import noProfpic from '../../media/no-profpic.png';

const FeedItem = ({ feed, alwaysOpen, onFeedDeleted }) => {
  const [userDetail, __] = useUserDetail(feed.user);
  const [token, setToken] = useState();
  const [isLiked, setIsLiked] = useState(false);
  const [feedData, setFeedData] = useState(feed);
  const [likesCount, setLikesCount] = useState(0);
  const [openComments, setOpenComments] = useState(false);
  const [error, setError] = useState();

  const { userDetail: clientDetail, _ } = useContext(UserContext);
  const navigate = useNavigate();

  let timer;

  useEffect(() => {
    const { token: t } = getLocalData();
    setToken(t);
    if (feedData) {
      let numLikes = feedData.likes.length;
      setLikesCount(numLikes);
      if (clientDetail && feedData) {
        let usersLiked = feedData.likes.map((like) => like.user);
        let liked = usersLiked.includes(clientDetail.id);
        setIsLiked(liked);
      }
    }
    clearTimeout(timer);
  }, [feedData]);

  let profpic = noProfpic;
  if (userDetail && userDetail.profilePictureUrl != '') {
    profpic = userDetail.profilePictureUrl;
  }

  // --- Like post
  const [likePost, { data: likeData, loading, error: likeError }] = useMutation(
    LIKE_POST,
    {
      onError: (e) => {
        onGraphqlError(e, setError, timer);
      },
    }
  );

  useEffect(() => {
    if (likeData && !likeError) {
      setFeedData(likeData.likePost);
    }
  }, [likeData]);

  // --- Unlike post
  const [
    unlikePost,
    { data: unlikeData, loading: unlikedLoading, error: unlikeError },
  ] = useMutation(UNLIKE_POST, {
    onError: onGraphqlError,
  });
  useEffect(() => {
    if (unlikeData && !unlikeError) {
      setFeedData(unlikeData.unlikePost);
    }
  }, [unlikeData]);

  // --- Delete post
  const [
    deletePost,
    { data: deleteData, loading: deleteLoading, error: deleteError },
  ] = useMutation(DELETE_POST, {
    onError: onGraphqlError,
  });
  useEffect(() => {
    if (deleteData) {
      if (deleteData.deletePost.success === true) {
        const deletedPostId = deleteData.deletePost.postId;
        onFeedDeleted(deletedPostId);
      }
    }
  }, [deleteData]);

  const likeHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Sync with DB
    const config = {
      variables: { postId: feedData.id },
      context: {
        headers: { authorization: token },
      },
      fetchPolicy: 'no-cache',
    };
    if (!isLiked) {
      likePost(config);
    } else if (isLiked) {
      unlikePost(config);
    }
  };

  const onRemoveButtonClick = (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    deletePost({
      variables: { id },
      context: {
        headers: { authorization: token },
      },
      fetchPolicy: 'no-cache',
    });
  };

  if (!userDetail || !feedData) {
    return null;
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        e.bubbles = false;
        navigate(`/post/${feedData.id}`);
      }}
      style={{ marginBottom: '1rem' }}
    >
      <div
        className={styles.feedItemContainer}
        style={{
          maxHeight: openComments ? 'fit-content' : 'max-content',
          transition: 'max-height 2s',
        }}
      >
        <a style={{ padding: '0 0rem' }} href={`/user/${userDetail.id}`}>
          <img
            src={profpic}
            alt={userDetail.fullname}
            style={{
              width: '55px',
              height: '50px',
              objectFit: 'cover',
              borderRadius: '50%',
            }}
          />
        </a>

        <div className={styles.itemDetails}>
          {/* Name & Username */}
          <div
            className={styles.itemUser}
            onClick={(e) => {
              e.stopPropagation();
              window.location.replace(`/user/${userDetail.id}`);
            }}
          >
            <p className={styles.itemUserFullname}>{userDetail.fullname}</p>
            <div>
              <p className={styles.itemUsername}>@{userDetail.username}</p>
            </div>
            {!clientDetail ? null : userDetail.id === clientDetail.id ? (
              <button
                onClick={(e) => onRemoveButtonClick(e, feedData.id)}
                className={styles.removePostButton}
              >
                <BsFillTrashFill />
                <p>Remove</p>
              </button>
            ) : null}
            <div className={styles.itemNotifContainer}>
              {error ? <ErrorCard error={error} /> : null}
            </div>
          </div>
          <div style={{ color: 'grey' }}>
            {timeString(new Date(feedData.createdAt))}
          </div>
          <div className={styles.feedBody}>
            <h5 style={{ paddingBottom: '1rem' }}>{feedData.body}</h5>
            {feedData && feedData.imgUrls.length > 0 ? (
              <FeedImage imgUrls={feedData.imgUrls} />
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
                {countString(likesCount)}
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
                e.stopPropagation();
                if (!alwaysOpen) {
                  setOpenComments(!openComments);
                }
              }}
            >
              <CommentIcon
                style={{ width: '20px', height: '20px', margin: '0 5px' }}
              />

              <h6 style={{ fontSize: '1rem' }}>{feedData.comments.length}</h6>
            </a>
          </div>

          {/* Comments section */}
          <div
            style={{
              opacity: openComments ? '1' : '0',
              maxHeight: openComments ? 'fit-content' : '0',
              transition: 'all 0.5s',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {clientDetail ? (
              <NewComment
                feed={feedData}
                client={clientDetail}
                setFeed={setFeedData}
              />
            ) : null}
            <CommentSection comments={feedData.comments} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedItem;
