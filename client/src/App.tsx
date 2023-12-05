import './App.css';
import React, { useState,useEffect } from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import { Home } from './pages/Home';
import { Upload } from './pages/Upload';
import Subscribe from './pages/Subscribe';
import Dashboard from './pages/Dashboard';
import SongDetails from './pages/PlayRadio';
import Auth from './pages/Auth';
import Profile from './components/Profile';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import LearnMore from './pages/LearnMore';
import { Navbar } from './components/Navbar';
import Footer from './components/Footer';
import Test from './pages/Test';

function App() {
  const { wallet,account } = useWallet();
  const [login, setLogin] = useState(true);
  const [subscribe, setSubscribe] = useState(false);
  const [address, setAddress] = useState('');
  const [publicKey, setPublicKey] = useState<string | string[]>([]);

  

  useEffect(() => {
    if (wallet) {
      setLogin(true);
      if (account?.address) {
        setAddress(account.address);
      }
      if (account?.publicKey) {
        setPublicKey(account.publicKey);
      }  
    }else{
      setLogin(false);
    }
  }, [wallet]);
  

  return (
    <Router>
      <Navbar login={login} setLogin={setLogin} subscribe={subscribe} setSubscribe={setSubscribe} />
      <Routes>
        <Route path='/' element={<Home login={login} setLogin={setLogin} subscribe={subscribe} setSubscribe={setSubscribe} />} />
        <Route path='/signup' element={<Auth address={address} publicKey={publicKey}/>} />
        <Route path='/uploadsongs' element={<Upload login={login} setLogin={setLogin} subscribe={subscribe} setSubscribe={setSubscribe} />} />
        <Route path='/dashboard' element={<Dashboard address={address} publicKey={publicKey}  />} />
        <Route path='/subscribe' element={<Subscribe />} />
        <Route path='/playsongs' element={<SongDetails login={login} setLogin={setLogin} subscribe={subscribe} setSubscribe={setSubscribe}  />} />
        <Route path='/profile' element={<Dashboard address={address} publicKey={publicKey}/>} />
        <Route path='/learn-more' element={<LearnMore />} />
        <Route path='/test' element={<Test/>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
