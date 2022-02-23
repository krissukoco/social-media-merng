import { useEffect } from 'react';

import MainLayout from '../components/MainLayout';

const Home = () => {
  return (
    <MainLayout>
      <div>
        <h1 className='title has-text-centered'>
          HOME PAGE - Linkedin-like (not feeds)
        </h1>
      </div>
    </MainLayout>
  );
};

export default Home;
