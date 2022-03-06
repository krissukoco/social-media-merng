import React from 'react';

import MainLayout from '../components/MainLayout';

const NotFound = () => {
  return (
    <MainLayout>
      <div
        style={{
          margin: 'auto',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '3rem 0',
          height: '24rem',
        }}
      >
        <h1
          style={{
            fontWeight: 'bold',
            fontSize: '3rem',
            paddingBottom: '1rem',
          }}
        >
          404 - NOT FOUND
        </h1>
        <h2 style={{ fontSize: '1.2rem', color: 'grey' }}>
          Sorry, the page you are looking for doesn't exist
        </h2>
        <h3 style={{ color: 'grey', fontWeight: 'bold', paddingTop: '1rem' }}>
          Go back to{' '}
          <a href='/' style={{ color: '#38b6ff' }}>
            Home
          </a>
        </h3>
      </div>
    </MainLayout>
  );
};

export default NotFound;
