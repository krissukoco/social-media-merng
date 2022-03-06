import { useState, useContext, useEffect, useRef } from 'react';
import { useMutation } from '@apollo/client';

import MainLayout from '../components/MainLayout';
import UserContext from '../context/UserContext';
import { getLocalData } from '../utils/handleUserAuth';
import {
  UPDATE_USER,
  CHANGE_PASSWORD,
  UPLOAD_PERSONAL_PICTURE,
} from '../graphql/mutations';

import LoadingSpinner from '../components/utils/LoadingSpinner';
import styles from '../styles/Settings.module.css';
import noProfpic from '../media/no-profpic.png';
import noBackgroundImg from '../media/no-background.jpg';
import { MAX_FILE_SIZE } from '../public.config';

const Settings = () => {
  const { userDetail: user, setUserDetail: setUser } = useContext(UserContext);
  const [userTemp, setUserTemp] = useState();
  const [changed, setChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState();
  const [error, setError] = useState();
  const [password, setPassword] = useState({
    old: '',
    new: '',
    confirm: '',
  });
  const [newProfpic, setNewProfpic] = useState();
  const [newBgImage, setNewBgImage] = useState();

  const profilePictureInput = useRef(null);
  const backgroundImageInput = useRef(null);

  console.log('Changed: ', changed);
  console.log('ERROR: ', error);
  console.log('newProfpic: ', newProfpic);

  const isTempDifferent = () => {
    return JSON.stringify(user) === JSON.stringify(userTemp);
  };

  useEffect(() => {
    const { token: t } = getLocalData();
    if (t) {
      setToken(t);
    }
    if (user) {
      setUserTemp(user);
    }
  }, [user]);

  useEffect(() => {
    if (newProfpic || newBgImage) {
      setChanged(true);
    } else if (isTempDifferent()) {
      setChanged(false);
    } else {
      setChanged(true);
    }
  }, [userTemp, newProfpic, newBgImage]);

  const [
    updateUser,
    { data: updateData, loading: updateLoading, error: updateError },
  ] = useMutation(UPDATE_USER, {
    onCompleted: (data) => {
      if (data) {
        console.log('updateUser data: ', data);
        setUser(data.updateUser);
      }
    },
  });

  const [
    changePassword,
    { data: pwdData, loading: pwdLoading, error: pwdError },
  ] = useMutation(CHANGE_PASSWORD, {
    onCompleted: (data) => {
      if (data) {
        // TODO: Show SUCCESS Card
        console.log('After Changing Password: ', data);
        setUser(data.changePassword);
        setPassword({ old: '', new: '', confirm: '' });
        // window.location.reload();
      }
    },
  });

  const [
    uploadPersonalPicture,
    { data: picData, loading: picLoading, error: picError },
  ] = useMutation(UPLOAD_PERSONAL_PICTURE, {
    onCompleted: (data) => {
      if (data) {
        // TODO: Show SUCCESS Card
        console.log('After UPLOAD picture', data);
        const user = data.uploadPersonalPicture;
        // setUser(data.uploadPersonalPicture);
        setUserTemp({ ...userTemp, profilePictureUrl: user.profilePictureUrl });
      }
    },
  });

  const onDetailChange = (e, key) => {
    e.preventDefault();
    e.stopPropagation();
    setChanged(true);

    let u = { ...userTemp };
    if (key in u) {
      let value = e.target.value;
      if (key === 'username') {
        value = value.replace('@', '');
      }
      u[`${key}`] = value;
      setUserTemp(u);
    }
  };

  const validateInputs = () => {
    return;
  };

  const imageChangeHandler = (e, type) => {
    e.preventDefault();
    let file;
    if (e.target.files) {
      file = e.target.files[0];
      if (file.size > MAX_FILE_SIZE) {
        setError('Max. file size is 10 MB');
        return;
      }

      if (type === 'profile-picture') {
        setNewProfpic(file);
      } else if (type === 'background-image') {
        setNewBgImage(file);
      } else {
        return;
      }
    }
  };

  const saveChangeHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // TODO: Update personal images first
    const config = {
      context: { headers: { authorization: token } },
      fetchPolicy: 'no-cache',
    };
    if (newProfpic) {
      try {
        uploadPersonalPicture({
          ...config,
          variables: {
            image: newProfpic,
            type: 'profile-picture',
          },
        });
      } catch (e) {
        setError(e.message);
        return;
      }
    }
    if (newBgImage) {
      try {
        uploadPersonalPicture({
          ...config,
          variables: {
            image: newBgImage,
            type: 'background-image',
          },
        });
      } catch (e) {
        setError(e.message);
        return;
      }
    }

    // TODO: Then update the selected fields
    const { username, fullname, email, bio, location } = userTemp;
    const input = { username, fullname, email, bio, location };
    console.log('Upload vars: ', input);
    try {
      updateUser({
        variables: { input },
        ...config,
      });
    } catch (e) {
      setError(e.message);
    }
  };

  const cancelChangeHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setUserTemp(user);
    setChanged(false);
    return;
  };

  const onChangePassword = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const vars = {
      oldPassword: password.old,
      newPassword: password.new,
      confirmPassword: password.confirm,
    };
    console.log('Change Pwd vars: ', vars);
    changePassword({
      variables: vars,
      context: {
        headers: { authorization: token },
      },
      fetchPolicy: 'no-cache',
    });
  };

  console.log('User on Settings.js: ', user);
  console.log('userTemp: ', userTemp);
  if (!userTemp) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  let profpic =
    userTemp !== undefined && newProfpic
      ? URL.createObjectURL(newProfpic)
      : userTemp.profilePictureUrl
      ? userTemp.profilePictureUrl
      : noProfpic;
  let bgPicture =
    userTemp !== undefined && newBgImage
      ? URL.createObjectURL(newBgImage)
      : userTemp.bgPictureUrl
      ? userTemp.bgPictureUrl
      : noBackgroundImg;

  return (
    user && (
      <MainLayout>
        <div className={styles.container}>
          <div className={styles.backgroundContainer}>
            <img
              src={bgPicture}
              alt={`Sportify Sport Social Media | ${userTemp.fullname}`}
              className={styles.backgroundImage}
            />
            <input
              ref={backgroundImageInput}
              id='backgroundImageInput'
              type='file'
              name='backgroundImageInput'
              onChange={(e) => imageChangeHandler(e, 'background-image')}
              accept='image/png, image/jpg, image/jpeg,'
              className={styles.hidden}
            />
            <button
              onClick={() => backgroundImageInput.current.click()}
              className={styles.backgroundButton}
            >
              Change Background Image
            </button>
          </div>
          <span className={styles.title}>Profile Settings</span>
          <div className={styles.main}>
            <div className={styles.imgArea}>
              <img
                src={profpic}
                className={styles.profilePicture}
                alt={`Sportify Sport Social Media | ${userTemp.fullname}`}
              />
              <div>
                <input
                  ref={profilePictureInput}
                  id='profilePictureInput'
                  type='file'
                  name='profilePictureInput'
                  onChange={(e) => imageChangeHandler(e, 'profile-picture')}
                  accept='image/png, image/jpg, image/jpeg,'
                  className={styles.hidden}
                />
                <button
                  onClick={() => profilePictureInput.current.click()}
                  className={styles.profpicButton}
                >
                  Change Profile Picture
                </button>
              </div>
            </div>
            <div className={styles.settingsContainer}>
              <div className={styles.inputGroup}>
                <p>Username</p>
                <input
                  style={{ color: '#329cda' }}
                  value={`@${userTemp.username}`}
                  onChange={(e) => onDetailChange(e, 'username')}
                  placeholder='Cannot be empty'
                />
              </div>
              <div className={styles.inputGroup}>
                <p>Name</p>
                <input
                  value={userTemp.fullname}
                  onChange={(e) => onDetailChange(e, 'fullname')}
                  placeholder='Cannot be empty'
                />
              </div>
              <div className={styles.inputGroup}>
                <p>Email</p>
                <input
                  value={userTemp.email}
                  onChange={(e) => onDetailChange(e, 'email')}
                  placeholder='Cannot be empty'
                />
              </div>
              <div className={styles.inputGroup}>
                <p>Location</p>
                <input
                  value={userTemp.location}
                  onChange={(e) => onDetailChange(e, 'location')}
                  placeholder="e.g. 'London, UK'"
                />
              </div>
              <div className={styles.inputGroup}>
                <p>Bio</p>
                <textarea
                  value={userTemp.bio}
                  onChange={(e) => onDetailChange(e, 'bio')}
                  placeholder='e.g. "Sport enthusiast. Liverpool FC fan"; "Competitive basketball player"; "Junior Chess Champion at 15 years old"'
                />
              </div>
              <div className={styles.changesContainer}>
                <button
                  onClick={saveChangeHandler}
                  disabled={!changed}
                  className={styles.saveButton}
                >
                  Save Changes
                </button>
                <button
                  onClick={cancelChangeHandler}
                  disabled={!changed}
                  className={styles.cancelButton}
                >
                  Cancel All
                </button>
              </div>
              <div className={styles.changePassword}>
                <h2
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    color: 'grey',
                    justifyContent: 'center',
                    textAlign: 'center',
                  }}
                >
                  Change Password
                </h2>
                <div className={styles.inputGroup}>
                  <p>Old Password</p>
                  <input
                    type='password'
                    value={password.old}
                    onChange={(e) =>
                      setPassword({
                        ...password,
                        old: e.target.value,
                      })
                    }
                    placeholder='Old Password'
                  />
                </div>
                <div className={styles.inputGroup}>
                  <p>New Password</p>
                  <input
                    type='password'
                    value={password.new}
                    onChange={(e) =>
                      setPassword({
                        ...password,
                        new: e.target.value,
                      })
                    }
                    placeholder='NEW Strong Password'
                  />
                </div>
                <div className={styles.inputGroup}>
                  <p>Confirm Password</p>
                  <input
                    type='password'
                    value={password.confirm}
                    onChange={(e) =>
                      setPassword({
                        ...password,
                        confirm: e.target.value,
                      })
                    }
                    placeholder='Confirm Password'
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'right',
                    marginTop: '2rem',
                  }}
                >
                  <button
                    onClick={onChangePassword}
                    className={styles.passwordButton}
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  );
};

export default Settings;
