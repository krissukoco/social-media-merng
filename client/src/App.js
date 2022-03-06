import './App.css';
import { useState, useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import 'bulma/css/bulma.min.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

import UserContext from './context/UserContext';
import Home from './pages/Home';
import Feed from './pages/Feed';
import Post from './pages/Post';
import User from './pages/User';
import Login from './pages/LoginRegister';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import useClientDetail from './hooks/useClientDetail';

function App() {
  // const [userDetail, setUserDetail] = useState();

  const [userDetail, setUserDetail] = useClientDetail();

  console.log('App.js userDetail: ', userDetail);

  return (
    <UserContext.Provider value={{ userDetail, setUserDetail }}>
      <Router>
        <Routes>
          <Route
            index
            element={userDetail !== null ? <Navigate to='/feed' /> : <Home />}
          />
          <Route path='/feed' element={<Feed />} />
          <Route path='/post/:id' element={<Post />} />
          <Route path='/user/:id' element={<User />} />
          <Route path='/login' element={<Login page='login' />} />
          <Route path='/signup' element={<Login page='signup' />} />
          <Route
            path='/settings'
            element={userDetail !== null ? <Settings /> : <Navigate to='/' />}
          />
          <Route path='/404' element={<NotFound />} />
          <Route path='*' element={<Navigate to='/404' />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
