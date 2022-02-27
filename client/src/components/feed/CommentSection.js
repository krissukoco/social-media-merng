import React from 'react';

import { timeString, countString } from '../../utils/numberToString';
import styles from '../../styles/Comment.module.css';

// TODO: Sort comments by recently created
// TODO: getUser(id) from GraphQL to get user's details
// TODO: LIMIT the comments shown to be 5, add Load More...
// TODO: Set the comment design

// === ONLY FOR DEVELOPMENT
const users = [
  {
    id: '12345',
    fullname: 'Neymar Jr.',
    username: 'neymarjr',
    profilePictureUrl:
      'https://upload.wikimedia.org/wikipedia/commons/8/83/Bra-Cos_%281%29_%28cropped%29.jpg',
  },
  {
    id: '23456',
    fullname: 'Sergio Ramos',
    username: 'sergioramos',
    profilePictureUrl:
      'https://upload.wikimedia.org/wikipedia/commons/4/43/Russia-Spain_2017_%286%29.jpg',
  },
];
// =====

// === COMPONENTS ===
const CommentItem = ({ comment }) => {
  const user = users.find(({ id }) => id == comment.user);

  return (
    <div className={`${styles.commentItem}`}>
      <div style={{ margin: '0 0.5rem' }}>
        <img
          src={user.profilePictureUrl}
          alt={user.fullname}
          className={styles.profilePicture}
        />
      </div>
      <div style={{ margin: '0 0.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <h1 style={{ paddingRight: '0.5rem', fontWeight: 'bold' }}>
            {user.fullname}
          </h1>
          <a style={{ color: 'darkblue' }}>@{user.username}</a>
        </div>
        <h6 style={{ color: 'grey' }}>
          {timeString(new Date(comment.createdAt))}
        </h6>
        <h5>{comment.body}</h5>
      </div>
    </div>
  );
};

const CommentSection = ({ comments }) => {
  return (
    <div className={styles.commentSection}>
      <h3 style={{ fontSize: '0.9rem', color: 'grey' }}>
        Showing {countString(comments.length)} comments
      </h3>
      {comments.map((comment, i) => (
        <CommentItem key={i} comment={comment} />
      ))}
    </div>
  );
};

export default CommentSection;
