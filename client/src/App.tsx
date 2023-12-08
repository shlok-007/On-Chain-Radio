import './App.css';
import React, { useState, useEffect, useMemo } from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import { Home } from './pages/Home';
import { Upload } from './pages/Upload';
import Subscribe from './pages/Subscribe';
import Dashboard from './pages/Dashboard';
import PlayRadio from './pages/PlayRadio';
import Auth from './pages/Auth';
import Profile from './components/Profile';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import LearnMore from './pages/LearnMore';
import { Navbar } from './components/Navbar';
import Footer from './components/Footer';
import Test from './pages/Test';
import { Community } from './pages/Community';
import { Provider, Network } from "aptos";
import { AccountContext } from './utils/context';
import { Account } from './utils/types';
import PrivateRoutes from './utils/PrivateRoutes';
import getUserAccount from './utils/getUserAccount';

function App() {
  const provider = new Provider(Network.TESTNET);

  const { account, disconnect, connected } = useWallet();
  const [login, setLogin] = useState(false);
  const [userAccount, setUserAccount] = useState<Account | null>(null);

  const onLoginSuccess = (userAccount : Account) => {
    setLogin(true);
    setUserAccount(userAccount);
  }
  const onLogout = () => {
    // console.log(account);
    if(connected)
      disconnect();
    setUserAccount(null);
    setLogin(false);
  }

  useEffect(() => {
    getUserAccount(account).then((userAccount) => {
      if (userAccount !== 0 && userAccount !== -1) {
        onLoginSuccess(userAccount);
      }
    });
  }, [account]);

  return (
    <Router>
      <AccountContext.Provider value={userAccount}>
      <Navbar onLogout={onLogout} />
      <Routes>
        <Route path='/' element={<Home onLoginSuccess={onLoginSuccess}/>} />
        <Route path='/signup' element={<Auth onLoginSuccess={onLoginSuccess}/>} />
        
        <Route element={<PrivateRoutes isLogged={login}/>}>
          <Route path='/community' element={<Community />} />
          <Route path='/uploadsongs' element={<Upload />} />
          <Route path='/dashboard' element={<Dashboard startingPage={0} />} />
          <Route path='/subscribe' element={<Subscribe setUserAccount={setUserAccount}/>} />
          <Route path='/playsongs' element={<PlayRadio />} />
          <Route path='/profile' element={<Dashboard startingPage={2}/>} />
          <Route path='/learn-more' element={<LearnMore />} />
        </Route>
        <Route path='/test' element={<Test/>} />
      </Routes>
      </AccountContext.Provider>
      <Footer />
    </Router>
  );
}

export default App;
