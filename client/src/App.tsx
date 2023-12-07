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
import { Community } from './pages/Community';

function App() {
  // initial values of login ad subscribe should be false
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
    }
  }, [wallet]);
  

  // address is the wallet address
  // publicKey is the wallet public key

  return (
    <Router>
      <Navbar login={login} setLogin={setLogin} subscribe={subscribe} setSubscribe={setSubscribe} />
      <Routes>
        <Route path='/' element={<Home login={login} setLogin={setLogin} subscribe={subscribe} setSubscribe={setSubscribe} />} />
        <Route path='/community' element={<Community />} />
        <Route path='/signup' element={<Auth login={login} setLogin={setLogin} address={address} publicKey={publicKey}/>} />
        <Route path='/uploadsongs' element={<Upload login={login} setLogin={setLogin} subscribe={subscribe} setSubscribe={setSubscribe} />} />
        <Route path='/dashboard' element={<Dashboard address={address} publicKey={publicKey} startingPage={0} />} />
        <Route path='/subscribe' element={<Subscribe address={address} publicKey={publicKey} />} />
        <Route path='/playsongs' element={<SongDetails login={login} setLogin={setLogin} subscribe={subscribe} setSubscribe={setSubscribe}  />} />
        <Route path='/profile' element={<Dashboard address={address} publicKey={publicKey} startingPage={2}/>} />
        <Route path='/learn-more' element={<LearnMore />} />
        <Route path='/test' element={<Test/>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
