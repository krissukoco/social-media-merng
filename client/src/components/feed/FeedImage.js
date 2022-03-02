import React, { useState } from 'react';
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from 'react-icons/bs';

import styles from '../../styles/Feed.module.css';

const FeedImage = ({ imgUrls }) => {
  const [imgIndex, setImgIndex] = useState(0);

  const changeImage = (n) => {
    if (n != 1 && n != -1) {
      throw new Error('n must be -1 or 1');
    } else if (imgIndex == 0 && n == -1) {
      return;
    } else if (imgIndex == imgUrls.length - 1 && n == 1) {
      return;
    } else {
      return setImgIndex(imgIndex + n);
    }
  };

  const arrowStyle = {
    opacity: '70%',
    margin: '0 0.5rem',
    '&:hover': {
      opacity: '100%',
    },
  };

  const SliderArrow = ({ type }) => {
    let n;
    let arrow;
    if (type == 'next') {
      n = 1;
      arrow = (
        <BsArrowRightCircleFill
          color='white'
          size='1.5rem'
          className={styles.imageArrow}
        />
      );
    } else if (type == 'previous') {
      n = -1;
      arrow = (
        <BsArrowLeftCircleFill
          color='white'
          size='1.5rem'
          className={styles.imageArrow}
        />
      );
    } else {
      throw new Error("sliderArrow type must be either 'next' or 'previous'");
    }

    if (imgUrls.length > 1) {
      const left = type == 'previous' ? '0' : null;
      const right = type == 'next' ? '0' : null;
      return (
        <a
          onClick={(e) => {
            e.stopPropagation();
            changeImage(n);
          }}
          style={{ position: 'absolute', top: '45%', left, right }}
        >
          {arrow}
        </a>
      );
    } else {
      return null;
    }
  };

  return (
    <div className={styles.postImageContainer}>
      <img
        src={imgUrls[imgIndex]}
        style={{
          maxWidth: '100%',
          transition: 'opacity 0.6s ease-in-out',
          zIndex: 1,
          justifyContent: 'center',
        }}
      />
      <SliderArrow type='previous' />
      <SliderArrow type='next' />
    </div>
  );
};

export default FeedImage;
