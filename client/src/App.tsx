import './App.css';
import React, { useState } from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import { Home } from './pages/Home';
import { Upload } from './pages/Upload';
import Subscribe from './pages/Subscribe';
import Dashboard from './pages/Dashboard';
import SongDetails from './pages/SongDetails';
import Auth from './pages/Auth';

function App() {
  const [login, setLogin] = useState(true);
  const [subscribe, setSubscribe] = useState(false);
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home login={login} setLogin={setLogin} subscribe={subscribe} setSubscribe={setSubscribe} />} />
        <Route path='/signup' element={<Auth />} />
        <Route path='/uploadsongs' element={<Upload login={login} setLogin={setLogin} subscribe={subscribe} setSubscribe={setSubscribe} />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/subscribe' element={<Subscribe />} />
        <Route path='/playsongs' element={<SongDetails login={login} setLogin={setLogin} subscribe={subscribe} setSubscribe={setSubscribe}  />} />
      </Routes>
    </Router>
  );
}

export default App;
