import React from 'react';

import Container from './Container';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <Container>{children}</Container>
      <Footer />
    </div>
  );
};

export default MainLayout;
