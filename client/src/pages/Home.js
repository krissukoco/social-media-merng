import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import MainLayout from '../components/MainLayout';
import ImageSlider from '../components/home/ImageSlider';

import img1 from '../media/home/sportify-home-img-1.jpg';
import img2 from '../media/home/sportify-home-img-2.jpg';
import img3 from '../media/home/sportify-home-img-3.jpg';
import img4 from '../media/home/sportify-home-img-4.jpg';
import img5 from '../media/home/sportify-home-img-5.jpg';
import img6 from '../media/home/sportify-home-img-6.jpg';
import img7 from '../media/home/sportify-home-img-7.jpg';

import styles from '../styles/Home.module.css';

const Home = () => {
  const imgList = [img1, img2, img3, img4, img5, img6, img7];
  const navigate = useNavigate();
  return (
    <MainLayout bgColor='white'>
      <div className={styles.container}>
        <div className={styles.mainContainer}>
          <div className={styles.mainSection}>
            <h1 className={styles.headingText}>
              Post pictures, write opinions, and engage with Sport enthusiasts
            </h1>
            <h3
              style={{
                color: 'skyblue',
                fontWeight: 'bold',
                fontSize: '1.6rem',
                textAlign: 'center',
                marginBottom: '0.5rem',
              }}
            >
              Join with other 3 million users!
            </h3>
            <button
              onClick={() => navigate('/signup')}
              className={`${styles.signup} ${styles.myButton}`}
            >
              Sign Up for free
            </button>
            <h4
              style={{
                color: 'grey',
                fontSize: '1.3rem',
                textAlign: 'center',
                paddingTop: '3rem',
              }}
            >
              Or take a look on what's going on:
            </h4>
            <button
              onClick={() => navigate('/feed')}
              className={`${styles.myButton} ${styles.goToFeed}`}
            >
              Go to Feed
            </button>
          </div>
          <div className={styles.imageSection}>
            <ImageSlider images={imgList} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
