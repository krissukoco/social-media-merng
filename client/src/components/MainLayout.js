import { useContext } from 'react';

import UserContext from '../context/UserContext';
import Container from './Container';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = ({ children, bgColor }) => {
  const { userDetail, _ } = useContext(UserContext);

  return (
    <div>
      <Navbar userDetail={userDetail} />
      <Container bgColor={bgColor}>{children}</Container>
      <Footer />
    </div>
  );
};

export default MainLayout;
