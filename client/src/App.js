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
import useClientDetail from './hooks/useClientDetail';

function App() {
  // const [userDetail, setUserDetail] = useState();

  const [userDetail, setUserDetail] = useClientDetail();

  console.log('App.js userDetail: ', userDetail);

  return (
    <UserContext.Provider value={{ userDetail, setUserDetail }}>
      <Router>
        <Routes>
          <Route index element={userDetail != null ? <Feed /> : <Home />} />
          <Route path='/feed' element={<Feed />} />
          <Route path='/post' element={<Post />} />
          <Route path='/user' element={<User />}>
            <Route path=':id' element={<User />} />
          </Route>
          <Route path='/login' element={<Login page='login' />} />
          <Route path='/signup' element={<Login page='signup' />} />
          <Route path='/settings' element={<Settings />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
