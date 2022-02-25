import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import 'bulma/css/bulma.min.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

import Home from './pages/Home';
import Feed from './pages/Feed';
import Post from './pages/Post';
import User from './pages/User';
import Login from './pages/LoginRegister';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route index element={<Home />} />
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
  );
}

export default App;
