import { set } from 'mongoose';
import { useEffect, useState } from 'react';
import { MdAddPhotoAlternate, MdOutlinePoll } from 'react-icons/md';
import { AiFillCloseCircle } from 'react-icons/ai';

import noProfpic from '../../media/no-profpic.png';
import styles from '../../styles/NewPost.module.css';

const NewPost = ({ userDetail }) => {
  const [text, setText] = useState('');
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState(false);
  const [poll, setPoll] = useState();

  console.log('Preview?', preview);

  const onTextChange = (e) => {
    setText(e.target.value);
  };

  const onFileChange = (e) => {
    let imgArr = [...images];

    // FileList of images selected
    const files = e.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        console.log('loop');
        imgArr.push(files[i]);
      }
      console.log('imgArr: ', imgArr);
      // setImages(null);
      setImages(imgArr);
    }
    console.log(images);
  };

  console.log('text state: ', text);
  console.log('images state: ', images);

  let profpic = userDetail.profilePictureUrl || noProfpic;

  return (
    <div className={styles.container}>
      <img src={profpic} className={styles.profilePicture} />
      <div className={styles.postInput}>
        <textarea
          className={styles.postBody}
          rows='1'
          id='postBody'
          name='postBody'
          placeholder='Post something...'
          onChange={onTextChange}
          value={text}
        />
        {images.length > 0 ? (
          <div className={styles.previewImgContainer}>
            <button
              onClick={() => setImages([])}
              className={styles.previewClose}
            >
              Remove All
            </button>
            <p className={styles.previewImgText}>Image(s) Preview:</p>
            {images.map((image, i) => (
              <img
                key={i}
                src={URL.createObjectURL(image)}
                className={styles.previewImg}
              />
            ))}
          </div>
        ) : null}
        <div className={styles.optionsContainer}>
          <div className={styles.optionDiv}>
            <input
              id='imageInput'
              type='file'
              name='imageInput'
              onChange={onFileChange}
              multiple
              accept='image/png, image/jpg, image/jpeg, image/gif'
            />
            <label htmlFor='imageInput'>
              <MdAddPhotoAlternate className={styles.option} size='30px' />
            </label>
          </div>
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
