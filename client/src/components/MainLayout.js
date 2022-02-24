import React from 'react';

import Container from './Container';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = ({ children, bgColor }) => {
  return (
    <div>
      <Navbar />
      <Container bgColor={bgColor}>{children}</Container>
      <Footer />
    </div>
  );
};

export default MainLayout;
