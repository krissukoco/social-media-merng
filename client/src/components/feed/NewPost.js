import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { MdAddPhotoAlternate, MdOutlinePoll } from 'react-icons/md';

import SuccessCard from '..//utils/SuccessCard';
import ErrorCard from '../utils/ErrorCard';
import LoadingFull from '../utils/LoadingFull';

import { CREATE_POST } from '../../graphql/mutations';
import { getLocalData } from '../../utils/handleUserAuth';
import noProfpic from '../../media/no-profpic.png';
import styles from '../../styles/NewPost.module.css';

const NewPost = ({ userDetail, onNewPost }) => {
  const [text, setText] = useState('');
  const [token, setToken] = useState();
  const [error, setError] = useState();
  const [success, setSuccess] = useState(false);

  const [images, setImages] = useState([]);
  const [poll, setPoll] = useState();

  // Get token
  useEffect(() => {
    const { _, token: t } = getLocalData();
    setToken(t);
  }, []);

  const getPostType = () => {
    let postType = 'standard';
    if (poll) {
      postType = 'poll';
    } else if (images.length > 0) {
      postType = 'image';
    }
    return postType;
  };

  const onTextChange = (e) => {
    setText(e.target.value);
  };

  const onFileChange = (e) => {
    let imgArr = [...images];

    // FileList of images selected
    const files = e.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        imgArr.push(files[i]);
      }
      setImages(imgArr);
    }
  };

  // Posting related
  const onGraphqlError = (error) => {
    let err = error.graphQLErrors[0].message;
    return err;
  };
  const [createPost, { data, loading, error: err }] = useMutation(CREATE_POST, {
    onError: onGraphqlError,
  });

  const onDataReturned = (data) => {
    if (data) {
      setError();
      setText('');
      setImages([]);
      setSuccess(true);
      onNewPost(data.createPost);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
  };
  useEffect(() => {
    if (data) {
      onDataReturned(data);
    }
  }, [data]);

  const successText = 'Success posting!';

  const onPostSubmit = (e) => {
    e.preventDefault();
    const postType = getPostType();
    setError();

    createPost({
      variables: {
        input: {
          postType,
          body: text,
          images: images,
        },
      },
      context: {
        headers: {
          Authorization: token,
        },
      },
      fetchPolicy: 'no-cache',
    });
  };

  let profpic = userDetail.profilePictureUrl || noProfpic;

  return (
    <div className={styles.container}>
      {error ? <ErrorCard error={error} /> : null}
      <img src={profpic} className={styles.profilePicture} />
      <div className={styles.postInput}>
        {loading ? <LoadingFull /> : null}
        {success ? <SuccessCard text={successText} /> : null}
        <textarea
          className={styles.postBody}
          rows='1'
          id='postBody'
          name='postBody'
          placeholder='Post something...'
          onChange={onTextChange}
          value={text}
        />

        {images && images.length > 0 ? (
          <div className={styles.previewImgContainer}>
            <button
              onClick={() => setImages([])}
              className={styles.previewClose}
            >
              Remove All
            </button>
            <p className={styles.previewImgText}>Image(s) Preview:</p>
            {images.map((image, i) => (
              <div
                key={i}
                style={{
                  margin: '0.2rem',
                  border: '0.5px solid lightgrey',
                  display: 'flex',
                  maxWidth: 'fit-content',
                }}
              >
                <img
                  key={i}
                  src={URL.createObjectURL(image)}
                  className={styles.previewImg}
                />
              </div>
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
          {/* <a className={styles.optionDiv}>
            <MdOutlinePoll className={styles.option} size='30px' />
          </a> */}
          <button className={styles.postButton} onClick={onPostSubmit}>
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewPost;
