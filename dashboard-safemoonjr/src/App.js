/*******************************************************
 * Copyright (C) 2021-2031 SAS Solicity | solicity.company@gmail.com
 *******************************************************/

import { useState, useEffect } from 'react';
import './styles/App.scss';

import Web3 from 'web3';

import Navbar from "./Components/Navbar/Navbar.js";
import Dashboard from './Components/Dashboard/Dashboard';

import {ConnectContext} from './context/connectContext';

function App() {

    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState(null);
    const [Connect, setConnect] = useState(false);
    const [getAccount, setGetAccount] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    const eth = window.ethereum;

    const Con = async() =>{
        if(Connect)
          window.location.reload();

        if (typeof window.ethereum == 'undefined') {
          alert('MetaMask is not installed!');
        }else{
          const accounts = await eth.request({ method: 'eth_requestAccounts' });
          const account = accounts[0];
          const web3 = new Web3(eth);
  
          setWeb3(web3);
          setAccount(account);
          if(account !== "undefined"){
            localStorage.setItem("walletConnected", true);
            setConnect(true)
          }
        }
      } 

      useEffect(()=>{
        if(eth !== undefined){
          eth.on('accountsChanged', (accounts)=>{
            window.location.reload();
          });
        }
      },[])

  return (
    <ConnectContext.Provider value={{web3, account, Con, Connect, eth, setConnect, getAccount, setGetAccount, loadingData, setLoadingData}}>

      <Navbar />
      <Dashboard />

    </ConnectContext.Provider>
  );
}

export default App;
