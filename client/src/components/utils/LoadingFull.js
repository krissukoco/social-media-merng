import React from 'react';

import spinner from '../../media/loading-spinner.gif';

const LoadingFull = () => {
  return (
    <div
      style={{
        backgroundColor: 'rgba(255,255,255, 0.7)',
        margin: 'auto',
        padding: 'auto',
        justifyContent: 'center',
        position: 'relative',
        width: '100%',
      }}
    >
      <img
        src={spinner}
        style={{
          position: 'absolute',
          left: '0',
          right: '0',
          margin: 'auto',
          maxWidth: '2rem',
          maxHeight: '2rem',
          objectFit: 'cover',
          justifyContent: 'center',
        }}
      />
    </div>
  );
};

export default LoadingFull;
