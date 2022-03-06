import React from 'react';

import { timeString, countString } from '../../utils/numberToString';
import styles from '../../styles/Comment.module.css';
import useUserDetail from '../../hooks/useUserDetail';
import noProfpic from '../../media/no-profpic.png';

// TODO: Sort comments by recently created
// TODO: getUser(id) from GraphQL to get user's details
// TODO: LIMIT the comments shown to be 5, add Load More...
// TODO: Set the comment design
// =====

// === COMPONENTS ===
const CommentItem = ({ comment }) => {
  const userId = comment.user;

  const [user, setUser] = useUserDetail(userId);

  let profpic = noProfpic;
  if (user && user.profilePictureUrl.length > 0) {
    profpic = user.profilePictureUrl;
  }

  if (!user) return null;

  return (
    user && (
      <div className={`${styles.commentItem}`}>
        <div style={{ margin: '0 0.5rem' }}>
          <img
            src={profpic}
            alt={user.fullname}
            className={styles.profilePicture}
          />
        </div>
        <div style={{ margin: '0 0.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <h1 className={styles.commentItemFullname}>{user.fullname}</h1>
            <a href={`/user/${user.id}`} className={styles.commentItemUsername}>
              @{user.username}
            </a>
          </div>
          <h6 style={{ fontSize: '0.8rem', color: 'grey' }}>
            {timeString(new Date(comment.createdAt))}
          </h6>
          <h5 className={styles.commentBody}>{comment.body}</h5>
        </div>
      </div>
    )
  );
};

const CommentSection = ({ comments }) => {
  if (!comments || comments.length == 0) {
    return null;
  }
  return (
    <div className={styles.commentSection}>
      <h3 style={{ fontSize: '0.9rem', color: 'grey' }}>
        Showing {countString(comments.length)} comments
      </h3>
      {comments &&
        comments.length > 0 &&
        comments.map((comment, i) => <CommentItem key={i} comment={comment} />)}
    </div>
  );
};

export default CommentSection;
