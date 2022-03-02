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

const NewPost = ({ userDetail }) => {
  const [text, setText] = useState('');
  const [token, setToken] = useState();
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [postResponse, setPostResponse] = useState();
  const [images, setImages] = useState([]);
  const [imgFiles, setImgFiles] = useState();
  const [preview, setPreview] = useState(false);
  const [poll, setPoll] = useState();

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
    let imgArr = [];

    // FileList of images selected
    const files = e.target.files;
    if (files) {
      setImgFiles(files);
      for (let i = 0; i < files.length; i++) {
        imgArr.push(files[i]);
      }
      setImages(imgArr);
    }
  };

  // Posting related
  const [createPost, { data, loading, error }] = useMutation(CREATE_POST, {
    onCompleted: (data) => {
      if (data != undefined && data.createPost != postResponse) {
        setText('');
        setImages([]);
        setErrors([]);
        setIsLoading(false);

        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        setPostResponse(data.createPost);
      }
    },
    onError: (error) => {
      setErrors([error]);
    },
  });
  console.log('Data: ', data);

  console.log('postResponse: ', postResponse);

  const successText = 'Successfully posting!';
  console.log('Loading: ', loading);

  // TODO: Show user input errors & server error as error card
  if (error) console.log('ERROR: ', error);

  const onPostSubmit = (e) => {
    e.preventDefault();
    const postType = getPostType();

    createPost({
      variables: {
        input: {
          postType,
          body: text,
          images: imgFiles,
        },
      },
      context: {
        headers: {
          Authorization: token,
        },
      },
    });

    setIsLoading(true);
  };

  let profpic = userDetail.profilePictureUrl || noProfpic;

  return (
    <div className={styles.container}>
      {success ? <SuccessCard text={successText} /> : null}
      {isLoading ? <LoadingFull /> : null}
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
          <a className={styles.optionDiv}>
            <MdOutlinePoll className={styles.option} size='30px' />
          </a>
          <button className={styles.postButton} onClick={onPostSubmit}>
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewPost;
