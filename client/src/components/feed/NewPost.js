import { useState } from 'react';
import { MdAddPhotoAlternate, MdOutlinePoll } from 'react-icons/md';

import styles from '../../styles/NewPost.module.css';

const NewPost = ({ userId, profPic }) => {
  const [isActive, setIsActive] = useState(false);
  return (
    <div className={styles.container}>
      <img src={profPic} className={styles.profilePicture} />
      <div className={styles.postInput}>
        <textarea
          className={styles.postBody}
          rows='1'
          id='postBody'
          name='postBody'
          placeholder='Post something...'
        ></textarea>
        <div className={styles.optionsContainer}>
          <a className={styles.optionDiv}>
            <MdAddPhotoAlternate className={styles.option} size='30px' />
          </a>
          <a className={styles.optionDiv}>
            <MdOutlinePoll className={styles.option} size='30px' />
          </a>
          <button className={styles.postButton}>Post</button>
        </div>
      </div>
    </div>
  );
};

export default NewPost;
