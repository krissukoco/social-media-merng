import React from 'react';

import spinner from '../../media/loading-spinner.gif';

const LoadingSpinner = () => {
  return (
    <img
      src={spinner}
      style={{
        maxWidth: '1.5rem',
        maxHeight: '1.5rem',
        objectFit: 'contain',
        justifyContent: 'center',
      }}
    />
  );
};

export default LoadingSpinner;
