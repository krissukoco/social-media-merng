import { useState, useEffect } from 'react';
import { Transition } from 'react-transition-group';

import styles from '../../styles/Home.module.css';

const ImageSlider = ({ images }) => {
  const [sliderIndex, setSliderIndex] = useState(0);

  const getNextIndex = (currentIdx) => {
    let imagesLen = images.length;
    if (imagesLen > 0) {
      if (currentIdx == imagesLen - 1) {
        return 0;
      } else {
        return currentIdx + 1;
      }
    } else {
      throw new Error('Images length is zero');
    }
  };

  let nextIndex = getNextIndex(sliderIndex);

  useEffect(() => {
    let timer = setTimeout(() => setSliderIndex(nextIndex), 5000);
    // To remove React error -> unsubscribe when component unmounts
    return () => clearTimeout(timer);
  }, [sliderIndex]);

  return (
    <div className={styles.sliderContainer}>
      {images ? (
        <img
          alt='Spority: Share your sport pictures'
          src={images[sliderIndex]}
          className={styles.sliderImg}
          style={{}}
          key={sliderIndex}
        />
      ) : null}
    </div>
  );
};

export default ImageSlider;
