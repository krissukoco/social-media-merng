import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';

import { CREATE_COMMENT } from '../../graphql/mutations';
import { getLocalData } from '../../utils/handleUserAuth';
import LoadingFull from '../utils/LoadingFull';
import ErrorCard from '../utils/ErrorCard';
import styles from '../../styles/Comment.module.css';
import noProfpic from '../../media/no-profpic.png';

const NewComment = ({ feed, client, setFeed }) => {
  const [text, setText] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState();

  const postId = feed.id;

  useEffect(() => {
    const { _, token: t } = getLocalData();
    setToken(t);
  }, []);

  const onChange = (e) => {
    e.stopPropagation();
    setText(e.target.value);
  };

  const onDataReturned = (data) => {
    // Data is Post type. Make FeedItem's state to updated post
    if (data) {
      setFeed(data.createComment);
      setText('');
    }
  };

  const onGraphqlError = (error) => {
    let err = error.graphQLErrors[0].message;
    setError(err);
  };

  const [createComment, { data, loading, error: commentError }] = useMutation(
    CREATE_COMMENT,
    {
      onError: onGraphqlError,
    }
  );

  useEffect(() => {
    onDataReturned(data);
  }, [data]);

  const onCommentSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    createComment({
      variables: {
        postId,
        text,
      },
      context: {
        headers: {
          authorization: token,
        },
      },
      fetchPolicy: 'no-cache',
    });
  };

  let profpic = noProfpic;
  if (client && client.profilePictureUrl.length != 0) {
    profpic = client.profilePictureUrl;
  }

  return (
    <div className={styles.newComment}>
      <img src={profpic} className={styles.newCommentProfPic} />
      <div className={styles.newCommentContainer}>
        <textarea
          placeholder='Comment here...'
          value={text}
          onChange={onChange}
          id='commentText'
          name='commentText'
          rows='1'
          className={styles.newCommentTextArea}
        />
        {loading ? <LoadingFull /> : null}
        {error ? <ErrorCard error={error} /> : null}
        <div style={{ display: 'flex', justifyContent: 'right', right: '0' }}>
          <button onClick={onCommentSubmit} className={styles.newCommentButton}>
            Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewComment;
